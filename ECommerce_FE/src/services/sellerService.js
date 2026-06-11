import { API_ENDPOINTS } from '../api/config'
import { apiClient } from '../api/httpClient'

export async function getSellerProducts() {
  const response = await apiClient.get(API_ENDPOINTS.seller.dashboard)
  return response.data || []
}

export async function addSellerProduct({ name, description, price, imageFile }) {
  const formData = new FormData()
  const productPayload = {
    p_name: name,
    p_desc: description,
    p_price: Number(price),
  }

  formData.append('product', new Blob([JSON.stringify(productPayload)], { type: 'application/json' }))
  formData.append('image', imageFile)

  const response = await apiClient.post(API_ENDPOINTS.seller.addProduct, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export async function deleteSellerProduct(productId) {
  const response = await apiClient.get(API_ENDPOINTS.seller.deleteProduct, {
    params: { productId },
  })

  return response.data
}

export async function getSellerTransactions() {
  const response = await apiClient.get(API_ENDPOINTS.seller.transactions)
  return response.data || []
}

export async function getSellerRevenue() {
  const response = await apiClient.get(API_ENDPOINTS.seller.revenue)
  return Number(response.data || 0)
}
