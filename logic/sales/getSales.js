import db from '../../electron/db/connection.js'
import sales from '../../electron/db/queries/sales.js'

export default function getSales({ productId = null, sellerId = null } = {}) {
  return sales(db).findAll({ productId, sellerId })
}
