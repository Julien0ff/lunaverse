import React, { useState, useEffect } from 'react'

/* ============================================================
   PORTAL — laclasse.com-inspired tile dashboard
   Updated: logos for LEmedia/LunaFM/Luna School, Discord filled eyes,
   admin team tile
   ============================================================ */

// Discord logo SVG with filled eyes
function DiscordLogoFilled({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

// Roblox SVG
function RobloxLogo({ size = 28 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 50 50" fill="currentColor">
      <path d="M 12.125 1.9980469 A 1.0001 1.0001 0 0 0 11.199219 2.7441406 L 2.0332031 37.576172 A 1.0001 1.0001 0 0 0 2.7460938 38.798828 L 37.580078 47.966797 A 1.0001 1.0001 0 0 0 38.802734 47.253906 L 47.96875 12.419922 A 1.0001 1.0001 0 0 0 47.255859 11.197266 L 12.421875 2.03125 A 1.0001 1.0001 0 0 0 12.125 1.9980469 z M 21.5 19 L 31 21.5 L 28.5 31 L 19 28.5 L 21.5 19 z"></path>
    </svg>
  )
}

const TILES = [
  // --- Member tiles ---
  {
    id: 'ent',
    title: 'ENT',
    subtitle: 'Espace Numérique de Travail',
    url: 'https://ent.lunaverse.fr',
    color: '#4F7AFF',
    gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    roles: ['member', 'admin'],
    category: 'school',
    disabled: true,
  },
  {
    id: 'pronote',
    title: 'Pronote',
    subtitle: 'Notes, emplois du temps & bulletins',
    url: 'https://pronote.lunaverse.fr',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #065f46, #10b981)',
    logo: '/assets/Pronote_logo.png',
    fillBox: true,
    roles: ['member', 'admin'],
    category: 'school',
    disabled: true,
  },
  {
    id: 'inscription',
    title: 'Inscription',
    subtitle: 'S\'inscrire comme élève via Discord',
    url: 'https://discord.gg/8t8cQXM6eN',
    color: '#6C5CE7',
    gradient: 'linear-gradient(135deg, #5b21b6, #8b5cf6)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    ),
    roles: ['member', 'admin'],
    category: 'school',
    disabled: true,
  },
  {
    id: 'recrutement',
    title: 'Recrutement',
    subtitle: 'Équipe pédagogique',
    url: 'https://pentagonal-brisket-1d0.notion.site/7601d8435591470a85319e24add99806?pvs=105',
    color: '#A855F7',
    gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    roles: ['member', 'admin'],
    category: 'school',
    disabled: true,
  },
  {
    id: 'lunafm',
    title: "Luna'FM",
    subtitle: 'Webradio communautaire',
    url: 'https://lunafm.lunaverse.fr',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #92400e, #f59e0b)',
    logo: '/assets/lunafm.png',
    isRectangular: true,
    roles: ['member', 'admin'],
    category: 'media',
  },
  {
    id: 'roblox',
    title: 'Roblox',
    subtitle: 'Jeu LunaVerse',
    url: 'https://www.roblox.com/fr/games/79755605122846/LunaVerse',
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #c2410c, #f97316)',
    icon: <RobloxLogo />,
    roles: ['member', 'admin'],
    category: 'gaming',
  },
  {
    id: 'discord',
    title: 'Discord',
    subtitle: 'Rejoindre le serveur',
    url: 'https://discord.gg/8t8cQXM6eN',
    color: '#5865F2',
    gradient: 'linear-gradient(135deg, #4338ca, #5865f2)',
    customIcon: <DiscordLogoFilled size={32} />,
    roles: ['member', 'admin'],
    category: 'community',
  },

  // --- Admin-only tiles ---
  {
    id: 'admin-ent',
    title: 'Admin ENT',
    subtitle: 'Panneau d\'administration',
    url: 'https://ent.lunaverse.fr/admin',
    color: '#F43F5E',
    gradient: 'linear-gradient(135deg, #be123c, #f43f5e)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    roles: ['admin'],
    category: 'admin',
    disabled: true,
  },
  {
    id: 'admin-team',
    title: 'Équipe & Avis',
    subtitle: 'Gérer le staff et les avis',
    url: null,
    internalAction: 'admin-team',
    color: '#00D2FF',
    gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    roles: ['admin'],
    category: 'admin',
  },
  {
    id: 'lemedia-admin',
    title: 'LEmedia',
    subtitle: 'Studio Webtélé — En construction',
    url: '#',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #be185d, #ec4899)',
    logo: '/assets/lemedia.png',
    isRectangular: true,
    roles: ['admin'],
    category: 'admin',
    badge: 'Bientôt',
  },
]

const CATEGORIES = {
  school: { label: 'Luna School', color: '#4F7AFF' },
  media: { label: 'Médias', color: '#F59E0B' },
  gaming: { label: 'Jeux', color: '#F97316' },
  community: { label: 'Communauté', color: '#5865F2' },
  admin: { label: 'Administration', color: '#A855F7' },
}

export default function Portal({ user, onNavigate }) {
  const [loaded, setLoaded] = useState(false)
  const visibleTiles = TILES.filter(t => t.roles.includes(user.role))

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Group tiles by category
  const grouped = {}
  for (const tile of visibleTiles) {
    if (!grouped[tile.category]) grouped[tile.category] = []
    grouped[tile.category].push(tile)
  }

  return (
    <div style={{
      position: 'relative',
      zIndex: 'var(--z-base)',
      padding: '7rem 1.5rem 3rem',
      maxWidth: '1000px',
      margin: '0 auto',
    }}>
      {/* Portal greeting */}
      <div style={{
        marginBottom: 'var(--space-2xl)',
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.5rem',
        }}>
          <span className="micro-label" style={{ color: 'var(--color-accent-cyan)' }}>
            PORTAIL
          </span>
          <span style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'var(--color-text-muted)',
            display: 'inline-block',
          }} />
          <span className="micro-label">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
        <h1 style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
        }}>
          Bonjour, {user.name}
          <span style={{
            display: 'inline-block',
            marginLeft: '0.5rem',
            animation: 'fade-in 600ms ease 400ms both',
          }}>
            👋
          </span>
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--color-text-secondary)',
          marginTop: '0.35rem',
        }}>
          {user.role === 'admin'
            ? 'Accès complet — Portail Administrateur'
            : 'Accède à tes services et tes projets favoris'
          }
        </p>
      </div>

      {/* Category groups */}
      {Object.entries(grouped).map(([catKey, tiles], catIndex) => {
        const cat = CATEGORIES[catKey]
        return (
          <div
            key={catKey}
            style={{
              marginBottom: 'var(--space-xl)',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1) ${200 + catIndex * 100}ms`,
            }}
          >
            {/* Category label */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.85rem',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: cat.color,
                boxShadow: `0 0 8px ${cat.color}50`,
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-text-secondary)',
              }}>
                {cat.label}
              </span>
            </div>

            {/* Tiles grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '0.85rem',
            }}>
              {tiles.map((tile, tileIndex) => (
                <PortalTile
                  key={tile.id}
                  tile={tile}
                  delay={300 + catIndex * 100 + tileIndex * 60}
                  loaded={loaded}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function PortalTile({ tile, delay, loaded, onNavigate }) {
  const [hovered, setHovered] = useState(false)

  const handleClick = () => {
    if (tile.disabled) return;
    if (tile.internalAction) {
      onNavigate?.(tile.internalAction)
    } else if (tile.url && tile.url !== '#') {
      window.open(tile.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => !tile.disabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '0.75rem',
        padding: '1.75rem 1rem',
        background: hovered
          ? 'rgba(15, 26, 82, 0.6)'
          : 'rgba(10, 19, 64, 0.35)',
        border: `1px solid ${hovered ? 'rgba(120,140,255,0.2)' : 'rgba(120,140,255,0.08)'}`,
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        cursor: tile.disabled ? 'not-allowed' : ((tile.url && tile.url !== '#') || tile.internalAction ? 'pointer' : 'default'),
        transition: `all 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transform: loaded
          ? (hovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)')
          : 'translateY(20px) scale(0.95)',
        opacity: tile.disabled ? (loaded ? 0.4 : 0) : (loaded ? 1 : 0),
        pointerEvents: tile.disabled ? 'none' : 'auto',
        transitionDelay: `${delay}ms`,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
        boxShadow: hovered ? `0 16px 50px rgba(0,0,0,0.3), 0 0 30px ${tile.color}15` : 'none',
      }}
    >
      {/* Glow */}
      <div style={{
        position: 'absolute',
        top: '-30px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: tile.gradient,
        opacity: hovered ? 0.15 : 0,
        filter: 'blur(30px)',
        transition: 'opacity 400ms ease',
        pointerEvents: 'none',
      }} />

      {/* Icon container */}
      <div style={{
        width: tile.isRectangular ? '130px' : '64px',
        height: tile.isRectangular ? 'auto' : '64px',
        borderRadius: tile.isRectangular ? '0' : 'var(--radius-md)',
        background: (tile.isRectangular || tile.fillBox) ? 'transparent' : tile.gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        boxShadow: (hovered && !tile.isRectangular && !tile.fillBox) ? `0 8px 24px ${tile.color}30` : (!tile.isRectangular && !tile.fillBox ? `0 4px 12px ${tile.color}15` : 'none'),
        transition: 'all 400ms ease',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {tile.customIcon ? (
          tile.customIcon
        ) : tile.logo ? (
          <>
            <img
              src={tile.logo}
              alt={tile.title}
              style={{
                width: tile.fillBox ? '100%' : (tile.isRectangular ? '100%' : '48px'),
                height: tile.fillBox ? '100%' : (tile.isRectangular ? 'auto' : '48px'),
                objectFit: tile.fillBox ? 'cover' : 'contain',
              }}
              onError={e => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex' }}
            />
            <span style={{ display: 'none' }}>{tile.icon}</span>
          </>
        ) : (
          tile.icon
        )}
      </div>

      {/* Title */}
      <div>
        <div style={{
          fontWeight: 600,
          fontSize: '0.9rem',
          color: 'var(--color-text-primary)',
          marginBottom: '0.15rem',
          letterSpacing: '-0.01em',
        }}>
          {tile.title}
        </div>
        <div style={{
          fontSize: '0.7rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.4,
        }}>
          {tile.subtitle}
        </div>
      </div>

      {/* Badge */}
      {tile.badge && (
        <span style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: tile.color,
          padding: '0.15rem 0.45rem',
          borderRadius: 'var(--radius-full)',
          background: `${tile.color}15`,
          border: `1px solid ${tile.color}25`,
        }}>
          {tile.badge}
        </span>
      )}
    </button>
  )
}
