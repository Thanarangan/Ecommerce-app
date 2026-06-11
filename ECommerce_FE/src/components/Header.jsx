import { useState } from 'react'
import {
  BadgeDollarSign,
  History,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  PackagePlus,
  PackageSearch,
  ShoppingBag,
  User,
  X,
} from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { getInitials } from '../utils/formatters'

const customerNavItems = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: PackageSearch, label: 'Products', to: '/products' },
  { icon: History, label: 'Orders', to: '/orders' },
  { icon: User, label: 'Profile', to: '/profile' },
]

const sellerNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/seller' },
  { icon: PackagePlus, label: 'Add Product', to: '/seller/add-product' },
  { icon: BadgeDollarSign, label: 'Transactions', to: '/seller/transactions' },
]

export function Header() {
  const { logout, user } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const isSeller = String(user?.role || '').toUpperCase() === 'SELLER'
  const navItems = isSeller ? sellerNavItems : customerNavItems
  const homePath = isSeller ? '/seller' : '/'
  const profilePath = isSeller ? '/seller' : '/profile'

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="app-header">
      <Link className="brand" to={homePath} onClick={() => setMenuOpen(false)}>
        <span className="brand__mark" aria-hidden="true">
          <ShoppingBag size={22} />
        </span>
        <span>
          <strong>Commerce</strong>
          <small>Customer Storefront</small>
        </span>
      </Link>

      <button
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
        className="icon-button app-header__menu"
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <nav className={menuOpen ? 'app-nav app-nav--open' : 'app-nav'}>
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            className={({ isActive }) =>
              isActive ? 'app-nav__link app-nav__link--active' : 'app-nav__link'
            }
            end={to === '/'}
            key={to}
            to={to}
            onClick={() => setMenuOpen(false)}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="app-header__actions">
        {!isSeller ? (
          <Link className="cart-link" to="/cart">
            <ShoppingBag size={18} />
            <span>Cart</span>
            <strong>{totalItems}</strong>
          </Link>
        ) : null}
        <Link className="avatar" to={profilePath} title="Profile">
          {getInitials(user?.username || user?.email)}
        </Link>
        <button
          aria-label="Logout"
          className="icon-button"
          title="Logout"
          type="button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
