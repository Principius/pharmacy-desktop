/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable('expenses', function (table) {
    table.boolean('is_synced').defaultTo(false).after('description')
  })
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.alterTable('expenses', function (table) {
    table.dropColumn('is_synced')
  })
}
