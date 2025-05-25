import db from '../../electron/db/connection.js'

export default async function updateSale(id, updatedSale) {
  // Find existing sale
  const existing = await db('sales').where('id', id).first()
  if (!existing) throw new Error(`Sale with ID ${id} not found`)

  // Find related product
  const product = await db('products').where('id', existing.product_id).first()
  if (!product) throw new Error(`Product not found for sale`)

  // Calculate stock difference and new stock level
  const stockDiff = updatedSale.quantity_sold - existing.quantity_sold
  const newStock = product.quantity_remained - stockDiff

  if (newStock < 0) throw new Error('Not enough stock for update')

  // Run transaction to update sale and product stock atomically
  await db.transaction(async (trx) => {
    // Update the sale record
    await trx('sales')
      .where('id', id)
      .update(updatedSale)

    // Update product quantity_remained
    await trx('products')
      .where('id', existing.product_id)
      .update({ quantity_remained: newStock })
  })

  return { success: true }
}
