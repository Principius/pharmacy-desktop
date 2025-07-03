export async function up(knex) {
  const exists = await knex.schema.hasTable('pending_products')
  if (!exists) {
    await knex.schema.createTable('pending_products', table => {
      table.increments('id').primary()
      table.string('product_uuid').notNullable().unique()  // New UUID column, unique for each product
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

      // New approval fields
      table.string('status').defaultTo('pending') // values: pending, approved, rejected
      table.integer('approved_by').unsigned().nullable() // could reference users table
      table.datetime('approved_at').nullable()

      table.boolean('is_synced').defaultTo(false)  // New sync flag

      table.timestamp('created_at').defaultTo(knex.fn.now())
      table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('pending_products')
}
// This migration creates a new table for pending products with necessary fields
// including a UUID for each product, approval status, and sync flag.
// It also includes timestamps for creation and updates.
// The `up` function creates the table if it doesn't exist, while the `down`
// function drops the table if it exists.
// This structure allows for tracking pending products, their approval status,
// and synchronization with a remote server, which is useful for managing inventory. 