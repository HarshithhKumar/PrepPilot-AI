import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiCheck, FiCreditCard } from 'react-icons/fi'
import axios from 'axios'
import { serverUrl } from '../services/config'

const plans = [
  { title: 'Starter', price: 100, credits: 50, description: 'A few focused study sessions.' },
  { title: 'Study pack', price: 200, credits: 120, description: 'More room for your next subjects.', featured: true },
  { title: 'Semester pack', price: 500, credits: 300, description: 'Credits for a longer study plan.' },
]

function Pricing() {
  const [payingAmount, setPayingAmount] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handlePurchase = async (amount) => {
    setPayingAmount(amount)
    setErrorMessage('')
    try {
      const { data } = await axios.post(`${serverUrl}/api/credit/order`, { amount }, { withCredentials: true })
      if (!data.url) throw new Error('Checkout did not return a payment link.')
      window.location.assign(data.url)
    } catch (error) {
      console.error('Could not start checkout:', error)
      setErrorMessage('Checkout could not be started. Please try again in a moment.')
      setPayingAmount(null)
    }
  }

  return (
    <main className="pricing-page">
      <div className="pricing-inner">
        <Link className="pricing-back" to="/"><FiArrowLeft aria-hidden="true" /> Back to overview</Link>
        <div className="pricing-heading">
          <p className="eyebrow">Credits</p>
          <h1>Choose your next study pack</h1>
          <p>Purchase credits for AI-assisted note generation. Each successful generation uses 10 credits.</p>
        </div>
        {errorMessage && <p className="form-error pricing-error" role="alert">{errorMessage}</p>}
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article className={`pricing-card${plan.featured ? ' pricing-featured' : ''}`} key={plan.price}>
              {plan.featured && <span className="pricing-tag">Popular</span>}
              <span className="pricing-plan">{plan.title}</span>
              <h2><span>₹</span>{plan.price}</h2>
              <p className="pricing-credits"><FiCreditCard aria-hidden="true" /> {plan.credits} credits</p>
              <p className="pricing-description">{plan.description}</p>
              <ul>
                <li><FiCheck aria-hidden="true" /> Generate study notes</li>
                <li><FiCheck aria-hidden="true" /> Optional diagrams and charts</li>
                <li><FiCheck aria-hidden="true" /> Download notes as a PDF</li>
              </ul>
              <button
                type="button"
                className={plan.featured ? 'button-primary pricing-button' : 'button-secondary pricing-button'}
                onClick={() => handlePurchase(plan.price)}
                disabled={payingAmount !== null}
              >
                {payingAmount === plan.price ? 'Opening checkout…' : `Continue · ₹${plan.price}`}
              </button>
            </article>
          ))}
        </div>
        <p className="pricing-note">Payments are securely processed through Stripe Checkout. Credits are added after payment confirmation.</p>
      </div>
    </main>
  )
}

export default Pricing
