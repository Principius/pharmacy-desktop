import db from '../../electron/db/connection.js'
import dayjs from 'dayjs'

export default async function getSalesStats() {
  const today = dayjs().startOf('day').toISOString()
  const now = dayjs().endOf('day').toISOString()

  // Sales made today
  const dailySales = await db('sales')
    .whereBetween('created_at', [today, now])
    .count('* as totalSales')
    .sum('total_cost as totalRevenue')
    .first()

  // Overall sales
  const total = await db('sales')
    .count('* as totalSales')
    .sum('total_cost as totalRevenue')
    .first()

  return {
    dailySales: Number(dailySales.totalSales || 0),
    dailyRevenue: Number(dailySales.totalRevenue || 0),
    totalSales: Number(total.totalSales || 0),
    totalRevenue: Number(total.totalRevenue || 0),
  }
}
