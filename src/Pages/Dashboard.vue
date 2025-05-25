<template>
    <div class="flex flex-col min-h-screen">
        <div class="flex flex-1">
            <!-- Sidebar -->
            <SideBar />

            <!-- Main Content -->
            <div class="flex-1 p-6">
                <h1 class="mt-16 mb-6 text-2xl font-bold">  {{ name }} Dashboard</h1>
                <div class="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3">
                    <!-- Daily Sales -->
                    <Link  >
                    <div
                        class="p-6 transition-all ease-in-out rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-green-600 hover:scale-105">
                        <div class="flex items-center">
                            <i class="w-6 h-6 mr-3 text-white fas fa-chart-line"></i>
                            <h2 class="text-lg font-semibold text-white">Today's Sales</h2>
                        </div>
                        <p class="mt-2 text-white">Total Sales: {{ dailySales }}</p>
                        <p class="mt-2 text-white">Total Revenue: {{ formatTZS(dailyRevenue) }}</p>
                    </div>
                    </Link>

                    <!-- Overall Sales -->
                    <Link  >
                    <div
                        class="p-6 transition-all ease-in-out rounded-lg shadow-lg bg-gradient-to-r from-blue-400 to-blue-600 hover:scale-105">
                        <div class="flex items-center">
                            <i class="w-6 h-6 mr-3 text-white fas fa-chart-bar"></i>
                            <h2 class="text-lg font-semibold text-white">Overall Sales</h2>
                        </div>
                        <p class="mt-2 text-white">Total Sales: {{ totalSales }}</p>
                       <p class="mt-2 text-white">Total Revenue: {{ formatTZS(totalRevenue) }}</p>
                    </div>
                    </Link>

                    <!-- Available Products -->
                    <Link >
                    <div
                        class="p-6 transition-all ease-in-out rounded-lg shadow-lg bg-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-105">
                        <div class="flex items-center">
                            <i class="w-6 h-6 mr-3 text-white fas fa-cube"></i>
                            <h2 class="text-lg font-semibold text-white">Available Products</h2>
                        </div>
                        <p class="mt-2 text-white">Total: {{ availableProducts }}</p>
                    </div>
                    </Link>

                    <!-- Expiring Soon Products -->
                    <Link>
                    <div
                        class="p-6 transition-all ease-in-out rounded-lg shadow-lg bg-gradient-to-r from-red-400 to-red-600 hover:scale-105">
                        <div class="flex items-center">
                            <i class="w-6 h-6 mr-3 text-white fas fa-clock"></i>
                            <h2 class="text-lg font-semibold text-white">Expiring Soon (In 180 Days)</h2>
                        </div>
                        <p class="mt-2 text-white">Total: {{ expiringSoonProducts }}</p>
                    </div>
                    </Link>

                    <!-- Expired Products -->
                    <Link>
                    <div
                        class="p-6 transition-all ease-in-out rounded-lg shadow-lg bg-gradient-to-r from-gray-400 to-gray-600 hover:scale-105">
                        <div class="flex items-center">
                            <i class="w-6 h-6 mr-3 text-white fas fa-ban"></i>
                            <h2 class="text-lg font-semibold text-white">Expired Products</h2>
                        </div>
                        <p class="mt-2 text-white">Total: {{ expiredProducts }}</p>
                    </div>
                    </Link>

                    <!-- Low Stock Drugs -->
                    <Link>
                    <div
                        class="p-6 transition-all ease-in-out rounded-lg shadow-lg bg-gradient-to-r from-purple-400 to-purple-600 hover:scale-105">
                        <div class="flex items-center">
                            <i class="w-6 h-6 mr-3 text-white fas fa-boxes"></i>
                            <h2 class="text-lg font-semibold text-white">Low Stock Drugs </h2>
                        </div>
                        <p class="mt-2 text-white">Total: {{ lowStockDrugs }}</p>
                    </div>
                    </Link>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 sm:ml-[256px]">
            <!-- Sales Graph -->
            <!-- <SplineChart title="Sales Over Last 7 Days" :labels="dailyStats.map(stat => stat.date)"
                :data="dailyStats.map(stat => stat.salesCount)" label="Sales" color="#10B981" />
            <div class="p-4 transition duration-300 transform bg-white rounded shadow dark:bg-white hover:scale-105">
                <DonutChart :title="'Visited Customers'" :data="[availableProducts, expiredProducts]"
                    :labels="['Available', 'Expired']" />
            </div> -->
            <!-- Revenue Graph -->
            <!-- <SplineChart title="Revenue Over Last 7 Days" :labels="dailyStats.map(stat => stat.date)"
                :data="dailyStats.map(stat => stat.revenue)" label="Revenue" color="#EF4444" />
            <div class="p-4 transition duration-300 transform bg-white rounded shadow dark:bg-white hover:scale-105">
                <BarChart title="Monthly Revenue Trends" :labels="monthlyRevenueData.months"
                    :data="monthlyRevenueData.revenues" />
            </div> -->
        </div>

        <!-- Footer -->
        <Footer class="md:ml-[200px]" />
    </div>
</template>

<script setup>
import { ref } from "vue";
import SplineChart from "../Components/SplineChart.vue";
import SideBar from "../Components/SideBar.vue";
import Footer from "../Components/Footer.vue";
import DonutChart from "../Components/DonutChart.vue";
import BarChart from "../Components/BarChart.vue";
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const name = route.params.name

const formatTZS = (value) => {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        minimumFractionDigits: 2,
    }).format(value);
};

</script>