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
                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Navigate smartly. Act efficiently. Grow sustainably.
                    </p>
                    <button @click="$router.push('/cloud')"
                        class="px-6 py-3 mt-2 mb-2 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-green-500 to-teal-500 rounded-xl hover:scale-105 hover:from-green-600 hover:to-teal-600 dark:from-green-400 dark:to-teal-400 dark:hover:from-green-500 dark:hover:to-teal-500">
                        🚀 Register Online
                    </button>
                </div>
                <!-- Dashboard Stats -->
                <div class="grid gap-6 mb-10 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                    <div @click="$router.push('/sales')" class="cursor-pointer" v-if="can('canViewSales')">
                        <DashboardCard title="Today's Sales" icon="fas fa-chart-line" bg="from-green-400 to-green-600"
                            :lines="[
                                'Total Sales: ' + dailySales,
                                'Total Revenue: ' + formatTZS(dailyRevenue),
                            ]" />
                    </div>

                    <DashboardCard title="Today's Expenses" v-if="can('canViewExpenses')" icon="fas fa-money-bill-wave" bg="from-red-400 to-red-600"
                        :lines="[
                            'Expenses: ' + formatTZS(dailyExpenses)
                        ]" />

                    <DashboardCard title="Today's Net Profit" v-if="can('canViewNetProfit')" icon="fas fa-coins" bg="from-green-500 to-green-700"
                        :lines="[
                            'Net Profit: ' + formatTZS(dailyNetProfit)
                        ]" />

                    <DashboardCard title="Weekly Revenue" v-if="can('canViewSales')" icon="fas fa-chart-line" bg="from-blue-400 to-blue-600"
                        :lines="[
                            'Sales: ' + formatTZS(weeklyRevenue),
                            'Period: ' + weeklyStart + ' → ' + weeklyEnd
                        ]" />

                    <DashboardCard title="Weekly Expenses" v-if="can('canViewExpenses')" icon="fas fa-wallet" bg="from-orange-400 to-orange-600"
                        :lines="[
                            'Expenses: ' + formatTZS(weeklyExpenses),
                            'Period: ' + weeklyStart + ' → ' + weeklyEnd
                        ]" />

                    <DashboardCard title="Weekly Net Profit" icon="fas fa-hand-holding-usd" v-if="can('canViewNetProfit')"
                        bg="from-green-500 to-green-700" :lines="[
                            'Net Profit: ' + formatTZS(weeklyNetProfit),
                            'Period: ' + weeklyStart + ' → ' + weeklyEnd
                        ]" />


                    <div @click="$router.push('/sales')" class="cursor-pointer" v-if="can('canViewSales')">
                        <DashboardCard title="Overall Sales" icon="fas fa-chart-bar" bg="from-blue-400 to-blue-600"
                            :lines="[
                                'Total Sales: ' + totalSales,
                                'Total Revenue: ' + formatTZS(totalRevenue),
                            ]" />
                    </div>

                    <DashboardCard title="Overall Expenses" v-if="can('canViewExpenses')" icon="fas fa-wallet" bg="from-red-400 to-red-600" :lines="[
                        'Expenses: ' + formatTZS(overallExpenses)
                    ]" />

                    <DashboardCard title="Overall Net Profit" v-if="can('canViewNetProfit')" icon="fas fa-piggy-bank" bg="from-green-600 to-green-800"
                        :lines="[
                            'Net Profit: ' + formatTZS(overallNetProfit)
                        ]" />

                    <div @click="$router.push('/products')" class="cursor-pointer">
                        <DashboardCard title="All Products" icon="fas fa-boxes" bg="from-green-500 to-green-700"
                            :lines="['Total: ' + totalProducts]" />
                    </div>

                    <div @click="$router.push('/products')" class="cursor-pointer">
                        <DashboardCard title="Available Products (Non-expired & In Stock)" icon="fas fa-cube"
                            bg="from-yellow-400 to-yellow-600" :lines="['Total: ' + availableProducts]" />
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
                        <DashboardCard title="Low Stock Products" icon="fas fa-boxes" bg="from-purple-400 to-purple-600"
                            :lines="['Total: ' + lowStockDrugs]" />
                    </div>
                </div>
                <div>
                    <SalesCharts :graphData="graphStats" />
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer
            class="px-6 py-3 text-sm text-white transition-all duration-300 transform bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-t-2xl shadow-xl hover:scale-[1.02] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 md:ml-[200px]">
            <!-- Footer Info -->
            <div class="space-y-1 text-center">
                <p class="text-gray-300 dark:text-gray-400">
                    © {{ currentYear }} {{ appName }}. All Rights Reserved.
                </p>
                <p class="text-gray-400 dark:text-gray-500">📞 +255 623 827 005</p>
                <p class="text-gray-400 dark:text-gray-500">
                    📧 automatextinfo@gmail.com
                </p>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import SideBar from "@/components/SideBar.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import SalesCharts from "@/Pages/SalesCharts.vue";

const router = useRouter();

const dailySales = ref(0);
const dailyRevenue = ref(0);
const totalSales = ref(0);
const totalRevenue = ref(0);
const availableProducts = ref(0);
const expiringSoonProducts = ref(0);
const expiredProducts = ref(0);
const lowStockDrugs = ref(0);
const totalProducts = ref(0);

const dailyExpenses = ref(0);
const dailyNetProfit = ref(0);

const weeklyRevenue = ref(0);
const weeklyExpenses = ref(0);
const weeklyNetProfit = ref(0);

const overallRevenue = ref(0);
const overallExpenses = ref(0);
const overallNetProfit = ref(0);
const weeklyStart = ref("");
const weeklyEnd = ref("");

const graphStats = ref([]);
const currentYear = new Date().getFullYear();
const appName = "Automate-XT";

// Shared user ref
const user = ref({ name: "", email: "", role: "", permissions: [] });
const currentUser = user; // Alias for permission-based logic

const can = (permission) => {
    return currentUser.value?.permissions?.includes(permission);
};

const formatTZS = (value) => {
    return new Intl.NumberFormat("en-TZ", {
        style: "currency",
        currency: "TZS",
        minimumFractionDigits: 2,
    }).format(value);
};

onMounted(async () => {
    const stored = localStorage.getItem("user");
    if (stored) {
        user.value = JSON.parse(stored);
    } else {
        const response = await window.electronAPI.getLoggedInUser();
        if (response) {
            user.value = response;
        } else {
            router.push({ name: "Login" });
            return;
        }
    }

    const stats = await window.electronAPI.invoke("sales:get-stats");
    dailySales.value = stats.dailySales;
    dailyRevenue.value = stats.dailyRevenue;
    totalSales.value = stats.totalSales;
    totalRevenue.value = stats.totalRevenue;

    dailyExpenses.value = stats.dailyExpenses;
    dailyNetProfit.value = stats.dailyNetProfit;

    weeklyRevenue.value = stats.weeklyRevenue;
    weeklyExpenses.value = stats.weeklyExpenses;
    weeklyNetProfit.value = stats.weeklyNetProfit;

    weeklyStart.value = stats.weeklyStart;
    weeklyEnd.value = stats.weeklyEnd;

    overallRevenue.value = stats.overallRevenue;
    overallExpenses.value = stats.overallExpenses;
    overallNetProfit.value = stats.overallNetProfit;

    const productStats = await window.electronAPI.invoke("products:get-dashboard-stats");
    availableProducts.value = productStats.availableProducts;
    expiredProducts.value = productStats.expiredProducts;
    lowStockDrugs.value = productStats.lowStockDrugs;
    totalProducts.value = productStats.totalProducts;
    expiringSoonProducts.value = productStats.expiringSoonProducts;

    const data = await window.electronAPI.getGraphSalesStats();
    graphStats.value = data;
});
</script>
