import db from '../electron/db/connection.js'
import axios from 'axios'
import sessions from '../electron/db/queries/sessions.js'

export default async function syncFinancialSummaries() {
  try {
    const session = await sessions(db).getCurrent()
    if (!session) throw new Error('No tenant session found.')

    const response = await axios.get(`${session.tenant_url}/api/financial-summary`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })

    const summary = response.data
    if (!summary) {
      return { status: 'no_data', message: 'No summary data to sync.' }
    }

    await db('financial_summaries')
      .insert({
        id: 1, // Singleton
        total_sales: summary.total_sales,
        total_expenses: summary.total_expenses,
        total_buying_price: summary.total_buying_price,
        net_profit: summary.net_profit,
        sync_at: new Date()
      })
      .onConflict('id')
      .merge([
        'total_sales',
        'total_expenses',
        'total_buying_price',
        'net_profit',
        'sync_at'
      ])

    return {
      status: 'success',
      message: 'Financial summary synced successfully.'
    }
  } catch (error) {
    console.error('Financial Summary Sync Error:', error.response?.data || error.message)
    return {
      status: 'error',
      message: error.response?.data?.message || error.message || 'Failed to sync financial summary'
    }
  }
}
