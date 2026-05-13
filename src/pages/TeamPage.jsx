import React, { useState, useEffect, useRef } from 'react'
import { getDiscordAvatarUrl, getDiscordBannerUrl } from '../lib/discord.js'

/* ============================================================
   TeamPage — Notre Équipe (public page)
   Data sourced from localStorage (managed via AdminTeam)
   ============================================================ */

// Team groups with their display order
const GROUP_ORDER = [
  { key: 'serveur', label: 'Équipe Serveur', color: '#4F7AFF', gradient: 'linear-gradient(135deg, #1e40af, #4F7AFF)' },
  { key: 'rp', label: 'Équipe RP', color: '#10B981', gradient: 'linear-gradient(135deg, #065f46, #10B981)' },
]

// Role hierarchy within each group (display order)
const ROLE_HIERARCHY = {
  serveur: ['Fondateur', 'Co-Fondateur', 'Haute Administration', 'Administrateur', 'Responsable', 'Modérateur', 'Helper', 'Développeur', 'Graphiste', 'Community Manager', 'Rédacteur'],
  rp: ['Directeur', 'Proviseur', 'CPE', 'Professeur', 'Surveillant'],
}

import initialTeamData from '../data/team.json'

function loadTeamData() {
  try {
    const raw = localStorage.getItem('lunaverse_team')
    if (raw) return JSON.parse(raw)
    return initialTeamData || []
  } catch {
    return initialTeamData || []
  }
}

export default function TeamPage() {
  const [team, setTeam] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setTeam(loadTeamData())
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Group members by category
  const grouped = {}
  for (const member of team) {
    const grp = member.group || 'serveur'
    if (!grouped[grp]) grouped[grp] = []
    grouped[grp].push(member)
  }

  // Sort members within each group by role hierarchy
  for (const [grp, members] of Object.entries(grouped)) {
    const hierarchy = ROLE_HIERARCHY[grp] || []
    members.sort((a, b) => {
      const aIdx = hierarchy.indexOf(a.role)
      const bIdx = hierarchy.indexOf(b.role)
      return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx)
    })
  }

  return (
    <div style={{
      position: 'relative',
      zIndex: 'var(--z-base)',
      padding: '8rem 1.5rem 4rem',
      maxWidth: '1100px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: 'var(--space-3xl)',
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <span className="micro-label" style={{
          display: 'inline-block',
          marginBottom: '0.75rem',
          color: 'var(--color-accent-cyan)',
        }}>
          L'ÉQUIPE
        </span>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          marginBottom: '1rem',
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #E8ECFF 0%, #fff 40%, #8B95C9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Notre Équipe
          </span>
        </h1>
        <p style={{
          fontSize: '1rem',
          color: 'var(--color-text-secondary)',
          maxWidth: '550px',
          margin: '0 auto',
          lineHeight: 1.7,
        }}>
          Les personnes qui font vivre LunaVerse au quotidien.
          Chaque membre apporte sa pierre à l'édifice.
        </p>
      </div>

      {/* Team groups */}
      {team.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-3xl) 1rem',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 600ms ease 300ms',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 1.5rem',
            borderRadius: '50%',
            background: 'rgba(120,140,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            L'équipe sera bientôt présentée ici.
          </p>
        </div>
      ) : (
        GROUP_ORDER.map((group, groupIdx) => {
          const groupMembers = grouped[group.key]
          if (!groupMembers || groupMembers.length === 0) return null

          const hierarchy = ROLE_HIERARCHY[group.key] || []

          return (
            <div
              key={group.key}
              style={{
                marginBottom: 'var(--space-3xl)',
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1) ${200 + groupIdx * 150}ms`,
              }}
            >
              {/* Group header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '2.5rem',
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: group.color,
                  boxShadow: `0 0 12px ${group.color}60`,
                }} />
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'var(--color-text-primary)',
                  textTransform: 'uppercase',
                }}>
                  {group.label}
                </h2>
                <div style={{
                  flex: 1,
                  height: '1px',
                  background: `linear-gradient(90deg, ${group.color}40, transparent)`,
                }} />
              </div>

              {/* Role sections */}
              {hierarchy.map((role, roleIdx) => {
                const membersByRole = groupMembers.filter(m => m.role === role)
                if (membersByRole.length === 0) return null

                const isPremium = role === 'Fondateur' || role === 'Co-Fondateur' || role === 'Haute Administration'

                return (
                  <div key={role} style={{ marginBottom: '3rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1.25rem',
                    }}>
                      <h3 style={{
                        fontSize: isPremium ? '0.9rem' : '0.75rem',
                        fontWeight: isPremium ? 800 : 600,
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: isPremium ? group.color : 'var(--color-text-muted)',
                        padding: '4px 0',
                        position: 'relative',
                      }}>
                        {role}
                        {isPremium && (
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '2px',
                            background: group.color,
                            boxShadow: `0 0 8px ${group.color}80`,
                          }} />
                        )}
                      </h3>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '1.25rem',
                    }}>
                      {membersByRole.map((member, memberIdx) => (
                        <MemberCard
                          key={member.id}
                          member={member}
                          groupColor={group.color}
                          groupGradient={group.gradient}
                          delay={roleIdx * 100 + memberIdx * 50}
                          loaded={loaded}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })
      )}
    </div>
  )
}

function MemberCard({ member, groupColor, groupGradient, delay, loaded }) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const avatarUrl = member.avatarUrl || (member.discordId
    ? getDiscordAvatarUrl(member.discordId, null)
    : null)

  const bannerUrl = member.bannerUrl || null

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible && loaded ? 1 : 0,
        transform: visible && loaded
          ? (hovered ? 'translateY(-4px)' : 'translateY(0)')
          : 'translateY(20px)',
        transition: `all 500ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        background: hovered
          ? 'rgba(15, 26, 82, 0.6)'
          : 'rgba(10, 19, 64, 0.35)',
        border: `1px solid ${hovered ? 'rgba(120,140,255,0.2)' : 'rgba(120,140,255,0.08)'}`,
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hovered ? `0 16px 50px rgba(0,0,0,0.3), 0 0 30px ${groupColor}12` : 'none',
      }}
    >
      {/* Banner */}
      {/* Content wrapper */}
      <div style={{ padding: '1.25rem', position: 'relative' }}>
        {/* Glow accent */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: groupGradient,
          opacity: hovered ? 0.1 : 0.03,
          filter: 'blur(35px)',
          transition: 'opacity 400ms ease',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Avatar */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--color-void)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
            boxShadow: hovered ? `0 0 20px ${groupColor}30` : 'none',
            transition: 'box-shadow 400ms ease',
            position: 'relative',
            zIndex: 2,
          }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={member.displayName || member.pseudo}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = `<span style="font-size:1.2rem;font-weight:700;color:#fff">${(member.pseudo || '?').charAt(0).toUpperCase()}</span>`
                }}
              />
            ) : (
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                {(member.pseudo || '?').charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: '0.25rem' }}>
            <div style={{
              fontSize: (member.role === 'Fondateur' || member.role === 'Co-Fondateur' || member.role === 'Haute Administration') ? '1.2rem' : '1.05rem',
              fontWeight: (member.role === 'Fondateur' || member.role === 'Co-Fondateur' || member.role === 'Haute Administration') ? 800 : 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.01em',
              marginBottom: '0.2rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {member.displayName || member.pseudo || 'Membre'}
            </div>
          {member.description && (
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              marginTop: '0.4rem',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {member.description}
            </p>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}
