import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { ProductImage } from '../components/ProductImage'
import { QuantityStepper } from '../components/QuantityStepper'
import { StateBlock } from '../components/StateBlock'
import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/formatters'
import {
  getProductDescription,
  getProductName,
  getProductPrice,
} from '../utils/product'

export function CartPage() {
  const {
    formattedSubtotal,
    items,
    removeItem,
    totalItems,
    updateQuantity,
  } = useCart()

  if (!items.length) {
    return (
      <div className="page-stack">
        <StateBlock
          description="Add products from the catalog before checkout."
          title="Your cart is empty"
        />
        <Link className="button button--primary state-link" to="/products">
          Shop products
        </Link>
      </div>
    )
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Cart</p>
          <h1>Shopping cart</h1>
          <p>{totalItems} item{totalItems === 1 ? '' : 's'} ready for checkout.</p>
        </div>
      </section>

      <section className="cart-layout">
        <div className="cart-list">
          {items.map(({ product, productId, quantity }) => (
            <article className="cart-item" key={productId}>
              <Link to={`/products/${productId}`}>
                <ProductImage product={product} />
              </Link>
              <div className="cart-item__body">
                <div>
                  <h2>{getProductName(product)}</h2>
                  <p>{getProductDescription(product)}</p>
                </div>
                <div className="cart-item__controls">
                  <QuantityStepper
                    value={quantity}
                    onChange={(nextQuantity) =>
                      updateQuantity(productId, nextQuantity)
                    }
                  />
                  <strong>{formatCurrency(getProductPrice(product) * quantity)}</strong>
                  <button
                    aria-label={`Remove ${getProductName(product)}`}
                    className="icon-button"
                    title="Remove item"
                    type="button"
                    onClick={() => removeItem(productId)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="summary-panel">
          <p className="eyebrow">Order summary</p>
          <div className="summary-row">
            <span>Items</span>
            <strong>{totalItems}</strong>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formattedSubtotal}</strong>
          </div>
          <div className="summary-row summary-row--total">
            <span>Total</span>
            <strong>{formattedSubtotal}</strong>
          </div>
          <Link className="button button--primary button--full" to="/checkout">
            Checkout
          </Link>
        </aside>
      </section>
    </div>
  )
}
