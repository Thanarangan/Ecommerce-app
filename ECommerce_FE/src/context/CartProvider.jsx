import { useCallback, useMemo, useState } from 'react'
import { addProductToCart } from '../services/customerService'
import { formatCurrency } from '../utils/formatters'
import { getProductId, getProductPrice } from '../utils/product'
import { getCartStorageKey, readJson, writeJson } from '../utils/storage'
import { useAuth } from '../hooks/useAuth'
import { CartContext } from './CartContext'

function normalizeQuantity(quantity) {
  const parsed = Number.parseInt(quantity, 10)
  return Number.isNaN(parsed) ? 1 : Math.max(parsed, 1)
}

function normalizeItem(product, quantity) {
  return {
    product,
    productId: getProductId(product),
    quantity: normalizeQuantity(quantity),
  }
}

export function CartProvider({ children }) {
  const { isAuthenticated, user } = useAuth()
  const cartStorageKey =
    isAuthenticated && user?.email ? getCartStorageKey(user.email) : ''
  const [items, setItems] = useState(() => {
    if (!cartStorageKey) {
      return []
    }

    const savedCart = readJson(cartStorageKey, [])
    return Array.isArray(savedCart) ? savedCart : []
  })

  const updateCart = useCallback(
    (updater) => {
      setItems((currentItems) => {
        const nextItems =
          typeof updater === 'function' ? updater(currentItems) : updater

        if (cartStorageKey) {
          writeJson(cartStorageKey, nextItems)
        }

        return nextItems
      })
    },
    [cartStorageKey],
  )

  const addItem = useCallback(
    async (product, quantity = 1) => {
      const productId = getProductId(product)
      const nextQuantity = normalizeQuantity(quantity)

      await addProductToCart({ productId, quantity: nextQuantity })

      updateCart((currentItems) => {
        const existingItem = currentItems.find(
          (item) => String(item.productId) === String(productId),
        )

        if (existingItem) {
          return currentItems.map((item) =>
            String(item.productId) === String(productId)
              ? {
                  ...item,
                  product,
                  quantity: item.quantity + nextQuantity,
                }
              : item,
          )
        }

        return [...currentItems, normalizeItem(product, nextQuantity)]
      })
    },
    [updateCart],
  )

  const updateQuantity = useCallback(
    (productId, quantity) => {
      const nextQuantity = normalizeQuantity(quantity)

      updateCart((currentItems) =>
        currentItems.map((item) =>
          String(item.productId) === String(productId)
            ? { ...item, quantity: nextQuantity }
            : item,
        ),
      )
    },
    [updateCart],
  )

  const removeItem = useCallback(
    (productId) => {
      updateCart((currentItems) =>
        currentItems.filter((item) => String(item.productId) !== String(productId)),
      )
    },
    [updateCart],
  )

  const clearCart = useCallback(() => {
    updateCart([])
  }, [updateCart])

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + getProductPrice(item.product) * item.quantity,
      0,
    )
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    return {
      formattedSubtotal: formatCurrency(subtotal),
      subtotal,
      totalItems,
    }
  }, [items])

  const value = useMemo(
    () => ({
      addItem,
      clearCart,
      items,
      removeItem,
      updateQuantity,
      ...totals,
    }),
    [addItem, clearCart, items, removeItem, totals, updateQuantity],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
