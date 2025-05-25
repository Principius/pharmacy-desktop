/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('expenses', function (table) {
    table.increments('id').primary()
    table.uuid('expense_uuid').notNullable().unique()
    table.integer('user_id').unsigned().notNullable()
    table.string('name').notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.date('date').notNullable()
    table.text('description').nullable()
    table.timestamps(true, true)

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
  })
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('expenses')
}
