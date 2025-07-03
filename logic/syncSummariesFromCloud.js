import db from '../electron/db/connection.js'
import axios from 'axios'
import sessions from '../electron/db/queries/sessions.js'

export default async function syncSummariesFromCloud() {
  try {
    const session = await sessions(db).getCurrent()
    if (!session) throw new Error('No tenant session found.')

    const response = await axios.get(`${session.tenant_url}/api/summary/stats`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })

    const summary = response.data
    if (!summary) {
      return { status: 'no_data', message: 'No summary data to sync.' }
    }

    await db('summaries')
      .insert({
        id: 1, // Force singleton entry
        total_sales: summary.total_sales,
        total_revenue: summary.total_revenue,
        total_products: summary.total_products,
        total_capital: summary.total_capital,
        total_users: summary.total_users,
        total_expired_products: summary.total_expired_products,
        total_expenses: summary.total_expenses,
        total_damaged_products: summary.total_damaged_products,
        synced_at: new Date()
      })
      .onConflict('id')
      .merge([
        'total_sales',
        'total_revenue',
        'total_products',
        'total_capital',
        'total_users',
        'total_expired_products',
        'total_expenses',
        'total_damaged_products',
        'synced_at'
      ])

    return {
      status: 'success',
      message: 'Summary synced successfully.'
    }
  } catch (error) {
    console.error('Summary Sync Error:', error.response?.data || error.message)
    return {
      status: 'error',
      message: error.response?.data?.message || error.message || 'Failed to sync summaries'
    }
  }
}
