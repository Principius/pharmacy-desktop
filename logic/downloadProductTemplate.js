import fs from 'fs';
import { dialog } from 'electron';
import db from '../electron/db/connection.js';
import axios from 'axios';
import sessions from '../electron/db/queries/sessions.js';

export default async function downloadProductTemplate() {
    try {
        const session = await sessions(db).getCurrent();
        if (!session || !session.access_token) {
            throw new Error('No tenant session or access token found.');
        }

        // Make sure the endpoint returns an actual Excel file
        const response = await axios.get(`${session.tenant_url}/api/generate-product-template`, {
            headers: {
                Authorization: `Bearer ${session.access_token}`,
                Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            responseType: 'arraybuffer',
        });

        // Prompt user for save location
        const { filePath, canceled } = await dialog.showSaveDialog({
            title: 'Save Product Template',
            defaultPath: 'ProductTemplate.xlsx',
            filters: [{ name: 'Excel Files', extensions: ['xlsx'] }],
        });

        if (canceled || !filePath) {
            return { status: 'cancelled', message: 'Download cancelled by user.' };
        }

        // Write buffer to file
        fs.writeFileSync(filePath, Buffer.from(response.data));

        return {
            status: 'success',
            message: 'Template downloaded successfully.',
            path: filePath,
        };
    } catch (error) {
        console.error('Error downloading template:', error.response?.data || error.message);
        return {
            status: 'error',
            message: error.message || 'Failed to download template.',
        };
    }
}
