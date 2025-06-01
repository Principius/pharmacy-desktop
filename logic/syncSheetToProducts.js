import db from '../electron/db/connection.js';
import axios from 'axios';
import sessions from '../electron/db/queries/sessions.js';

export default async function syncSheetToProducts() {
  try {
    const session = await sessions(db).getCurrent();
    if (!session) throw new Error('No tenant session found.');

    const response = await axios.post(
      `${session.tenant_url}/api/sync-sheet-to-products`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    return {
      success: true,
      message: response.data.message || 'Sheet data synced to products successfully.',
    };
  } catch (error) {
    console.error('Error syncing sheet to products:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
}
