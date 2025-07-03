export async function up(knex) {
  const exists = await knex.schema.hasTable('customer_suggestions');
  if (!exists) {
    await knex.schema.createTable('customer_suggestions', table => {
      table.increments('id').primary(); // Auto-incrementing ID
      table.string('uuid').notNullable().unique(); // Unique UUID for each suggestion
      table.string('name').notNullable(); // Name of person making the suggestion
      table.string('email').nullable(); // Optional email
      table.text('message').notNullable(); // Their suggestion or message
      table.boolean('is_synced').defaultTo(false); // Sync flag
      table.timestamp('created_at').defaultTo(knex.fn.now()); // When it was submitted
    });
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('customer_suggestions');
}
