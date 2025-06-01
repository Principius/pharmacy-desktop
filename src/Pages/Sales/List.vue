<template>
    <div class="max-w-6xl p-6 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-900">
        <Back />

        <div class="flex flex-col mt-4 mb-6 space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-gray-100">All Sales</h2>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input v-model="searchTerm" type="search" placeholder="Search sales..."
                    class="px-4 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    aria-label="Search sales" :disabled="isSyncing" />

                <button @click="syncSales"
                    class="flex items-center gap-2 px-5 py-2 font-semibold text-white transition bg-blue-600 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Sync sales to cloud" :disabled="isSyncing">
                    <span v-if="!isSyncing">Sync to Cloud</span>
                    <span v-else>
                        Please wait...
                        <svg class="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    </span>
                </button>
            </div>
        </div>
        <div class="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center">
            <label class="flex flex-col text-sm text-gray-700 dark:text-gray-300">
                From
                <input v-model="startDate" type="date"
                    class="px-4 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100" />
            </label>

            <label class="flex flex-col text-sm text-gray-700 dark:text-gray-300">
                To
                <input v-model="endDate" type="date"
                    class="px-4 py-2 border border-gray-300 rounded dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100" />
            </label>
        </div>

        <div class="overflow-x-auto border border-gray-200 rounded-lg dark:border-gray-700">
            <table class="w-full text-left table-auto">
                <thead class="bg-gray-100 dark:bg-gray-800">
                    <tr>
                        <th
                            class="px-5 py-3 font-semibold text-gray-700 border-b border-gray-300 dark:text-gray-300 dark:border-gray-700">
                            ID</th>
                        <th
                            class="px-5 py-3 font-semibold text-gray-700 border-b border-gray-300 dark:text-gray-300 dark:border-gray-700">
                            Product</th>
                        <th
                            class="px-5 py-3 font-semibold text-gray-700 border-b border-gray-300 dark:text-gray-300 dark:border-gray-700">
                            Quantity</th>
                        <th
                            class="px-5 py-3 font-semibold text-gray-700 border-b border-gray-300 dark:text-gray-300 dark:border-gray-700">
                            Total</th>
                        <th
                            class="px-5 py-3 font-semibold text-gray-700 border-b border-gray-300 dark:text-gray-300 dark:border-gray-700">
                            Synced</th>
                        <th
                            class="px-5 py-3 font-semibold text-gray-700 border-b border-gray-300 dark:text-gray-300 dark:border-gray-700">
                            Created At</th>
                        <th
                            class="px-5 py-3 font-semibold text-gray-700 border-b border-gray-300 dark:text-gray-300 dark:border-gray-700">
                            Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="sale in filteredSales" :key="sale.id"
                        class="transition-colors border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td class="px-5 py-3 font-medium text-gray-900 dark:text-gray-100">{{ sale.id }}</td>
                        <td class="px-5 py-3 text-gray-900 dark:text-gray-100">{{ sale.product_name }}</td>
                        <td class="px-5 py-3 text-gray-900 dark:text-gray-100">{{ sale.quantity_sold }}</td>
                        <td class="px-5 py-3 font-semibold text-green-600">
                            {{ sale.total_cost.toLocaleString() }} TZS
                        </td>
                        <td class="px-5 py-3">
                            <span :class="sale.synced ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                                class="px-2 py-1 text-xs font-semibold rounded select-none">
                                {{ sale.synced ? 'Yes' : 'No' }}
                            </span>
                        </td>
                        <td class="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {{ formatToNairobi(sale.created_at) }}
                        </td>
                        <td class="px-5 py-3 space-x-3">
                            <button @click="goToEdit(sale)"
                                class="font-semibold text-blue-600 transition hover:text-blue-800 dark:hover:text-blue-400 focus:outline-none focus:underline"
                                aria-label="Edit sale">
                                Edit
                            </button>
                            <button @click="deleteSale(sale.id)"
                                class="font-semibold text-red-600 transition hover:text-red-800 dark:hover:text-red-400 focus:outline-none focus:underline"
                                aria-label="Delete sale">
                                Delete
                            </button>
                        </td>
                    </tr>
                    <tr v-if="filteredSales.length === 0">
                        <td colspan="7" class="py-6 italic text-center text-gray-500 dark:text-gray-400">No sales found.
                        </td>
                    </tr>
                </tbody>
                <tfoot v-if="filteredSales.length > 0">
                    <tr class="font-semibold bg-gray-100 dark:bg-gray-800">
                        <td colspan="2" class="px-5 py-3 text-right text-gray-700 dark:text-gray-200">Totals:</td>
                        <td class="px-5 py-3 text-gray-700 dark:text-gray-200">{{ totalQuantity }}</td>
                        <td class="px-5 py-3 text-green-600">{{ totalAmount.toLocaleString() }} TZS</td>
                        <td colspan="3"></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import Back from '@/components/Back.vue'
import dayjs, { formatToNairobi } from '@/utils/dayjs'

const sales = ref([])
const searchTerm = ref('')
const isSyncing = ref(false)
const router = useRouter()

const startDate = ref('')
const endDate = ref('')

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
        callback();
    }
}

const fetchSales = async () => {
    sales.value = await window.electronAPI.getSales()
}

const goToEdit = (sale) => {
    router.push({
        name: 'SalesEdit',
        query: { id: sale.id },
    })
}

const deleteSale = async (id) => {
    const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: 'This will delete the sale.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
    })

    if (confirmed.isConfirmed) {
        await window.electronAPI.deleteSale(id)
        await fetchSales()
        Swal.fire('Deleted!', 'Sale has been deleted.', 'success')
    }
}

const syncSales = () => {
    confirmInternetAction(async () => {
        isSyncing.value = true;
        try {
            const result = await window.electronAPI.syncSalesToCloud();

            if (result.status === 'success') {
                await Swal.fire('Synced!', `${result.synced} sales uploaded to cloud.`, 'success');
                window.location.reload(); // Refresh page after successful sync
            } else if (result.status === 'no_data') {
                Swal.fire('No New Sales', result.message, 'info');
            } else {
                Swal.fire('Error', result.message, 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to sync sales.', 'error');
        } finally {
            isSyncing.value = false;
        }
    });
};

onMounted(fetchSales)

// Filter by search AND date
const filteredSales = computed(() => {
    return sales.value.filter(sale => {
        const matchesSearch =
            !searchTerm.value.trim() ||
            sale.product_name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
            String(sale.id).includes(searchTerm.value) ||
            String(sale.quantity_sold).includes(searchTerm.value) ||
            String(sale.total_cost).includes(searchTerm.value)

        const createdAt = dayjs(sale.created_at)

        const matchesDate =
            (!startDate.value || createdAt.isSameOrAfter(dayjs(startDate.value), 'day')) &&
            (!endDate.value || createdAt.isSameOrBefore(dayjs(endDate.value), 'day'))

        return matchesSearch && matchesDate
    })
})

const totalQuantity = computed(() => {
    return filteredSales.value.reduce((sum, sale) => sum + Number(sale.quantity_sold), 0)
})

const totalAmount = computed(() => {
    return filteredSales.value.reduce((sum, sale) => sum + Number(sale.total_cost), 0)
})
</script>
