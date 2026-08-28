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

    // 2. Fetch users to dynamically update avatars
    if (token) {
      const fetchUserPromises = avisList.map(async (avis) => {
        if (!avis.discordId) return;
        try {
          const userRes = await fetch(`https://discord.com/api/v10/users/${avis.discordId}`, {
            headers: { Authorization: `Bot ${token}` }
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            if (userData.avatar) {
              avis.authorAvatar = `https://cdn.discordapp.com/avatars/${avis.discordId}/${userData.avatar}.png?size=256`;
            } else {
              // Si pas d'avatar, on met l'avatar par défaut de Discord
              avis.authorAvatar = `https://cdn.discordapp.com/embed/avatars/${(BigInt(avis.discordId) >> 22n) % 6n}.png`;
            }
            // avis.authorName = userData.global_name || userData.username; // Optionnel
          }
        } catch (e) {
          console.error(`Erreur fetch avatar pour ${avis.discordId}:`, e);
        }
      });
      await Promise.all(fetchUserPromises);
    }

    // 3. Sort by most recent
    avisList.sort((a, b) => b.createdAt - a.createdAt)
    
    res.status(200).json(avisList)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
