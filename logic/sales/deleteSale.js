import db from '../../electron/db/connection.js'

export default async function deleteSale(id) {
  // Find existing sale
  const existing = await db('sales').where('id', id).first()
  if (!existing) throw new Error(`Sale with ID ${id} not found`)

  // Find related product
  const product = await db('products').where('id', existing.product_id).first()
  if (!product) throw new Error(`Product not found for sale`)

  // Run transaction to update stock and delete sale atomically
  await db.transaction(async (trx) => {
    // Update product stock (restore quantity)
    await trx('products')
      .where('id', existing.product_id)
      .update({
        quantity_remained: product.quantity_remained + existing.quantity_sold,
      })

    // Delete the sale
    await trx('sales')
      .where('id', id)
      .del()
  })

  return { success: true }
}
