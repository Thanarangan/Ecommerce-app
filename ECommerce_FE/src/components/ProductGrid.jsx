import { ProductCard } from './ProductCard'
import { StateBlock } from './StateBlock'

function ProductSkeleton() {
  return (
    <div className="product-card product-card--loading">
      <div className="skeleton skeleton--image" />
      <div className="product-card__body">
        <div className="skeleton skeleton--line skeleton--short" />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line" />
      </div>
    </div>
  )
}

export function ProductGrid({ error, loading, onRetry, products }) {
  if (loading) {
    return (
      <div className="product-grid" aria-busy="true">
        {Array.from({ length: 8 }, (_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <StateBlock
        action={onRetry}
        description={error}
        title="Products could not be loaded"
        tone="error"
      />
    )
  }

  if (!products.length) {
    return (
      <StateBlock
        description="Try a different search term or clear your filters."
        title="No products found"
      />
    )
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  )
}
