import db from '../electron/db/connection.js'
import axios from 'axios'
import sessions from '../electron/db/queries/sessions.js'

export default async function changeProduct(product) {
  try {
    const session = await sessions(db).getCurrent()
    if (!session) throw new Error('No tenant session found.')

    const response = await axios.put(
  `${session.tenant_url}/api/products/${product.id}`,
  product,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    )

    return {
      success: true,
      message: response.data.message || 'Product updated successfully.',
    }
  } catch (error) {
    console.error('Error updating product:', error.response?.data || error.message)
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    }
  }
}
