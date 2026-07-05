import React, { useState, useEffect, useRef } from 'react'
import { getDiscordAvatarUrl, getDiscordBannerUrl } from '../lib/discord.js'

/* ============================================================
   TeamPage — Notre Équipe (public page)
   Data sourced from Vercel API (/api/team)
   ============================================================ */

export default function TeamPage() {
  const [team, setTeam] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [loadingError, setLoadingError] = useState(false)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/team')
        if (!res.ok) throw new Error('Failed to fetch team')
        const data = await res.json()
        setTeam(data)
      } catch (err) {
        console.error('Error fetching team:', err)
        setLoadingError(true)
      } finally {
        setTimeout(() => setLoaded(true), 100)
      }
    }
    fetchTeam()
  }, [])

  // Group members by role
  const groupedByRole = {}
  for (const member of team) {
    const r = member.role || 'Staff'
    if (!groupedByRole[r]) groupedByRole[r] = []
    groupedByRole[r].push(member)
  }

  // Preserve the order returned by the API
  const sortedRoles = [...new Set(team.map(m => m.role))]

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
      {loadingError ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-accent-rose)' }}>
          Erreur lors du chargement de l'équipe. Veuillez réessayer plus tard.
        </div>
      ) : team.length === 0 && loaded ? (
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
            Aucun membre trouvé.
          </p>
        </div>
      ) : (
        sortedRoles.map((role, roleIdx) => {
          const membersByRole = groupedByRole[role]
          if (!membersByRole || membersByRole.length === 0) return null

          // The color of the first member of the role dictates the role color
          const roleColor = membersByRole[0].roleColor || '#4F7AFF'

          return (
            <div
              key={role}
              style={{
                marginBottom: 'var(--space-3xl)',
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1) ${200 + roleIdx * 150}ms`,
              }}
            >
              {/* Role header */}
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
                  background: roleColor,
                  boxShadow: `0 0 12px ${roleColor}60`,
                }} />
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'var(--color-text-primary)',
                  textTransform: 'uppercase',
                }}>
                  {role}
                </h2>
                <div style={{
                  flex: 1,
                  height: '1px',
                  background: `linear-gradient(90deg, ${roleColor}40, transparent)`,
                }} />
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
                    groupColor={member.roleColor}
                    groupGradient={`linear-gradient(135deg, ${member.roleColor}80, ${member.roleColor})`}
                    delay={roleIdx * 100 + memberIdx * 50}
                    loaded={loaded}
                  />
                ))}
              </div>
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

  const avatarUrl = member.avatarUrl || null

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
                {(member.name || '?').charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: '0.25rem' }}>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.01em',
              marginBottom: '0.2rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {member.name || 'Membre'}
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
