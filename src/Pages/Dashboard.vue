<template>
    <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <div class="flex flex-1">
            <!-- Sidebar -->
            <SideBar />

            <!-- Main Content -->
            <div class="flex-1 px-4 py-6 mt-16 md:px-8 lg:px-12">
                <div
                    class="px-6 py-8 mx-auto mb-12 text-center transition-colors bg-white rounded-3xl dark:bg-gray-800 dark:text-gray-300 animate-fade-in">
                    <h2 class="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                        Welcome, {{ user.name }} 🎉
                    </h2>
                    <p class="mt-4 text-lg leading-relaxed">
                        You're now inside the <strong>Community Pharmacy Management Software</strong>.
                        Feel <span class="font-semibold text-green-600 dark:text-green-400">free and confident</span> to
                        manage all
                        your pharmacy operations—sales, inventory, expiry tracking, and more.
                    </p>
                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Navigate smartly. Act efficiently. Grow sustainably.
                    </p>
                </div>
                <!-- Dashboard Stats -->
                <div class="grid gap-6 mb-10 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                    <div @click="$router.push('/sales')" class="cursor-pointer">
                        <DashboardCard title="Today's Sales" icon="fas fa-chart-line" bg="from-green-400 to-green-600"
                            :lines="[
                                'Total Sales: ' + dailySales,
                                'Total Revenue: ' + formatTZS(dailyRevenue),
                            ]" />
                    </div>

                    <div @click="$router.push('/sales')" class="cursor-pointer">
                        <DashboardCard title="Overall Sales" icon="fas fa-chart-bar" bg="from-blue-400 to-blue-600"
                            :lines="[
                                'Total Sales: ' + totalSales,
                                'Total Revenue: ' + formatTZS(totalRevenue),
                            ]" />
                    </div>

                    <div @click="$router.push('/products')" class="cursor-pointer">
                        <DashboardCard title="Available Products" icon="fas fa-cube" bg="from-yellow-400 to-yellow-600"
                            :lines="['Total: ' + availableProducts]" />
                    </div>

                    <div @click="$router.push('/expired/soon')" class="cursor-pointer">
                        <DashboardCard title="Expiring Soon (180 Days)" icon="fas fa-clock" bg="from-red-400 to-red-600"
                            :lines="['Total: ' + expiringSoonProducts]" />
                    </div>

                    <div @click="$router.push('/expired')" class="cursor-pointer">
                        <DashboardCard title="Expired Products" icon="fas fa-ban" bg="from-gray-400 to-gray-600"
                            :lines="['Total: ' + expiredProducts]" />
                    </div>

                    <div @click="$router.push('/lowstock')" class="cursor-pointer">
                        <DashboardCard title="Low Stock Drugs" icon="fas fa-boxes" bg="from-purple-400 to-purple-600"
                            :lines="['Total: ' + lowStockDrugs]" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer
            class="px-6 py-3 text-sm text-white transition-all duration-300 transform bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-t-2xl shadow-xl hover:scale-[1.02] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 md:ml-[200px]">
            <!-- Footer Info -->
            <div class="space-y-1 text-center">
                <button @click="$router.push('/cloud')"
                    class="px-6 py-3 mb-4 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-green-500 to-teal-500 rounded-xl hover:scale-105 hover:from-green-600 hover:to-teal-600 dark:from-green-400 dark:to-teal-400 dark:hover:from-green-500 dark:hover:to-teal-500">
                    🚀 Auth Online
                </button>
                <p class="text-gray-300 dark:text-gray-400">© {{ currentYear }} {{ appName }}. All Rights Reserved.
                </p>
                <p class="text-gray-400 dark:text-gray-500">📞 +255 623 827 005</p>
                <p class="text-gray-400 dark:text-gray-500">📧 automatextinfo@gmail.com</p>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import DashboardCard from '@/components/DashboardCard.vue'

const router = useRouter()

const dailySales = ref(0)
const dailyRevenue = ref(0)
const totalSales = ref(0)
const totalRevenue = ref(0)
const availableProducts = ref(0)
const expiringSoonProducts = ref(0)
const expiredProducts = ref(0)
const lowStockDrugs = ref(0)

const formatTZS = (value) => {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 2,
    }).format(value)
}

const user = ref({ name: '', email: '', role: '' })

onMounted(async () => {
    const stored = localStorage.getItem('user')
    if (stored) {
        user.value = JSON.parse(stored)
    } else {
        const response = await window.electronAPI.getLoggedInUser()
        if (response) {
            user.value = response
        } else {
            router.push({ name: 'Login' })
            return
        }
    }

    const stats = await window.electronAPI.invoke('sales:get-stats')
    dailySales.value = stats.dailySales
    dailyRevenue.value = stats.dailyRevenue
    totalSales.value = stats.totalSales
    totalRevenue.value = stats.totalRevenue

    const productStats = await window.electronAPI.invoke('products:get-dashboard-stats')

    availableProducts.value = productStats.availableProducts
    expiredProducts.value = productStats.expiredProducts
    lowStockDrugs.value = productStats.lowStockDrugs
    expiringSoonProducts.value = productStats.expiringSoonProducts

})

const currentYear = new Date().getFullYear()
const appName = "Automate-XT"
</script>
