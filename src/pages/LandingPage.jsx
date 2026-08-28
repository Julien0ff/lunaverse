import React, { useState, useEffect, useRef } from 'react'
import { db } from '../lib/firebase.js'
import { collection, getDocs } from 'firebase/firestore'

/* ============================================================
   PROJECTS — with logo images for LEmedia, LunaFM, Luna School
   ============================================================ */

// Minecraft Creeper SVG
function MinecraftLogo({ size = 28 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 48">
      <path fill="#8bc34a" d="M11,7h10l-1,4h3l-2,5h4l2-5h3l1-4h10l-6,26H3L11,7z"></path>
      <path fill="#263238" d="M40.754,6H40h-9h-0.74l-1.182,5H27.5h-1.299l-0.509,1.854L20.785,6H20h-7.266H11h-0.359h-0.01L2,33	l8.908,9h0.229h2.004h7.982l1.523-6.172L23.698,37h2.62l4.104,5H30.6h1.784h8.538L46,17L40.754,6z M31.333,8h8.133l-1.808,8h-3.754	l1.086-4.402c0.029-0.146-0.009-0.299-0.104-0.415C34.792,11.067,34.649,11,34.5,11h-3.908L31.333,8z M27.5,11.916V12h6.39l-1.012,4	h-6.581l1.087-3.66L27.5,11.916z M18.887,11h-7.715l0.938-3h7.688L18.887,11z M12.334,33.042H4.369L4.328,33H4.297l3.125-10h1.915	L7.52,29.362c-0.043,0.151-0.014,0.313,0.081,0.438C7.695,29.927,7.843,30,8,30h5.217L12.334,33.042z M9.52,26h4.858l-0.871,3H8.663	L9.52,26z M25.094,33l2.628-11h-2.094h-1.121l-1.352,5H17.4l1.354-5h-3.215l-0.871,3H9.806l0.675-2.362	c0.043-0.151,0.014-0.313-0.081-0.438C10.305,22.073,10.157,22,10,22H7.734l3.125-10h7.725H19h2.292l-1.354,5H25h1h11.432l-3.615,16	H25.094z"></path>
      <path fill="#8d6e63" d="M18.841,40l-6.507-7H4.328l6.854,7H18.841z M38.801,40l-4.985-7h-8.722l5.67,7H38.801z M23.036,33H23	l1.117-4.676L23.084,27h-5.6l6.587,8.001h0.607L23.036,33z"></path>
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

const PROJECTS = [
  {
    id: 'school',
    title: 'Luna School',
    tagline: 'Vie scolaire immersive',
    description: 'Un roleplay éducatif complet avec ENT, Pronote et système d\'inscription via Discord.',
    color: 'var(--color-accent-blue)',
    gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    logo: '/assets/school.png',
    fillBox: true,
    badge: 'Saison 2 en septembre',
    links: [
      { label: 'ENT', url: '#', disabled: true },
      { label: 'Pronote', url: '#', disabled: true },
      { label: 'Inscription', url: '#', disabled: true },
    ],
  },
  {
    id: 'minecraft',
    title: 'Minecraft',
    tagline: 'Saison 2 en préparation',
    description: 'Une nouvelle saison arrive avec des nouveautés inédites. Reste connecté pour ne rien rater !',
    color: 'var(--color-accent-emerald)',
    gradient: 'linear-gradient(135deg, #065f46, #10b981)',
    icon: <MinecraftLogo size={38} />,
    links: [],
    badge: 'Octobre - Novembre',
  },
  {
    id: 'radio',
    tagline: 'Webradio communautaire',
    description: 'La radio officielle de LunaVerse. Écoute, participe et deviens animateur !',
    color: 'var(--color-accent-amber)',
    gradient: 'linear-gradient(135deg, #92400e, #f59e0b)',
    logo: '/assets/lunafm.png',
    isRectangular: true,
    badge: 'Fermé',
    links: [
      { label: 'Écouter', url: '#', disabled: true },
    ],
  },
  {
    id: 'lemedia',
    tagline: 'Webtélé en construction',
    description: 'Le futur média vidéo de LunaVerse. Production, diffusion et créativité sans limites.',
    color: 'var(--color-accent-rose)',
    gradient: 'linear-gradient(135deg, #9f1239, #f43f5e)',
    logo: '/assets/lemedia.png',
    isRectangular: true,
    links: [],
    badge: 'Arrive bientôt',
  },
  {
    id: 'roblox',
    title: 'Roblox',
    tagline: 'Expérience LunaVerse',
    description: 'Explore l\'univers LunaVerse directement sur Roblox. Rejoins et joue avec la communauté !',
    color: 'var(--color-accent-orange)',
    gradient: 'linear-gradient(135deg, #c2410c, #f97316)',
    icon: <RobloxLogo />,
    links: [
      { label: 'Jouer', url: 'https://www.roblox.com/fr/games/79755605122846/LunaVerse' },
    ],
  },
]

// Discord logo SVG with filled eyes
function DiscordLogoFilled({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export default function LandingPage({ onJoinClick }) {
  return (
    <div style={{ position: 'relative', zIndex: 'var(--z-base)' }}>
      <HeroSection onJoinClick={onJoinClick} />
      <StatsSection />
      <ProjectsSection />
      <TestimonialsSection />
      <FooterSection onJoinClick={onJoinClick} />
    </div>
  )
}

/* ==============================
   HERO SECTION
   ============================== */
function HeroSection({ onJoinClick }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '8rem 1.5rem 4rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Central glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,122,255,0.08) 0%, transparent 60%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      {/* Micro label */}
      <div style={{
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '200ms',
        marginBottom: '1.5rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          fontWeight: 500,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--color-accent-cyan)',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(0,210,255,0.2)',
          background: 'rgba(0,210,255,0.06)',
        }}>
          ✦ Communauté Discord
        </span>
      </div>

      {/* Logo image */}
      <div style={{
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
        transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '400ms',
        marginBottom: '1.5rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <img
          src="/assets/lunaverse_blanc.png"
          alt="LunaVerse"
          style={{
            width: 'clamp(220px, 45vw, 400px)',
            height: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 40px rgba(79,122,255,0.2)) drop-shadow(0 0 80px rgba(108,92,231,0.1))',
          }}
        />
      </div>

      {/* Tagline */}
      <h1 style={{
        fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
        marginBottom: '1.5rem',
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '550ms',
      }}>
        <span style={{
          background: 'linear-gradient(135deg, #E8ECFF 0%, #fff 40%, #8B95C9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Bienvenue dans l'univers
        </span>
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
        maxWidth: '580px',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.7,
        marginBottom: '2.5rem',
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '600ms',
      }}>
        Un univers de projets créés par et pour les membres.
        <br />
        School RP, Minecraft, Webradio, Webtélé et bien plus.
      </p>

      {/* CTA Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: '800ms',
      }}>
        <button className="btn-primary" onClick={onJoinClick} style={{ fontSize: '0.95rem', padding: '0.85rem 2rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Accéder au portail
        </button>
        <a
          href="https://discord.gg/8t8cQXM6eN"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ fontSize: '0.95rem', padding: '0.85rem 2rem' }}
        >
          <DiscordLogoFilled size={18} />
          Rejoindre Discord
        </a>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        opacity: loaded ? 0.5 : 0,
        transition: 'opacity 1s ease 1.2s',
        animation: 'fade-up 2s ease-in-out infinite alternate',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
        }}>
          Découvrir
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  )
}

/* ==============================
   PROJECTS SECTION
   ============================== */
function ProjectsSection() {
  return (
    <section style={{
      padding: 'var(--space-3xl) 1.5rem var(--space-4xl)',
      maxWidth: '1100px',
      margin: '0 auto',
    }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
        <span className="micro-label" style={{
          display: 'inline-block',
          marginBottom: '0.75rem',
          color: 'var(--color-accent-blue)',
        }}>
          NOS PROJETS
        </span>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          marginBottom: '1rem',
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #E8ECFF, #8B95C9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Un écosystème complet
          </span>
        </h2>
        <p style={{
          fontSize: '1rem',
          color: 'var(--color-text-secondary)',
          maxWidth: '500px',
          margin: '0 auto',
          lineHeight: 1.7,
        }}>
          Chaque projet est une expérience unique, créée par la communauté pour la communauté.
        </p>
      </div>

      {/* Projects grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
      }}>
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project, index }) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? (hovered ? 'translateY(-4px)' : 'translateY(0)')
          : 'translateY(30px)',
        transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms`,
        background: hovered
          ? 'rgba(15, 26, 82, 0.6)'
          : 'rgba(10, 19, 64, 0.35)',
        border: `1px solid ${hovered ? 'rgba(120,140,255,0.2)' : 'rgba(120,140,255,0.08)'}`,
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '1.75rem',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hovered ? '0 20px 60px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      {/* Glow accent */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: project.gradient,
        opacity: hovered ? 0.12 : 0.04,
        filter: 'blur(40px)',
        transition: 'opacity 400ms ease',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{
          width: project.isRectangular ? '120px' : '56px',
          height: project.isRectangular ? 'auto' : '56px',
          borderRadius: project.isRectangular ? '0' : 'var(--radius-md)',
          background: (project.isRectangular || project.fillBox) ? 'transparent' : project.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: (hovered && !project.isRectangular && !project.fillBox) ? `0 0 24px ${project.color}33` : 'none',
          transition: 'box-shadow 400ms ease',
          overflow: 'hidden',
          padding: '0',
        }}>
          {project.logo ? (
            <img
              src={project.logo}
              alt={project.title}
              style={{
                width: project.fillBox ? '100%' : (project.isRectangular ? '100%' : '42px'),
                height: project.fillBox ? '100%' : (project.isRectangular ? 'auto' : '42px'),
                objectFit: project.fillBox ? 'cover' : 'contain',
              }}
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex') }}
            />
          ) : null}
          <span style={{ display: project.logo ? 'none' : 'flex' }}>
            {project.icon}
          </span>
        </div>
        {project.badge && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: project.color,
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            background: `color-mix(in srgb, ${project.color} 10%, transparent)`,
            border: `1px solid color-mix(in srgb, ${project.color} 20%, transparent)`,
          }}>
            {project.badge}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '1.15rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        marginBottom: '0.25rem',
      }}>
        {project.title}
      </h3>

      {/* Tagline */}
      <p style={{
        fontSize: '0.8rem',
        color: project.color,
        fontWeight: 500,
        marginBottom: '0.75rem',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.02em',
      }}>
        {project.tagline}
      </p>

      {/* Description */}
      <p style={{
        fontSize: '0.85rem',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.6,
        marginBottom: project.links.length ? '1.25rem' : '0',
      }}>
        {project.description}
      </p>

      {/* Links */}
      {project.links.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {project.links.map(link => (
            <a
              key={link.label}
              href={link.disabled ? '#' : link.url}
              target={link.disabled ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.75rem',
                fontWeight: 500,
                borderRadius: 'var(--radius-full)',
                opacity: link.disabled ? 0.5 : 1,
                cursor: link.disabled ? 'not-allowed' : 'pointer',
                pointerEvents: link.disabled ? 'none' : 'auto',
              }}
            >
              {link.label}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

/* ==============================
   STATS SECTION (Live)
   ============================== */
function StatsSection() {
  const [stats, setStats] = useState({ memberCount: '...', onlineCount: '...', activeProjects: '4' })
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (err) {
        console.error('Failed to fetch stats', err)
      }
    }
    fetchStats()

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={ref}
      style={{
        padding: '2rem 1.5rem',
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '2rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <StatBox title="Membres Totaux" value={stats.memberCount} color="var(--color-accent-blue)" />
      <StatBox title="En Ligne" value={stats.onlineCount} color="var(--color-accent-emerald)" />
      <StatBox title="Projets Actifs" value={stats.activeProjects} color="var(--color-accent-purple)" />
    </section>
  )
}

function StatBox({ title, value, color }) {
  return (
    <div style={{
      background: 'rgba(10, 19, 64, 0.4)',
      border: '1px solid rgba(120,140,255,0.08)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem 2rem',
      textAlign: 'center',
      minWidth: '200px',
      backdropFilter: 'blur(10px)',
      boxShadow: `0 8px 32px rgba(0,0,0,0.2), inset 0 0 20px ${color}10`,
    }}>
      <div style={{
        fontSize: '2.5rem',
        fontWeight: 800,
        color: color,
        marginBottom: '0.25rem',
        fontFamily: 'var(--font-mono)',
        textShadow: `0 0 20px ${color}40`,
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '0.85rem',
        color: 'var(--color-text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        fontWeight: 600,
      }}>
        {title}
      </div>
    </div>
  )
}

/* ==============================
   TESTIMONIALS SECTION
   ============================== */
function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([])
  const scrollRef = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const animationFrameId = useRef(null)

  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const res = await fetch('/api/avis')
        if (res.ok) {
          const avisList = await res.json()
          setTestimonials(avisList)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchAvis()
  }, [])

  // Infinite scroll
  useEffect(() => {
    if (!scrollRef.current || testimonials.length === 0) return
    const scrollContainer = scrollRef.current

    const scroll = () => {
      if (!isDragging.current) {
        scrollContainer.scrollLeft += 0.8 // Speed of scroll
        
        // We duplicated items 3 times. Reset scroll when we reach 1/3 of total width
        const singleSetWidth = scrollContainer.scrollWidth / 3
        if (scrollContainer.scrollLeft >= singleSetWidth) {
          scrollContainer.scrollLeft -= singleSetWidth
        }
      }
      animationFrameId.current = requestAnimationFrame(scroll)
    }
    
    animationFrameId.current = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationFrameId.current)
  }, [testimonials.length])

  const onMouseDown = (e) => {
    if (!scrollRef.current) return
    isDragging.current = true
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
    scrollRef.current.style.cursor = 'grabbing'
  }
  const onMouseLeave = () => { 
    isDragging.current = false 
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }
  const onMouseUp = () => { 
    isDragging.current = false 
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }
  const onMouseMove = (e) => {
    if (!isDragging.current || !scrollRef.current) return
    e.preventDefault() // Prevents text selection while dragging
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 2
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }

  // Duplicate items for infinite scroll illusion
  const displayItems = testimonials.length > 0 ? [...testimonials, ...testimonials, ...testimonials] : []

  return (
    <section style={{
      padding: '1rem 0 6rem',
      width: '100vw',
      maxWidth: '100%',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      overflow: 'hidden',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 1.5rem' }}>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #E8ECFF, #8B95C9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Ce qu'ils en disent
        </h2>
      </div>
      
      {testimonials.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '0 1.5rem' }}>
          Les témoignages de nos membres apparaîtront ici.
        </div>
      ) : (
        <div 
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '1.5rem',
            overflowX: 'hidden', // Using JS drag + requestAnimationFrame instead of native scroll
            padding: '0 1.5rem 2rem',
            cursor: 'grab',
            userSelect: 'none', // Prevent text selection globally in this container
            WebkitUserSelect: 'none',
          }}
        >
          {displayItems.map((t, idx) => (
            <div key={`${t.id}-${idx}`} style={{ minWidth: '320px', maxWidth: '400px', flex: '0 0 auto' }}>
              <TestimonialCard testimonial={t} index={idx} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function TestimonialCard({ testimonial, index }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 150}ms`,
        background: 'rgba(10, 19, 64, 0.3)',
        border: '1px solid rgba(120,140,255,0.08)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        position: 'relative',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'rgba(120,140,255,0.2)', marginBottom: '1rem' }}>
        <path d="M14.017 21L16.09 13.232H11.517V3H21.517V13.232L19.444 21H14.017ZM4.5 21L6.573 13.232H2V3H12V13.232L9.927 21H4.5Z" />
      </svg>
      <p style={{
        fontSize: '0.95rem',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.6,
        marginBottom: '1.5rem',
        fontStyle: 'italic',
        whiteSpace: 'pre-wrap',
      }}>
        "{testimonial.content}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {testimonial.authorAvatar ? (
          <img 
            src={testimonial.authorAvatar} 
            alt={testimonial.authorName} 
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-blue))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
          }}>
            {testimonial.authorName?.charAt(0) || '?'}
          </div>
        )}
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {testimonial.authorName}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {testimonial.authorRole || 'Membre'}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ==============================
   FOOTER SECTION
   ============================== */
function FooterSection({ onJoinClick }) {
  return (
    <footer style={{
      padding: '3rem 1.5rem 2rem',
      textAlign: 'center',
      borderTop: '1px solid rgba(120,140,255,0.06)',
    }}>
      {/* CTA block */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto 3rem',
      }}>
        <h3 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #E8ECFF, #8B95C9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Prêt à rejoindre l'aventure ?
        </h3>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--color-text-secondary)',
          marginBottom: '1.5rem',
          lineHeight: 1.6,
        }}>
          Rejoins des centaines de membres sur Discord et accède à tous les projets LunaVerse.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={onJoinClick}>
            Connexion au portail
          </button>
          <a
            href="https://discord.gg/8t8cQXM6eN"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <DiscordLogoFilled size={16} />
            Discord
          </a>
        </div>
      </div>

      {/* Bottom credits */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(120,140,255,0.04)',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
        }}>
          © 2026 LunaVerse — Tous droits réservés
        </span>
      </div>
    </footer>
  )
}
