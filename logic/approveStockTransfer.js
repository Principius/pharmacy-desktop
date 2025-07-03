import db from '../electron/db/connection.js';
import axios from 'axios';
import sessions from '../electron/db/queries/sessions.js';

export default async function approveStockTransfer(id) {
  try {
    const session = await sessions(db).getCurrent()
    if (!session) throw new Error('No tenant session found.')

    const response = await axios.post(`${session.tenant_url}/api/stock-transfers/${id}/approve`, null, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    return {
      status: 'success',
      message: response.data.message || 'Stock transfer approved successfully.',
      server_response: response.data,
    }
  } catch (error) {
    console.error('Approval Error:', error.response?.data || error.message)
    return {
      status: 'error',
      message: error.response?.data?.message || error.message || 'Error approving stock transfer.',
    }
  }
}
