import db from '../electron/db/connection.js'
import axios from 'axios'
import sessionHelper from '../electron/db/queries/sessions.js'

const sessions = sessionHelper(db)

export default async function syncExpensesToCloud() {
  try {
    const session = await sessions.getCurrent()
    if (!session) throw new Error('No tenant session found.')

    const unsyncedExpenses = await db('expenses')
      .whereNotNull('expense_uuid')
      .andWhere(function () {
        this.whereNull('is_synced').orWhere('is_synced', false)
      })

    if (unsyncedExpenses.length === 0) {
      return { status: 'no_data', message: 'No expenses to sync.' }
    }

    const response = await axios.post(
      `${session.tenant_url}/api/sync-expenses`,
      { expenses: unsyncedExpenses },
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          Accept: 'application/json',
        },
      }
    )

    const syncedUUIDs = response.data.synced || []

    await db('expenses')
      .whereIn('expense_uuid', syncedUUIDs)
      .update({ is_synced: true })

    return {
      status: 'success',
      synced: syncedUUIDs.length,
    }
  } catch (error) {
    console.error('Expense Sync Error:', error.response?.data || error.message)
    return {
      status: 'error',
      message: error.response?.data?.message || error.message || 'Failed to sync expenses',
    }
  }
}
