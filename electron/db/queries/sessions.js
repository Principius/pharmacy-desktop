export default function sessions(db) {
  return {
    // Find the session by tenant_id
    async findByTenantId(tenantId) {
      return await db('electron_sessions')
        .where({ tenant_id: tenantId })
        .first()
    },

    // Create or update a session record
    async createOrUpdate({ tenant_id, device_id, access_token, tenant_url }) {
      await db('electron_sessions')
        .insert({
          tenant_id,
          device_id,
          access_token,
          tenant_url,
          last_sync_at: db.fn.now(),
        })
        .onConflict('tenant_id')
        .merge({
          device_id,
          access_token,
          tenant_url,
          last_sync_at: db.fn.now(),
        })
    },

    // Delete the session data for a tenant
    async delete(tenantId) {
      await db('electron_sessions')
        .where({ tenant_id: tenantId })
        .del()
    },

    // Get the first session (current)
    async getCurrent() {
      return await db('electron_sessions').first()
    },
  }
}
