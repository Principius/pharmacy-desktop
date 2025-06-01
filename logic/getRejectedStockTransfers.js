import db from '../electron/db/connection.js';
import axios from 'axios';
import sessions from '../electron/db/queries/sessions.js';

export default async function getRejectedStockTransfers() {
  try {
    const session = await sessions(db).getCurrent();
    if (!session || !session.access_token) {
      throw new Error('No valid tenant session or access token found.');
    }

    const response = await axios.get(`${session.tenant_url}/api/stock-transfers/rejected`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: 'application/json',
      },
    });

    return {
      transfers: response.data.transfers,
    };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Unauthenticated. Token may have expired or is invalid.');
    } else {
      console.error('Error fetching rejected stock transfers:', error);
    }

    return {
      transfers: [],
      error: error.message || 'Unknown error',
    };
  }
}
