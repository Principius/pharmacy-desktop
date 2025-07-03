export async function up(knex) {
  return knex.schema.alterTable('sales', (table) => {
    table.decimal('profit', 10, 2).defaultTo(0);
  });
}

export async function down(knex) {
  return knex.schema.alterTable('sales', (table) => {
    table.dropColumn('profit');
  });
}
