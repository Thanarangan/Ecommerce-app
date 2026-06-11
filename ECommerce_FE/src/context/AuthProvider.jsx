import { useCallback, useEffect, useMemo, useState } from 'react'
import { configureHttpClient } from '../api/httpClient'
import {
  loginUser,
  registerUser,
  validateSessionForRole,
} from '../services/authService'
import { getJwtEmail, getJwtExpiryMs, isJwtExpired } from '../utils/jwt'
import {
  readJson,
  removeStorage,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
  writeJson,
} from '../utils/storage'
import { AuthContext } from './AuthContext'

function getInitialToken() {
  const savedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY)

  if (!savedToken || isJwtExpired(savedToken)) {
    removeStorage(TOKEN_STORAGE_KEY)
    return ''
  }

  return savedToken
}

function buildUserFromToken(token, fallback = {}) {
  const email = getJwtEmail(token) || fallback.email || ''
  const savedUser = readJson(USER_STORAGE_KEY)
  const savedMatchesToken = savedUser?.email === email

  if (!email) {
    return null
  }

  return {
    email,
    username:
      fallback.username ||
      (savedMatchesToken ? savedUser?.username : '') ||
      email.split('@')[0],
    role: fallback.role || (savedMatchesToken ? savedUser?.role : '') || 'CUSTOMER',
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getInitialToken)
  const [user, setUser] = useState(() => {
    const initialToken = getInitialToken()
    return initialToken ? buildUserFromToken(initialToken) : null
  })

  const applySession = useCallback((nextToken, profile = {}) => {
    const nextUser = buildUserFromToken(nextToken, profile)

    window.localStorage.setItem(TOKEN_STORAGE_KEY, nextToken)
    writeJson(USER_STORAGE_KEY, nextUser)
    setToken(nextToken)
    setUser(nextUser)

    return nextUser
  }, [])

  const logout = useCallback(() => {
    removeStorage(TOKEN_STORAGE_KEY)
    setToken('')
    setUser(null)
  }, [])

  const login = useCallback(
    async ({ email, password, role = 'CUSTOMER' }) => {
      const normalizedRole = String(role).toUpperCase()
      const nextToken = await loginUser({ email, password })
      const nextUser = applySession(nextToken, { email, role: normalizedRole })

      try {
        await validateSessionForRole(normalizedRole)
      } catch (requestError) {
        logout()
        throw requestError
      }

      return nextUser
    },
    [applySession, logout],
  )

  const register = useCallback(
    async ({ username, email, password, role = 'CUSTOMER' }) => {
      const normalizedRole = String(role).toUpperCase()
      const message = await registerUser({
        username,
        email,
        password,
        role: normalizedRole,
      })
      const nextToken = await loginUser({ email, password })
      applySession(nextToken, { username, email, role: normalizedRole })

      return message
    },
    [applySession],
  )

  useEffect(() => {
    configureHttpClient({
      getToken: () => window.localStorage.getItem(TOKEN_STORAGE_KEY),
      onUnauthorized: logout,
    })
  }, [logout])

  useEffect(() => {
    if (!token) {
      return undefined
    }

    const expiryMs = getJwtExpiryMs(token)
    const timeoutMs = Math.max(expiryMs - Date.now(), 0)
    const timeoutId = window.setTimeout(logout, timeoutMs)

    return () => window.clearTimeout(timeoutId)
  }, [logout, token])

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      login,
      logout,
      register,
      sessionExpiresAt: getJwtExpiryMs(token),
      token,
      user,
    }),
    [login, logout, register, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
