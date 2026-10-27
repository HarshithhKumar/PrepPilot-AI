import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import {
  FiArrowRight,
  FiBarChart2,
  FiBookOpen,
  FiClock,
  FiFileText,
  FiFolder,
  FiPlus,
} from 'react-icons/fi'
import { serverUrl } from '../services/config'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const tools = [
  { icon: FiBookOpen, title: 'Exam notes', description: 'Build clear, exam-focused notes with revision points.', label: 'Create notes' },
  { icon: FiFolder, title: 'Topic notes', description: 'Organize a subject into structured learning material.', label: 'Start a document' },
  { icon: FiBarChart2, title: 'Charts & diagrams', description: 'Add visual explanations to your generated notes.', label: 'Explore visuals' },
]

function Home() {
  const { userData } = useSelector((state) => state.user)
  const [recentNotes, setRecentNotes] = useState([])
  const [notesError, setNotesError] = useState('')

  useEffect(() => {
    let active = true
    axios.get(`${serverUrl}/api/notes/getnotes`, { withCredentials: true })
      .then(({ data }) => {
        if (active) setRecentNotes(Array.isArray(data) ? data.slice(0, 3) : [])
      })
      .catch((error) => {
        console.error('Could not load recent notes:', error)
        if (active) setNotesError('Recent study materials could not be loaded.')
      })

    return () => { active = false }
  }, [])

  const firstName = userData?.name?.trim().split(/\s+/)[0] || 'there'

  return (
    <div className="app-frame">
      <Navbar />
      <main className="page-container dashboard-page">
        <section className="dashboard-welcome">
          <div>
            <p className="eyebrow">Your learning workspace</p>
            <h1>Good to see you, {firstName}.</h1>
            <p className="muted-copy">What would you like to work on today?</p>
          </div>
          <div className="balance-card" aria-label={`${userData?.credits ?? 0} credits remaining`}>
            <span className="balance-label">Available credits</span>
            <strong>{userData?.credits ?? 0}</strong>
            <Link to="/pricing">Get more <FiArrowRight aria-hidden="true" /></Link>
          </div>
        </section>

        <section className="dashboard-section" aria-labelledby="create-heading">
          <div className="section-heading">
            <div><p className="eyebrow">Study tools</p><h2 id="create-heading">Pick up where you need to</h2></div>
            <Link className="text-link" to="/notes">Open notes workspace <FiArrowRight aria-hidden="true" /></Link>
          </div>
          <div className="tool-grid">
            {tools.map(({ icon: Icon, title, description, label }) => (
              <Link className="tool-card" to="/notes" key={title}>
                <span className="tool-icon"><Icon aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="tool-card-action">{label}<FiArrowRight aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="dashboard-section recent-section" aria-labelledby="recent-heading">
          <div className="section-heading">
            <div><p className="eyebrow">Your library</p><h2 id="recent-heading">Recently created</h2></div>
            <Link className="text-link" to="/history">View all <FiArrowRight aria-hidden="true" /></Link>
          </div>
          {notesError ? (
            <p className="inline-notice" role="status">{notesError}</p>
          ) : recentNotes.length ? (
            <div className="recent-list">
              {recentNotes.map((note) => (
                <Link className="recent-item" to="/history" key={note._id}>
                  <span className="recent-icon"><FiFileText aria-hidden="true" /></span>
                  <span className="recent-copy"><strong>{note.topic}</strong><small>{[note.classLevel, note.examType].filter(Boolean).join(' · ') || 'Study notes'}</small></span>
                  <span className="recent-date"><FiClock aria-hidden="true" />{new Date(note.createdAt).toLocaleDateString()}</span>
                  <FiArrowRight className="recent-arrow" aria-hidden="true" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-library">
              <span className="empty-icon"><FiBookOpen aria-hidden="true" /></span>
              <h3>Your library starts here</h3>
              <p>Generated study materials will appear here when you create your first set of notes.</p>
              <Link className="button-primary" to="/notes"><FiPlus aria-hidden="true" /> Create study notes</Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home
