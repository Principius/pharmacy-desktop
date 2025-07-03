export async function up(knex) {
  await knex.schema.createTable('financial_summaries', (table) => {
    table.increments('id').primary();
    table.decimal('total_sales', 15, 2).defaultTo(0);
    table.decimal('total_expenses', 15, 2).defaultTo(0);
    table.decimal('total_buying_price', 15, 2).defaultTo(0);
    table.decimal('net_profit', 15, 2).defaultTo(0);
    table.timestamp('sync_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTable('financial_summaries');
}
