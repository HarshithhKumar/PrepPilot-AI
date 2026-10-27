import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FiCheckCircle } from 'react-icons/fi'
import { getCurrentUser } from '../services/api'

function PaymentSuccess() {
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
        <span className="payment-status-icon is-success"><FiCheckCircle aria-hidden="true" /></span>
        <p className="eyebrow">PrepPilot credits</p>
        <h1>Payment complete</h1>
        <p>Your credits will appear in your account once the payment confirmation is processed.</p>
        <Link className="button-primary" to="/">Return to your workspace</Link>
        <small>You will be redirected automatically in a few seconds.</small>
      </section>
    </main>
  )
}

export default PaymentSuccess
