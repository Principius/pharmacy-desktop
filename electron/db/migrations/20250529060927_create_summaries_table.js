export async function up(knex) {
  await knex.schema.createTable('summaries', (table) => {
    table.increments('id').primary();
    table.integer('total_sales').notNullable();
    table.float('total_revenue').notNullable();
    table.integer('total_products').notNullable();
    table.float('total_capital').notNullable();
    table.integer('total_users').notNullable();
    table.integer('total_expired_products').notNullable();
    table.float('total_expenses').notNullable();
    table.integer('total_damaged_products').notNullable();
    table.timestamp('synced_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('summaries');
}
