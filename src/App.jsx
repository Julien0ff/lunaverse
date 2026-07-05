import React, { useState, useCallback, useEffect } from 'react'
import LandingPage from './pages/LandingPage.jsx'
import Portal from './pages/Portal.jsx'
import TeamPage from './pages/TeamPage.jsx'
import AdminTeam from './pages/AdminTeam.jsx'
import OurStory from './pages/OurStory.jsx'
import Navbar from './components/Navbar.jsx'
import LoginModal from './components/LoginModal.jsx'
import BackgroundScene from './components/BackgroundScene.jsx'
import useAudioPlayer from './components/AudioPlayer.jsx'
import {
  parseOAuthCallback,
  fetchDiscordUser,
  fetchDiscordGuildMember,
  saveSession,
  loadSession,
  clearSession,
  LUNAVERSE_GUILD_ID,
  ROLE_ADMIN_ID,
  ROLE_MEMBER_ID,
  ADMIN_USER_IDS,
} from './lib/discord.js'

/* ============================================================
   App — Root component
   Manages Discord OAuth2 auth, routing, and global audio
   ============================================================ */

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing') // 'landing' | 'portal' | 'team' | 'admin-team'
  const [user, setUser] = useState(null) // null | { name, role, avatar, avatarUrl, id }
  const [showLogin, setShowLogin] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  // Audio player — active on landing + team pages
  const audio = useAudioPlayer(currentPage)

  // Determine user role
  const getRole = (memberInfo, discordUser) => {
    // Override d'urgence si tu as mis ton ID en dur dans discord.js
    if (discordUser && ADMIN_USER_IDS.includes(discordUser.id)) return 'admin'

    if (!memberInfo || !memberInfo.roles) return 'member' // fallback to member if fetch fails
    if (memberInfo.roles.includes(ROLE_ADMIN_ID)) return 'admin'
    if (memberInfo.roles.includes(ROLE_MEMBER_ID)) return 'member'
    return 'member' 
  }

  // On mount: check for saved session or OAuth callback
  useEffect(() => {
    const init = async () => {
      // 1. Check for OAuth2 callback in URL hash
      const callback = parseOAuthCallback()
      if (callback) {
        window.location.hash = '' // Clear hash from URL
        try {
          const discordUser = await fetchDiscordUser(callback.access_token)
          // Tente de récupérer les infos du membre sur le serveur
          const memberInfo = await fetchDiscordGuildMember(callback.access_token, LUNAVERSE_GUILD_ID)
          
          console.log('--- DEBUG DISCORD ---')
          console.log('User ID:', discordUser?.id)
          console.log('Member Info:', memberInfo)
          console.log('Roles found:', memberInfo?.roles)
          console.log('---------------------')

          const role = getRole(memberInfo, discordUser)
          
          const session = saveSession({ ...discordUser, lunaRole: role }, callback.access_token)
          setUser({
            id: session.id,
            name: session.global_name || session.username,
            role: session.lunaRole || 'member',
            avatar: session.avatar,
            avatarUrl: session.avatarUrl,
          })
          setCurrentPage('portal')
        } catch (err) {
          console.error('[Discord OAuth] Error fetching user:', err)
        }
        setAuthLoading(false)
        return
      }

      // 2. Check for saved session in localStorage
      const session = loadSession()
      if (session) {
        setUser({
          id: session.id,
          name: session.global_name || session.username,
          role: session.lunaRole || 'member',
          avatar: session.avatar,
          avatarUrl: session.avatarUrl,
        })
        setCurrentPage('portal')
      }
      setAuthLoading(false)
    }

    init()
  }, [])

  const handleLogout = useCallback(() => {
    clearSession()
    setUser(null)
    setCurrentPage('landing')
  }, [])

  const handleNavigateHome = useCallback(() => {
    setCurrentPage('landing')
  }, [])

  const handleNavigateTeam = useCallback(() => {
    setCurrentPage('team')
  }, [])

  const handleNavigateStory = useCallback(() => {
    setCurrentPage('our-story')
  }, [])

  const handlePortalNavigate = useCallback((action) => {
    if (action === 'admin-team') {
      setCurrentPage('admin-team')
    }
  }, [])

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-void)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          animation: 'fade-in 500ms ease both',
        }}>
          <img
            src="/assets/lunaverse_blanc.png"
            alt="LunaVerse"
            style={{
              height: '40px',
              width: 'auto',
              opacity: 0.7,
              filter: 'drop-shadow(0 0 20px rgba(79,122,255,0.3))',
            }}
          />
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid rgba(120,140,255,0.15)',
            borderTop: '2px solid var(--color-accent-blue)',
            borderRadius: '50%',
            animation: 'spin 800ms linear infinite',
          }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <BackgroundScene />
      
      <Navbar
        user={user}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
        onNavigateHome={handleNavigateHome}
        onNavigatePortal={() => setCurrentPage('portal')}
        onNavigateTeam={handleNavigateTeam}
        onNavigateStory={handleNavigateStory}
        currentPage={currentPage}
        audio={audio}
      />

      {currentPage === 'landing' && (
        <LandingPage onJoinClick={() => setShowLogin(true)} />
      )}

      {currentPage === 'portal' && user && (
        <Portal user={user} onNavigate={handlePortalNavigate} />
      )}

      {currentPage === 'team' && (
        <TeamPage />
      )}

      {currentPage === 'our-story' && (
        <OurStory />
      )}

      {currentPage === 'admin-team' && user?.role === 'admin' && (
        <AdminTeam onBack={() => setCurrentPage('portal')} />
      )}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
        />
      )}
    </div>
  )
}
