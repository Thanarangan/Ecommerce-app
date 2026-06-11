import { useCallback, useEffect, useState } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StateBlock } from '../components/StateBlock'
import { getApiErrorMessage } from '../utils/errors'
import { formatCurrency } from '../utils/formatters'
import { getProductDescription, getProductName, getProductPrice } from '../utils/product'
import { deleteSellerProduct, getSellerProducts } from '../services/sellerService'

export function SellerDashboardPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState('')

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getSellerProducts()
      setProducts(data)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load seller products.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(loadProducts, 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadProducts])

  async function handleDelete(productId) {
    setDeletingId(productId)
    setError('')

    try {
      await deleteSellerProduct(productId)
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.productId !== productId),
      )
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to delete this product.'))
    } finally {
      setDeletingId('')
    }
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Seller</p>
          <h1>Seller dashboard</h1>
          <p>{products.length} product{products.length === 1 ? '' : 's'} listed by you.</p>
        </div>
        <Link className="button button--primary" to="/seller/add-product">
          Add product
        </Link>
      </section>

      {loading ? <StateBlock title="Loading products" description="Fetching seller catalog." /> : null}

      {!loading && error ? (
        <StateBlock
          action={loadProducts}
          actionLabel="Retry"
          description={error}
          title="Seller dashboard unavailable"
          tone="error"
        />
      ) : null}

      {!loading && !error && !products.length ? (
        <StateBlock
          description="Start by adding your first product listing."
          title="No products listed"
        />
      ) : null}

      {!loading && !error && products.length ? (
        <div className="orders-list">
          {products.map((product) => (
            <article className="order-card" key={product.productId}>
              <span className="order-card__icon">#{product.productId}</span>
              <div>
                <p className="eyebrow">Seller Product</p>
                <h2>{getProductName(product)}</h2>
                <p>{getProductDescription(product)}</p>
                <p>{formatCurrency(getProductPrice(product))}</p>
              </div>
              <button
                className="button button--danger"
                disabled={deletingId === product.productId}
                type="button"
                onClick={() => handleDelete(product.productId)}
              >
                {deletingId === product.productId ? <Loader2 size={17} /> : <Trash2 size={17} />}
                Delete
              </button>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  )
}
