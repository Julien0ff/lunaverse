export default async function handler(req, res) {
  const { id } = req.query
  const token = process.env.DISCORD_BOT_TOKEN

  if (!id) return res.status(400).json({ error: 'Missing user ID' })
  if (!token) return res.status(500).json({ error: 'Missing DISCORD_BOT_TOKEN' })

  try {
    const userRes = await fetch(`https://discord.com/api/v10/users/${id}`, {
      headers: { Authorization: `Bot ${token}` }
    })
    
    if (!userRes.ok) throw new Error('User not found or Discord API error')
    
    const data = await userRes.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
}
