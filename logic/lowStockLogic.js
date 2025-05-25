// lowStockLogic.js
export async function getLowStockProducts(db) {
  return await db('products')
    .select('id', 'name', 'brand', 'batch_no', 'quantity_remained', 'minimum_stock')
    .where('quantity_remained', '<', db.ref('minimum_stock'))
    .andWhere('quantity_remained', '>', 0)
}
