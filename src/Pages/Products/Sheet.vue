<template>
    <div
        class="max-w-2xl p-6 mx-auto mt-8 space-y-6 text-gray-800 transition-colors duration-300 bg-white shadow-lg rounded-2xl dark:bg-gray-900 dark:text-gray-100">
        <Back />

        <!-- Workflow Guide -->
        <div
            class="p-4 text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-lg shadow-sm dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700">
            <h2 class="mb-1 text-lg font-semibold">Stock Taking Workflow</h2>
            <ol class="space-y-1 text-sm list-decimal list-inside">
                <li>Click <strong>"Sync Products to Sheet"</strong> to upload your current product data to Google Sheet.
                </li>
                <li>Click <strong>"Open Google Sheet"</strong> to perform stock taking or edit stock values in the
                    sheet.</li>
                <li>Once done, click <strong>"Sync Sheet to Products"</strong> to apply the changes back to your system.
                </li>
            </ol>
        </div>

        <!-- Sync Buttons Section -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button @click="syncProducts" :disabled="loadingProducts"
                class="px-4 py-2 rounded-lg font-medium transition hover:scale-[1.02] duration-200 disabled:opacity-60 disabled:cursor-not-allowed bg-green-600 text-white hover:bg-green-700">
                {{ loadingProducts ? 'Syncing...' : 'Sync Products to Sheet' }}
            </button>

            <button @click="openSheet" :disabled="sheetLoading"
                class="px-4 py-2 rounded-lg font-medium transition hover:scale-[1.02] duration-200 disabled:opacity-60 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700">
                {{ sheetLoading ? 'Opening...' : 'Open Google Sheet' }}
            </button>

            <button @click="syncSheet" :disabled="loadingSheetToProducts"
                class="px-4 py-2 rounded-lg font-medium transition hover:scale-[1.02] duration-200 disabled:opacity-60 disabled:cursor-not-allowed bg-indigo-600 text-white hover:bg-indigo-700">
                {{ loadingSheetToProducts ? 'Syncing...' : 'Sync Sheet to Products' }}
            </button>
        </div>

        <!-- Feedback Message -->
        <p v-if="message" :class="success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
            class="mt-4 text-sm font-medium">
            {{ message }}
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import Back from '@/components/Back.vue';

const loadingProducts = ref(false);
const loadingSheetToProducts = ref(false);
const sheetLoading = ref(false);

const message = ref('');
const success = ref(false);

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

function syncProducts() {
    confirmInternetAction(async () => {
        loadingProducts.value = true;
        message.value = '';
        success.value = false;

        try {
            const result = await window.electronAPI.syncProductsToSheet();
            message.value = result.message;
            success.value = result.success;

            Swal.fire({
                icon: result.success ? 'success' : 'error',
                title: result.success ? 'Synced!' : 'Sync Failed',
                text: result.message,
            });
        } catch (error) {
            console.error(error);
            message.value = 'Unexpected error occurred.';
            Swal.fire('Error', 'Unexpected error occurred.', 'error');
        } finally {
            loadingProducts.value = false;
        }
    });
}

function syncSheet() {
    confirmInternetAction(async () => {
        loadingSheetToProducts.value = true;
        message.value = '';
        success.value = false;

        try {
            const result = await window.electronAPI.syncSheetToProducts();
            message.value = result.message;
            success.value = result.success;

            Swal.fire({
                icon: result.success ? 'success' : 'error',
                title: result.success ? 'Synced!' : 'Failed',
                text: result.message,
            });
        } catch (error) {
            console.error(error);
            message.value = 'Unexpected error occurred.';
            Swal.fire('Error', 'Unexpected error occurred.', 'error');
        } finally {
            loadingSheetToProducts.value = false;
        }
    });
}

function openSheet() {
    confirmInternetAction(async () => {
        sheetLoading.value = true;

        try {
            const result = await window.electronAPI.openGoogleSheet();
            Swal.fire({
                icon: result.success ? 'success' : 'error',
                title: result.success ? 'Opened!' : 'Failed',
                text: result.message,
            });
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to open the Google Sheet.', 'error');
        } finally {
            sheetLoading.value = false;
        }
    });
}

</script>
