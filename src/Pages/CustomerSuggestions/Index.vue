<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import Back from '@/components/Back.vue';

const suggestions = ref([]);
const loading = ref(false);
const showModal = ref(false);
const newSuggestion = ref({ name: '', email: '', message: '' });

async function fetchSuggestions() {
    loading.value = true;
    try {
        suggestions.value = await window.electronAPI.readCustomerSuggestions();
    } catch (err) {
        Swal.fire('Error', err.message || 'Failed to load suggestions', 'error');
    } finally {
        loading.value = false;
    }
}

async function addSuggestion() {
    if (!newSuggestion.value.name || !newSuggestion.value.message) {
        Swal.fire('Validation', 'Name and message are required', 'warning');
        return;
    }

    try {
        const plainSuggestion = JSON.parse(JSON.stringify(newSuggestion.value));
        await window.electronAPI.createCustomerSuggestion(plainSuggestion);
        Swal.fire('Success', 'Suggestion added!', 'success');
        newSuggestion.value = { name: '', email: '', message: '' };
        showModal.value = false;
        await fetchSuggestions();
    } catch (err) {
        Swal.fire('Error', err.message || 'Failed to add suggestion', 'error');
    }
}

async function deleteSuggestion(id) {
    const result = await Swal.fire({
        title: 'Delete this suggestion?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
    });
    if (result.isConfirmed) {
        try {
            await window.electronAPI.deleteCustomerSuggestion(id);
            Swal.fire('Deleted', 'Suggestion deleted', 'success');
            await fetchSuggestions();
        } catch (err) {
            Swal.fire('Error', err.message || 'Failed to delete', 'error');
        }
    }
}

onMounted(fetchSuggestions);
</script>

<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white px-4 py-8">
        <div class="mb-4 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <Back />
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold text-blue-600 dark:text-blue-400">Customer Suggestions</h1>
                <button @click="showModal = true"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                    New Suggestion
                </button>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-8">
                <svg class="w-6 h-6 animate-spin mx-auto text-blue-600 dark:text-blue-400" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <p class="mt-2 text-gray-600 dark:text-gray-400">Loading suggestions...</p>
            </div>

            <!-- Suggestions Table -->
            <div v-else>
                <table class="w-full text-left border-collapse rounded overflow-hidden">
                    <thead class="bg-gray-200 dark:bg-gray-700">
                        <tr>
                            <th class="px-4 py-2 font-semibold text-sm">Name</th>
                            <th class="px-4 py-2 font-semibold text-sm">Email</th>
                            <th class="px-4 py-2 font-semibold text-sm">Message</th>
                            <th class="px-4 py-2 font-semibold text-sm text-center">Synced</th> <!-- ✅ Added -->
                            <th class="px-4 py-2 font-semibold text-sm text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="sugg in suggestions" :key="sugg.id"
                            class="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                            <td class="px-4 py-3">{{ sugg.name }}</td>
                            <td class="px-4 py-3">{{ sugg.email || '-' }}</td>
                            <td class="px-4 py-3">{{ sugg.message }}</td>

                            <!-- ✅ New Synced Cell -->
                            <td class="px-4 py-3 text-center">
                                <span :class="sugg.is_synced ? 'text-green-600' : 'text-yellow-600'"
                                    :title="sugg.is_synced ? 'Synced' : 'Not Synced'">
                                    {{ sugg.is_synced ? '✔' : '✘' }}
                                </span>
                            </td>

                            <td class="px-4 py-3 text-center">
                                <button @click="deleteSuggestion(sugg.id)"
                                    class="text-red-600 hover:underline font-semibold">
                                    Delete
                                </button>
                            </td>
                        </tr>

                        <tr v-if="suggestions.length === 0">
                            <td colspan="5" class="text-center py-6 text-gray-500 italic">No suggestions yet.</td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
                <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-white">Add Suggestion</h2>
                <form @submit.prevent="addSuggestion" class="space-y-4">
                    <div>
                        <label class="block font-semibold mb-1">Name <span class="text-red-500">*</span></label>
                        <input v-model="newSuggestion.name" type="text" required
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring focus:ring-blue-400" />
                    </div>
                    <div>
                        <label class="block font-semibold mb-1">Email</label>
                        <input v-model="newSuggestion.email" type="email"
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring focus:ring-blue-400" />
                    </div>
                    <div>
                        <label class="block font-semibold mb-1">Message <span class="text-red-500">*</span></label>
                        <textarea v-model="newSuggestion.message" rows="3" required
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring focus:ring-blue-400"></textarea>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" @click="showModal = false"
                            class="px-4 py-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600">
                            Cancel
                        </button>
                        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
