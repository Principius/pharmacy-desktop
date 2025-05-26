import { ipcMain } from 'electron'
import db from '../db/connection.js'

// Function to insert a pharmacy into the database
async function addPharmacy(data) {
  try {
    const [id] = await db('pharmacy_data').insert({
      name: data.name,
      phone_number: data.phone_number,
      email: data.email,
      address: data.address,
    })
    return { success: true, id }
  } catch (error) {
    console.error('Failed to add pharmacy:', error)
    throw new Error('Pharmacy insert failed: ' + error.message)
  }
}

// ✅ Function to fetch the first pharmacy record
async function getPharmacyData() {
  try {
    const result = await db('pharmacy_data').first()
    return result || null
  } catch (error) {
    console.error('Error checking pharmacy_data:', error)
    return null
  }
}

// Function to register IPC handlers
export default function registerPharmacyHandlers(ipcMainInstance) {
  ipcMainInstance.handle('add-pharmacy', async (event, formData) => {
    return await addPharmacy(formData)
  })

  // ✅ Register pharmacy data checker
  ipcMainInstance.handle('get-pharmacy-data', async () => {
    return await getPharmacyData()
  })
}
