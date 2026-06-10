import { API_ENDPOINTS } from '../api/config'
import { apiClient } from '../api/httpClient'

export async function getCustomerProducts() {
  const response = await apiClient.get(API_ENDPOINTS.customer.dashboard)
  return response.data || []
}

export async function searchCustomerProducts(query) {
  const response = await apiClient.post(API_ENDPOINTS.customer.search, null, {
    params: { query },
  })

  return response.data || []
}

export async function addProductToCart({ productId, quantity }) {
  const response = await apiClient.post(API_ENDPOINTS.customer.addToCart, {
    productId,
    quantity,
  })

  return response.data
}

export async function makeCustomerPayment() {
  const response = await apiClient.post(API_ENDPOINTS.customer.payment)
  return response.data
}

export async function placeCustomerOrder({ productId, quantity }) {
  const response = await apiClient.post(API_ENDPOINTS.customer.order, {
    productId,
    quantity,
  })

  return response.data
}

export async function getCustomerOrderHistory() {
  const response = await apiClient.get(API_ENDPOINTS.customer.orderHistory)
  return response.data || []
}

export async function cancelCustomerOrder(orderId) {
  const response = await apiClient.post(API_ENDPOINTS.customer.cancelOrder, null, {
    params: { orderId },
  })

  return response.data
}
