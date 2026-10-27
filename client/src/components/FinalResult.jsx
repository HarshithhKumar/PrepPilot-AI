import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { FiAlertCircle, FiBookOpen, FiDownload, FiHelpCircle, FiList, FiRefreshCw, FiTarget } from 'react-icons/fi'
import MermaidSetup from './MermaidSetup'
import RechartSetUp from './RechartSetUp'
import { downloadPdf } from '../services/api'

const markdownComponents = {
  h1: ({ children }) => <h1 className="text-2xl font-bold text-slate-800 mt-6 mb-4 border-b pb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-semibold text-slate-800 mt-5 mb-3">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-2">{children}</h3>,
  p: ({ children }) => <p className="text-slate-700 leading-relaxed mb-3">{children}</p>,
  ul: ({ children }) => <ul className="list-disc ml-6 space-y-1 text-slate-700">{children}</ul>,
}

function FinalResult({ result }) {
  const [quickRevision, setQuickRevision] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState('')

  if (!result?.subTopics || !result?.questions || !result?.revisionPoints) return null

  const handleDownload = async () => {
    setDownloading(true)
    setDownloadError('')
    try {
      await downloadPdf(result)
    } catch (error) {
      console.error('PDF download failed:', error)
      setDownloadError('The PDF could not be downloaded. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <article className="final-result">
      <header className="result-header">
        <div>
          <p className="eyebrow">Study material</p>
          <h2><FiBookOpen aria-hidden="true" /> Generated notes</h2>
        </div>
        <div className="result-actions">
          <button type="button" className="button-secondary" onClick={() => setQuickRevision(!quickRevision)}>
            <FiRefreshCw aria-hidden="true" /> {quickRevision ? 'Full notes' : 'Quick revision'}
          </button>
          <button type="button" className="button-primary" onClick={handleDownload} disabled={downloading}>
            <FiDownload aria-hidden="true" /> {downloading ? 'Preparing PDF…' : 'Download PDF'}
          </button>
        </div>
      </header>
      {downloadError && <p className="result-error" role="alert"><FiAlertCircle aria-hidden="true" />{downloadError}</p>}

      {!quickRevision && (
        <section className="result-section">
          <SectionHeader icon={FiTarget} title="Priority topics" />
          {Object.entries(result.subTopics).map(([priority, topics]) => (
            <div className="priority-group" key={priority}>
              <strong>{priority} priority</strong>
              <ul>{topics.map((topic, index) => <li key={`${priority}-${index}`}>{topic}</li>)}</ul>
            </div>
          ))}
        </section>
      )}

      {!quickRevision && (
        <section className="result-section">
          <SectionHeader icon={FiBookOpen} title="Detailed notes" />
          <div className="markdown-content"><ReactMarkdown components={markdownComponents}>{result.notes || ''}</ReactMarkdown></div>
        </section>
      )}

      {quickRevision && (
        <section className="result-section revision-panel">
          <SectionHeader icon={FiRefreshCw} title="Revision points" />
          <ul>{result.revisionPoints.map((point, index) => <li key={index}>{point}</li>)}</ul>
        </section>
      )}

      {result.diagram?.data && (
        <section className="result-section">
          <SectionHeader icon={FiList} title="Diagram" />
          <MermaidSetup diagram={result.diagram.data} />
        </section>
      )}

      {result.charts?.length > 0 && (
        <section className="result-section">
          <SectionHeader icon={FiList} title="Charts" />
          <RechartSetUp charts={result.charts} />
        </section>
      )}

      <section className="result-section">
        <SectionHeader icon={FiHelpCircle} title="Practice questions" />
        <div className="question-block">
          <h3>Short questions</h3>
          <ul>{result.questions.short.map((question, index) => <li key={`short-${index}`}>{question}</li>)}</ul>
        </div>
        <div className="question-block">
          <h3>Long questions</h3>
          <ul>{result.questions.long.map((question, index) => <li key={`long-${index}`}>{question}</li>)}</ul>
        </div>
        {result.questions.diagram && <div className="question-block"><h3>Diagram question</h3><p>{result.questions.diagram}</p></div>}
      </section>
    </article>
  )
}

function SectionHeader({ icon: Icon, title }) {
  return <h3 className="result-section-heading"><Icon aria-hidden="true" />{title}</h3>
}

export default FinalResult
