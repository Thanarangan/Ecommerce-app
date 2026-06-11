import { useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
import { useAuth } from '../hooks/useAuth'

export function MainLayout() {
  const { user } = useAuth()
  const isSeller = useMemo(
    () => String(user?.role || '').toUpperCase() === 'SELLER',
    [user?.role],
  )

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <span>{isSeller ? 'Commerce Seller Console' : 'Commerce Customer Storefront'}</span>
        <span>
          {isSeller
            ? 'Manage products and track seller transactions'
            : 'Secure checkout with JWT session persistence'}
        </span>
      </footer>
    </div>
  )
}
