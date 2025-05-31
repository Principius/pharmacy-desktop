import db from '../electron/db/connection.js';
import axios from 'axios';
import sessions from '../electron/db/queries/sessions.js';

export default async function getStockTransfers() {
  try {
    const session = await sessions(db).getCurrent(); // assume you already have this session manager
    if (!session) throw new Error('No tenant session found.');

    const response = await axios.get(`${session.tenant_url}/api/stock-transfers`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    return {
      pharmacies: response.data.pharmacies,
      products: response.data.products,
    };
  } catch (error) {
    console.error('Error fetching stock transfers:', error);
    return {
      pharmacies: [],
      products: [],
      error: error.message,
    };
  }
}
