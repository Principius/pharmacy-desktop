<template>
    <div class="max-w-6xl p-6 mx-auto">
        <Back />
        <div class="mt-4 mb-8">
            <div class="flex flex-wrap items-center gap-4 mb-4">
                <button @click="$router.push('/transfers/history')"
                    class="px-6 py-3 font-semibold text-white transition-all duration-200 bg-gray-600 rounded-xl hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600">
                    Transfer History
                </button>

                <button @click="$router.push('/transfers/pending')"
                    class="px-6 py-3 font-semibold text-white transition-all duration-200 bg-purple-600 rounded-xl hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
                    Pending Transfers
                </button>

                <button @click="$router.push('/transfers/rejected')"
                    class="px-6 py-3 font-semibold text-white transition-all duration-200 bg-purple-600 rounded-xl hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
                    Rejected Transfers
                </button>
            </div>

            <h2 class="mb-2 text-2xl font-bold text-gray-800 dark:text-black">Pharmacies (for transfer)</h2>
            <select v-model="toPharmacy"
                class="w-full p-3 text-gray-700 transition bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option disabled value="">Select a pharmacy</option>
                <option v-for="pharmacy in pharmacies" :key="pharmacy.id" :value="pharmacy.id">
                    {{ pharmacy.name }}
                </option>
            </select>
        </div>

        <div class="flex flex-wrap items-center gap-4 mb-10 sm:flex-nowrap sm:gap-6">

            <button @click="submitTransfer" :disabled="loading"
                class="flex items-center justify-center gap-2 px-6 py-3 ml-auto font-semibold text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-300">
                <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l5-5-5-5v4A12 12 0 002 12h2z" />
                </svg>
                <span>{{ loading ? 'Transferring...' : 'Transfer Selected Products' }}</span>
            </button>
        </div>

        <h2 class="mb-4 text-2xl font-bold text-gray-800 dark:text-black">Available Products</h2>

        <div class="overflow-auto rounded-lg shadow ring-1 ring-black/5 dark:ring-white/10">
            <table class="w-full text-sm text-left text-gray-800 dark:text-gray-200">
                <thead class="text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                    <tr>
                        <th class="p-3">Select</th>
                        <th class="p-3">Product Name</th>
                        <th class="p-3">Price (TZS)</th>
                        <th class="p-3">Available</th>
                        <th class="p-3">Quantity to Transfer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in products" :key="product.id"
                        class="transition border-t border-gray-200 dark:text-gray-800 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-400">
                        <td class="p-3">
                            <input type="checkbox" v-model="product.selected" :disabled="product.quantity_remained <= 0"
                                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500" />
                        </td>
                        <td class="p-3">{{ product.name }}</td>
                        <td class="p-3">{{ product.selling_price_per_unit.toLocaleString() }}</td>
                        <td class="p-3">{{ product.quantity_remained }}</td>
                        <td class="p-3">
                            <input type="number" v-model.number="product.transfer_quantity"
                                :disabled="!product.selected" min="1" :max="product.quantity_remained"
                                class="w-24 px-2 py-1 text-gray-800 transition bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import Back from '@/components/Back.vue';

const pharmacies = ref([]);
const products = ref([]);
const toPharmacy = ref('');
const loading = ref(false);

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

async function getStockTransfers() {
    try {
        return await window.electronAPI.getStockTransfers();
    } catch (err) {
        console.error('IPC error:', err);
        return { pharmacies: [], products: [], error: err.message };
    }
}

onMounted(async () => {
    const result = await getStockTransfers();
    pharmacies.value = result.pharmacies || [];
    products.value = (result.products || []).map(product => ({
        ...product,
        selected: false,
        transfer_quantity: null,
    }));
});

function submitTransfer() {
    confirmInternetAction(async () => {
        if (!toPharmacy.value) {
            Swal.fire('Error', 'Please select a destination pharmacy.', 'error');
            return;
        }

        const selectedProducts = products.value
            .filter(p => p.selected && p.transfer_quantity > 0)
            .map(p => ({
                product_id: p.id,
                quantity: p.transfer_quantity
            }));

        if (selectedProducts.length === 0) {
            Swal.fire('Error', 'Please select at least one product and enter quantity.', 'error');
            return;
        }

        loading.value = true;

        try {
            const result = await window.electronAPI.submitStockTransfer({
                to_pharmacy: toPharmacy.value,
                products: selectedProducts,
            });

            Swal.fire('Success', result.message, 'success');

            products.value.forEach(p => {
                p.selected = false;
                p.transfer_quantity = null;
            });
            toPharmacy.value = '';
        } catch (err) {
            Swal.fire('Error', err.message || 'Stock transfer failed.', 'error');
        } finally {
            loading.value = false;
        }
    });
}

</script>
