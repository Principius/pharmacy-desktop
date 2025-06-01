import db from '../electron/db/connection.js';
import axios from 'axios';
import sessions from '../electron/db/queries/sessions.js';

export default async function syncProductsToSheet() {
    try {
        const session = await sessions(db).getCurrent();
        if (!session) throw new Error('No tenant session found.');

        const response = await axios.post(
            `${session.tenant_url}/api/sync-products-to-sheet`,
            {}, 
            {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            }
        );

        return {
            success: true,
            message: response.data.message || 'Products synced to Google Sheet.',
        };
    } catch (error) {
        console.error('Error syncing products to Google Sheet:', error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || error.message,
        };
    }
}
