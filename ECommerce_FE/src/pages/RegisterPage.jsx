import { useState } from 'react'
import { Lock, Mail, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { getApiErrorMessage } from '../utils/errors'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'CUSTOMER',
    username: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(form)
      navigate('/', { replace: true })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to register.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="auth-card__header">
        <p className="eyebrow">Start shopping</p>
        <h1>Create account</h1>
        <p>Choose customer or seller account type before registration.</p>
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="role-switch" role="group" aria-label="Account type">
          <button
            className={form.role === 'CUSTOMER' ? 'chip chip--active' : 'chip'}
            type="button"
            onClick={() => setForm((current) => ({ ...current, role: 'CUSTOMER' }))}
          >
            Customer
          </button>
          <button
            className={form.role === 'SELLER' ? 'chip chip--active' : 'chip'}
            type="button"
            onClick={() => setForm((current) => ({ ...current, role: 'SELLER' }))}
          >
            Seller
          </button>
        </div>

        <label className="field">
          <span>Username</span>
          <div className="field__control">
            <User size={18} />
            <input
              autoComplete="username"
              name="username"
              required
              type="text"
              value={form.username}
              onChange={updateField}
            />
          </div>
        </label>

        <label className="field">
          <span>Email</span>
          <div className="field__control">
            <Mail size={18} />
            <input
              autoComplete="email"
              name="email"
              required
              type="email"
              value={form.email}
              onChange={updateField}
            />
          </div>
        </label>

        <label className="field">
          <span>Password</span>
          <div className="field__control">
            <Lock size={18} />
            <input
              autoComplete="new-password"
              minLength={6}
              name="password"
              required
              type="password"
              value={form.password}
              onChange={updateField}
            />
          </div>
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="button button--primary button--full" disabled={loading} type="submit">
          {loading ? <LoadingSpinner label="Creating account" /> : null}
          Create account
        </button>
      </form>

      <p className="auth-switch">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </>
  )
}
