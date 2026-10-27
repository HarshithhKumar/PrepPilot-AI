import { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { FcGoogle } from 'react-icons/fc'
import { FiBookOpen, FiBarChart2, FiFileText, FiDownload, FiShield } from 'react-icons/fi'
import axios from 'axios'
import { auth, provider } from '../utils/firebase'
import { serverUrl } from '../services/config'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const features = [
  { icon: FiBookOpen, title: 'Exam-ready notes', description: 'Turn a topic into structured revision material.' },
  { icon: FiFileText, title: 'Notes for any topic', description: 'Build clear, organized notes around your subject.' },
  { icon: FiBarChart2, title: 'Visual explanations', description: 'Add diagrams and charts when they help.' },
  { icon: FiDownload, title: 'Portable study guides', description: 'Export generated notes as a PDF.' },
]

function Auth() {
  const dispatch = useDispatch()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleGoogleAuth = async () => {
    setIsSigningIn(true)
    setErrorMessage('')

    try {
      const { user } = await signInWithPopup(auth, provider)
      const idToken = await user.getIdToken()
      const result = await axios.post(
        `${serverUrl}/api/auth/google`,
        { idToken },
        { withCredentials: true }
      )
      dispatch(setUserData(result.data))
    } catch (error) {
      console.error('Google sign-in failed:', error)
      const firebaseCode = error.code
      const status = error.response?.status

      if (firebaseCode === 'auth/popup-blocked' || firebaseCode === 'auth/popup-closed-by-user') {
        setErrorMessage('The Google sign-in window was blocked or closed. Allow pop-ups for localhost and try again.')
      } else if (firebaseCode === 'auth/unauthorized-domain') {
        setErrorMessage('This site is not authorized for Google sign-in. Add localhost to Firebase Authentication’s authorized domains.')
      } else if (firebaseCode?.startsWith('auth/')) {
        setErrorMessage(`Google sign-in could not start (${firebaseCode}). Check the Firebase Google provider settings and try again.`)
      } else if (status === 503) {
        setErrorMessage('Your account service is temporarily unavailable because the database is offline. Check the server’s MongoDB connection, then try again.')
      } else if (status) {
        setErrorMessage(error.response?.data?.message || `Sign-in failed (server error ${status}). Please try again.`)
      } else {
        setErrorMessage('Could not reach the PrepPilot server. Check that the server is running, then try again.')
      }
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-layout">
        <section className="auth-story" aria-labelledby="auth-heading">
          <a className="brand" href="/" aria-label="PrepPilot home">
            <span className="brand-symbol">P</span>
            <span>PrepPilot</span>
          </a>

          <div className="auth-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> A clearer way to prepare</p>
            <h1 id="auth-heading">Make study time <span>count.</span></h1>
            <p className="auth-description">
              Build focused exam notes, explore ideas with visual explanations, and keep your study materials in one place.
            </p>
            <div className="credit-offer">
              <span className="credit-offer-icon"><FiShield aria-hidden="true" /></span>
              <span><strong>Start with 50 credits</strong><small>New accounts include 50 credits for generating study material.</small></span>
            </div>
          </div>

          <div className="auth-feature-grid">
            {features.map(({ icon: Icon, title, description }) => (
              <article className="auth-feature" key={title}>
                <span className="feature-icon"><Icon aria-hidden="true" /></span>
                <div><h2>{title}</h2><p>{description}</p></div>
              </article>
            ))}
          </div>
          <p className="auth-footnote">AI-generated material is a study aid. Review important facts against your course resources.</p>
        </section>

        <section className="auth-panel" aria-label="Sign in">
          <div className="auth-panel-top"><span className="status-dot" /> Your study space, ready when you are</div>
          <div className="auth-panel-content">
            <span className="auth-panel-icon"><FiBookOpen aria-hidden="true" /></span>
            <p className="eyebrow">Welcome to PrepPilot</p>
            <h2>Sign in to get started</h2>
            <p className="muted-copy">Use your Google account to create and revisit your study materials.</p>
            {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
            <button className="google-signin" type="button" onClick={handleGoogleAuth} disabled={isSigningIn}>
              <FcGoogle size={21} aria-hidden="true" />
              <span>{isSigningIn ? 'Connecting to Google…' : 'Continue with Google'}</span>
            </button>
            <p className="privacy-note">Secure sign-in with Google. PrepPilot never asks for your password.</p>
          </div>
          <div className="auth-panel-bottom"><span>Simple tools for focused learning</span><span>PrepPilot</span></div>
        </section>
      </div>
    </main>
  )
}

export default Auth
