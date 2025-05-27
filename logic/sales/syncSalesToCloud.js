import db from '../../electron/db/connection.js'
import axios from 'axios'
import sessions from '../../electron/db/queries/sessions.js'

export default async function syncSalesToCloud() {
  try {
    const session = await sessions(db).getCurrent()
    if (!session) throw new Error('No tenant session found.')

    // Fetch unsynced sales
    const unsyncedSales = await db('sales').where('synced', 0).select('*')
    if (unsyncedSales.length === 0) {
      return { status: 'no_data', message: 'No unsynced sales' }
    }

    const payload = {
      sales: unsyncedSales,
      device_id: session.device_id,
      tenant_id: session.tenant_id,
      access_token: session.access_token,
    }

    const response = await axios.post(`${session.tenant_url}/api/sales/sync`, payload)

    // Update sales as synced
    const ids = unsyncedSales.map(sale => sale.id)
    await db('sales').whereIn('id', ids).update({ synced: 1 })

    return {
      status: 'success',
      synced: unsyncedSales.length,
      server_response: response.data
    }
  } catch (error) {
    console.error('Cloud Sync Error:', error.response?.data || error.message)
    return {
      status: 'error',
      message: error.response?.data?.message || error.message || 'Failed to sync sales'
    }
  }
}
