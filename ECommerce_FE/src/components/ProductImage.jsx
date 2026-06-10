import { Package } from 'lucide-react'
import { getProductImageSrc, getProductName } from '../utils/product'

export function ProductImage({ className = '', product }) {
  const imageSrc = getProductImageSrc(product)
  const productName = getProductName(product)

  if (imageSrc) {
    return (
      <img
        alt={productName}
        className={`product-image ${className}`}
        loading="lazy"
        src={imageSrc}
      />
    )
  }

  return (
    <div
      aria-label={`${productName} image unavailable`}
      className={`product-image product-image--placeholder ${className}`}
      role="img"
    >
      <Package size={34} />
    </div>
  )
}
