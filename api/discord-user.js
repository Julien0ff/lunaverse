export default async function handler(req, res) {
  const { id } = req.query
  const token = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID

  if (!id) return res.status(400).json({ error: 'Missing user ID' })
  if (!token) return res.status(500).json({ error: 'Missing DISCORD_BOT_TOKEN' })

  try {
    let highestRoleName = 'Membre'
    let userData = null
    let globalName = null

    if (guildId) {
      const [memberRes, rolesRes] = await Promise.all([
        fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${id}`, {
          headers: { Authorization: `Bot ${token}` }
        }),
        fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
          headers: { Authorization: `Bot ${token}` }
        })
      ])

      if (memberRes.ok && rolesRes.ok) {
        const memberData = await memberRes.json()
        const rolesData = await rolesRes.json()

        userData = memberData.user
        globalName = memberData.nick || userData.global_name || userData.username
        
        const memberRoles = rolesData.filter(r => memberData.roles.includes(r.id))
        memberRoles.sort((a, b) => b.position - a.position)
        if (memberRoles.length > 0) {
          highestRoleName = memberRoles[0].name
        }
      }
    }

    if (!userData) {
      const userRes = await fetch(`https://discord.com/api/v10/users/${id}`, {
        headers: { Authorization: `Bot ${token}` }
      })
      if (!userRes.ok) throw new Error('User not found or Discord API error')
      userData = await userRes.json()
      globalName = userData.global_name || userData.username
    }

    res.status(200).json({
      ...userData,
      global_name: globalName,
      highestRoleName
    })
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}
