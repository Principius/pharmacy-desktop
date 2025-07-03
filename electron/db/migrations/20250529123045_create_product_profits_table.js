export async function up(knex) {
  const hasProductProfits = await knex.schema.hasTable('product_profits');
  if (!hasProductProfits) {
    await knex.schema.createTable('product_profits', (table) => {
      table.increments('id').primary();
      table.text('name');
      table.text('brand');
      table.text('category');
      table.integer('quantity_sold');
      table.float('buying_price');
      table.float('expected_selling_price');
      table.float('discount_applied');
      table.float('final_selling_price');
      table.float('profit');
    });
  }

  const hasSummary = await knex.schema.hasTable('product_profits_summary');
  if (!hasSummary) {
    await knex.schema.createTable('product_profits_summary', (table) => {
      table.increments('id').primary();
      table.float('total_buying_price');
      table.float('total_expected_selling_price');
      table.float('total_discount_applied');
      table.float('total_final_selling_price');
      table.float('total_profit');
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('product_profits_summary');
  await knex.schema.dropTableIfExists('product_profits');
}
