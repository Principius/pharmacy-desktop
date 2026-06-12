export async function up(knex) {
  const exists = await knex.schema.hasTable("sales");
  if (exists) {
    await knex.schema.alterTable("sales", (table) => {
      table
        .integer("payment_method_id")
        .unsigned()
        .references("id")
        .inTable("payment_methods")
        .onDelete("SET NULL")
        .nullable();
    });
  }
}

export async function down(knex) {
  const exists = await knex.schema.hasTable("sales");
  if (exists) {
    await knex.schema.alterTable("sales", (table) => {
      table.dropColumn("payment_method_id");
    });
  }
}
