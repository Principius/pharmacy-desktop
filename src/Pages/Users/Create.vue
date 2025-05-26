<template>
    <div class="max-w-5xl p-6 mx-auto text-gray-800 dark:text-gray-900">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Back />
            <h1 class="text-3xl font-bold">User Management</h1>
            <!-- Add New User Button -->
            <button v-if="!showForm" @click="openNewUserForm"
                class="px-5 py-2 text-white transition duration-200 bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400">
                Add New User
            </button>
        </div>

        <!-- Search Box -->
        <div class="mb-6">
            <input v-model="search" type="text" placeholder="Search by name, email, or role..."
                class="w-full px-4 py-2 text-sm transition duration-200 bg-white border rounded-lg shadow-sm dark:text-gray-200 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>

        <!-- User Form -->
        <form v-if="showForm" @submit.prevent="handleSubmit"
            class="p-6 mb-8 space-y-5 duration-300 bg-white shadow-md traknsition dark:text-gray-200 rounded-xl dark:bg-gray-900">
            <div>
                <label class="block mb-1 font-semibold">Name</label>
                <input v-model="form.name" required
                    class="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
                <label class="block mb-1 font-semibold">Email</label>
                <input v-model="form.email" type="email" required
                    class="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div>
                <label class="block mb-1 font-semibold">Role</label>
                <input v-model="form.role" required
                    class="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div v-if="!form.id">
                <label class="block mb-1 font-semibold">Password</label>
                <input v-model="form.password" type="password" required
                    class="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700" />
            </div>

            <div class="flex items-center space-x-3">
                <button type="submit"
                    class="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    {{ form.id ? 'Update User' : 'Create User' }}
                </button>
                <button @click="cancelForm" type="button"
                    class="px-5 py-2 text-gray-800 transition bg-gray-200 rounded-lg hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                    Cancel
                </button>
            </div>
        </form>

        <!-- Users Table -->
        <div class="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
            <table class="w-full text-left border-collapse table-auto">
                <thead class="bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                    <tr>
                        <th class="px-4 py-3 text-sm font-semibold border dark:border-gray-700">#</th>
                        <th class="px-4 py-3 text-sm font-semibold border dark:border-gray-700">Name</th>
                        <th class="px-4 py-3 text-sm font-semibold border dark:border-gray-700">Email</th>
                        <th class="px-4 py-3 text-sm font-semibold border dark:border-gray-700">Role</th>
                        <th class="px-4 py-3 text-sm font-semibold border dark:border-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in filteredUsers" :key="user.id"
                        class="transition hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                        <td class="px-4 py-3 border dark:border-gray-700">{{ index + 1 }}</td>
                        <td class="px-4 py-3 border dark:border-gray-700">{{ user.name }}</td>
                        <td class="px-4 py-3 border dark:border-gray-700">{{ user.email }}</td>
                        <td class="px-4 py-3 border dark:border-gray-700">{{ user.role }}</td>
                        <td class="px-4 py-3 space-x-2 border dark:border-gray-700">
                            <button @click="editUser(user)"
                                class="px-3 py-1 text-sm text-white transition bg-yellow-500 rounded hover:bg-yellow-600">
                                Edit
                            </button>
                            <button @click="confirmDelete(user.id)"
                                class="px-3 py-1 text-sm text-white transition bg-red-600 rounded hover:bg-red-700">
                                Delete
                            </button>
                        </td>
                    </tr>
                    <tr v-if="users.length === 0">
                        <td colspan="5" class="py-4 text-center text-gray-500 dark:text-gray-400">No users found</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Swal from 'sweetalert2';
import Back from '@/components/Back.vue';

const users = ref([]);
const search = ref('');
const showForm = ref(false);

const form = ref({
    id: null,
    name: '',
    email: '',
    password: '',
    role: '',
});

const resetForm = () => {
    form.value = {
        id: null,
        name: '',
        email: '',
        password: '',
        role: '',
    };
};

const filteredUsers = computed(() => {
    const query = search.value.toLowerCase();
    return users.value.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
});

const openNewUserForm = () => {
    resetForm();
    showForm.value = true;
};

const cancelForm = () => {
    resetForm();
    showForm.value = false;
};

const fetchUsers = async () => {
    users.value = await window.electronAPI.getUsers();
};

const handleSubmit = async () => {
    try {
        if (form.value.id) {
            await window.electronAPI.updateUser(form.value.id, {
                name: form.value.name,
                email: form.value.email,
                role: form.value.role,
            });
            Swal.fire('Updated!', 'User updated successfully.', 'success');
        } else {
            await window.electronAPI.createUser({
                name: form.value.name,
                email: form.value.email,
                password: form.value.password,
                role: form.value.role,
            });
            Swal.fire('Created!', 'User created successfully.', 'success');
        }
        resetForm();
        showForm.value = false;
        fetchUsers();
    } catch (err) {
        Swal.fire('Error', err.message || 'Something went wrong', 'error');
    }
};

const editUser = (user) => {
    form.value = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
    };
    showForm.value = true;
};

const confirmDelete = (id) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e3342f',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
        if (result.isConfirmed) {
            await window.electronAPI.deleteUser(id);
            await fetchUsers();
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
        }
    });
};

onMounted(() => {
    fetchUsers();
});
</script>
