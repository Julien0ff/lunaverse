import React, { useEffect, useRef } from 'react'

export default function BackgroundScene() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let stars = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      generateStars()
    }

    const generateStars = () => {
      stars = []
      const count = Math.floor((canvas.width * canvas.height) / 3000)
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.2 + 0.2,
          speed: Math.random() * 0.3 + 0.05,
          phase: Math.random() * Math.PI * 2,
          brightness: Math.random() * 0.5 + 0.3,
        })
      }
    }

    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (const star of stars) {
        const flicker = Math.sin(time * 0.001 * star.speed + star.phase) * 0.3 + 0.7
        const alpha = star.brightness * flicker
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    animId = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
    }}>
      {/* Star field canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Ambient orbs */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79,122,255,0.12) 0%, transparent 70%)',
        animation: 'float-1 25s ease-in-out infinite',
        filter: 'blur(60px)',
      }} />

      <div style={{
        position: 'absolute',
        top: '40%',
        right: '-8%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,92,231,0.1) 0%, transparent 70%)',
        animation: 'float-2 30s ease-in-out infinite',
        filter: 'blur(60px)',
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '30%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,210,255,0.08) 0%, transparent 70%)',
        animation: 'float-3 22s ease-in-out infinite',
        filter: 'blur(50px)',
      }} />

      {/* Subtle gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(2,8,36,0.3) 0%, transparent 40%, transparent 60%, rgba(2,8,36,0.5) 100%)',
      }} />
    </div>
  )
}
