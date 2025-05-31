import sessions from '../electron/db/queries/sessions.js'
import db from '../electron/db/connection.js'
import axios from 'axios'

export default async function loginAndSync({ email, password, deviceName, tenantSubdomain }) {
  if (!email || !password) throw new Error('Email and Password are required')
  if (!tenantSubdomain) throw new Error('Tenant subdomain is required')

  // Use the tenantSubdomain passed to the function dynamically
  const tenantUrl = `http://${tenantSubdomain}.afyatrack.co.tz`

  try {
    const response = await axios.post(`${tenantUrl}/api/electron/login`, {
      email,
      password,
      device_name: deviceName
    })

    const { access_token, tenant_id, device_id } = response.data

    // Await this operation if it returns a promise
    await sessions(db).createOrUpdate({
      tenant_id,
      device_id,
      access_token,
      tenant_url: tenantUrl
    })

    return { success: true, access_token, tenant_id, device_id, tenant_url: tenantUrl }
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message)

    const message = error.response?.data?.message || 'Login failed. Please check your credentials or tenant URL.'
    throw new Error(message)
  }
}
