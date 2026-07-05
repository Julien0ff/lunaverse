import React, { useState, useEffect } from 'react'
import { db } from '../lib/firebase.js'
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore'

export default function AdminTeam({ onBack }) {
  const [activeTab, setActiveTab] = useState('equipe') // 'equipe' | 'idees'
  const [team, setTeam] = useState([])
  const [descriptionsData, setDescriptionsData] = useState({})
  const [loading, setLoading] = useState(true)

  // Edit state
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ description: '', role: '', roleColor: '', forceDisplay: false })

  // Ideas state
  const [ideas, setIdeas] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch compiled team from API
      const res = await fetch('/api/team')
      if (res.ok) {
        const teamData = await res.json()
        setTeam(teamData)
      }

      // Fetch raw descriptions from Firebase
      const docRef = doc(db, 'team', 'data')
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setDescriptionsData(docSnap.data())
      } else {
        // Initialize if empty
        const initial = { config: { staffRoles: ["ID_DU_ROLE_FONDATEUR", "ID_DU_ROLE_HAUTE_ADMINISTRATION", "ID_DU_ROLE_ADMINISTRATEUR", "ID_DU_ROLE_MODERATEUR"] } }
        await setDoc(docRef, initial)
        setDescriptionsData(initial)
      }

      // Fetch ideas
      const ideasSnapshot = await getDocs(collection(db, 'ideas'))
      const ideasList = []
      ideasSnapshot.forEach(doc => ideasList.push({ id: doc.id, ...doc.data() }))
      // Sort by latest
      ideasList.sort((a, b) => b.createdAt - a.createdAt)
      setIdeas(ideasList)

    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const handleEdit = (member) => {
    const manualData = descriptionsData[member.id] || {}
    setForm({
      description: manualData.description || '',
      role: manualData.role || '',
      roleColor: manualData.roleColor || '',
      forceDisplay: manualData.forceDisplay || false
    })
    setEditingId(member.id)
  }

  const handleSave = async () => {
    if (!editingId) return
    const newDescriptions = { ...descriptionsData }
    newDescriptions[editingId] = {
      ...newDescriptions[editingId],
      description: form.description,
      role: form.role,
      roleColor: form.roleColor,
      forceDisplay: form.forceDisplay
    }
    
    try {
      await setDoc(doc(db, 'team', 'data'), newDescriptions)
      setDescriptionsData(newDescriptions)
      setEditingId(null)
      fetchData() // refresh the API data
    } catch (e) {
      alert("Erreur lors de la sauvegarde : " + e.message)
    }
  }

  const handleDeleteIdea = async (ideaId) => {
    if (!window.confirm("Supprimer cette idée ?")) return
    try {
      await deleteDoc(doc(db, 'ideas', ideaId))
      setIdeas(ideas.filter(i => i.id !== ideaId))
    } catch (e) {
      alert("Erreur : " + e.message)
    }
  }

  return (
    <div style={{
      position: 'relative',
      zIndex: 'var(--z-base)',
      padding: '7rem 1.5rem 3rem',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '50%',
            border: '1px solid rgba(120,140,255,0.15)', background: 'rgba(120,140,255,0.06)',
            color: 'var(--color-text-secondary)', cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <span className="micro-label" style={{ color: 'var(--color-accent-cyan)' }}>ADMINISTRATION</span>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 700 }}>
            Dashboard
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(120,140,255,0.1)' }}>
        <button
          onClick={() => setActiveTab('equipe')}
          style={{
            padding: '0.75rem 1.5rem', background: 'transparent', border: 'none',
            color: activeTab === 'equipe' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'equipe' ? '2px solid var(--color-accent-blue)' : '2px solid transparent',
            fontWeight: 600, cursor: 'pointer', transition: 'all 200ms'
          }}
        >
          Gestion de l'équipe
        </button>
        <button
          onClick={() => setActiveTab('idees')}
          style={{
            padding: '0.75rem 1.5rem', background: 'transparent', border: 'none',
            color: activeTab === 'idees' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            borderBottom: activeTab === 'idees' ? '2px solid var(--color-accent-purple)' : '2px solid transparent',
            fontWeight: 600, cursor: 'pointer', transition: 'all 200ms'
          }}
        >
          Boîte à Idées
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Chargement des données...</div>
      ) : activeTab === 'equipe' ? (
        <div>
          {editingId && (
            <div style={{
              marginBottom: '2rem', padding: '1.5rem', background: 'rgba(10, 19, 64, 0.5)',
              border: '1px solid rgba(120,140,255,0.15)', borderRadius: 'var(--radius-lg)',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Modifier la description ({team.find(m => m.id === editingId)?.name})</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }}>Nom du Rôle (Optionnel)</label>
                  <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} placeholder="Surcharge du rôle Discord" style={{ width: '100%', padding: '0.65rem', background: 'rgba(120,140,255,0.06)', border: '1px solid rgba(120,140,255,0.1)', color: '#fff', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }}>Couleur Hex (Optionnel)</label>
                  <input type="text" value={form.roleColor} onChange={e => setForm({...form, roleColor: e.target.value})} placeholder="#FF0000" style={{ width: '100%', padding: '0.65rem', background: 'rgba(120,140,255,0.06)', border: '1px solid rgba(120,140,255,0.1)', color: '#fff', borderRadius: '4px' }} />
                </div>
              </div>

              <label style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' }}>Description personnalisée</label>
              <textarea 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
                rows={3}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(120,140,255,0.06)', border: '1px solid rgba(120,140,255,0.1)', color: '#fff', borderRadius: '4px', marginBottom: '1rem' }}
              />

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button className="btn-secondary" onClick={() => setEditingId(null)} style={{ padding: '0.5rem 1rem' }}>Annuler</button>
                <button className="btn-primary" onClick={handleSave} style={{ padding: '0.5rem 1rem' }}>Sauvegarder dans Firebase</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {team.length === 0 && <div style={{ color: 'var(--color-text-muted)' }}>Aucun membre trouvé via l'API Discord. Vérifiez votre config Discord.</div>}
            {team.map(member => (
              <div key={member.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem', background: 'rgba(10, 19, 64, 0.3)', border: '1px solid rgba(120,140,255,0.06)',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={member.avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png'} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{member.name}</div>
                    <div style={{ fontSize: '0.75rem', color: member.roleColor }}>{member.role}</div>
                  </div>
                </div>
                <button className="btn-secondary" onClick={() => handleEdit(member)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                  Modifier
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>Idées des utilisateurs ({ideas.length})</h2>
          {ideas.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>Aucune idée pour le moment.</p>}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {ideas.map(idea => (
              <div key={idea.id} style={{
                background: 'rgba(10, 19, 64, 0.4)', border: '1px solid rgba(120,140,255,0.1)',
                borderRadius: '8px', padding: '1.5rem', position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <img src={idea.authorAvatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{idea.authorName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{new Date(idea.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{idea.content}</p>
                <button 
                  onClick={() => handleDeleteIdea(idea.id)}
                  style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: 'transparent', border: 'none', color: 'var(--color-accent-rose)', cursor: 'pointer',
                    padding: '0.5rem'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
