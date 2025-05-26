<template>
    <div
        class="max-w-md p-8 mx-auto mt-8 bg-white shadow-lg dark:bg-gray-900 rounded-xl ring-1 ring-gray-200 dark:ring-gray-700">
        <h2 class="mb-6 text-3xl font-extrabold text-center text-gray-900 dark:text-gray-100">
            Register Pharmacy
        </h2>

        <form @submit.prevent="submitForm" class="space-y-6">
            <!-- Name -->
            <div>
                <label for="name" class="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Name <span class="text-red-500">*</span>
                </label>
                <input id="name" type="text" v-model="form.name" required placeholder="Enter pharmacy name"
                    class="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition duration-200 border border-gray-300 rounded-md dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <!-- Phone Number -->
            <div>
                <label for="phone" class="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Phone Number
                </label>
                <input id="phone" type="tel" v-model="form.phone_number" placeholder="+255 7XX XXX XXX"
                    class="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition duration-200 border border-gray-300 rounded-md dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <!-- Email -->
            <div>
                <label for="email" class="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email
                </label>
                <input id="email" type="email" v-model="form.email" placeholder="example@mail.com"
                    class="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition duration-200 border border-gray-300 rounded-md dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <!-- Address -->
            <div>
                <label for="address" class="block mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Address
                </label>
                <input id="address" type="text" v-model="form.address" placeholder="Physical location or street address"
                    class="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition duration-200 border border-gray-300 rounded-md dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <!-- Submit Button -->
            <button type="submit"
                class="w-full py-3 font-semibold text-white transition duration-300 rounded-md shadow-md bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300">
                Save
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

const form = ref({
    name: '',
    phone_number: '',
    email: '',
    address: '',
})

onMounted(() => {
    if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
})

const submitForm = async () => {
    try {
        const plainFormData = { ...form.value }

        const response = await window.electronAPI.addPharmacy(plainFormData)

        if (response.success) {
            Swal.fire('Success', 'Pharmacy registered successfully.', 'success')
            form.value = { name: '', phone_number: '', email: '', address: '' }

            // ✅ Navigate to the homepage
            router.push('/')
        }
    } catch (error) {
        console.error('Insert failed:', error)
        Swal.fire('Error', 'Failed to register pharmacy.', 'error')
    }
}
</script>
