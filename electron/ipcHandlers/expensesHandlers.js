import { v4 as uuidv4 } from 'uuid'
import syncExpensesToCloud from '../../logic/syncExpensesToCloud.js'


export default function registerExpensesHandlers(ipcMain, db) {
  // Assuming you pass the SQLite db instance or Knex instance to this function

  ipcMain.handle('expenses:create', async (event, expenseData) => {
    // Add default user_id if missing
    if (!expenseData.user_id) expenseData.user_id = 1

    expenseData.expense_uuid = expenseData.expense_uuid || uuidv4()

    // Use Knex or better-sqlite3 query here, example with Knex:
    await db('expenses').insert(expenseData)
    return { success: true }
  })

  ipcMain.handle('expenses:read', async () => {
    return await db('expenses').select('*')
  })

  ipcMain.handle('expenses:update', async (event, expense_uuid, updates) => {
    await db('expenses').where({ expense_uuid }).update(updates)
    return { success: true }
  })

  ipcMain.handle('expenses:delete', async (event, expense_uuid) => {
    await db('expenses').where({ expense_uuid }).del()
    return { success: true }
  })

   ipcMain.handle('expenses:sync-to-cloud', async () => {
    return await syncExpensesToCloud()
  })
}
