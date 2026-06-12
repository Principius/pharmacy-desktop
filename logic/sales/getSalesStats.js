import db from '../../electron/db/connection.js'
import dayjs from 'dayjs'

export default async function getSalesStats() {
  const todayStart = dayjs().startOf('day').toISOString()
  const todayEnd = dayjs().endOf('day').toISOString()

  const weekStart = dayjs().startOf('week')
  const weekEnd = dayjs().endOf('week')

  // Convert to ISO for DB queries
  const weekStartISO = weekStart.toISOString()
  const weekEndISO = weekEnd.toISOString()

  // ------------------------------------
  // DAILY SALES
  // ------------------------------------
  const dailySalesCount = await db('sales')
    .whereBetween('created_at', [todayStart, todayEnd])
    .count('id as count')
    .first()

  const dailySalesRevenue = await db('sales')
    .whereBetween('created_at', [todayStart, todayEnd])
    .sum('total_cost as revenue')
    .first()

  const dailyExpensesResult = await db('expenses')
    .whereBetween('created_at', [todayStart, todayEnd])
    .sum('amount as total')
    .first()

  const dailySales = Number(dailySalesCount?.count || 0)
  const dailyRevenue = Number(dailySalesRevenue?.revenue || 0)
  const dailyExpenses = Number(dailyExpensesResult?.total || 0)
  const dailyNetProfit = dailyRevenue - dailyExpenses

  // ------------------------------------
  // WEEKLY SALES
  // ------------------------------------
  const weeklySalesRevenue = await db('sales')
    .whereBetween('created_at', [weekStartISO, weekEndISO])
    .sum('total_cost as revenue')
    .first()

  const weeklyExpensesResult = await db('expenses')
    .whereBetween('created_at', [weekStartISO, weekEndISO])
    .sum('amount as total')
    .first()

  const weeklyRevenue = Number(weeklySalesRevenue?.revenue || 0)
  const weeklyExpenses = Number(weeklyExpensesResult?.total || 0)
  const weeklyNetProfit = weeklyRevenue - weeklyExpenses

  // ------------------------------------
  // OVERALL SALES
  // ------------------------------------
  const totalSalesCount = await db('sales')
    .count('id as count')
    .first()

  const totalSalesRevenue = await db('sales')
    .sum('total_cost as revenue')
    .first()

  const totalExpensesResult = await db('expenses')
    .sum('amount as total')
    .first()

  const totalSales = Number(totalSalesCount?.count || 0)
  const totalRevenue = Number(totalSalesRevenue?.revenue || 0)
  const overallExpenses = Number(totalExpensesResult?.total || 0)
  const overallNetProfit = totalRevenue - overallExpenses

  return {
    // DAILY
    dailySales,
    dailyRevenue,
    dailyExpenses,
    dailyNetProfit,

    // WEEKLY
    weeklyRevenue,
    weeklyExpenses,
    weeklyNetProfit,
    weeklyStart: weekStart.format("MMM DD"), 
    weeklyEnd: weekEnd.format("MMM DD"),

    // OVERALL
    totalSales,
    totalRevenue,
    overallExpenses,
    overallNetProfit,
  }
}
