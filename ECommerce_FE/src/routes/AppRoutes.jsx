import { Route, Routes } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { MainLayout } from '../layouts/MainLayout'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { OrderHistoryPage } from '../pages/OrderHistoryPage'
import { ProductDetailsPage } from '../pages/ProductDetailsPage'
import { ProductsPage } from '../pages/ProductsPage'
import { ProfilePage } from '../pages/ProfilePage'
import { RegisterPage } from '../pages/RegisterPage'
import { SellerAddProductPage } from '../pages/SellerAddProductPage'
import { SellerDashboardPage } from '../pages/SellerDashboardPage'
import { SellerTransactionsPage } from '../pages/SellerTransactionsPage'
import { GuestRoute } from './GuestRoute'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={['CUSTOMER']} />}>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:productId" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={['SELLER']} />}>
          <Route element={<MainLayout />}>
            <Route path="/seller" element={<SellerDashboardPage />} />
            <Route path="/seller/add-product" element={<SellerAddProductPage />} />
            <Route path="/seller/transactions" element={<SellerTransactionsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
