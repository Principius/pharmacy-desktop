import db from '../../electron/db/connection.js'

export default async function getSaleById(id) {
  const sale = await db('sales')
    .select('sales.*', 'products.name as product_name')
    .join('products', 'sales.product_id', 'products.id')
    .where('sales.id', id)
    .first()  // get a single record

  return sale
}
