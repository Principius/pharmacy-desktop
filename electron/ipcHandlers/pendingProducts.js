import { v4 as uuidv4 } from "uuid";
import syncPendingProductsToCloud from "../../logic/syncPendingProductsToCloud.js";

export default function registerPendingProductsHandlers(ipcMain, db) {
  ipcMain.handle("pendingProducts:create", async (_event, product) => {
    try {
      const productWithDefaults = {
        ...product,
        product_uuid: uuidv4(), // Always assign unique UUID
        batch_no:
          product.batch_no && product.batch_no.trim() !== ""
            ? product.batch_no // if user passed (from autofill)
            : `BATCH-${Date.now()}`, // auto-generate one
      };

      const [id] = await db("pending_products").insert(productWithDefaults);

      return { success: true, id };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle("pendingProducts:read", async () => {
    return await db("pending_products").orderBy("created_at", "desc");
  });

  ipcMain.handle("pendingProducts:update", async (_event, { id, updates }) => {
    await db("pending_products")
      .where({ id })
      .update({ ...updates, updated_at: db.fn.now() });
    return { id, ...updates };
  });

  ipcMain.handle("pendingProducts:delete", async (_event, id) => {
    return await db("pending_products").where({ id }).del();
  });

  ipcMain.handle("pendingProducts:sync-to-cloud", async () => {
    return await syncPendingProductsToCloud();
  });
}
