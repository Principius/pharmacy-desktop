import db from '../../electron/db/connection.js'
import axios from 'axios'
import sessions from '../../electron/db/queries/sessions.js'

export default async function syncSalesToCloud() {
  try {
    const session = await sessions(db).getCurrent()
    if (!session) throw new Error('No tenant session found.')

    // Fetch unsynced sales with product server_id
    const unsyncedSales = await db('sales')
      .join('products', 'sales.product_id', '=', 'products.id')
      .where('sales.synced', 0)
      .select(
        'sales.*',
        'products.server_id as product_server_id'
      )

    if (unsyncedSales.length === 0) {
      return { status: 'no_data', message: 'No unsynced sales' }
    }

    // Build payload with server_id instead of local product_id
    const payload = {
      sales: unsyncedSales.map(sale => ({
        product_id: sale.product_server_id, // send cloud's server_id
        quantity_sold: sale.quantity_sold,
        price_per_unit: sale.price_per_unit,
        discount_applied: sale.discount_applied,
        total_cost: sale.total_cost,
        price_before_discount: sale.price_before_discount,
        expected_selling_price: sale.expected_selling_price,
        sale_uuid: sale.sale_uuid,
        created_at: sale.created_at
      })),
      device_id: session.device_id,
      tenant_id: session.tenant_id,
      access_token: session.access_token,
    }

    const response = await axios.post(
      `${session.tenant_url}/api/sales/sync`,
      payload
    )

    // Mark synced sales
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
