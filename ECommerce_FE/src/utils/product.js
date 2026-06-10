const CATEGORY_RULES = [
  ['Electronics', ['phone', 'laptop', 'watch', 'camera', 'speaker', 'earbud']],
  ['Fashion', ['shirt', 'shoe', 'dress', 'bag', 'jean', 'jacket']],
  ['Home', ['sofa', 'chair', 'lamp', 'table', 'decor', 'kitchen']],
  ['Beauty', ['cream', 'serum', 'makeup', 'skin', 'hair', 'fragrance']],
  ['Sports', ['fitness', 'sport', 'cycle', 'yoga', 'gym', 'shoe']],
]

export function getProductId(product) {
  return product?.productId
}

export function getProductName(product) {
  return product?.productName || 'Untitled product'
}

export function getProductDescription(product) {
  return product?.productDesc || 'No product description has been provided.'
}

export function getProductPrice(product) {
  return Number(product?.productPrice || 0)
}

export function getProductImageSrc(product) {
  const image = product?.productImage

  if (!image) {
    return ''
  }

  if (typeof image === 'string') {
    if (image.startsWith('data:')) {
      return image
    }

    return `data:image/jpeg;base64,${image}`
  }

  if (Array.isArray(image)) {
    const binary = image.map((byte) => String.fromCharCode(byte)).join('')
    return `data:image/jpeg;base64,${btoa(binary)}`
  }

  return ''
}

export function inferProductCategory(product) {
  if (product?.category) {
    return product.category
  }

  const haystack = `${getProductName(product)} ${getProductDescription(product)}`.toLowerCase()
  const match = CATEGORY_RULES.find(([, terms]) =>
    terms.some((term) => haystack.includes(term)),
  )

  return match?.[0] || 'Catalog'
}

export function getAvailableCategories(products = []) {
  return Array.from(new Set(products.map(inferProductCategory))).sort()
}

export function productMatchesCategory(product, category) {
  return category === 'All' || inferProductCategory(product) === category
}
