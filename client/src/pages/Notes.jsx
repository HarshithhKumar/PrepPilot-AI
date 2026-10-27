import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiBookOpen, FiClock, FiFileText } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import TopicForm from '../components/TopicForm'
import Sidebar from '../components/Sidebar'
import FinalResult from '../components/FinalResult'

function Notes() {
  const { userData } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  return (
    <div className="app-frame">
      <Navbar />
      <main className="page-container workspace-page">
        <div className="workspace-heading">
          <div>
            <p className="eyebrow">Study workspace</p>
            <h1>Create study notes</h1>
            <p>Enter a topic and choose the study aids you want. Each successful generation uses 10 credits.</p>
          </div>
          <div className="workspace-actions">
            <span className="credit-chip"><FiBookOpen aria-hidden="true" /><strong>{userData?.credits ?? 0}</strong><span>credits</span></span>
            <Link className="button-secondary" to="/history"><FiClock aria-hidden="true" /> My library</Link>
          </div>
        </div>

        <TopicForm loading={loading} setResult={setResult} setLoading={setLoading} setError={setError} credits={userData?.credits ?? 0} />
        {error && <p className="workspace-error" role="alert">{error}</p>}
        {loading && <p className="workspace-progress" role="status">Creating your study material. This may take a few minutes.</p>}

        {result ? (
          <section className="workspace-result" aria-label="Generated study notes">
            <Sidebar result={result} />
            <div className="workspace-output"><FinalResult result={result} /></div>
          </section>
        ) : !loading && (
          <section className="workspace-placeholder" aria-live="polite">
            <FiFileText aria-hidden="true" />
            <strong>Your generated notes will appear here</strong>
            <p>Start with a topic above. Your saved materials will also be available in <Link to="/history">My library</Link>.</p>
          </section>
        )}
      </main>
    </div>
  )
}

export default Notes
