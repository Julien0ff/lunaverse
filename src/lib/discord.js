/* ============================================================
   Discord OAuth2 — Implicit Grant Flow (no backend required)
   ============================================================
   
   HOW TO SET UP:
   1. Go to https://discord.com/developers/applications
   2. Create or select your application
   3. Go to OAuth2 → General
   4. Add your redirect URI (e.g. http://localhost:5173 for dev)
   5. Copy the Client ID and paste it below
   ============================================================ */

export const DISCORD_CLIENT_ID = '1523284375406510200' // L'ID de ton application Discord
const REDIRECT_URI = window.location.origin // L'URL de redirection dynamique

// Guild ID and Role IDs
export const LUNAVERSE_GUILD_ID = '1216443076168515724'
export const ROLE_ADMIN_ID = '1264659843667591259'
export const ROLE_MEMBER_ID = '1216788973905776781'

// ⚠️ SÉCURITÉ DE SECOURS: Si le bot Discord n'arrive pas à lire tes rôles, 
// mets ton ID d'utilisateur Discord personnel ici pour forcer le grade Admin.
export const ADMIN_USER_IDS = ['1064801165201641592']

// Scopes: 'identify' gives us username, avatar, discriminator
const SCOPES = 'identify guilds guilds.members.read'

/**
 * Redirect the user to Discord's OAuth2 authorization page
 */
export function redirectToDiscordLogin() {
  const state = crypto.randomUUID()
  sessionStorage.setItem('discord_oauth_state', state)

  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'token',
    scope: SCOPES,
    state,
    prompt: 'none', // Skip consent if already authorized
  })

  window.location.href = `https://discord.com/api/oauth2/authorize?${params.toString()}`
}

/**
 * Parse the OAuth2 callback from the URL fragment (#access_token=...&...)
 * Returns { access_token, token_type, state } or null if not present
 */
export function parseOAuthCallback() {
  const hash = window.location.hash.substring(1)
  if (!hash) return null

  const params = new URLSearchParams(hash)
  const accessToken = params.get('access_token')
  const tokenType = params.get('token_type')
  const state = params.get('state')

  if (!accessToken) return null

  // Validate state to prevent CSRF
  const storedState = sessionStorage.getItem('discord_oauth_state')
  if (state && storedState && state !== storedState) {
    console.warn('[Discord OAuth] State mismatch — potential CSRF attack')
    return null
  }

  // Clean the URL
  window.history.replaceState(null, '', window.location.pathname)
  sessionStorage.removeItem('discord_oauth_state')

  return { access_token: accessToken, token_type: tokenType }
}

/**
 * Fetch the Discord user's profile using the access token
 * Returns { id, username, avatar, global_name, ... }
 */
export async function fetchDiscordUser(accessToken) {
  const res = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Discord API error: ${res.status}`)
  }

  return res.json()
}

/**
 * Fetch user's member object in the guild (to get roles)
 */
export async function fetchDiscordGuildMember(accessToken, guildId) {
  if (!guildId || guildId === 'ID_DU_SERVEUR_ICI') return null

  try {
    const res = await fetch(`https://discord.com/api/users/@me/guilds/${guildId}/member`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.error('Error fetching guild member:', err)
    return null
  }
}

/**
 * Get the Discord avatar URL for a user
 */
export function getDiscordAvatarUrl(userId, avatarHash, size = 128) {
  if (!avatarHash) {
    // Default avatar based on user ID
    try {
      const index = (BigInt(userId) >> 22n) % 6n
      return `https://cdn.discordapp.com/embed/avatars/${index}.png`
    } catch {
      return `https://cdn.discordapp.com/embed/avatars/0.png`
    }
  }
  const ext = avatarHash.startsWith('a_') ? 'gif' : 'webp'
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${ext}?size=${size}`
}

/**
 * Get the Discord banner URL for a user
 */
export function getDiscordBannerUrl(userId, bannerHash, size = 600) {
  if (!bannerHash || !userId) return null
  const ext = bannerHash.startsWith('a_') ? 'gif' : 'webp'
  return `https://cdn.discordapp.com/banners/${userId}/${bannerHash}.${ext}?size=${size}`
}

/**
 * Save the user session to localStorage
 */
export function saveSession(user, accessToken) {
  const session = {
    id: user.id,
    username: user.username,
    global_name: user.global_name || user.username,
    avatar: user.avatar,
    avatarUrl: getDiscordAvatarUrl(user.id, user.avatar),
    lunaRole: user.lunaRole,
    accessToken,
    savedAt: Date.now(),
  }
  localStorage.setItem('lunaverse_session', JSON.stringify(session))
  return session
}

/**
 * Load session from localStorage (returns null if expired or not present)
 * Sessions expire after 7 days
 */
export function loadSession() {
  try {
    const raw = localStorage.getItem('lunaverse_session')
    if (!raw) return null
    const session = JSON.parse(raw)
    // Expire after 7 days
    if (Date.now() - session.savedAt > 7 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem('lunaverse_session')
      return null
    }
    return session
  } catch {
    return null
  }
}

/**
 * Clear the session
 */
export function clearSession() {
  localStorage.removeItem('lunaverse_session')
}
