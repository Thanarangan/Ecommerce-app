import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function RoleRoute({ allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const currentRole = String(user?.role || '').toUpperCase()
  const normalizedAllowedRoles = allowedRoles.map((role) => String(role).toUpperCase())

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!normalizedAllowedRoles.includes(currentRole)) {
    const fallback = currentRole === 'SELLER' ? '/seller' : '/'
    return <Navigate to={fallback} replace />
  }

  return <Outlet />
}
