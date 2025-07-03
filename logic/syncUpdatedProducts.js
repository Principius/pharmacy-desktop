import db from "../electron/db/connection.js";
import axios from "axios";
import sessions from "../electron/db/queries/sessions.js";

export default async function syncEditedProductsToCloud() {
  try {
    const session = await sessions(db).getCurrent();
    if (!session) throw new Error("No tenant session found.");

    function isValidProduct(p) {
      return (
        p.name &&
        p.brand &&
        p.category &&
        p.form &&
        p.batch_no &&
        p.buying_price != null &&
        p.buying_price_per_unit != null &&
        p.selling_price_per_unit != null &&
        p.supplier_name &&
        p.received_date &&
        p.quantity_remained != null &&
        p.minimum_stock != null
      );
    }

    // Fetch all locally edited (unsynced) products
    const unsyncedProducts = await db("products")
      .where("synced", 0)
      .select("*");

    const validProducts = unsyncedProducts.filter(isValidProduct);

    if (validProducts.length === 0) {
      return {
        status: "error",
        message:
          "No valid edited products found. Please complete missing fields before syncing.",
      };
    }
    if (unsyncedProducts.length === 0) {
      return { status: "no_data", message: "No edited products to sync." };
    }

    const payload = {
       products: validProducts,
      device_id: session.device_id,
      tenant_id: session.tenant_id,
      access_token: session.access_token,
    };

    const response = await axios.put(
      `${session.tenant_url}/api/products/sync`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          Accept: "application/json",
        },
      }
    );

    const serverMappings = response.data.mappings || [];

    // Mark synced in batch
    const localIds = serverMappings.map((p) => p.local_id);

    await db("products").whereIn("id", localIds).update({ synced: 1 });

    // Update server_ids (optional: do only if not yet set)
    for (const mapping of serverMappings) {
      if (mapping.server_id) {
        await db("products")
          .where({ id: mapping.local_id })
          .update({ server_id: mapping.server_id });
      }
    }

    return {
      status: "success",
      synced: localIds.length,
      server_response: response.data,
    };
  } catch (error) {
    console.error("Product Sync Error:", error.response?.data || error.message);
    return {
      status: "error",
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to sync edited products",
    };
  }
}
