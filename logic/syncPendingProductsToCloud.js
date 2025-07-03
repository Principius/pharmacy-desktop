import db from '../electron/db/connection.js'
import axios from 'axios'
import sessionHelper from '../electron/db/queries/sessions.js'

const sessions = sessionHelper(db)

export default async function syncPendingProductsToCloud() {
  try {
    const session = await sessions.getCurrent()
    if (!session) throw new Error('No tenant session found.')

    // Get all unsynced pending products
    const unsyncedProducts = await db('pending_products')
      .whereNotNull('product_uuid')
      .andWhere(function () {
        this.whereNull('is_synced').orWhere('is_synced', false)
      })

    if (unsyncedProducts.length === 0) {
      return { status: 'no_data', message: 'No pending products to sync.' }
    }

    const productsToSync = unsyncedProducts.map(product => ({
      product_uuid: product.product_uuid,
      name: product.name,
      brand: product.brand,
      category: product.category,
      form: product.form,
      expire_date: product.expire_date,
      batch_no: product.batch_no,
      buying_price: product.buying_price,
      selling_price_per_unit: product.selling_price_per_unit,
      supplier_name: product.supplier_name,
      received_date: product.received_date,
      quantity_remained: product.quantity_remained,
      minimum_stock: product.minimum_stock,
      buying_price_per_unit: product.buying_price_per_unit,
      min_days_to_notify_expiring: product.min_days_to_notify_expiring,
      created_at: product.created_at,
      updated_at: product.updated_at,
    }))

    const response = await axios.post(
      `${session.tenant_url}/api/pending-products/sync`,
      { products: productsToSync },
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          Accept: 'application/json',
        },
      }
    )

    // Update synced status
    const syncedUUIDs = productsToSync.map(p => p.product_uuid)

    await db('pending_products')
      .whereIn('product_uuid', syncedUUIDs)
      .update({ is_synced: true })

    return {
      status: 'success',
      synced: syncedUUIDs.length,
    }
  } catch (error) {
    console.error('Pending Products Sync Error:', error.response?.data || error.message)
    return {
      status: 'error',
      message: error.response?.data?.message || error.message || 'Failed to sync pending products',
    }
  }
}
