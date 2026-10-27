import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { FiBookOpen, FiCreditCard, FiFileText, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { serverUrl } from '../services/config'
import { setUserData } from '../redux/userSlice'

function Navbar() {
  const { userData } = useSelector((state) => state.user)
  const [menuOpen, setMenuOpen] = useState(false)
  const [signOutError, setSignOutError] = useState('')
  const [signingOut, setSigningOut] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSignOut = async () => {
    setSigningOut(true)
    setSignOutError('')
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      dispatch(setUserData(null))
      navigate('/auth')
    } catch (error) {
      console.error('Sign-out failed:', error)
      setSignOutError('Could not sign out. Please try again.')
    } finally {
      setSigningOut(false)
    }
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink className="brand" to="/" aria-label="PrepPilot dashboard">
          <span className="brand-symbol">P</span><span>PrepPilot</span>
        </NavLink>
        <nav className={`primary-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <NavLink to="/" end onClick={closeMenu}><FiBookOpen aria-hidden="true" />Overview</NavLink>
          <NavLink to="/notes" onClick={closeMenu}><FiFileText aria-hidden="true" />Study workspace</NavLink>
          <NavLink to="/history" onClick={closeMenu}>My library</NavLink>
        </nav>
        <div className="header-tools">
          <NavLink className="credit-chip" to="/pricing"><FiCreditCard aria-hidden="true" /><strong>{userData?.credits ?? 0}</strong><span>credits</span></NavLink>
          <button className="profile-button" type="button" onClick={handleSignOut} disabled={signingOut} aria-label="Sign out">
            <span className="profile-avatar">{userData?.name?.trim()?.[0]?.toUpperCase() || 'U'}</span>
            <span className="profile-name">{signingOut ? 'Signing out…' : 'Sign out'}</span>
            <FiLogOut aria-hidden="true" />
          </button>
          <button className="mobile-menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}>
            {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </div>
      </div>
      {signOutError && <p className="header-error" role="alert">{signOutError}</p>}
    </header>
  )
}

export default Navbar
