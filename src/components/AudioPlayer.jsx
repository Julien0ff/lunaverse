import React, { useEffect, useRef, useState, useCallback } from 'react'

/* ============================================================
   AudioPlayer — Global background music controller
   Plays random lofi tracks from /public/music/
   Only active on landing + team pages
   ============================================================ */

const TRACKS = [
  '/music/fassounds-lofi-study-calm-peaceful-chill-hop-112191.mp3',
  '/music/leberch-lofi-hip-hop-519408.mp3',
  '/music/mondamusic-lofi-lofi-girl-lofi-music-529555.mp3',
  '/music/mondamusic-lofi-lofi-music-lofi-chill-529558.mp3',
  '/music/pulsebox-lofi-night-522890.mp3',
  '/music/solarflex-lofi-lofi-girl-lofi-chill-515513.mp3',
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function useAudioPlayer(activePage) {
  const audioRef = useRef(null)
  const playlistRef = useRef(shuffle(TRACKS))
  const indexRef = useRef(0)
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('lunaverse_volume')
    return saved !== null ? parseFloat(saved) : 0.5
  })
  const [muted, setMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Pages where music should play
  const shouldPlay = activePage === 'landing' || activePage === 'team'

  // Create audio element once
  useEffect(() => {
    const audio = new Audio()
    audio.volume = volume
    audio.loop = false
    audioRef.current = audio

    const handleEnded = () => {
      indexRef.current = (indexRef.current + 1) % playlistRef.current.length
      // Re-shuffle when we loop back
      if (indexRef.current === 0) {
        playlistRef.current = shuffle(TRACKS)
      }
      audio.src = playlistRef.current[indexRef.current]
      audio.play().catch(() => { })
    }

    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.pause()
      audio.src = ''
    }
  }, [])

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume
    }
    localStorage.setItem('lunaverse_volume', String(volume))
  }, [volume, muted])

  // Handle page transitions — play/pause based on active page
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (shouldPlay && hasInteracted) {
      if (audio.paused) {
        if (!audio.src || audio.ended) {
          audio.src = playlistRef.current[indexRef.current]
        }
        audio.play().then(() => setIsPlaying(true)).catch(() => { })
      }
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }, [shouldPlay, hasInteracted])

  // Listen for first user interaction to unlock autoplay
  useEffect(() => {
    if (hasInteracted) return

    const unlock = () => {
      setHasInteracted(true)
      window.removeEventListener('click', unlock)
      window.removeEventListener('keydown', unlock)
    }

    window.addEventListener('click', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })

    return () => {
      window.removeEventListener('click', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [hasInteracted])

  const toggleMute = useCallback(() => {
    setMuted(m => !m)
  }, [])

  const changeVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(1, v))
    setVolume(clamped)
    if (clamped > 0 && muted) setMuted(false)
  }, [muted])

  return {
    volume,
    muted,
    isPlaying: isPlaying && shouldPlay,
    toggleMute,
    changeVolume,
    shouldPlay,
  }
}
