<template>
    <div class="p-6 mx-auto max-w-7xl">
        <Back />

        <h2 class="mb-6 text-3xl font-bold text-gray-800 dark:text-gray-900">User Permissions Management</h2>

        <div class="overflow-x-auto rounded-lg shadow-md">
            <table class="min-w-full text-sm text-left border border-gray-200 dark:border-gray-700">
                <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-300">
                    <tr>
                        <th class="px-4 py-3 border dark:border-gray-700">Name</th>
                        <th class="px-4 py-3 border dark:border-gray-700"  v-if="user?.permissions?.includes('canAccessReports')">Email</th>
                        <th class="px-4 py-3 border dark:border-gray-700">Permissions</th>
                        <th class="px-4 py-3 text-center border dark:border-gray-700">Action</th>
                    </tr>
                </thead>

                <tbody class="bg-white dark:bg-gray-900">
                    <tr v-for="user in users" :key="user.id"
                        class="transition duration-200 border-t border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700">
                        <td class="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{{ user.name }}</td>
                        <td class="px-4 py-3 text-gray-600 dark:text-gray-300"  v-if="user?.permissions?.includes('canAccessReports')">{{ user.email }}</td>

                        <td class="px-4 py-3">
                            <div v-for="perm in availablePermissions" :key="perm"
                                class="flex items-center mb-2 space-x-2 text-gray-700 dark:text-gray-300">
                                <input type="checkbox" :checked="user.permissions.includes(perm)"
                                    @change="togglePermission(user, perm)"
                                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" />
                                <label class="text-sm">{{ formatLabel(perm) }}</label>
                            </div>
                        </td>

                        <td class="px-4 py-3 text-center">
                            <button @click="savePermissions(user)"
                                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition duration-150 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700">
                                Save
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import Back from '@/components/Back.vue'

const users = ref([])

const availablePermissions = [
    'canManageUsers',
    'canEditSales',
    'canDeleteSales',
    'canAddExpenses',
    'canAllowDiscount',
    'canChangePermissions',
    'canSyncProducts',
    'canEditExpenses',
    'canDeleteExpenses',
    'canSeeRevenueGraphs',
    'canEditPrices',
    'canSyncSales',
    'canSyncExpenses',
    'canSyncDebtors',
]

const togglePermission = (user, perm) => {
    const index = user.permissions.indexOf(perm)
    if (index > -1) {
        user.permissions.splice(index, 1)
    } else {
        user.permissions.push(perm)
    }
}

const savePermissions = async (user) => {
    try {
        const plainPermissions = [...user.permissions]
        await window.electronAPI.updateUserPermissions(user.id, plainPermissions)
        Swal.fire('Saved!', `Permissions for ${user.name} updated.`, 'success')
    } catch (error) {
        console.error('Update Error:', error)
        Swal.fire('Error', `Failed to update permissions for ${user.name}.`, 'error')
    }
}

const formatLabel = (perm) => {
    return perm.replace(/([a-z])([A-Z])/g, '$1 $2')
}

onMounted(async () => {
    try {
        const fetched = await window.electronAPI.getUsers()
        users.value = fetched.map((u) => ({
            ...u,
            permissions: typeof u.permissions === 'string'
                ? JSON.parse(u.permissions || '[]')
                : (u.permissions || []),
        }))
    } catch (error) {
        console.error('Failed to fetch users:', error)
        Swal.fire('Error', 'Failed to load users.', 'error')
    }
})
</script>

<style scoped>
/* Optional: ensure table has center-aligned action buttons */
table th,
table td {
    vertical-align: middle;
}
</style>
