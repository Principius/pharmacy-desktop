export async function up(knex) {
  const hasServerId = await knex.schema.hasColumn('products', 'server_id')
  if (!hasServerId) {
    await knex.schema.table('products', table => {
      table.integer('server_id').nullable().unique()
      table.boolean('synced').defaultTo(false)
    })
  }
}

export async function down(knex) {
  await knex.schema.table('products', table => {
    table.dropColumn('server_id')
    table.dropColumn('synced')
  })
}
