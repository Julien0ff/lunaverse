import { db } from '../src/lib/firebase.js'
import { collection, getDocs } from 'firebase/firestore'

export default async function handler(req, res) {
  const token = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID

  try {
    // 1. Get avis from Firestore
    const snap = await getDocs(collection(db, 'avis'))
    const avisList = []
    snap.forEach(doc => avisList.push({ id: doc.id, ...doc.data() }))

    // 2. Fetch members to dynamically update avatars
    if (token && guildId) {
      const membersRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members?limit=1000`, {
        headers: { Authorization: `Bot ${token}` }
      })
      
      if (membersRes.ok) {
        const members = await membersRes.json()
        const memberMap = {}
        members.forEach(m => { memberMap[m.user.id] = m })

        avisList.forEach(avis => {
          if (avis.discordId && memberMap[avis.discordId]) {
            const m = memberMap[avis.discordId]
            if (m.user.avatar) {
              avis.authorAvatar = `https://cdn.discordapp.com/avatars/${avis.discordId}/${m.user.avatar}.png?size=256`
            }
            // Mettre à jour le pseudo s'il a changé ? Optionnel, mais la demande est sur la photo
          }
        })
      }
    }

    // 3. Sort by most recent
    avisList.sort((a, b) => b.createdAt - a.createdAt)
    
    res.status(200).json(avisList)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
