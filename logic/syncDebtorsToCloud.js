import db from '../electron/db/connection.js'
import axios from 'axios'
import sessionHelper from '../electron/db/queries/sessions.js'

const sessions = sessionHelper(db)

export default async function syncDebtorsToCloud() {
  try {
    const session = await sessions.getCurrent()
    if (!session) throw new Error('No tenant session found.')

    // Get all unsynced debtors
    const unsyncedDebtors = await db('debtors')
      .whereNotNull('debtor_uuid')
      .andWhere(function () {
        this.whereNull('is_synced').orWhere('is_synced', false)
      })

    if (unsyncedDebtors.length === 0) {
      return { status: 'no_data', message: 'No debtors to sync.' }
    }

    const debtorsWithProducts = await Promise.all(
      unsyncedDebtors.map(async (debtor) => {
        const products = await db('debtor_products')
          .where('debtor_id', debtor.id)
          .select('product_id', 'quantity', 'price')

        return {
          debtor_uuid: debtor.debtor_uuid,
          name: debtor.name,
          phone: debtor.phone,
          amount_owed: debtor.amount_owed,
          description: debtor.description,
          due_date: debtor.due_date,
          created_at: debtor.created_at,
          updated_at: debtor.updated_at,
          products,
        }
      })
    )

    const response = await axios.post(
      `${session.tenant_url}/api/debtors/sync`,
      { debtors: debtorsWithProducts },
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          Accept: 'application/json',
        },
      }
    )

    // Update synced status
    const syncedUUIDs = debtorsWithProducts.map((d) => d.debtor_uuid)

    await db('debtors')
      .whereIn('debtor_uuid', syncedUUIDs)
      .update({ is_synced: true })

    return {
      status: 'success',
      synced: syncedUUIDs.length,
    }
  } catch (error) {
    console.error('Debtor Sync Error:', error.response?.data || error.message)
    return {
      status: 'error',
      message: error.response?.data?.message || error.message || 'Failed to sync debtors',
    }
  }
}
