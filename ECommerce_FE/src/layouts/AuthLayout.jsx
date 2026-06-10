import { ShoppingBag, Sparkles } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <main className="auth-layout">
      <section className="auth-panel" aria-label="Authentication">
        <div className="auth-card">
          <Outlet />
        </div>
      </section>
      <aside className="auth-showcase" aria-label="Storefront preview">
        <div className="auth-showcase__brand">
          <span className="brand__mark" aria-hidden="true">
            <ShoppingBag size={22} />
          </span>
          <span>Commerce</span>
        </div>
        <div className="auth-showcase__content">
          <p className="eyebrow">Premium storefront</p>
          <h1>Shop smarter with a secure customer account.</h1>
          <p>
            Browse the product catalog, keep your cart synced locally, and
            place authenticated orders through the production API.
          </p>
        </div>
        <div className="auth-metric">
          <Sparkles size={18} />
          <span>JWT protected customer experience</span>
        </div>
      </aside>
    </main>
  )
}
