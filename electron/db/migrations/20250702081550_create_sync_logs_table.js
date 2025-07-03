export async function up(knex) {
  const exists = await knex.schema.hasTable('sync_logs')
  if (!exists) {
    await knex.schema.createTable('sync_logs', table => {
      table.increments('id').primary()
      table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE')
      table.enum('action', ['created', 'updated', 'deleted'])
      table.boolean('is_successful').defaultTo(false)
      table.text('error_message').nullable()
      table.timestamp('synced_at').nullable()
      table.timestamps(true, true) // created_at, updated_at
    })
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('sync_logs')
}
// This migration creates a sync_logs table to track synchronization actions for products.
// It includes fields for product ID, action type (created, updated, deleted), success status,
// error messages, and timestamps for when the sync occurred.