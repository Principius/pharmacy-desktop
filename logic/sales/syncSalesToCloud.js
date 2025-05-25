import db from '../../electron/db/connection.js'
import axios from 'axios'

export default async function syncProductsFromCloud() {
  try {
    // Fetch current session (assuming session is in a separate table)
    const session = await db('sessions').where('current', 1).first()
    if (!session) throw new Error('No tenant session found.')

    // Fetch products from cloud
    const response = await axios.post(`${session.tenant_url}/api/electron/products/sync`, null, {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })

    const products = response.data.products
    if (!products || products.length === 0) {
      return { status: 'no_data', message: 'No products to sync.' }
    }

    // Perform bulk upsert using Knex
    await db.transaction(async (trx) => {
      for (const product of products) {
        await trx('products')
          .insert(product)
          .onConflict('id') // assumes 'id' is the primary key
          .merge({
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
          })
      }
    })

    return {
      status: 'success',
      synced: products.length
    }
  } catch (error) {
    console.error('Product Sync Error:', error.response?.data || error.message)
    return {
      status: 'error',
      message: error.response?.data?.message || error.message || 'Failed to sync products'
    }
  }
}
