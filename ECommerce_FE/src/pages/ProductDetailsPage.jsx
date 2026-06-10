import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Loader2, ShoppingBag, ShoppingCart } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ProductImage } from '../components/ProductImage'
import { QuantityStepper } from '../components/QuantityStepper'
import { StateBlock } from '../components/StateBlock'
import { useCart } from '../hooks/useCart'
import { useProducts } from '../hooks/useProducts'
import { getApiErrorMessage } from '../utils/errors'
import { formatCurrency } from '../utils/formatters'
import {
  getProductDescription,
  getProductName,
  getProductPrice,
  inferProductCategory,
} from '../utils/product'

export function ProductDetailsPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { catalogLoaded, fetchProducts, getProductById, loading } = useProducts()
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const product = getProductById(productId)

  useEffect(() => {
    if (!product && !catalogLoaded && !loading) {
      fetchProducts().catch(() => {})
    }
  }, [catalogLoaded, fetchProducts, loading, product])

  const total = useMemo(
    () => getProductPrice(product) * quantity,
    [product, quantity],
  )

  async function handleAddToCart(redirect = false) {
    if (!product) {
      return
    }

    setError('')
    setAdding(true)

    try {
      await addItem(product, quantity)

      if (redirect) {
        navigate('/checkout')
      }
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to add this item.'))
    } finally {
      setAdding(false)
    }
  }

  if ((loading || !catalogLoaded) && !product) {
    return (
      <div className="page-stack">
        <StateBlock title="Loading product" description="Fetching catalog data." />
      </div>
    )
  }

  if (catalogLoaded && !product) {
    return (
      <div className="page-stack">
        <StateBlock
          action={() => navigate('/products')}
          actionLabel="Back to products"
          description="This product was not found in the customer catalog."
          title="Product unavailable"
        />
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="page-stack">
      <Link className="back-link" to="/products">
        <ArrowLeft size={17} /> Back to products
      </Link>

      <section className="product-detail">
        <div className="product-detail__media">
          <ProductImage product={product} />
        </div>

        <div className="product-detail__content">
          <p className="eyebrow">{inferProductCategory(product)}</p>
          <h1>{getProductName(product)}</h1>
          <p>{getProductDescription(product)}</p>

          <div className="detail-meta">
            <span>Product #{product.productId}</span>
            <span>Seller #{product.sellerId || 'N/A'}</span>
          </div>

          <div className="detail-price">
            <span>Price</span>
            <strong>{formatCurrency(getProductPrice(product))}</strong>
          </div>

          <div className="detail-purchase">
            <QuantityStepper value={quantity} onChange={setQuantity} />
            <div className="detail-total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="hero-actions">
            <button
              className="button button--primary"
              disabled={adding}
              type="button"
              onClick={() => handleAddToCart(false)}
            >
              {adding ? <Loader2 size={18} /> : <ShoppingCart size={18} />}
              Add to cart
            </button>
            <button
              className="button button--secondary"
              disabled={adding}
              type="button"
              onClick={() => handleAddToCart(true)}
            >
              <ShoppingBag size={18} />
              Buy now
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
