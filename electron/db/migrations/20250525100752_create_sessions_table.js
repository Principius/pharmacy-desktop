export async function up(knex) {
  const exists = await knex.schema.hasTable('electron_sessions')
  if (!exists) {
    await knex.schema.createTable('electron_sessions', table => {
      table.increments('id').primary()
      table.string('tenant_id').notNullable().unique()
      table.string('device_id').notNullable()
      table.string('access_token').notNullable()
      table.string('tenant_url').notNullable()
      table.timestamp('last_sync_at').defaultTo(knex.fn.now())
    })
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('electron_sessions')
}
