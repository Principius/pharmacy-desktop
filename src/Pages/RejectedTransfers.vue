<template>
    <div class="min-h-screen p-6 dark:bg-gray-900">
        <Back />
        <h1 class="mb-6 text-3xl font-bold text-gray-800 dark:text-gray-200">Rejected Stock Transfers</h1>

        <div v-if="transfers.length > 0" class="overflow-x-auto border rounded-lg shadow dark:border-gray-700">
            <table class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
                <thead class="bg-gray-100 dark:bg-gray-800">
                    <tr>
                        <th class="px-4 py-3">Product</th>
                        <th class="px-4 py-3">Batch No</th>
                        <th class="px-4 py-3">Quantity</th>
                        <th class="px-4 py-3">From</th>
                        <th class="px-4 py-3">To</th>
                        <th class="px-4 py-3">Date</th>
                        <th class="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="transfer in transfers" :key="transfer.id" class="border-t dark:border-gray-700">
                        <td class="px-4 py-2">{{ transfer.name }}</td>
                        <td class="px-4 py-2">{{ transfer.batch_no }}</td>
                        <td class="px-4 py-2">{{ transfer.quantity }}</td>
                        <td class="px-4 py-2">{{ transfer.from_pharmacy }}</td>
                        <td class="px-4 py-2">{{ transfer.to_pharmacy }}</td>
                        <td class="px-4 py-2">{{ new Date(transfer.created_at) }}</td>
                        <td class="px-4 py-2">
                            <button @click="returnBack(transfer.id)"
                                class="px-4 py-1 text-sm text-white bg-yellow-600 rounded hover:bg-yellow-700">
                                Return
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else class="mt-10 text-center text-gray-500 dark:text-gray-400">
            No rejected transfers found.
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Back from '@/components/Back.vue';
import Swal from 'sweetalert2';

const transfers = ref([]);

onMounted(async () => {
    const result = await window.electronAPI.getRejectedStockTransfers();
    if (!result.error) {
        transfers.value = result.transfers;
    } else {
        console.error(result.error);
    }
});

async function returnBack(id) {
    const confirm = await Swal.fire({
        title: 'Return Rejected Stock?',
        text: 'This will move the rejected stock back to the original pharmacy.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f59e0b',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, return it!',
    });

    if (!confirm.isConfirmed) return;

    const result = await window.electronAPI.returnRejectedStockTransfer(id);

    await Swal.fire({
        icon: result.status === 'success' ? 'success' : 'error',
        title: result.status === 'success' ? 'Returned!' : 'Failed!',
        text: result.message,
    });

    if (result.status === 'success') {
        transfers.value = transfers.value.filter((t) => t.id !== id);
    }
}
</script>
