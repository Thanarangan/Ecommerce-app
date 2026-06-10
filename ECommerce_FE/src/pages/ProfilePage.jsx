import { Link } from 'react-router-dom'
import { Clock, Mail, ShieldCheck, ShoppingBag, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { getInitials } from '../utils/formatters'

export function ProfilePage() {
  const { sessionExpiresAt, user } = useAuth()
  const { formattedSubtotal, totalItems } = useCart()
  const expiryLabel = sessionExpiresAt
    ? new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(sessionExpiresAt))
    : 'Unavailable'

  return (
    <div className="page-stack">
      <section className="profile-header">
        <div className="profile-avatar">{getInitials(user?.username || user?.email)}</div>
        <div>
          <p className="eyebrow">Profile</p>
          <h1>{user?.username || 'Customer'}</h1>
          <p>{user?.email}</p>
        </div>
      </section>

      <section className="profile-grid">
        <article className="info-card">
          <User size={20} />
          <span>Username</span>
          <strong>{user?.username || 'Customer'}</strong>
        </article>
        <article className="info-card">
          <Mail size={20} />
          <span>Email</span>
          <strong>{user?.email}</strong>
        </article>
        <article className="info-card">
          <ShieldCheck size={20} />
          <span>Role</span>
          <strong>{user?.role || 'CUSTOMER'}</strong>
        </article>
        <article className="info-card">
          <Clock size={20} />
          <span>Session expires</span>
          <strong>{expiryLabel}</strong>
        </article>
      </section>

      <section className="profile-actions">
        <Link className="button button--secondary" to="/cart">
          <ShoppingBag size={18} />
          Cart · {totalItems} · {formattedSubtotal}
        </Link>
        <Link className="button button--primary" to="/orders">
          View order history
        </Link>
      </section>
    </div>
  )
}
