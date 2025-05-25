export async function up(knex) {
  const exists = await knex.schema.hasTable('products')
  if (!exists) {
    await knex.schema.createTable('products', table => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('brand')
      table.string('category')
      table.string('form')
      table.datetime('expire_date')
      table.string('batch_no')
      table.float('buying_price')
      table.float('selling_price_per_unit')
      table.string('supplier_name')
      table.datetime('received_date')
      table.integer('quantity_remained')
      table.integer('minimum_stock')
      table.float('buying_price_per_unit')
      table.integer('min_days_to_notify_expiring')
      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('products')
}
