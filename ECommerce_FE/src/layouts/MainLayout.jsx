import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'

export function MainLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <span>Commerce Customer Storefront</span>
        <span>Secure checkout with JWT session persistence</span>
      </footer>
    </div>
  )
}
