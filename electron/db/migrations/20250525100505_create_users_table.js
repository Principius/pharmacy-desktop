export async function up(knex) {
  const exists = await knex.schema.hasTable('users')
  if (!exists) {
    await knex.schema.createTable('users', table => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('email').unique().notNullable()
      table.string('phone')
      table.string('role').defaultTo('user')
      table.string('password').notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('users')
}
