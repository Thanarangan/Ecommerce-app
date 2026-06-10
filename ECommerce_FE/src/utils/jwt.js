function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    '=',
  )

  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(''),
  )
}

export function parseJwt(token) {
  if (!token || typeof token !== 'string') {
    return null
  }

  const [, payload] = token.split('.')

  if (!payload) {
    return null
  }

  try {
    return JSON.parse(decodeBase64Url(payload))
  } catch {
    return null
  }
}

export function isJwtExpired(token) {
  const payload = parseJwt(token)

  if (!payload?.exp) {
    return true
  }

  return payload.exp * 1000 <= Date.now()
}

export function getJwtEmail(token) {
  return parseJwt(token)?.sub || ''
}

export function getJwtExpiryMs(token) {
  const exp = parseJwt(token)?.exp
  return exp ? exp * 1000 : 0
}
