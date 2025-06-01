<template>
    <div class="max-w-6xl p-4 mx-auto text-gray-900 dark:text-gray-100">
        <div class="flex items-center justify-between mb-6">
            <Back />
            <h2 class="text-2xl font-semibold dark:text-gray-900">Expenses</h2>
            <button @click="showForm = true"
                class="px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700">
                Add Expense
            </button>
        </div>

        <ExpensesForm v-if="showForm" :expense="editData" @saved="onSaved"
            @cancel="() => { showForm = false; editData = null }" class="mb-6" />
        <button @click="syncExpenses"
            class="fixed z-50 px-4 py-2 text-white transition bg-indigo-600 rounded shadow-lg bottom-6 right-6 hover:bg-indigo-700">
            Sync to Cloud
        </button>

        <div class="overflow-x-auto bg-white rounded-lg shadow dark:bg-gray-800">

            <table class="min-w-full text-sm text-left">
                <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                    <tr>
                        <th class="px-6 py-3">Name</th>
                        <th class="px-6 py-3">Amount (TZS)</th>
                        <th class="px-6 py-3">Date</th>
                        <th class="px-6 py-3">Description</th>
                        <th class="px-6 py-3">Status</th>
                        <th class="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="expense in expenses" :key="expense.expense_uuid"
                        class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                            {{ expense.name }}
                        </td>
                        <td class="px-6 py-4 font-semibold text-green-600 dark:text-green-400">
                            {{ expense.amount }}
                        </td>
                        <td class="px-6 py-4 text-gray-700 dark:text-gray-300">
                            {{ expense.date }}
                        </td>
                        <td class="px-6 py-4 text-gray-700 dark:text-gray-300">
                            {{ expense.description || '—' }}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">
                            <span v-if="expense.is_synced" class="font-semibold text-green-500">✔ Synced</span>
                            <span v-else class="text-yellow-500">⏳ Pending</span>
                        </td>
                        <td class="px-6 py-4 space-x-2 text-right">
                            <button @click="editExpense(expense)" class="text-sm text-blue-600 hover:underline">
                                Edit
                            </button>
                            <button @click="deleteExpense(expense.expense_uuid)"
                                class="text-sm text-red-600 hover:underline">
                                Delete
                            </button>
                        </td>
                    </tr>
                    <tr v-if="expenses.length === 0">
                        <td colspan="5" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                            No expenses found.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ExpensesForm from '@/components/ExpensesForm.vue'
import Back from '@/components/Back.vue'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const expenses = ref([])
const showForm = ref(false)
const editData = ref(null)

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

async function fetchExpenses() {
    expenses.value = await window.electronAPI.readExpenses()
}

function onSaved() {
    showForm.value = false
    editData.value = null
    fetchExpenses()
}

function editExpense(expense) {
    editData.value = { ...expense }
    showForm.value = true
}

async function deleteExpense(id) {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#fff',
        color: document.documentElement.classList.contains('dark') ? '#f9fafb' : '#111827',
    })

    if (result.isConfirmed) {
        await window.electronAPI.deleteExpense(id)
        await fetchExpenses()
        Swal.fire({
            title: 'Deleted!',
            text: 'Expense has been deleted.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#f9fafb' : '#111827',
        })
    }
}

onMounted(fetchExpenses)

function syncExpenses() {
    confirmInternetAction(async () => {
        const result = await window.electronAPI.syncExpensesToCloud();

        if (result.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Sync Complete',
                text: `${result.synced} expenses synced to cloud.`,
            });
            fetchExpenses();
        } else if (result.status === 'no_data') {
            Swal.fire({
                icon: 'info',
                title: 'Nothing to Sync',
                text: result.message,
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Sync Failed',
                text: result.message,
            });
        }
    });
}


</script>
