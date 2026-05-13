import React, { useState, useEffect, useCallback } from 'react'
import { getDiscordAvatarUrl } from '../lib/discord.js'

/* ============================================================
   AdminTeam — Admin panel for managing the team
   Stores data in localStorage ('lunaverse_team')
   ============================================================ */

const GROUPS = [
  { key: 'serveur', label: 'Équipe Serveur' },
  { key: 'rp', label: 'Équipe RP' },
]

const ROLES_BY_GROUP = {
  serveur: ['Fondateur', 'Co-Fondateur', 'Haute Administration', 'Administrateur', 'Responsable', 'Modérateur', 'Helper', 'Développeur', 'Graphiste', 'Community Manager', 'Rédacteur'],
  rp: ['Directeur', 'Proviseur', 'CPE', 'Professeur', 'Surveillant'],
}

import initialTeamData from '../data/team.json'

function loadTeamData() {
  try {
    const raw = localStorage.getItem('lunaverse_team')
    if (raw) return JSON.parse(raw)
    // Fallback to static file if localStorage is empty
    return initialTeamData || []
  } catch {
    return initialTeamData || []
  }
}

function saveTeamData(data) {
  localStorage.setItem('lunaverse_team', JSON.stringify(data))
}

export default function AdminTeam({ onBack }) {
  const [team, setTeam] = useState(loadTeamData)
  const [editing, setEditing] = useState(null) // null | 'new' | member.id
  const [form, setForm] = useState({ pseudo: '', displayName: '', discordId: '', avatarUrl: '', bannerUrl: '', group: 'serveur', role: '', description: '' })
  const [loaded, setLoaded] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [botToken, setBotToken] = useState(localStorage.getItem('discord_bot_token') || '')

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  const saveToken = (token) => {
    setBotToken(token)
    localStorage.setItem('discord_bot_token', token)
  }

  const resetForm = useCallback(() => {
    setForm({ pseudo: '', displayName: '', discordId: '', avatarUrl: '', bannerUrl: '', group: 'serveur', role: '', description: '' })
    setEditing(null)
  }, [])

  const handleSave = useCallback(() => {
    if (!form.pseudo.trim()) return

    let updated
    if (editing === 'new') {
      const newMember = {
        ...form,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      }
      updated = [...team, newMember]
    } else {
      updated = team.map(m => m.id === editing ? { ...m, ...form } : m)
    }

    setTeam(updated)
    saveTeamData(updated)
    resetForm()
  }, [editing, form, team, resetForm])

  const handleEdit = useCallback((member) => {
    setForm({
      pseudo: member.pseudo || '',
      displayName: member.displayName || '',
      discordId: member.discordId || '',
      avatarUrl: member.avatarUrl || '',
      bannerUrl: member.bannerUrl || '',
      group: member.group || 'serveur',
      role: member.role || '',
      description: member.description || '',
    })
    setEditing(member.id)
  }, [])

  const handleDelete = useCallback((id) => {
    const updated = team.filter(m => m.id !== id)
    setTeam(updated)
    saveTeamData(updated)
    if (editing === id) resetForm()
  }, [team, editing, resetForm])

  const availableRoles = ROLES_BY_GROUP[form.group] || []

  const fetchWithProxy = async (url, headers) => {
    // 1. Try local Vite proxy first
    const localUrl = url.replace('https://discord.com/api/v10', '/api/discord')
    try {
      const res = await fetch(localUrl, { headers })
      if (res.status === 401) throw new Error("TOKEN_INVALID")
      if (res.ok) return await res.json()
    } catch (err) {
      if (err.message === "TOKEN_INVALID") throw err
    }

    // 2. Fallback to public proxies (CORSProxy.io is currently the most stable)
    const proxies = [
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
      `https://cors-anywhere.herokuapp.com/${url}`
    ]

    for (const proxyUrl of proxies) {
      try {
        const res = await fetch(proxyUrl, { headers })
        if (res.status === 401) throw new Error("TOKEN_INVALID")
        if (res.status === 403 && proxyUrl.includes('herokuapp')) continue
        if (res.ok) return await res.json()
      } catch (err) {
        if (err.message === "TOKEN_INVALID") throw err
        continue 
      }
    }
    throw new Error("Discord bloque les requêtes. Essaie de coller directement le lien de l'avatar !")
  }

  return (
    <div style={{
      position: 'relative',
      zIndex: 'var(--z-base)',
      padding: '7rem 1.5rem 3rem',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      {/* Config Panel */}
      {showConfig && (
        <div style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          background: 'rgba(120,140,255,0.08)',
          border: '1px solid rgba(120,140,255,0.15)',
          borderRadius: 'var(--radius-lg)',
          animation: 'fade-in 300ms ease both',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                Configuration API Discord
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Optionnel : Pour l'auto-complétion par ID ou Pseudo.
              </p>
              <input 
                type="password"
                value={botToken}
                onChange={e => saveToken(e.target.value)}
                placeholder="Token du Bot Discord..."
                style={inputStyle}
              />
            </div>
            <button 
              onClick={() => setShowConfig(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: '0.5rem',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(120,140,255,0.1)' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
              Gestion des données (JSON)
            </h4>
            
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <button 
                className="btn-secondary"
                style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', flex: 1 }}
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(team, null, 2))
                  alert("JSON copié dans le presse-papier !")
                }}
              >
                Copier le JSON
              </button>
              <button 
                className="btn-secondary"
                style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', flex: 1, color: 'var(--color-accent-rose)' }}
                onClick={() => {
                  if (window.confirm("Voulez-vous vraiment TOUT supprimer ?")) {
                    setTeam([])
                    saveTeamData([])
                  }
                }}
              >
                Vider l'équipe
              </button>
            </div>

            <textarea 
              placeholder="Collez un JSON ici pour importer..."
              id="json-import"
              style={{
                ...inputStyle,
                minHeight: '80px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                marginBottom: '0.75rem'
              }}
            />
            <button 
              className="btn-primary"
              style={{ width: '100%', padding: '0.5rem', fontSize: '0.75rem' }}
              onClick={() => {
                const val = document.getElementById('json-import').value.trim()
                if (!val) return
                try {
                  const parsed = JSON.parse(val)
                  if (!Array.isArray(parsed)) throw new Error("Le JSON doit être un tableau []")
                  setTeam(parsed)
                  saveTeamData(parsed)
                  document.getElementById('json-import').value = ""
                  alert("Importation réussie !")
                } catch (err) {
                  alert("Erreur JSON : " + err.message)
                }
              }}
            >
              Importer le JSON
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: 'var(--space-2xl)',
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid rgba(120,140,255,0.15)',
            background: 'rgba(120,140,255,0.06)',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(120,140,255,0.12)'
            e.currentTarget.style.color = 'var(--color-text-primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(120,140,255,0.06)'
            e.currentTarget.style.color = 'var(--color-text-secondary)'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <span className="micro-label" style={{ color: 'var(--color-accent-cyan)' }}>ADMINISTRATION</span>
          <h1 style={{
            fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
          }}>
            Gérer l'équipe
          </h1>
        </div>
        <div style={{ flex: 1 }} />
        
        <IconButton onClick={() => setShowConfig(!showConfig)} title="Configuration API" color="var(--color-text-muted)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </IconButton>

        <button
          onClick={() => { resetForm(); setEditing('new') }}
          className="btn-primary"
          style={{ padding: '0.55rem 1.2rem', fontSize: '0.82rem' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Ajouter
        </button>
      </div>

      {/* Form (when editing or adding) */}
      {editing !== null && (
        <div style={{
          marginBottom: 'var(--space-xl)',
          padding: '1.75rem',
          background: 'rgba(10, 19, 64, 0.5)',
          border: '1px solid rgba(120,140,255,0.15)',
          borderRadius: 'var(--radius-lg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          animation: 'scale-in 300ms cubic-bezier(0.16, 1, 0.3, 1) both',
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '1.25rem',
            color: 'var(--color-text-primary)',
          }}>
            {editing === 'new' ? 'Ajouter un membre' : 'Modifier le membre'}
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {/* Pseudo (Interne) */}
            <FormField label="Pseudo interne" value={form.pseudo} onChange={v => setForm(f => ({ ...f, pseudo: v }))} placeholder="Ex: the._foxy" />

            {/* Display Name */}
            <FormField label="Pseudo d'affichage" value={form.displayName} onChange={v => setForm(f => ({ ...f, displayName: v }))} placeholder="Ex: PA・M. Foxy F." />

            {/* Discord ID / Search */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Recherche Discord (ID, Pseudo ou URL)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={form.discordId}
                  onChange={e => setForm(f => ({ ...f, discordId: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                  placeholder="ID Discord ou coller un lien d'avatar..."
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let inputVal = (form.discordId || '').trim()
                    if (!inputVal) return alert("Veuillez entrer un ID, un Pseudo ou une URL Discord.")

                    const avatarMatch = inputVal.match(/cdn\.discordapp\.com\/avatars\/(\d+)\/([a-z0-9_]+)/i)
                    const bannerMatch = inputVal.match(/cdn\.discordapp\.com\/banners\/(\d+)\/([a-z0-9_]+)/i)
                    const profileMatch = inputVal.match(/discord\.com\/users\/(\d+)/i)

                    if (avatarMatch || bannerMatch) {
                      setForm(f => ({
                        ...f,
                        discordId: avatarMatch ? avatarMatch[1] : (bannerMatch ? bannerMatch[1] : f.discordId),
                        avatarUrl: avatarMatch ? `https://cdn.discordapp.com/avatars/${avatarMatch[1]}/${avatarMatch[2]}.webp?size=256` : f.avatarUrl,
                        bannerUrl: bannerMatch ? `https://cdn.discordapp.com/banners/${bannerMatch[1]}/${bannerMatch[2]}.webp?size=600` : f.bannerUrl,
                      }))
                      return 
                    }

                    if (profileMatch) {
                      inputVal = profileMatch[1] // Extract ID and continue to API search
                    }

                    if (!botToken) {
                      setShowConfig(true)
                      return alert("Pour rechercher par ID ou Pseudo, configurez votre Token Bot (icône ⚙️).\n\nOU colle directement un lien d'avatar Discord dans la case !")
                    }
                    
                    const LUNAVERSE_GUILD_ID = '1216443076168515724'
                    const headers = { 'Authorization': `Bot ${botToken}` }
                    
                    try {
                      let targetId = inputVal
                      if (!/^\d{17,20}$/.test(inputVal)) {
                        const members = await fetchWithProxy(`https://discord.com/api/v10/guilds/${LUNAVERSE_GUILD_ID}/members/search?query=${encodeURIComponent(inputVal)}`, headers)
                        if (members.length === 0) throw new Error("Aucun membre trouvé.")
                        targetId = members[0].user.id
                      }

                      const data = await fetchWithProxy(`https://discord.com/api/v10/users/${targetId}`, headers)
                      setForm(f => ({
                        ...f,
                        discordId: data.id,
                        pseudo: data.username,
                        displayName: data.global_name || data.username,
                        avatarUrl: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.webp?size=256` : '',
                        bannerUrl: data.banner ? `https://cdn.discordapp.com/banners/${data.id}/${data.banner}.webp?size=600` : '',
                      }))
                    } catch (err) {
                      alert(err.message)
                    }
                  }}
                  className="btn-primary"
                  style={{ padding: '0 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                >
                  Auto-remplir
                </button>
              </div>
            </div>

            {/* Direct Links */}
            <FormField label="Lien Avatar" value={form.avatarUrl} onChange={v => setForm(f => ({ ...f, avatarUrl: v }))} placeholder="https://cdn.discordapp.com/avatars/..." />
            <FormField label="Lien Bannière" value={form.bannerUrl} onChange={v => setForm(f => ({ ...f, bannerUrl: v }))} placeholder="https://cdn.discordapp.com/banners/..." />

            {/* Group */}
            <div>
              <label style={labelStyle}>Groupe</label>
              <select
                value={form.group}
                onChange={e => setForm(f => ({ ...f, group: e.target.value, role: '' }))}
                style={inputStyle}
              >
                {GROUPS.map(g => (
                  <option key={g.key} value={g.key}>{g.label}</option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div>
              <label style={labelStyle}>Rôle</label>
              <select
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                style={inputStyle}
              >
                <option value="">— Choisir un rôle —</option>
                {availableRoles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Description (optionnel)</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Petit mot sur ce membre..."
                rows={2}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '60px',
                }}
              />
            </div>
          </div>

          {/* Preview */}
          {form.avatarUrl && (
            <div style={{
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(120,140,255,0.04)',
              border: '1px solid rgba(120,140,255,0.08)',
            }}>
              <img
                src={form.avatarUrl}
                alt="Preview"
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                onError={e => { e.target.src = `https://cdn.discordapp.com/embed/avatars/0.png` }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Aperçu de l'avatar
              </span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'flex-end' }}>
            <button
              onClick={resetForm}
              className="btn-secondary"
              style={{ padding: '0.5rem 1.2rem', fontSize: '0.82rem' }}
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary"
              style={{
                padding: '0.5rem 1.2rem',
                fontSize: '0.82rem',
                opacity: form.pseudo.trim() ? 1 : 0.5,
                pointerEvents: form.pseudo.trim() ? 'auto' : 'none',
              }}
            >
              {editing === 'new' ? 'Ajouter' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      )}

      {/* Team list */}
      {team.length === 0 && editing === null ? (
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
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Aucun membre dans l'équipe pour le moment.
          </p>
          <button
            onClick={() => { resetForm(); setEditing('new') }}
            className="btn-primary"
            style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}
          >
            Ajouter le premier membre
          </button>
        </div>
      ) : (
        GROUPS.map(group => {
          const members = team.filter(m => m.group === group.key)
          if (members.length === 0) return null

          return (
            <div key={group.key} style={{
              marginBottom: 'var(--space-xl)',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1) 200ms',
            }}>
              <h3 style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-secondary)',
                marginBottom: '0.75rem',
              }}>
                {group.label} ({members.length})
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {members.map(member => (
                  <AdminMemberRow
                    key={member.id}
                    member={member}
                    isEditing={editing === member.id}
                    onEdit={() => handleEdit(member)}
                    onDelete={() => handleDelete(member.id)}
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

/* ---- Form Field ---- */
function FormField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  )
}

/* ---- Admin Member Row ---- */
function AdminMemberRow({ member, isEditing, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const avatarUrl = member.avatarUrl || (member.discordId ? `https://cdn.discordapp.com/embed/avatars/${(BigInt(member.discordId) >> 22n) % 6n}.png` : null)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: isEditing
          ? 'rgba(79,122,255,0.08)'
          : hovered
          ? 'rgba(15, 26, 82, 0.5)'
          : 'rgba(10, 19, 64, 0.3)',
        border: `1px solid ${isEditing ? 'rgba(79,122,255,0.25)' : hovered ? 'rgba(120,140,255,0.15)' : 'rgba(120,140,255,0.06)'}`,
        borderRadius: 'var(--radius-md)',
        transition: 'all 250ms ease',
      }}
    >
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-indigo))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
      }}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={member.pseudo}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => {
              e.target.src = `https://cdn.discordapp.com/embed/avatars/0.png`
            }}
          />
        ) : (
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
            {(member.pseudo || '?').charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}>
          {member.displayName || member.pseudo}
        </span>
        <span style={{
          marginLeft: '0.5rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          fontWeight: 500,
          letterSpacing: '0.06em',
          color: 'var(--color-text-muted)',
        }}>
          {member.role}
        </span>
      </div>

      <div style={{
        display: 'flex',
        gap: '0.3rem',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 200ms ease',
      }}>
        <IconButton onClick={onEdit} title="Modifier" color="var(--color-accent-blue)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </IconButton>
        <IconButton onClick={onDelete} title="Supprimer" color="var(--color-accent-rose)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </IconButton>
      </div>
    </div>
  )
}

function IconButton({ onClick, title, color, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30px',
        height: '30px',
        borderRadius: '8px',
        border: 'none',
        background: 'rgba(120,140,255,0.06)',
        color: color,
        cursor: 'pointer',
        transition: 'all 150ms ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${color}20`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(120,140,255,0.06)'
      }}
    >
      {children}
    </button>
  )
}

const labelStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6rem',
  fontWeight: 500,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--color-text-muted)',
  display: 'block',
  marginBottom: '0.4rem',
}

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.9rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.85rem',
  fontWeight: 500,
  color: 'var(--color-text-primary)',
  background: 'rgba(120,140,255,0.06)',
  border: '1px solid rgba(120,140,255,0.12)',
  borderRadius: 'var(--radius-sm)',
  outline: 'none',
  transition: 'all 200ms ease',
}
