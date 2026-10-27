import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FiFileText } from 'react-icons/fi'
import { serverUrl } from '../services/config'
import Navbar from '../components/Navbar'
import FinalResult from '../components/FinalResult'

function History() {
  const [topics, setTopics] = useState([])
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)
  const [loadingList, setLoadingList] = useState(true)
  const [loadingNote, setLoadingNote] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    axios.get(`${serverUrl}/api/notes/getnotes`, { withCredentials: true })
      .then(({ data }) => {
        if (active) setTopics(Array.isArray(data) ? data : [])
      })
      .catch((requestError) => {
        console.error('Could not load the study library:', requestError)
        if (active) setError('Your library could not be loaded. Please try again.')
      })
      .finally(() => {
        if (active) setLoadingList(false)
      })
    return () => { active = false }
  }, [])

  const openNote = async (noteId) => {
    setActiveNoteId(noteId)
    setLoadingNote(true)
    setSelectedNote(null)
    setError('')
    try {
      const { data } = await axios.get(`${serverUrl}/api/notes/${noteId}`, { withCredentials: true })
      setSelectedNote(data.content)
    } catch (requestError) {
      console.error('Could not open study notes:', requestError)
      setError('This study material could not be opened. Please try again.')
    } finally {
      setLoadingNote(false)
    }
  }

  return (
    <div className="app-frame">
      <Navbar />
      <main className="page-container workspace-page">
        <div className="workspace-heading">
          <div>
            <p className="eyebrow">Your library</p>
            <h1>Saved study materials</h1>
            <p>Revisit notes you have generated with PrepPilot.</p>
          </div>
          <Link className="button-primary" to="/notes"><FiFileText aria-hidden="true" /> Create notes</Link>
        </div>

        <div className="history-layout">
          <section className="history-list" aria-label="Saved notes">
            <h2>All materials <span className="history-count">{topics.length}</span></h2>
            {loadingList && <p className="muted-copy">Loading your library…</p>}
            {!loadingList && !topics.length && !error && (
              <div className="history-list-empty">
                <p>No study materials yet.</p><Link to="/notes">Create your first notes</Link>
              </div>
            )}
            {topics.map((note) => (
              <button
                type="button"
                key={note._id}
                className={`history-note${activeNoteId === note._id ? ' is-active' : ''}`}
                onClick={() => openNote(note._id)}
                aria-current={activeNoteId === note._id ? 'true' : undefined}
              >
                <strong>{note.topic}</strong>
                <small>{[note.classLevel, note.examType].filter(Boolean).join(' · ') || 'Study notes'}{note.createdAt ? ` · ${new Date(note.createdAt).toLocaleDateString()}` : ''}</small>
              </button>
            ))}
          </section>

          <section className="history-content" aria-live="polite">
            {loadingNote && <div className="history-message">Loading study material…</div>}
            {!loadingNote && error && <div className="history-message history-error" role="alert">{error}</div>}
            {!loadingNote && !error && selectedNote && <FinalResult result={selectedNote} />}
            {!loadingNote && !error && !selectedNote && (
              <div className="history-empty">
                <span className="empty-icon"><FiFileText aria-hidden="true" /></span>
                <p>Select a document to view your saved notes.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default History
