import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Loader2, PackageCheck, Trash2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { StateBlock } from '../components/StateBlock'
import {
  cancelCustomerOrder,
  getCustomerOrderHistory,
} from '../services/customerService'
import { getApiErrorMessage } from '../utils/errors'

export function OrderHistoryPage() {
  const location = useLocation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState('')

  const loadOrders = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getCustomerOrderHistory()
      setOrders(data)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load order history.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(loadOrders, 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadOrders])

  async function handleCancel(orderId) {
    setCancellingId(orderId)
    setError('')

    try {
      await cancelCustomerOrder(orderId)
      setOrders((currentOrders) =>
        currentOrders.filter((order) => order.orderId !== orderId),
      )
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to cancel this order.'))
    } finally {
      setCancellingId('')
    }
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Orders</p>
          <h1>Order history</h1>
          <p>{orders.length} order{orders.length === 1 ? '' : 's'} found.</p>
        </div>
      </section>

      {location.state?.successMessage ? (
        <div className="success-banner">
          <CheckCircle2 size={18} />
          {location.state.successMessage}
        </div>
      ) : null}

      {loading ? (
        <StateBlock title="Loading orders" description="Fetching your purchases." />
      ) : null}

      {!loading && error ? (
        <StateBlock
          action={loadOrders}
          description={error}
          title="Order history unavailable"
          tone="error"
        />
      ) : null}

      {!loading && !error && !orders.length ? (
        <StateBlock
          description="Completed checkout orders will appear here."
          title="No orders yet"
        />
      ) : null}

      {!loading && !error && orders.length ? (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.orderId}>
              <span className="order-card__icon">
                <PackageCheck size={20} />
              </span>
              <div>
                <p className="eyebrow">Order #{order.orderId}</p>
                <h2>{order.productname || `Product #${order.productId}`}</h2>
                <p>
                  Product #{order.productId} · Quantity {order.quantity} · Customer #
                  {order.customerId}
                </p>
              </div>
              <button
                className="button button--danger"
                disabled={cancellingId === order.orderId}
                type="button"
                onClick={() => handleCancel(order.orderId)}
              >
                {cancellingId === order.orderId ? (
                  <Loader2 size={17} />
                ) : (
                  <Trash2 size={17} />
                )}
                Cancel
              </button>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  )
}
