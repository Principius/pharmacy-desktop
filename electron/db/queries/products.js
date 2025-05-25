export default function products(db) {
  return {
    async findAll() {
      return await db('products').select('*')
    },

    async findById(id) {
      return await db('products').where({ id }).first()
    },

    async updateQuantity(id, newQuantity) {
      return await db('products')
        .where({ id })
        .update({ quantity_remained: newQuantity })
    },

    async create({
      name,
      brand,
      category,
      form,
      expire_date,
      batch_no,
      buying_price,
      selling_price_per_unit,
      supplier_name,
      received_date,
      quantity_remained,
      minimum_stock,
      buying_price_per_unit,
      min_days_to_notify_expiring,
    }) {
      return await db('products').insert({
        name,
        brand,
        category,
        form,
        expire_date,
        batch_no,
        buying_price,
        selling_price_per_unit,
        supplier_name,
        received_date,
        quantity_remained,
        minimum_stock,
        buying_price_per_unit,
        min_days_to_notify_expiring,
      })
    },

    async update(id, updates) {
      return await db('products').where({ id }).update(updates)
    },

    async delete(id) {
      return await db('products').where({ id }).del()
    },
  }
}
