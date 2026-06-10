import { useState } from 'react'
import { Lock, Mail } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { getApiErrorMessage } from '../utils/errors'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const redirectTo = location.state?.from?.pathname || '/'

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
      await login(form)
      navigate(redirectTo, { replace: true })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to login.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="auth-card__header">
        <p className="eyebrow">Welcome back</p>
        <h1>Login to your account</h1>
        <p>Use your customer credentials to access the store.</p>
      </div>

      <form className="form-stack" onSubmit={handleSubmit}>
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
              autoComplete="current-password"
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
          {loading ? <LoadingSpinner label="Logging in" /> : null}
          Login
        </button>
      </form>

      <p className="auth-switch">
        New here? <Link to="/register">Create a customer account</Link>
      </p>
    </>
  )
}
