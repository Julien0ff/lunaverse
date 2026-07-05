import React, { useEffect, useState } from 'react'

export default function OurStory() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      padding: '8rem 1.5rem 6rem',
      position: 'relative',
      zIndex: 'var(--z-base)',
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height: '60vw',
        maxWidth: '800px',
        maxHeight: '800px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(138,43,226,0.06) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: -1,
      }} />

      {/* Header */}
      <div style={{
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto 2rem',
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <span className="micro-label" style={{
          display: 'inline-block',
          marginBottom: '1rem',
          color: 'var(--color-accent-purple)',
        }}>
          ORIGINES & ÉVOLUTION
        </span>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #fff, #b19cd9, #e6e6fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Notre Histoire
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.8,
        }}>
          De la première étincelle à l'univers complet que vous connaissez aujourd'hui.
          Découvrez les moments clés qui ont façonné LunaVerse.
        </p>
      </div>

      {/* Construction Message */}
      <div style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '3rem',
        textAlign: 'center',
        background: 'rgba(10, 19, 64, 0.4)',
        border: '1px solid rgba(120,140,255,0.08)',
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(10px)',
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1) 200ms',
      }}>
        <svg style={{ margin: '0 auto 1.5rem', color: 'var(--color-accent-amber)' }} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: '1rem'
        }}>
          En cours de construction
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          Nous sommes actuellement en train de rédiger les moindres détails de notre histoire. Revenez très bientôt pour découvrir toute l'évolution de LunaVerse !
        </p>
      </div>
    </div>
  )
}
