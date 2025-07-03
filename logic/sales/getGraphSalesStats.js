import db from '../../electron/db/connection.js'
import dayjs from 'dayjs'

export default async function getGraphSalesStats() {
  const today = dayjs().endOf('day')
  const sevenDaysAgo = dayjs().subtract(6, 'day').startOf('day')

  const from = sevenDaysAgo.format('YYYY-MM-DD HH:mm:ss')
  const to = today.format('YYYY-MM-DD HH:mm:ss')

  const rawData = await db('sales')
    .select(
      db.raw("DATE(created_at) as date"),
      db.raw("COUNT(*) as total_sales"),
      db.raw("SUM(total_cost) as total_revenue")
    )
    .whereBetween('created_at', [from, to])
    .groupByRaw("DATE(created_at)")
    .orderByRaw("DATE(created_at) ASC")

  const results = []

  for (let i = 0; i < 7; i++) {
    const date = dayjs(sevenDaysAgo).add(i, 'day').format('YYYY-MM-DD')
    const found = rawData.find(d => dayjs(d.date).format('YYYY-MM-DD') === date)

    results.push({
      date,
      total_sales: found ? Number(found.total_sales) : 0,
      total_revenue: found ? Number(found.total_revenue) : 0,
    })
  }

  return results
}
