export async function up(knex) {
  await knex.schema.alterTable('summaries', (table) => {
    table.float('overall_net_profit').notNullable().defaultTo(0);
  });
}

export async function down(knex) {
  await knex.schema.alterTable('summaries', (table) => {
    table.dropColumn('overall_net_profit');
  });
}
