import { v4 as uuidv4 } from 'uuid'
import syncPendingProductsToCloud from "../../logic/syncPendingProductsToCloud.js";

export default function registerPendingProductsHandlers(ipcMain, db) {
  ipcMain.handle("pendingProducts:create", async (_event, product) => {
    const productWithUUID = {
      ...product,
      product_uuid: uuidv4(), // Assign UUID if not already set
    }

    const [id] = await db("pending_products").insert(productWithUUID);
    return { id, ...productWithUUID };
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
