import { useState } from 'react'
import { CheckCircle2, CreditCard, Loader2, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ProductImage } from '../components/ProductImage'
import { StateBlock } from '../components/StateBlock'
import { useCart } from '../hooks/useCart'
import {
  makeCustomerPayment,
  placeCustomerOrder,
} from '../services/customerService'
import { getApiErrorMessage } from '../utils/errors'
import { formatCurrency } from '../utils/formatters'
import { getProductName, getProductPrice } from '../utils/product'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { clearCart, formattedSubtotal, items, totalItems } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setError('')
    setSubmitting(true)

    try {
      await makeCustomerPayment()

      for (const item of items) {
        await placeCustomerOrder({
          productId: item.productId,
          quantity: item.quantity,
        })
      }

      clearCart()
      navigate('/orders', {
        replace: true,
        state: { successMessage: 'Order placed successfully' },
      })
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Checkout could not be completed.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (!items.length) {
    return (
      <div className="page-stack">
        <StateBlock
          description="Your cart needs at least one product before checkout."
          title="Nothing to checkout"
        />
        <Link className="button button--primary state-link" to="/products">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1>Review and place order</h1>
          <p>{totalItems} item{totalItems === 1 ? '' : 's'} in this checkout.</p>
        </div>
      </section>

      <section className="checkout-layout">
        <div className="checkout-panel">
          <div className="checkout-panel__heading">
            <CreditCard size={20} />
            <h2>Payment</h2>
          </div>
          <div className="payment-card">
            <div>
              <span>Amount</span>
              <strong>{formattedSubtotal}</strong>
            </div>
            <ShieldCheck size={28} />
          </div>
          <div className="checkout-note">
            <CheckCircle2 size={18} />
            <span>Payment is confirmed before each order is submitted.</span>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <button
            className="button button--primary button--full"
            disabled={submitting}
            type="button"
            onClick={handleCheckout}
          >
            {submitting ? <Loader2 size={18} /> : <CreditCard size={18} />}
            Place order
          </button>
        </div>

        <aside className="summary-panel">
          <p className="eyebrow">Items</p>
          <div className="checkout-items">
            {items.map(({ product, productId, quantity }) => (
              <div className="checkout-item" key={productId}>
                <ProductImage product={product} />
                <div>
                  <strong>{getProductName(product)}</strong>
                  <span>
                    {quantity} x {formatCurrency(getProductPrice(product))}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="summary-row summary-row--total">
            <span>Total</span>
            <strong>{formattedSubtotal}</strong>
          </div>
        </aside>
      </section>
    </div>
  )
}
