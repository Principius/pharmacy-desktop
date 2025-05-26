import syncDebtorsToCloud from "../../logic/syncDebtorsToCloud.js"

export default function registerDebtorsHandlers(ipcMain, db) {
  ipcMain.handle('debtors:create', async (_event, debtor) => {
    const [id] = await db('debtors').insert(debtor)
    return { id, ...debtor }
  })

  ipcMain.handle('debtors:read', async () => {
    return await db('debtors').orderBy('created_at', 'desc')
  })

  ipcMain.handle('debtors:update', async (_event, { id, updates }) => {
    await db('debtors').where({ id }).update({ ...updates, updated_at: db.fn.now() })
    return { id, ...updates }
  })

  ipcMain.handle('debtors:delete', async (_event, id) => {
    return await db.transaction(async trx => {
      // Fetch products related to the debtor
      const debtorProducts = await trx('debtor_products').where({ debtor_id: id })

      // Restore product quantities
      for (const dp of debtorProducts) {
        await trx('products')
          .where({ id: dp.product_id })
          .increment('quantity_remained', dp.quantity)
      }

      // Delete related records (foreign key with ON DELETE CASCADE will clean up)
      await trx('debtor_products').where({ debtor_id: id }).del()
      await trx('debtors').where({ id }).del()

      return true
    })
  })

  ipcMain.handle('debtors:createWithProducts', async (_event, debtorWithProducts) => {
    const { products, ...debtor } = debtorWithProducts

    return await db.transaction(async trx => {
      const [id] = await trx('debtors').insert(debtor)

      for (const p of products) {
        // reduce stock
        await trx('products')
          .where({ id: p.id })
          .decrement('quantity_remained', p.quantity)

        // store in debtor_products
        await trx('debtor_products').insert({
          debtor_id: id,
          product_id: p.id,
          quantity: p.quantity,
          price: p.price
        })
      }

      return { id, ...debtor }
    })
  })

  ipcMain.handle('debtor:products', async (_event, debtorId) => {
    return await db('debtor_products')
      .join('products', 'debtor_products.product_id', 'products.id')
      .where('debtor_products.debtor_id', debtorId)
      .select(
        'products.name',
        'debtor_products.quantity',
        'debtor_products.price'
      )
  })

  ipcMain.handle('debtors:sync-to-cloud', async () => {
  return await syncDebtorsToCloud()
})
}
