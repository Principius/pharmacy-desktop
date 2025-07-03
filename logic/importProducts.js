import axios from 'axios';
import FormData from 'form-data';
import db from '../electron/db/connection.js';
import sessions from '../electron/db/queries/sessions.js';

export default async function importProducts({ buffer, fileName }) {
  try {
    const session = await sessions(db).getCurrent();
    if (!session || !session.access_token) {
      throw new Error('No valid tenant session or access token found.');
    }

    const formData = new FormData();

    // ✅ Convert Uint8Array to Buffer
    const fileBuffer = Buffer.from(buffer); 

    formData.append('file', fileBuffer, {
      filename: fileName,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const response = await axios.post(`${session.tenant_url}/api/products/import`, formData, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        ...formData.getHeaders(),
      },
    });

    return {
      status: 'success',
      message: response.data.message || 'Products imported successfully.',
    };
  } catch (error) {
    console.error('Error importing products:', error.response?.data || error.message);
    return {
      status: 'error',
      message: error.response?.data?.message || error.message || 'Import failed.',
    };
  }
}
