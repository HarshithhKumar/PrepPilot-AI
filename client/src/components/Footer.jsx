import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <Link className="brand brand-footer" to="/">
        <span className="brand-symbol">P</span><span>PrepPilot</span>
      </Link>
      <p>AI-assisted study material to support your learning.</p>
      <span className="footer-note">Review generated content against your course materials.</span>
    </footer>
  )
}

export default Footer
