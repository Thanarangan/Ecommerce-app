import { API_ENDPOINTS } from '../api/config'
import { apiClient } from '../api/httpClient'

export async function loginUser({ email, password }) {
  const response = await apiClient.post(
    API_ENDPOINTS.auth.login,
    { email, password },
    { skipAuth: true, suppressUnauthorizedHandler: true },
  )

  return response.data
}

export async function registerUser({ username, email, password, role = 'CUSTOMER' }) {
  const response = await apiClient.post(
    API_ENDPOINTS.auth.register,
    {
      username,
      email,
      password,
      role,
    },
    { skipAuth: true, suppressUnauthorizedHandler: true },
  )

  return response.data
}

export async function validateSessionForRole(role) {
  const normalizedRole = String(role || 'CUSTOMER').toUpperCase()

  if (normalizedRole === 'SELLER') {
    await apiClient.get(API_ENDPOINTS.seller.dashboard)
    return
  }

  await apiClient.get(API_ENDPOINTS.customer.dashboard)
}
