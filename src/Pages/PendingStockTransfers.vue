<template>
  <div class="p-6 space-y-6">
    <Back />
    <h1 class="text-3xl font-bold text-gray-900 dark:text-black">Pending Stock Transfers</h1>

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
            <th class="px-4 py-3 text-sm font-semibold text-left">Action</th>
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
                class="inline-block px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full dark:bg-yellow-800 dark:text-yellow-100"
              >
                {{ transfer.status }}
              </span>
            </td>
            <td class="flex gap-2 px-4 py-3 text-sm">
    <button
      @click="approve(transfer.id)"
      class="px-3 py-1 text-green-600 transition duration-200 border border-green-600 rounded hover:text-white hover:bg-green-600"
    >
      Approve
    </button>
    <button
      @click="reject(transfer.id)"
      class="px-3 py-1 text-red-600 transition duration-200 border border-red-600 rounded hover:text-white hover:bg-red-600"
    >
      Reject
    </button>
  </td>
            <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{{ new Date(transfer.created_at) }}</td>
          </tr>
          <tr v-if="transfers.length === 0">
            <td colspan="7" class="px-4 py-6 text-center text-gray-600 dark:text-gray-400">
              No pending transfers available.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import Back from '@/components/Back.vue';

const transfers = ref([]);

onMounted(async () => {
  const result = await window.electronAPI.getPendingStockTransfers();
  if (!result.error) {
    transfers.value = result.transfers;
  } else {
    console.error(result.error);
  }
});

async function approve(id) {
  const { isConfirmed } = await Swal.fire({
    title: 'Approve Transfer?',
    text: 'Are you sure you want to approve this stock transfer?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, approve it!',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#2563EB',
    cancelButtonColor: '#6B7280',
  });

  if (!isConfirmed) return;

  const result = await window.electronAPI.approveStockTransfer(id);

  await Swal.fire({
    title: result.status === 'success' ? 'Approved!' : 'Error!',
    text: result.message,
    icon: result.status === 'success' ? 'success' : 'error',
    timer: 2500,
    showConfirmButton: false,
  });

  if (result.status === 'success') {
    transfers.value = transfers.value.filter((t) => t.id !== id);
  }
}

async function reject(id) {
  const { isConfirmed } = await Swal.fire({
    title: 'Reject Transfer?',
    text: 'Are you sure you want to reject this stock transfer?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, reject it!',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#DC2626',
    cancelButtonColor: '#6B7280',
  });

  if (!isConfirmed) return;

  const result = await window.electronAPI.rejectStockTransfer(id);

  await Swal.fire({
    title: result.status === 'success' ? 'Rejected!' : 'Error!',
    text: result.message,
    icon: result.status === 'success' ? 'success' : 'error',
    timer: 2500,
    showConfirmButton: false,
  });

  if (result.status === 'success') {
    transfers.value = transfers.value.filter(t => t.id !== id);
  }
}
</script>

