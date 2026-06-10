import { AuthProvider } from './AuthProvider'
import { CartProvider } from './CartProvider'
import { ProductProvider } from './ProductProvider'
import { useAuth } from '../hooks/useAuth'

function ScopedCartProvider({ children }) {
  const { isAuthenticated, user } = useAuth()
  const cartScope = isAuthenticated && user?.email ? user.email : 'guest'

  return <CartProvider key={cartScope}>{children}</CartProvider>
}

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ProductProvider>
        <ScopedCartProvider>{children}</ScopedCartProvider>
      </ProductProvider>
    </AuthProvider>
  )
}
