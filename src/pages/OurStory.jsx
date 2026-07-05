import React, { useEffect, useRef, useState } from 'react'

const TIMELINE_EVENTS = [
  {
    year: '2023',
    title: 'La naissance',
    description: 'Création du premier projet qui a posé les fondations de ce qui allait devenir LunaVerse. Une petite communauté passionnée se rassemble pour la première fois.',
    color: 'var(--color-accent-blue)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    )
  },
  {
    year: 'Début 2024',
    title: 'Expansion des horizons',
    description: 'Lancement du serveur Minecraft saison 1 et ouverture officielle de Luna School. Le concept d\'un univers interconnecté prend forme.',
    color: 'var(--color-accent-emerald)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    )
  },
  {
    year: 'Mi 2024',
    title: 'LunaFM & La voix de la communauté',
    description: 'La webradio LunaFM commence à diffuser. Des émissions régulières, de la musique et des débats animent les soirées des membres.',
    color: 'var(--color-accent-amber)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" x2="12" y1="19" y2="22"/>
      </svg>
    )
  },
  {
    year: 'Aujourd\'hui',
    title: 'L\'univers s\'agrandit',
    description: 'LunaVerse regroupe désormais de multiples projets, incluant LEMedia et une présence sur Roblox. Et l\'histoire ne fait que commencer.',
    color: 'var(--color-accent-rose)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
    )
  }
]

export default function OurStory() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Scroll to top when mounted
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
        margin: '0 auto 5rem',
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

      {/* Timeline Container */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative',
      }}>
        {/* Central Vertical Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: '2px',
          background: 'linear-gradient(to bottom, transparent, rgba(120,140,255,0.2) 10%, rgba(120,140,255,0.2) 90%, transparent)',
          transform: 'translateX(-50%)',
          zIndex: 0,
        }} className="timeline-line-mobile" />

        <style>{`
          @media (max-width: 768px) {
            .timeline-line-mobile {
              left: 24px !important;
              transform: translateX(0) !important;
            }
          }
        `}</style>

        {TIMELINE_EVENTS.map((event, idx) => (
          <TimelineItem key={idx} event={event} index={idx} isEven={idx % 2 === 0} />
        ))}
      </div>
    </div>
  )
}

function TimelineItem({ event, index, isEven }) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        marginBottom: '4rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`timeline-item ${isEven ? 'row' : 'row-reverse'}`}
    >
      <style>{`
        .timeline-item {
          flex-direction: row;
        }
        .timeline-item.row-reverse {
          flex-direction: row-reverse;
        }
        .timeline-content {
          width: calc(50% - 3rem);
        }
        @media (max-width: 768px) {
          .timeline-item {
            flex-direction: row !important;
            justify-content: flex-start !important;
          }
          .timeline-content {
            width: calc(100% - 4rem) !important;
            margin-left: 4rem !important;
          }
          .timeline-dot {
            left: 24px !important;
            transform: translateX(-50%) !important;
          }
        }
      `}</style>

      {/* Central Dot */}
      <div
        className="timeline-dot"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translate(-50%, 0)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'var(--color-background)',
          border: `2px solid ${event.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          color: event.color,
          boxShadow: hovered ? `0 0 20px ${event.color}40` : `0 0 0 ${event.color}00`,
          transition: 'all 400ms ease',
        }}
      >
        <div style={{ transform: hovered ? 'scale(1.1)' : 'scale(1)', transition: 'transform 300ms ease' }}>
          {event.icon}
        </div>
      </div>

      {/* Content Box */}
      <div
        className="timeline-content"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: '2rem',
          background: hovered ? 'rgba(15, 26, 82, 0.7)' : 'rgba(10, 19, 64, 0.4)',
          border: `1px solid ${hovered ? 'rgba(120,140,255,0.3)' : 'rgba(120,140,255,0.08)'}`,
          borderRadius: 'var(--radius-lg)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: hovered ? `0 8px 32px rgba(0,0,0,0.4), inset 0 0 20px ${event.color}15` : '0 8px 32px rgba(0,0,0,0.2)',
          transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          overflow: 'hidden',
          textAlign: isEven ? 'right' : 'left',
        }}
      >
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          [isEven ? 'right' : 'left']: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at ${isEven ? '100%' : '0%'} 0%, ${event.color}25 0%, transparent 70%), linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%)`,
          opacity: hovered ? 1 : 0.4,
          transition: 'opacity 400ms ease',
          pointerEvents: 'none',
        }} />

        {/* CSS fix for text alignment on mobile */}
        <style>{`
          @media (max-width: 768px) {
            .timeline-content {
              text-align: left !important;
            }
          }
        `}</style>

        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: event.color,
          letterSpacing: '0.05em',
          display: 'block',
          marginBottom: '0.5rem',
        }}>
          {event.year}
        </span>
        
        <h3 style={{
          fontSize: '1.4rem',
          fontWeight: 700,
          marginBottom: '1rem',
          color: '#fff',
        }}>
          {event.title}
        </h3>
        
        <p style={{
          fontSize: '0.95rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.7,
        }}>
          {event.description}
        </p>
      </div>

      {/* Empty Div for Flex balancing */}
      <div className="timeline-content" style={{ background: 'transparent', border: 'none', padding: 0 }} />
    </div>
  )
}
