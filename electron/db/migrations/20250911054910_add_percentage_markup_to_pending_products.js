export async function up(knex) {
  const hasColumn = await knex.schema.hasColumn('pending_products', 'percentage_markup')
  if (!hasColumn) {
    await knex.schema.alterTable('pending_products', table => {
      table.float('percentage_markup').defaultTo(0)
    })
  }
}

export async function down(knex) {
  await knex.schema.alterTable('pending_products', table => {
    table.dropColumn('percentage_markup')
  })
}
