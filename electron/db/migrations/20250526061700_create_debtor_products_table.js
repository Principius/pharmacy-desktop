export async function up(knex) {
    await knex.schema.createTable('debtor_products', table => {
        table.increments('id') // Auto-incrementing ID
        table
            .integer('debtor_id')
            .unsigned()
            .references('id')
            .inTable('debtors')
            .onDelete('CASCADE') // If a debtor is deleted, also delete their product records
        table
            .integer('product_id')
            .unsigned()
            .references('id')
            .inTable('products') // Reference to the products table
        table.integer('quantity').notNullable() // Quantity sold to the debtor
        table.integer('price').notNullable() // Price per unit at the time of debt
        table.timestamps(true, true) // created_at and updated_at with defaults
    })
}

export async function down(knex) {
    await knex.schema.dropTableIfExists('debtor_products')
}
