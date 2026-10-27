import { FiHelpCircle, FiTarget } from 'react-icons/fi'

function Sidebar({ result }) {
  if (!result?.subTopics || !result?.questions) return null

  return (
    <aside className="quick-view">
      <h2><FiTarget aria-hidden="true" /> Quick review</h2>
      {result.importance && (
        <section>
          <h3>Exam importance</h3>
          <p>{result.importance}</p>
        </section>
      )}
      <section>
        <h3>Priority topics</h3>
        {Object.entries(result.subTopics).map(([priority, topics]) => (
          <div className="quick-priority" key={priority}>
            <strong>{priority} priority</strong>
            <ul>{topics.map((topic, index) => <li key={`${priority}-${index}`}>{topic}</li>)}</ul>
          </div>
        ))}
      </section>
      <section>
        <h3><FiHelpCircle aria-hidden="true" /> Important questions</h3>
        <ul>{(result.questions.short || []).slice(0, 3).map((question, index) => <li key={`question-${index}`}>{question}</li>)}</ul>
      </section>
    </aside>
  )
}

export default Sidebar
