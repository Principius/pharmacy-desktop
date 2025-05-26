export async function up(knex) {
  await knex.schema.createTable('pharmacy_data', function (table) {
    table.increments('id').primary()
    table.string('name').notNullable().unique()
    table.string('phone_number').nullable()
    table.string('email').nullable()
    table.string('address').nullable()
    table.timestamps(true, true) // created_at & updated_at
  })
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('pharmacy_data')
}
