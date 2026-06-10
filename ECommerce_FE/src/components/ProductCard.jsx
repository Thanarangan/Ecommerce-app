import { useState } from 'react'
import { Eye, Loader2, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { getApiErrorMessage } from '../utils/errors'
import { formatCurrency } from '../utils/formatters'
import {
  getProductDescription,
  getProductId,
  getProductName,
  getProductPrice,
  inferProductCategory,
} from '../utils/product'
import { ProductImage } from './ProductImage'

export function ProductCard({ product }) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState('')
  const productId = getProductId(product)

  async function handleAddToCart() {
    setError('')
    setIsAdding(true)

    try {
      await addItem(product, 1)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to add this item.'))
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <article className="product-card">
      <Link className="product-card__media" to={`/products/${productId}`}>
        <ProductImage product={product} />
        <span className="product-card__badge">{inferProductCategory(product)}</span>
      </Link>
      <div className="product-card__body">
        <div>
          <p className="eyebrow">Seller #{product?.sellerId || 'N/A'}</p>
          <h3>{getProductName(product)}</h3>
          <p className="product-card__description">
            {getProductDescription(product)}
          </p>
        </div>
        <div className="product-card__footer">
          <strong>{formatCurrency(getProductPrice(product))}</strong>
          <div className="product-card__actions">
            <Link
              aria-label={`View ${getProductName(product)}`}
              className="icon-button"
              title="View details"
              to={`/products/${productId}`}
            >
              <Eye size={18} />
            </Link>
            <button
              aria-label={`Add ${getProductName(product)} to cart`}
              className="icon-button icon-button--primary"
              disabled={isAdding}
              title="Add to cart"
              type="button"
              onClick={handleAddToCart}
            >
              {isAdding ? <Loader2 size={18} /> : <ShoppingCart size={18} />}
            </button>
          </div>
        </div>
        {error ? <p className="inline-error">{error}</p> : null}
      </div>
    </article>
  )
}
