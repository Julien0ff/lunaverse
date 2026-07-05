import React, { useState, useEffect } from 'react'
import { db } from '../lib/firebase.js'
import { collection, addDoc, getDocs } from 'firebase/firestore'

export default function IdeasPage({ user, onLoginClick }) {
  const [ideas, setIdeas] = useState([])
  const [newIdea, setNewIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetchIdeas()
  }, [])

  const fetchIdeas = async () => {
    setFetching(true)
    try {
      const ideasSnapshot = await getDocs(collection(db, 'ideas'))
      const ideasList = []
      ideasSnapshot.forEach(doc => ideasList.push({ id: doc.id, ...doc.data() }))
      ideasList.sort((a, b) => b.createdAt - a.createdAt)
      setIdeas(ideasList)
    } catch (e) {
      console.error(e)
    }
    setFetching(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newIdea.trim() || !user) return

    setLoading(true)
    try {
      await addDoc(collection(db, 'ideas'), {
        content: newIdea,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatarUrl,
        createdAt: Date.now()
      })
      setNewIdea('')
      fetchIdeas()
      alert("Votre idée a bien été envoyée !")
    } catch (e) {
      alert("Erreur lors de l'envoi : " + e.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '8rem 1.5rem 4rem', maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 'var(--z-base)' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(135deg, #fff, #8B95C9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Boîte à idées
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Vous avez une idée pour améliorer le serveur ou le site ? Partagez-la avec nous !
        </p>
      </div>

      <div style={{ background: 'rgba(10, 19, 64, 0.4)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(120,140,255,0.1)', marginBottom: '3rem', backdropFilter: 'blur(20px)' }}>
        {user ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <img src={user.avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png'} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <div style={{ fontWeight: 600 }}>{user.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Prêt à partager une idée brillante ?</div>
              </div>
            </div>
            <textarea
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              placeholder="Décrivez votre idée en détail..."
              rows={5}
              style={{
                width: '100%', padding: '1rem', background: 'rgba(120,140,255,0.06)', border: '1px solid rgba(120,140,255,0.1)',
                borderRadius: '8px', color: '#fff', fontSize: '0.95rem', resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={!newIdea.trim() || loading} className="btn-primary" style={{ padding: '0.75rem 2rem', opacity: (!newIdea.trim() || loading) ? 0.5 : 1 }}>
                {loading ? 'Envoi...' : 'Envoyer mon idée'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Vous devez être connecté avec Discord pour proposer une idée.</p>
            <button onClick={onLoginClick} className="btn-primary" style={{ padding: '0.75rem 2rem', display: 'inline-flex' }}>
              Se connecter avec Discord
            </button>
          </div>
        )}
      </div>

      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>Idées récentes de la communauté</h2>
        {fetching ? (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Chargement des idées...</div>
        ) : ideas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(120,140,255,0.04)', borderRadius: '12px', border: '1px dashed rgba(120,140,255,0.2)' }}>
            Soyez le premier à proposer une idée !
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {ideas.map(idea => (
              <div key={idea.id} style={{ background: 'rgba(10, 19, 64, 0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(120,140,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <img src={idea.authorAvatar || 'https://cdn.discordapp.com/embed/avatars/0.png'} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{idea.authorName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{new Date(idea.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{idea.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
