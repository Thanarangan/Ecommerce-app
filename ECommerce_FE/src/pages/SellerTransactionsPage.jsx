import { useCallback, useEffect, useState } from 'react'
import { StateBlock } from '../components/StateBlock'
import { getSellerRevenue, getSellerTransactions } from '../services/sellerService'
import { getApiErrorMessage } from '../utils/errors'
import { formatCurrency } from '../utils/formatters'

export function SellerTransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [revenue, setRevenue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTransactions = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [txns, totalRevenue] = await Promise.all([
        getSellerTransactions(),
        getSellerRevenue(),
      ])
      setTransactions(txns)
      setRevenue(totalRevenue)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to load transactions.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(loadTransactions, 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadTransactions])

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Seller</p>
          <h1>Transactions</h1>
          <p>{transactions.length} sale{transactions.length === 1 ? '' : 's'} recorded.</p>
        </div>
        <div className="summary-panel">
          <p className="eyebrow">Revenue</p>
          <h2>{formatCurrency(revenue)}</h2>
        </div>
      </section>

      {loading ? <StateBlock title="Loading transactions" description="Fetching sales history." /> : null}

      {!loading && error ? (
        <StateBlock
          action={loadTransactions}
          actionLabel="Retry"
          description={error}
          title="Transactions unavailable"
          tone="error"
        />
      ) : null}

      {!loading && !error && !transactions.length ? (
        <StateBlock
          description="Completed customer purchases will appear here."
          title="No transactions yet"
        />
      ) : null}

      {!loading && !error && transactions.length ? (
        <div className="orders-list">
          {transactions.map((transaction) => (
            <article className="order-card" key={transaction.transactionId}>
              <span className="order-card__icon">₹</span>
              <div>
                <p className="eyebrow">Transaction #{transaction.transactionId}</p>
                <h2>{transaction.productName || `Product #${transaction.productId}`}</h2>
                <p>
                  Product #{transaction.productId} · Customer #{transaction.customerId}
                </p>
              </div>
              <strong>{formatCurrency(transaction.amount)}</strong>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  )
}
