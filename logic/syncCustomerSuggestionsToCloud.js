import db from "../electron/db/connection.js";
import axios from "axios";
import sessionHelper from "../electron/db/queries/sessions.js";

const sessions = sessionHelper(db);

export default async function syncCustomerSuggestionsToCloud() {
  try {
    const session = await sessions.getCurrent();
    if (!session) throw new Error("No tenant session found.");

    // Get all unsynced customer suggestions
    const unsyncedSuggestions = await db("customer_suggestions")
      .whereNull("is_synced")
      .orWhere("is_synced", false);

    if (unsyncedSuggestions.length === 0) {
      return { status: "no_data", message: "No customer suggestions to sync." };
    }

    const suggestionsToSync = unsyncedSuggestions.map((suggestion) => ({
      name: suggestion.name,
      email: suggestion.email,
      message: suggestion.message,
      created_at: suggestion.created_at,
    }));

    const response = await axios.post(
      `${session.tenant_url}/api/customer-suggestions/sync`,
      {
        device_id: session.device_id, // ✅ Include device_id
        suggestions: suggestionsToSync,
      },
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          Accept: "application/json",
        },
      }
    );

    // Mark synced in local DB
    const syncedIds = unsyncedSuggestions.map((s) => s.id);
    await db("customer_suggestions")
      .whereIn("id", syncedIds)
      .update({ is_synced: true });

    return {
      status: "success",
      synced: syncedIds.length,
    };
  } catch (error) {
    console.error(
      "Customer Suggestions Sync Error:",
      error.response?.data || error.message
    );
    return {
      status: "error",
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to sync customer suggestions",
    };
  }
}
