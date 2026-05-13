import React, { useState, useEffect, useRef } from 'react'

/* ============================================================
   Navbar — Responsive, with volume controls & mobile menu
   ============================================================ */

// Volume icon components
function VolumeHighIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}

function VolumeLowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}

function VolumeMutedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}

export default function Navbar({
  user,
  onLoginClick,
  onLogout,
  onNavigateHome,
  onNavigatePortal,
  onNavigateTeam,
  currentPage,
  audio,
}) {
  const [scrolled, setScrolled] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const volumeRef = useRef(null)
  const volumeTimeout = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close volume slider when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target)) {
        setShowVolumeSlider(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleVolumeEnter = () => {
    clearTimeout(volumeTimeout.current)
    setShowVolumeSlider(true)
  }

  const handleVolumeLeave = () => {
    volumeTimeout.current = setTimeout(() => setShowVolumeSlider(false), 600)
  }

  const VolumeIcon = audio?.muted ? VolumeMutedIcon : (audio?.volume > 0.5 ? VolumeHighIcon : VolumeLowIcon)

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: '16px',
        left: '16px',
        right: '16px',
        zIndex: 'var(--z-overlay)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.65rem 1.25rem',
        borderRadius: 'var(--radius-xl)',
        background: scrolled
          ? 'rgba(6, 14, 46, 0.75)'
          : 'rgba(6, 14, 46, 0.35)',
        border: `1px solid ${scrolled ? 'rgba(120,140,255,0.15)' : 'rgba(120,140,255,0.06)'}`,
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        animation: 'slide-down 800ms cubic-bezier(0.16, 1, 0.3, 1) both',
        gap: '0.5rem',
      }}>
        {/* Logo / Brand */}
        <div
          onClick={() => { onNavigateHome(); setMobileMenuOpen(false); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            userSelect: 'none',
            flexShrink: 0,
          }}
        >
          <img
            src="/assets/lunaverse_blanc.png"
            alt="LunaVerse"
            style={{
              height: '28px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 12px rgba(79,122,255,0.2))',
            }}
          />
        </div>

        {/* Center: Nav links (Desktop only) */}
        <div className="desktop-only" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          flex: '0 1 auto',
          overflow: 'hidden',
        }}>
          {/* Accueil link (always visible now) */}
          <NavButton 
            onClick={onNavigateHome} 
            label="Accueil" 
            active={currentPage === 'landing'} 
          />
          {/* Notre Équipe link */}
          <NavButton
            onClick={onNavigateTeam}
            label="Notre Équipe"
            active={currentPage === 'team'}
          />
        </div>

        {/* Right side: volume + user controls + mobile burger */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexShrink: 0,
        }}>
          {/* Volume Control */}
          {audio?.shouldPlay && (
            <div
              ref={volumeRef}
              onMouseEnter={handleVolumeEnter}
              onMouseLeave={handleVolumeLeave}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                position: 'relative',
              }}
            >
              <button
                onClick={audio.toggleMute}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: 'none',
                  background: audio.muted ? 'rgba(244,63,94,0.12)' : 'rgba(120,140,255,0.08)',
                  color: audio.muted ? 'var(--color-accent-rose)' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = audio.muted ? 'rgba(244,63,94,0.2)' : 'rgba(120,140,255,0.15)'
                  e.currentTarget.style.color = audio.muted ? 'var(--color-accent-rose)' : 'var(--color-text-primary)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = audio.muted ? 'rgba(244,63,94,0.12)' : 'rgba(120,140,255,0.08)'
                  e.currentTarget.style.color = audio.muted ? 'var(--color-accent-rose)' : 'var(--color-text-secondary)'
                }}
                title={audio.muted ? 'Activer le son' : 'Couper le son'}
              >
                <VolumeIcon />
              </button>

              {/* Volume slider (popup below on hover, absolutely positioned) */}
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                left: '50%',
                transform: showVolumeSlider ? 'translateX(-50%) scale(1)' : 'translateX(-50%) scale(0.95)',
                padding: showVolumeSlider ? '0.75rem 1rem' : '0 1rem',
                width: showVolumeSlider ? '130px' : '0',
                height: showVolumeSlider ? 'auto' : '0',
                opacity: showVolumeSlider ? 1 : 0,
                pointerEvents: showVolumeSlider ? 'auto' : 'none',
                background: 'rgba(10, 19, 64, 0.95)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${showVolumeSlider ? 'rgba(120,140,255,0.2)' : 'transparent'}`,
                borderRadius: 'var(--radius-lg)',
                transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                zIndex: 100,
              }}>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={audio.muted ? 0 : audio.volume}
                  onChange={e => audio.changeVolume(parseFloat(e.target.value))}
                  className="volume-slider"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}

          {/* User Controls (Desktop) */}
          {user ? (
            <div className="desktop-only">
              <UserControls
                user={user}
                onLogout={() => { onLogout(); setMobileMenuOpen(false); }}
                onNavigatePortal={() => { onNavigatePortal(); setMobileMenuOpen(false); }}
              />
            </div>
          ) : (
            <div className="desktop-only">
              <button
                className="btn-primary"
                onClick={onLoginClick}
                style={{ padding: '0.55rem 1.2rem', fontSize: '0.82rem' }}
              >
                {/* Discord icon with filled eyes */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Se connecter
              </button>
            </div>
          )}

          {/* Mobile menu toggle (Burger) */}
          <button
            className="mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: '1px solid rgba(120,140,255,0.15)',
              background: mobileMenuOpen ? 'rgba(120,140,255,0.12)' : 'rgba(120,140,255,0.06)',
              color: mobileMenuOpen ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '16px',
          right: '16px',
          zIndex: 'var(--z-overlay)',
          background: 'rgba(6, 14, 46, 0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(120,140,255,0.15)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          animation: 'scale-in 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          {/* Mobile Nav Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <NavButton 
              onClick={() => { onNavigateHome(); setMobileMenuOpen(false); }} 
              label="Accueil" 
              active={currentPage === 'landing'} 
              mobile
            />
            <NavButton
              onClick={() => { onNavigateTeam(); setMobileMenuOpen(false); }}
              label="Notre Équipe"
              active={currentPage === 'team'}
              mobile
            />
          </div>

          <div style={{ height: '1px', background: 'rgba(120,140,255,0.1)', margin: '0.5rem 0' }} />

          {/* Mobile User Controls */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div 
                onClick={() => { onNavigatePortal(); setMobileMenuOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                title="Accéder au Portail"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{user.name}</div>
                  <div style={{ fontSize: '0.7rem', color: user.role === 'admin' ? 'var(--color-accent-violet)' : 'var(--color-accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{user.role === 'admin' ? 'Staff' : 'Membre'}</div>
                </div>
              </div>
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'var(--color-accent-rose)', borderColor: 'rgba(244,63,94,0.3)' }}
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <button
              className="btn-primary"
              onClick={() => { onLoginClick(); setMobileMenuOpen(false); }}
              style={{ width: '100%', padding: '0.75rem', justifyContent: 'center' }}
            >
              Se connecter
            </button>
          )}
        </div>
      )}
    </>
  )
}

/* ---- Nav Button ---- */
function NavButton({ onClick, label, active, mobile = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: mobile ? '0.75rem 1rem' : '0.4rem 0.85rem',
        background: active ? 'rgba(120,140,255,0.1)' : 'transparent',
        border: 'none',
        color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        fontFamily: 'var(--font-body)',
        fontSize: mobile ? '1rem' : '0.82rem',
        fontWeight: 500,
        cursor: 'pointer',
        borderRadius: mobile ? 'var(--radius-md)' : 'var(--radius-full)',
        transition: 'all var(--transition-fast)',
        whiteSpace: 'nowrap',
        textAlign: mobile ? 'left' : 'center',
        width: mobile ? '100%' : 'auto',
      }}
      onMouseEnter={e => {
        if (!mobile) {
          e.currentTarget.style.color = 'var(--color-text-primary)'
          e.currentTarget.style.background = 'rgba(120,140,255,0.08)'
        }
      }}
      onMouseLeave={e => {
        if (!mobile) {
          e.currentTarget.style.color = active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'
          e.currentTarget.style.background = active ? 'rgba(120,140,255,0.1)' : 'transparent'
        }
      }}
    >
      {label}
    </button>
  )
}

/* ---- User Controls (Desktop) ---- */
function UserControls({ user, onLogout, onNavigatePortal }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    }}>
      {/* User badge — always visible, now clickable */}
      <div 
        onClick={onNavigatePortal}
        title="Accéder au Portail"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.3rem 0.7rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(120,140,255,0.08)',
          border: '1px solid rgba(120,140,255,0.1)',
          maxWidth: '220px',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(120,140,255,0.12)'
          e.currentTarget.style.borderColor = 'rgba(120,140,255,0.2)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(120,140,255,0.08)'
          e.currentTarget.style.borderColor = 'rgba(120,140,255,0.1)'
        }}
      >
        {/* Avatar */}
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
        ) : (
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: user.role === 'admin'
              ? 'linear-gradient(135deg, var(--color-accent-violet), var(--color-accent-rose))'
              : 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-cyan))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.65rem',
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0,
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Name */}
        <span style={{
          fontSize: '0.78rem',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100px',
        }}>
          {user.name}
        </span>

        {/* Role badge */}
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: user.role === 'admin' ? 'var(--color-accent-violet)' : 'var(--color-accent-cyan)',
          padding: '1px 6px',
          borderRadius: 'var(--radius-full)',
          background: user.role === 'admin'
            ? 'rgba(168,85,247,0.12)'
            : 'rgba(0,210,255,0.1)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {user.role === 'admin' ? 'Staff' : 'Membre'}
        </span>
      </div>

      {/* Logout button */}
      <button
        onClick={onLogout}
        title="Déconnexion"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '34px',
          height: '34px',
          background: 'transparent',
          border: '1px solid rgba(244,63,94,0.2)',
          color: 'var(--color-accent-rose)',
          cursor: 'pointer',
          borderRadius: '50%',
          transition: 'all var(--transition-fast)',
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(244,63,94,0.1)'
          e.currentTarget.style.borderColor = 'rgba(244,63,94,0.35)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'rgba(244,63,94,0.2)'
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  )
}
