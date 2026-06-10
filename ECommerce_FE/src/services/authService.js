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

export async function registerUser({ username, email, password }) {
  const response = await apiClient.post(
    API_ENDPOINTS.auth.register,
    {
      username,
      email,
      password,
      role: 'CUSTOMER',
    },
    { skipAuth: true, suppressUnauthorizedHandler: true },
  )

  return response.data
}
