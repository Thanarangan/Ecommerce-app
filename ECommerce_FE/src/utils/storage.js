export const TOKEN_STORAGE_KEY = 'ecommerce.jwt'
export const USER_STORAGE_KEY = 'ecommerce.user'
export const CART_STORAGE_PREFIX = 'ecommerce.cart'

export function readJson(key, fallback = null) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorage(key) {
  window.localStorage.removeItem(key)
}

export function getCartStorageKey(email) {
  return `${CART_STORAGE_PREFIX}.${email || 'guest'}`
}
