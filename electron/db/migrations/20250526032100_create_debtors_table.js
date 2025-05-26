// migrations/2025_05_25_000000_create_debtors_table.js
export async function up(knex) {
  await knex.schema.createTable('debtors', (table) => {
    table.increments('id').primary()
    table.string('debtor_uuid')
    table.string('name').notNullable()
    table.string('phone').nullable()
    table.decimal('amount_owed', 14, 2).notNullable()
    table.text('description').nullable()
    table.date('due_date').notNullable()
    table.boolean('is_synced').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('debtors')
}
