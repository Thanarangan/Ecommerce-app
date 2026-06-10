import { useCallback, useMemo, useState } from 'react'
import {
  getCustomerProducts,
  searchCustomerProducts,
} from '../services/customerService'
import { getApiErrorMessage } from '../utils/errors'
import { getProductId } from '../utils/product'
import { ProductContext } from './ProductContext'

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastQuery, setLastQuery] = useState('')
  const [catalogLoaded, setCatalogLoaded] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getCustomerProducts()
      setProducts(data)
      setLastQuery('')
      return data
    } catch (requestError) {
      const message = getApiErrorMessage(
        requestError,
        'Unable to load products right now.',
      )
      setError(message)
      throw requestError
    } finally {
      setCatalogLoaded(true)
      setLoading(false)
    }
  }, [])

  const searchProducts = useCallback(
    async (query) => {
      const trimmedQuery = query.trim()

      if (!trimmedQuery) {
        return fetchProducts()
      }

      setLoading(true)
      setError('')

      try {
        const data = await searchCustomerProducts(trimmedQuery)
        setProducts(data)
        setLastQuery(trimmedQuery)
        return data
      } catch (requestError) {
        const message = getApiErrorMessage(
          requestError,
          'Unable to search products right now.',
        )
        setError(message)
        throw requestError
      } finally {
        setLoading(false)
      }
    },
    [fetchProducts],
  )

  const getProductById = useCallback(
    (productId) =>
      products.find((product) => String(getProductId(product)) === String(productId)),
    [products],
  )

  const value = useMemo(
    () => ({
      error,
      fetchProducts,
      getProductById,
      catalogLoaded,
      lastQuery,
      loading,
      products,
      searchProducts,
    }),
    [
      error,
      fetchProducts,
      getProductById,
      catalogLoaded,
      lastQuery,
      loading,
      products,
      searchProducts,
    ],
  )

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  )
}
