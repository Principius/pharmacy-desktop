<script setup>
import { ref, computed, onMounted } from 'vue'
import ApexChart from 'vue3-apexcharts'

// Props
const props = defineProps({
  graphData: {
    type: Array,
    required: true,
  },
})

// User and Permission Handling
const currentUser = ref(null)

const can = (permission) => {
  return currentUser.value?.permissions?.includes(permission)
}

const fetchSales = async () => {
  // Define your logic or leave this empty if you're not using it yet
}

// Initialize user and fetchSales
onMounted(async () => {
  currentUser.value = await window.electronAPI.getLoggedInUser()
  await fetchSales()
})

// Revenue stats
const monthlyRevenue = ref([])

onMounted(async () => {
  monthlyRevenue.value = await window.electronAPI.getMonthlyRevenueStats()
})

// Expiry stats
const expiryStats = ref({ expired: 0, available: 0 })

onMounted(async () => {
  expiryStats.value = await window.electronAPI.readDonutProducts()
})

// Pie chart
const pieSeries = computed(() => [
  expiryStats.value.available,
  expiryStats.value.expired,
])

const pieOptions = {
  chart: { type: 'donut' },
  labels: ['Available Products', 'Expired Products'],
  colors: ['#10b981', '#ef4444'],
  legend: { position: 'bottom' },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${val.toFixed(1)}%`,
  },
}

// Sales & Revenue line chart
const salesCountSeries = computed(() => [
  { name: 'Sales Count', data: props.graphData.map(entry => entry.total_sales) }
])

const revenueSeries = computed(() => [
  { name: 'Revenue (TZS)', data: props.graphData.map(entry => entry.total_revenue) }
])

const categories = computed(() => props.graphData.map(entry => entry.date))

const commonOptions = {
  chart: {
    toolbar: { show: false },
    animations: { enabled: true, easing: 'easeinout', speed: 800 },
    zoom: { enabled: false },
  },
  dataLabels: { enabled: false },
  grid: { borderColor: '#e5e7eb', strokeDashArray: 4 },
  tooltip: { theme: 'dark' },
  xaxis: {
    categories: categories.value,
    labels: { style: { colors: ['#6b7280'], fontSize: '12px' } }
  },
  yaxis: {
    labels: { style: { colors: ['#6b7280'], fontSize: '12px' } }
  },
  stroke: { curve: 'smooth', width: 3 }
}

const salesCountOptions = computed(() => ({
  ...commonOptions,
  colors: ['#22c55e'],
}))

const revenueOptions = computed(() => ({
  ...commonOptions,
  colors: ['#3b82f6'],
}))

const monthlyRevenueSeries = computed(() => [
  { name: 'Monthly Revenue (TZS)', data: monthlyRevenue.value.map(entry => entry.total_revenue) }
])

const monthlyRevenueCategories = computed(() =>
  monthlyRevenue.value.map(entry => entry.month)
)

const monthlyRevenueOptions = computed(() => ({
  chart: {
    toolbar: { show: false },
    animations: { enabled: true, easing: 'easeinout', speed: 800 },
    zoom: { enabled: false },
  },
  dataLabels: { enabled: false },
  grid: { borderColor: '#e5e7eb', strokeDashArray: 4 },
  tooltip: { theme: 'dark' },
  xaxis: {
    categories: monthlyRevenueCategories.value,
    labels: { style: { colors: ['#6b7280'], fontSize: '12px' } }
  },
  yaxis: {
    labels: { style: { colors: ['#6b7280'], fontSize: '12px' } }
  },
  stroke: { curve: 'smooth', width: 3 },
  colors: ['#f59e0b'],
}))
</script>


<template>
  <section class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div
      class="p-6 transition duration-300 bg-white border border-gray-200 shadow-lg dark:bg-gray-900 rounded-2xl hover:shadow-xl dark:border-gray-700">
      <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">📈 Sales Count (Last 7 Days)</h2>
      <ApexChart type="line" height="300" :options="salesCountOptions" :series="salesCountSeries" />
    </div>

    <div v-if="can('canSeeRevenueGraphs')"
      class="p-6 transition duration-300 bg-white border border-gray-200 shadow-lg dark:bg-gray-900 rounded-2xl hover:shadow-xl dark:border-gray-700">
      <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">💰 Revenue (Last 7 Days)</h2>
      <ApexChart type="line" height="300" :options="revenueOptions" :series="revenueSeries" />
    </div>
    <div v-if="can('canSeeRevenueGraphs')"
      class="p-6 transition duration-300 bg-white border border-gray-200 shadow-lg dark:bg-gray-900 rounded-2xl hover:shadow-xl dark:border-gray-700">
      <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">📊 Monthly Revenue (Last 12 Months)</h2>
      <ApexChart type="line" height="300" :options="monthlyRevenueOptions" :series="monthlyRevenueSeries" />
    </div>
    <div
      class="p-6 transition duration-300 bg-white border border-gray-200 shadow-lg dark:text-gray-400 dark:bg-gray-900 rounded-2xl hover:shadow-xl dark:border-gray-700">
      <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">🧪 Product Expiry Distribution</h2>
      <ApexChart type="donut" height="300" :options="pieOptions" :series="pieSeries" />
    </div>
  </section>
</template>

<style scoped>
/* Optional fine-tuning */
</style>
