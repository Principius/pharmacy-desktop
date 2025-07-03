<template>
  <div class="p-6 space-y-6">
    <Back />
    <h1 class="text-3xl font-bold text-gray-900 dark:text-black">Stock Transfer History</h1>

    <div class="overflow-x-auto rounded-lg shadow ring-1 ring-gray-200 dark:ring-gray-700">
      <table class="min-w-full bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
        <thead class="text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
          <tr>
            <th class="px-4 py-3 text-sm font-semibold text-left">Product</th>
            <th class="px-4 py-3 text-sm font-semibold text-left">Batch No</th>
            <th class="px-4 py-3 text-sm font-semibold text-left">Quantity</th>
            <th class="px-4 py-3 text-sm font-semibold text-left">From</th>
            <th class="px-4 py-3 text-sm font-semibold text-left">To</th>
            <th class="px-4 py-3 text-sm font-semibold text-left">Status</th>
            <th class="px-4 py-3 text-sm font-semibold text-left">Date</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr
            v-for="transfer in transfers"
            :key="transfer.id"
            class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{{ transfer.name }}</td>
            <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{{ transfer.batch_no }}</td>
            <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{{ transfer.quantity }}</td>
            <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{{ transfer.from_pharmacy }}</td>
            <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{{ transfer.to_pharmacy }}</td>
            <td class="px-4 py-3 text-sm font-medium">
              <span
                class="inline-block px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100': transfer.status === 'approved',
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100': transfer.status === 'pending',
                  'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100': transfer.status === 'returned'
                }"
              >
                {{ transfer.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{{ new Date(transfer.created_at) }}</td>
          </tr>
          <tr v-if="transfers.length === 0">
            <td colspan="7" class="px-4 py-6 text-center text-gray-600 dark:text-gray-400">
              No transfer history available.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Back from '@/components/Back.vue';

const transfers = ref([]);

onMounted(async () => {
  const result = await window.electronAPI.getStockTransferHistory();
  if (!result.error) {
    transfers.value = result.transfers;
  } else {
    console.error(result.error);
  }
});
</script>
