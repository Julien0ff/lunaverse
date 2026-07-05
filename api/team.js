import fs from 'fs'
import path from 'path'
import { db } from '../src/lib/firebase.js'
import { doc, getDoc } from 'firebase/firestore'

export default async function handler(req, res) {
  const token = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID

  if (!token || !guildId) {
    return res.status(500).json({ error: 'Missing Discord credentials in Vercel environment variables (DISCORD_BOT_TOKEN, DISCORD_GUILD_ID).' })
  }

  try {
    // 1. Fetch members
    const membersRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members?limit=1000`, {
      headers: { Authorization: `Bot ${token}` }
    })
    
    if (!membersRes.ok) throw new Error(`Failed to fetch members: ${membersRes.statusText}`)
    const members = await membersRes.json()

    // 2. Fetch roles
    const rolesRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
      headers: { Authorization: `Bot ${token}` }
    })
    
    if (!rolesRes.ok) throw new Error('Failed to fetch roles')
    const rolesData = await rolesRes.json()
    const roleMap = {}
    rolesData.forEach(r => { roleMap[r.id] = r })

    // 3. Read config from local JSON
    let localConfig = {}
    try {
      const dataPath = path.join(process.cwd(), 'src', 'data', 'team_descriptions.json')
      localConfig = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    } catch(e) {
      console.error('Error reading local config', e)
    }

    // Read manual descriptions from Firebase
    let descriptions = {}
    try {
      const docRef = doc(db, 'team', 'data')
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        descriptions = docSnap.data()
      }
    } catch(e) {
      console.error('No descriptions found in Firebase or error reading it', e)
    }

    // 4. Define staff roles priority (ordered)
    const STAFF_ROLES = localConfig.config?.staffRoles || descriptions.config?.staffRoles || [] 

    const team = []

    members.forEach(m => {
      const userId = m.user.id
      const manualData = descriptions[userId] || localConfig[userId]

      // Check if user has any of the staff roles OR if their userId is directly in STAFF_ROLES
      const userStaffRoles = m.roles.filter(rId => STAFF_ROLES.includes(rId))
      const isStaffUser = STAFF_ROLES.includes(userId)
      
      if (userStaffRoles.length === 0 && !isStaffUser && !manualData?.forceDisplay) return

      // Find the highest priority role or UserID
      const primaryRoleId = STAFF_ROLES.find(id => userStaffRoles.includes(id) || id === userId)
      const primaryRole = roleMap[primaryRoleId]

      const roleName = manualData?.role || primaryRole?.name || 'Staff'
      let roleColor = manualData?.roleColor || '#ffffff'
      if (!manualData?.roleColor && primaryRole?.color) {
        roleColor = `#${primaryRole.color.toString(16).padStart(6, '0')}`
        if (roleColor === '#000000') roleColor = '#ffffff' // Default discord color is often 0
      }

      team.push({
        id: userId,
        name: manualData?.name || m.nick || m.user.global_name || m.user.username,
        role: roleName,
        roleColor: roleColor,
        description: manualData?.description || "Aucune description pour le moment.",
        avatarUrl: m.user.avatar ? `https://cdn.discordapp.com/avatars/${userId}/${m.user.avatar}.png?size=256` : null,
        links: manualData?.links || [],
        order: STAFF_ROLES.indexOf(primaryRoleId) === -1 ? 999 : STAFF_ROLES.indexOf(primaryRoleId)
      })
    })

    // Sort team by role order
    team.sort((a, b) => a.order - b.order)

    res.status(200).json(team)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
