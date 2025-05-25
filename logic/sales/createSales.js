import { v4 as uuidv4 } from 'uuid'
import db from '../../electron/db/connection.js'
import sales from '../../electron/db/queries/sales.js'
import products from '../../electron/db/queries/products.js'

export default async function createSales(salesData) {
  if (!Array.isArray(salesData) || salesData.length === 0) {
    throw new Error('At least one sale is required')
  }

  const createdSales = []

  await db.transaction(async (trx) => {
    for (const sale of salesData) {
      const {
        product_id,
        quantity_sold,
        price_per_unit,
        discount_applied = 0,
        total_cost,
        price_before_discount,
        expected_selling_price,
        seller_id
      } = sale

      // Use trx instead of db in queries inside transaction
      const product = await products(trx).findById(product_id)
      if (!product) throw new Error(`Product with ID ${product_id} not found`)

      if (product.quantity_remained < quantity_sold) {
        throw new Error(
          `Not enough stock for product ${product.name} (ID: ${product_id})`
        )
      }

      // Create sale object with sale_uuid
      const saleObject = {
        product_id,
        quantity_sold,
        price_per_unit,
        discount_applied,
        total_cost,
        price_before_discount,
        expected_selling_price,
        seller_id,
        sale_uuid: uuidv4(),  // generate unique UUID
      }

      // Create sale in DB using transaction
      const [saleId] = await sales(trx).create(saleObject)  // assuming .create returns inserted id array

      // Update product stock using transaction
      await products(trx).updateQuantity(product_id, product.quantity_remained - quantity_sold)

      createdSales.push({ sale_id: saleId, sale_uuid: saleObject.sale_uuid })
    }
  })

  return { success: true, sales: createdSales }
}
