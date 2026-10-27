import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FiXCircle } from 'react-icons/fi'
import { getCurrentUser } from '../services/api'

function PaymentFailed() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    getCurrentUser(dispatch)
    const timer = setTimeout(() => navigate('/'), 5000)
    return () => clearTimeout(timer)
  }, [dispatch, navigate])

  return (
    <main className="payment-status-page">
      <section className="payment-status-card">
        <span className="payment-status-icon is-failed"><FiXCircle aria-hidden="true" /></span>
        <p className="eyebrow">PrepPilot credits</p>
        <h1>Payment was not completed</h1>
        <p>No credits were added. You can return to your workspace and try again whenever you are ready.</p>
        <Link className="button-primary" to="/">Return to your workspace</Link>
        <small>You will be redirected automatically in a few seconds.</small>
      </section>
    </main>
  )
}

export default PaymentFailed
