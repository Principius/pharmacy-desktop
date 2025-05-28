import db from '../../electron/db/connection.js'
import dayjs from 'dayjs'

export default async function getMonthlyRevenueStats() {
  const endOfMonth = dayjs().endOf('month')
  const startOfPeriod = dayjs().subtract(11, 'month').startOf('month')

  const from = startOfPeriod.format('YYYY-MM-DD HH:mm:ss')
  const to = endOfMonth.format('YYYY-MM-DD HH:mm:ss')

  // ✅ SQLite-compatible query using strftime
  const rawData = await db('sales')
    .select(
      db.raw("strftime('%Y-%m', created_at) as month"),
      db.raw("SUM(total_cost) as total_revenue")
    )
    .whereBetween('created_at', [from, to])
    .groupByRaw("strftime('%Y-%m', created_at)")
    .orderByRaw("strftime('%Y-%m', created_at) ASC")

  const results = []
  for (let i = 0; i < 12; i++) {
    const month = startOfPeriod.add(i, 'month').format('YYYY-MM')
    const found = rawData.find(d => d.month === month)

    results.push({
      month,
      total_revenue: found ? Number(found.total_revenue) : 0,
    })
  }

  return results
}
