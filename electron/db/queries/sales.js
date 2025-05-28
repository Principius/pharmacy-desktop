export default function sales(db) {
  return {
    async create({
      product_id,
      quantity_sold,
      price_per_unit,
      discount_applied,
      total_cost,
      price_before_discount,
      expected_selling_price,
      seller_id,
      sale_uuid,
    }) {
      return await db('sales').insert({
        product_id,
        quantity_sold,
        price_per_unit,
        discount_applied,
        total_cost,
        price_before_discount,
        expected_selling_price,
        seller_id,
        sale_uuid,
      })
    },

    async findAll({ productId = null, sellerId = null } = {}) {
      let query = db('sales')
        .join('products', 'sales.product_id', 'products.id')
        .select('sales.*', 'products.name as product_name')
        .orderBy('sales.created_at', 'desc')

      if (productId !== null) {
        query = query.where('sales.product_id', productId)
      }

      if (sellerId !== null) {
        query = query.where('sales.seller_id', sellerId)
      }

      const results = await query

      // Convert UTC -> EAT (UTC+3)
      return results.map(sale => {
        const utcDate = new Date(sale.created_at)
        const eatDate = new Date(utcDate.getTime() + 3 * 60 * 60 * 1000) // Add 3 hours
        return {
          ...sale,
          created_at_eat: eatDate.toISOString().replace('T', ' ').substring(0, 19) // "YYYY-MM-DD HH:mm:ss"
        }
      })
    },

    async findById(id) {
      return await db('sales')
        .join('products', 'sales.product_id', 'products.id')
        .select('sales.*', 'products.name as product_name')
        .where('sales.id', id)
        .first()
    },

    async getSaleById(id) {
      return await db('sales').where({ id }).first()
    },

    async update(id, updates) {
      return await db('sales').where({ id }).update({
        product_id: updates.product_id,
        quantity_sold: updates.quantity_sold,
        price_per_unit: updates.price_per_unit,
        discount_applied: updates.discount_applied,
        total_cost: updates.total_cost,
        price_before_discount: updates.price_before_discount,
        expected_selling_price: updates.expected_selling_price,
        seller_id: updates.seller_id,
        sale_uuid: updates.sale_uuid,
      })
    },

    async delete(id) {
      return await db('sales').where({ id }).del()
    },
  }
}
