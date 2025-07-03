<template>
    <div class="max-w-4xl p-6 mx-auto">
        <Back />
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-800">Summary Dashboard</h1>
            <button @click="syncSummaries"
                class="px-4 py-2 font-medium text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700">
                🔄 Sync Summaries
            </button>
        </div>

        <div v-if="loading" class="text-center text-gray-600 dark:text-gray-800 animate-pulse">
            ⏳ Loading summaries...
        </div>

        <div v-else-if="summary" class="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <SummaryCard icon="🛒" title="Total Sales" :value="summary.total_sales" />
            <SummaryCard icon="💰" title="Total Revenue" :value="format(summary.total_revenue)" />
            <SummaryCard icon="📦" title="Total Products" :value="summary.total_products" />
            <SummaryCard icon="🏦" title="Total Capital" :value="format(summary.total_capital)" />
            <SummaryCard icon="👥" title="Total Users" :value="summary.total_users" />
            <SummaryCard icon="⏳" title="Expired Products" :value="summary.total_expired_products" />
            <SummaryCard icon="💸" title="Total Expenses" :value="format(summary.total_expenses)" />
            <SummaryCard icon="⚠️" title="Damaged Products" :value="summary.total_damaged_products" />
            <SummaryCard icon="📅" title="Synced At" :value="formatDate(summary.synced_at)" />
        </div>

        <div v-else class="mt-8 text-center text-gray-500 dark:text-gray-400">
            ❌ No summary data available.
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import SummaryCard from '@/components/SummaryCard.vue'
import Back from '@/components/Back.vue'

const summary = ref(null)
const loading = ref(false)

async function confirmInternetAction(callback) {
    const { isConfirmed } = await Swal.fire({
        title: 'Internet Required',
        text: 'This action requires an internet connection. Do you want to continue?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, continue',
        cancelButtonText: 'Cancel'
    });

    if (isConfirmed) {
        await callback();
    }
}

const loadSummary = async () => {
    loading.value = true
    summary.value = await window.electronAPI.getLatest()
    loading.value = false
}

const syncSummaries = () => {
    confirmInternetAction(async () => {
        loading.value = true;
        const result = await window.electronAPI.syncSummariesFromCloud();
        loading.value = false;

        if (result.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: '✅ Synced!',
                text: result.message,
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: '❌ Sync Failed',
                text: result.message || 'Something went wrong!',
            });
        }

        await loadSummary();
    });
};


onMounted(loadSummary)

function format(value) {
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: 'TZS',
        maximumFractionDigits: 0,
    }).format(value)
}

function formatDate(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleString()
}
</script>

<script>
// Optional: dark/light mode via Tailwind
document.documentElement.classList.add(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
)
</script>

<style scoped>
/* Additional transition effects if needed */
</style>
