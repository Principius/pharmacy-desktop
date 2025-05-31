import db from '../electron/db/connection.js';
import axios from 'axios';
import sessions from '../electron/db/queries/sessions.js';

export default async function syncProductProfits() {
  try {
    const session = await sessions(db).getCurrent();
    if (!session) throw new Error('No tenant session found.');

    const response = await axios.get(`${session.tenant_url}/api/product-profit`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const { productData, totals } = response.data;

    await db.transaction(async trx => {
      // Clear and bulk insert product profits
      await trx('product_profits').delete();
      if (productData.length > 0) {
        await trx.batchInsert('product_profits', productData, 100);
      }

      // Update summary row (assuming id = 1)
      await trx('product_profits_summary')
        .update({
          ...totals,
          updated_at: new Date().toISOString(),
        })
        .where('id', 1); // assumes single-row table with id = 1
    });

    return { success: true, message: 'Synced successfully.' };
  } catch (error) {
    console.error('Sync error:', error.message);
    return { success: false, message: 'Sync failed.' };
  }
}
