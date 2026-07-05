export default async function handler(req, res) {
  const token = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID

  if (!token || !guildId) {
    return res.status(500).json({ error: 'Missing Discord credentials' })
  }

  try {
    const guildRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
      headers: { Authorization: `Bot ${token}` }
    })
    
    if (!guildRes.ok) throw new Error('Failed to fetch guild stats')
    const guild = await guildRes.json()

    res.status(200).json({
      memberCount: guild.approximate_member_count || 0,
      onlineCount: guild.approximate_presence_count || 0,
      activeProjects: 4, // Hardcodé pour l'instant
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
