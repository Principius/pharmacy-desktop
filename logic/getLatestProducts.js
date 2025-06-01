import db from '../electron/db/connection.js'
import axios from 'axios'
import sessions from '../electron/db/queries/sessions.js'

export default async function getLatestProducts() {
  try {
    const session = await sessions(db).getCurrent()
    if (!session) throw new Error('No tenant session found.')

    const response = await axios.get(
      `${session.tenant_url}/api/products/latest`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    )

    return {
      success: true,
      products: response.data.products || [],
    }
  } catch (error) {
    console.error('Error fetching latest products:', error.response?.data || error.message)
    return {
      success: false,
      products: [],
      message: error.response?.data?.message || error.message,
    }
  }
}
