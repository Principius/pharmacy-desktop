export async function getGroupedInventory(db) {
  const result = await db('products')
    .select(
      'name',
      db.raw('COUNT(DISTINCT brand) AS brand_count'),
      db.raw('COUNT(*) AS batch_count'),
      db.raw('SUM(quantity_remained) AS total_quantity')
    )
    .whereRaw("expire_date > datetime('now')")
    .andWhere('quantity_remained', '>', 0)
    .groupBy('name')

  return result
}
