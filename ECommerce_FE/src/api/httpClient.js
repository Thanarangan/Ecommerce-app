import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT_MS } from './config'
import { TOKEN_STORAGE_KEY } from '../utils/storage'

let tokenGetter = () => window.localStorage.getItem(TOKEN_STORAGE_KEY)
let unauthorizedHandler = null

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function configureHttpClient({ getToken, onUnauthorized } = {}) {
  if (getToken) {
    tokenGetter = getToken
  }

  unauthorizedHandler = onUnauthorized || null
}

apiClient.interceptors.request.use((config) => {
  const token = tokenGetter?.()

  if (token && !config.skipAuth) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.response?.status === 401 &&
      !error?.config?.suppressUnauthorizedHandler
    ) {
      unauthorizedHandler?.()
    }

    return Promise.reject(error)
  },
)
