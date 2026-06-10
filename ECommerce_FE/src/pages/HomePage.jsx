import { useEffect, useMemo } from 'react'
import { ArrowRight, ShieldCheck, ShoppingCart, Truck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { ProductGrid } from '../components/ProductGrid'
import { SearchControls } from '../components/SearchControls'
import { useProducts } from '../hooks/useProducts'
import { formatCompactNumber, formatCurrency } from '../utils/formatters'
import {
  getAvailableCategories,
  getProductPrice,
  productMatchesCategory,
} from '../utils/product'

export function HomePage() {
  const navigate = useNavigate()
  const {
    error,
    fetchProducts,
    lastQuery,
    loading,
    products,
    searchProducts,
  } = useProducts()

  useEffect(() => {
    if (!products.length && !loading) {
      fetchProducts().catch(() => {})
    }
  }, [fetchProducts, loading, products.length])

  const featuredProducts = useMemo(() => products.slice(0, 8), [products])
  const categories = useMemo(() => getAvailableCategories(products), [products])
  const catalogValue = useMemo(
    () => products.reduce((sum, product) => sum + getProductPrice(product), 0),
    [products],
  )

  return (
    <div className="page-stack">
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="eyebrow">Production API connected</p>
          <h1>Discover products from the customer catalog.</h1>
          <p>
            Search, review details, save items to cart, and place orders with a
            protected JWT session.
          </p>
          <div className="hero-actions">
            <Link className="button button--primary" to="/products">
              Shop catalog <ArrowRight size={18} />
            </Link>
            <Link className="button button--secondary" to="/orders">
              View orders
            </Link>
          </div>
        </div>
        <div className="home-hero__panel" aria-label="Store metrics">
          <div>
            <span className="metric-label">Products</span>
            <strong>{formatCompactNumber(products.length)}</strong>
          </div>
          <div>
            <span className="metric-label">Catalog value</span>
            <strong>{formatCurrency(catalogValue)}</strong>
          </div>
          <div>
            <span className="metric-label">Categories</span>
            <strong>{formatCompactNumber(categories.length)}</strong>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Store benefits">
        <span>
          <ShieldCheck size={18} /> Protected routes
        </span>
        <span>
          <ShoppingCart size={18} /> Persistent cart
        </span>
        <span>
          <Truck size={18} /> Checkout flow
        </span>
      </section>

      <SearchControls
        categories={categories}
        category="All"
        disabled={loading}
        lastQuery={lastQuery}
        onCategoryChange={(category) =>
          navigate(category === 'All' ? '/products' : `/products?category=${category}`)
        }
        onClear={() => fetchProducts().catch(() => {})}
        onSearch={(query) => searchProducts(query).catch(() => {})}
      />

      <section className="section-heading">
        <div>
          <p className="eyebrow">Featured catalog</p>
          <h2>Latest products</h2>
        </div>
        <Link to="/products">View all</Link>
      </section>

      <ProductGrid
        error={error}
        loading={loading}
        products={featuredProducts.filter((product) =>
          productMatchesCategory(product, 'All'),
        )}
        onRetry={() => fetchProducts().catch(() => {})}
      />
    </div>
  )
}
