<template>
    <div
        class="min-h-screen px-4 py-8 text-gray-800 transition-colors duration-300 bg-gray-100 dark:bg-gray-900 dark:text-gray-200">
        <div class="max-w-xl p-6 mx-auto bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
            <Back />
            <h1 class="mb-6 text-2xl font-bold text-center">📦 Import Products</h1>

            <div class="p-6 text-center transition border-2 border-gray-300 border-dashed cursor-pointer dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700"
                @click="$refs.fileInput.click()">
                <svg class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor"
                    stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M7 16V4m0 0L3 8m4-4l4 4m5 8v6m0 0l4-4m-4 4l-4-4" />
                </svg>
                <p class="mt-3 text-sm">Click to select an Excel file (<code>.xlsx</code>)</p>
                <input type="file" ref="fileInput" @change="handleFile" accept=".xlsx" class="hidden" />
                <p v-if="file" class="mt-2 text-sm text-green-600 dark:text-green-400">{{ file.name }}</p>
            </div>

            <div class="mt-6 text-center">
                <button @click="submit" :disabled="loading"
                    class="w-full px-6 py-3 font-semibold text-white transition duration-300 bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-blue-400">
                    <span v-if="!loading">Import Products</span>
                    <span v-else class="flex items-center justify-center space-x-2">
                        <svg class="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <span>Uploading...</span>
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import Back from '@/components/Back.vue';
import { ref } from 'vue';
import Swal from 'sweetalert2';

const file = ref(null);
const loading = ref(false);

const handleFile = (e) => {
    file.value = e.target.files[0];
};

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

const submit = () => {
  if (!file.value) {
    Swal.fire({
      icon: 'warning',
      title: 'No File Selected',
      text: 'Please select an Excel (.xlsx) file to upload.',
    });
    return;
  }

  confirmInternetAction(async () => {
    loading.value = true;

    const arrayBuffer = await file.value.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);

    try {
      const result = await window.electronAPI.importProducts({
        buffer: fileData,
        fileName: file.value.name,
      });

      if (result.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Upload Successful',
          text: result.message,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: result.message,
        });
      }
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to import products. Please try again.',
      });
    } finally {
      loading.value = false;
    }
  });
};

</script>
