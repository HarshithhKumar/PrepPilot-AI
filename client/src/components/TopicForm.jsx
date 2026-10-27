import { useEffect, useState } from 'react'
import { FiBookOpen, FiLoader } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { generateNotes } from '../services/api'
import { updateCredits } from '../redux/userSlice'

function TopicForm({ setResult, setLoading, loading, setError, credits }) {
  const [topic, setTopic] = useState('')
  const [classLevel, setClassLevel] = useState('')
  const [examType, setExamType] = useState('')
  const [revisionMode, setRevisionMode] = useState(false)
  const [includeDiagram, setIncludeDiagram] = useState(false)
  const [includeChart, setIncludeChart] = useState(false)
  const [progress, setProgress] = useState(0)
  const dispatch = useDispatch()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!topic.trim()) {
      setError('Enter a topic to create study notes.')
      return
    }
    if (credits < 10) {
      setError('You need at least 10 credits to create notes. Add credits to continue.')
      return
    }

    setError('')
    setProgress(0)
    setLoading(true)
    setResult(null)

    try {
      const result = await generateNotes({
        topic: topic.trim(),
        classLevel: classLevel.trim(),
        examType: examType.trim(),
        revisionMode,
        includeDiagram,
        includeChart,
      })
      setResult(result.data)
      if (typeof result.creditsLeft === 'number') dispatch(updateCredits(result.creditsLeft))
      setTopic('')
      setClassLevel('')
      setExamType('')
      setRevisionMode(false)
      setIncludeDiagram(false)
      setIncludeChart(false)
    } catch (error) {
      console.error('Study note generation failed:', error)
      setError(error.response?.data?.message || 'Could not create study notes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) return undefined

    const interval = setInterval(() => {
      setProgress((current) => Math.min(current + Math.ceil(Math.random() * 7), 95))
    }, 850)
    return () => clearInterval(interval)
  }, [loading])

  return (
    <form className="workspace-panel workspace-form" onSubmit={handleSubmit}>
      <label>
        Topic <span aria-hidden="true">*</span>
        <input
          required
          maxLength={160}
          type="text"
          placeholder="For example, cellular respiration"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          disabled={loading}
        />
      </label>
      <label>
        Class or level <span className="optional-label">Optional</span>
        <input
          maxLength={80}
          type="text"
          placeholder="For example, Grade 10"
          value={classLevel}
          onChange={(event) => setClassLevel(event.target.value)}
          disabled={loading}
        />
      </label>
      <label>
        Exam or curriculum <span className="optional-label">Optional</span>
        <input
          maxLength={80}
          type="text"
          placeholder="For example, CBSE or SAT"
          value={examType}
          onChange={(event) => setExamType(event.target.value)}
          disabled={loading}
        />
      </label>

      <div className="workspace-options" aria-label="Optional study aids">
        <label><input type="checkbox" checked={revisionMode} onChange={(event) => setRevisionMode(event.target.checked)} disabled={loading} /> Revision mode</label>
        <label><input type="checkbox" checked={includeDiagram} onChange={(event) => setIncludeDiagram(event.target.checked)} disabled={loading} /> Include a diagram</label>
        <label><input type="checkbox" checked={includeChart} onChange={(event) => setIncludeChart(event.target.checked)} disabled={loading} /> Include charts</label>
      </div>

      <button className="button-primary generate-action" type="submit" disabled={loading || credits < 10}>
        {loading ? <><FiLoader className="spin-icon" aria-hidden="true" /> Creating notes…</> : <><FiBookOpen aria-hidden="true" /> Generate notes · 10 credits</>}
      </button>
      {credits < 10 && <p className="credit-warning">At least 10 credits are needed to generate notes. <Link to="/pricing">Add credits</Link>.</p>}
      {loading && (
        <div className="generation-progress" role="status" aria-live="polite">
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          <span>Generating your study material · {progress}% estimated</span>
        </div>
      )}
    </form>
  )
}

export default TopicForm
