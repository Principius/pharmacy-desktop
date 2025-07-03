import { v4 as uuidv4 } from 'uuid';
import syncCustomerSuggestionsToCloud from "../../logic/syncCustomerSuggestionsToCloud.js";

export default function registerCustomerSuggestionsHandlers(ipcMain, db) {
  // Create suggestion with UUID
  ipcMain.handle("customerSuggestions:create", async (_event, suggestion) => {
    const uuid = uuidv4();
    const [id] = await db("customer_suggestions").insert({
      ...suggestion,
      uuid,
      is_synced: false, // ensure new entry is marked unsynced
    });
    return { id, uuid, ...suggestion, is_synced: false };
  });

  // Read all suggestions
  ipcMain.handle("customerSuggestions:read", async () => {
    return await db("customer_suggestions").orderBy("created_at", "desc");
  });

  // Update suggestion by id
  ipcMain.handle("customerSuggestions:update", async (_event, { id, updates }) => {
    await db("customer_suggestions")
      .where({ id })
      .update({ ...updates, updated_at: db.fn.now() });
    return { id, ...updates };
  });

  // Delete suggestion by id
  ipcMain.handle("customerSuggestions:delete", async (_event, id) => {
    return await db("customer_suggestions").where({ id }).del();
  });

  // Sync to cloud
  ipcMain.handle("customerSuggestions:sync-to-cloud", async () => {
    return await syncCustomerSuggestionsToCloud();
  });
}
