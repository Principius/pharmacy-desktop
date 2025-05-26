export async function up(knex) {
  const hasColumn = await knex.schema.hasColumn('users', 'permissions');
  if (!hasColumn) {
    await knex.schema.alterTable('users', (table) => {
      table.string('permissions').nullable()
    });
  }
}

export async function down(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('permissions');
  });
}
