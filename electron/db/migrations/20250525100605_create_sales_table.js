export async function up(knex) {
  const exists = await knex.schema.hasTable('sales')
  if (!exists) {
    await knex.schema.createTable('sales', table => {
      table.increments('id').primary()
      table.integer('product_id')
      table.integer('quantity_sold')
      table.float('price_per_unit')
      table.float('discount_applied')
      table.float('total_cost')
      table.float('price_before_discount')
      table.float('expected_selling_price')
      table.integer('seller_id')
      table.string('sale_uuid')
      table.integer('synced').defaultTo(0)
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('sales')
}
