import db from '../electron/db/connection.js'

export default async function changeProduct(product) {
  try {
    // Validate required fields
    if (!product.id) {
      throw new Error("Product ID is required.");
    }

    // Remove unwanted fields (if any)
    const {
      id, name, brand, category, form, batch_no, expire_date,
      quantity_remained, buying_price_per_unit, buying_price,
      selling_price_per_unit, supplier_name, received_date,
      minimum_stock, min_days_to_notify_expiring
    } = product;

    // Update product
    const updated = await db("products")
      .where({ id })
      .update({
        name,
        brand,
        category,
        form,
        batch_no,
        expire_date,
        quantity_remained,
        buying_price_per_unit,
        buying_price,
        selling_price_per_unit,
        supplier_name,
        received_date,
        minimum_stock,
        min_days_to_notify_expiring,
        updated_at: new Date().toISOString(),
        synced: false, // important for sync flag
      });

    if (updated === 0) {
      throw new Error("Product not found or update failed.");
    }

    return { success: true, message: "Product updated successfully." };
  } catch (error) {
    console.error("changeProduct error:", error.message);
    return { success: false, message: error.message };
  }
}
