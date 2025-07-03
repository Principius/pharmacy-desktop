import db from '../electron/db/connection.js'
import axios from 'axios'
import sessions from '../electron/db/queries/sessions.js'

export default async function submitStockTransfer({ to_pharmacy, products }) {
  try {
    const session = await sessions(db).getCurrent()
    if (!session) throw new Error('No tenant session found.')

    const payload = {
      to_pharmacy,
      products,
      device_id: session.device_id,
      tenant_id: session.tenant_id,
      access_token: session.access_token,
    }

    const response = await axios.post(`${session.tenant_url}/api/stock-transfers`, payload, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    return {
      status: 'success',
      message: response.data.message || 'Transfer successful!',
      server_response: response.data,
    }
  } catch (error) {
    console.error('Cloud Stock Transfer Error:', error.response?.data || error.message)
    return {
      status: 'error',
      message: error.response?.data?.message || error.message || 'An error occurred during stock transfer.',
    }
  }
}
