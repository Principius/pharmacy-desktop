<template>
    <form @submit.prevent="submit" class="p-6 space-y-4 bg-gray-100 rounded-lg shadow dark:bg-gray-900">
        <div>
            <label class="block mb-1 text-sm font-medium">Name</label>
            <input v-model="form.name" required
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Expense name" />
        </div>

        <div>
            <label class="block mb-1 text-sm font-medium">Amount (TZS)</label>
            <input type="number" v-model.number="form.amount" required
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00" />
        </div>

        <div>
            <label class="block mb-1 text-sm font-medium">Date</label>
            <input type="date" v-model="form.date" required
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
            <label class="block mb-1 text-sm font-medium">Description</label>
            <textarea v-model="form.description"
                class="w-full px-3 py-2 bg-white border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional description" rows="3"></textarea>
        </div>

        <div class="flex justify-end gap-3 mt-4">
            <button type="submit" class="px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700">
                {{ form.expense_uuid ? 'Update' : 'Create' }}
            </button>
            <button type="button" @click="$emit('cancel')"
                class="px-4 py-2 text-gray-800 transition bg-gray-300 rounded dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-600">
                Cancel
            </button>
        </div>
    </form>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({ expense: Object })
const emit = defineEmits(['saved', 'cancel'])

const form = reactive({
    expense_uuid: null,
    user_id: 1,
    name: '',
    amount: 0,
    date: '',
    description: '',
})

watch(
    () => props.expense,
    (newExpense) => {
        if (newExpense) Object.assign(form, newExpense)
        else {
            form.expense_uuid = null
            form.name = ''
            form.amount = 0
            form.date = ''
            form.description = ''
        }
    },
    { immediate: true }
)

async function submit() {
    if (!form.expense_uuid) {
        form.expense_uuid = uuidv4()
        await window.electronAPI.createExpense({ ...form })
    } else {
        await window.electronAPI.updateExpense(form.expense_uuid, { ...form })
    }
    emit('saved')
}
</script>
