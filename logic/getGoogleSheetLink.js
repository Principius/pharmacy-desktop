import db from '../electron/db/connection.js';
import axios from 'axios';
import sessions from '../electron/db/queries/sessions.js';
import { shell } from 'electron';

export default async function getGoogleSheetLink() {
  try {
    const session = await sessions(db).getCurrent();
    if (!session) throw new Error('No tenant session found.');

    const response = await axios.get(`${session.tenant_url}/api/tenant/stock-link`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const link = response.data.sheet_url; // ✅ match the Laravel key

    if (!link) throw new Error('No link found in response.');

    // Open in default browser
    shell.openExternal(link);

    return {
      success: true,
      message: 'Google Sheet opened successfully.',
    };
  } catch (error) {
    console.error('Error opening Google Sheet:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
}
