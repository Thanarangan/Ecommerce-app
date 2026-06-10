export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://ecommerce-be-6lf3.onrender.com'

export const API_ENDPOINTS = {
  auth: {
    login: '/login',
    register: '/register',
  },
  customer: {
    dashboard: '/customer/dashboard',
    addToCart: '/customer/addToCart',
    payment: '/customer/payment',
    search: '/customer/search',
    order: '/customer/order',
    orderHistory: '/customer/orderhistory',
    cancelOrder: '/customer/cancelorder',
  },
}

export const API_TIMEOUT_MS = 20000
