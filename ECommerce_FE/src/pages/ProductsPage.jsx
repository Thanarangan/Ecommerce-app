import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductGrid } from '../components/ProductGrid'
import { SearchControls } from '../components/SearchControls'
import { useProducts } from '../hooks/useProducts'
import {
  getAvailableCategories,
  productMatchesCategory,
} from '../utils/product'

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    error,
    fetchProducts,
    lastQuery,
    loading,
    products,
    searchProducts,
  } = useProducts()
  const category = searchParams.get('category') || 'All'

  useEffect(() => {
    if (!products.length && !loading) {
      fetchProducts().catch(() => {})
    }
  }, [fetchProducts, loading, products.length])

  const categories = useMemo(() => getAvailableCategories(products), [products])
  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        productMatchesCategory(product, categories.includes(category) ? category : 'All'),
      ),
    [categories, category, products],
  )

  function handleCategoryChange(nextCategory) {
    const nextParams = new URLSearchParams(searchParams)

    if (nextCategory === 'All') {
      nextParams.delete('category')
    } else {
      nextParams.set('category', nextCategory)
    }

    setSearchParams(nextParams)
  }

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Product listing</h1>
          <p>Browse every product returned by the customer dashboard endpoint.</p>
        </div>
      </section>

      <SearchControls
        categories={categories}
        category={categories.includes(category) ? category : 'All'}
        disabled={loading}
        lastQuery={lastQuery}
        onCategoryChange={handleCategoryChange}
        onClear={() => fetchProducts().catch(() => {})}
        onSearch={(query) => searchProducts(query).catch(() => {})}
      />

      <ProductGrid
        error={error}
        loading={loading}
        products={filteredProducts}
        onRetry={() => fetchProducts().catch(() => {})}
      />
    </div>
  )
}
