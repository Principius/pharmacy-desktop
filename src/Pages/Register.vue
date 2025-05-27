<template>
    <div
        class="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <div class="w-full max-w-md p-8 text-center bg-white shadow-xl rounded-2xl">
            <h1 class="mb-6 text-3xl font-bold text-gray-800">Register</h1>

            <form @submit.prevent="handleRegister" class="space-y-5 text-left">
                <label class="block">
                    <span class="font-semibold text-gray-700">Name</span>
                    <input v-model="name" type="text" required placeholder="Your full name"
                        class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:border-purple-500 focus:ring focus:ring-purple-300 focus:ring-opacity-50" />
                </label>

                <label class="block">
                    <span class="font-semibold text-gray-700">Email</span>
                    <input v-model="email" type="email" required placeholder="you@example.com"
                        class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:border-purple-500 focus:ring focus:ring-purple-300 focus:ring-opacity-50" />
                </label>

                <label class="block">
                    <span class="font-semibold text-gray-700">Phone</span>
                    <input v-model="phone" type="tel" placeholder="+255 7XX XXX XXX"
                        class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:border-purple-500 focus:ring focus:ring-purple-300 focus:ring-opacity-50" />
                </label>

                <label class="block">
                    <span class="font-semibold text-gray-700">Role</span>
                    <input v-model="role" required placeholder="Enter role"
                        class="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md focus:border-purple-500 focus:ring focus:ring-purple-300 focus:ring-opacity-50">
                </label>

                <label class="block">
                    <span class="font-semibold text-gray-700">Password</span>
                    <input v-model="password" type="password" required placeholder="Enter password"
                        class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:border-purple-500 focus:ring focus:ring-purple-300 focus:ring-opacity-50" />
                </label>

                <button type="submit"
                    class="w-full py-3 font-semibold text-white transition bg-purple-600 hover:bg-purple-700 rounded-xl">
                    Register
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import Swal from 'sweetalert2'
import { ref } from 'vue'
import { useRouter } from 'vue-router' // Import Vue Router

const router = useRouter()

const name = ref('')
const email = ref('')
const phone = ref('')
const role = ref('')
const password = ref('')

async function handleRegister() {
    const userData = {
        name: name.value,
        email: email.value,
        phone: phone.value,
        role: role.value,
        password: password.value,
    }

    try {
        const response = await window.electronAPI.registerUser(userData)

        if (response.success) {
            await Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'User registered successfully.',
                timer: 2000,
                showConfirmButton: false,
            })

            // Redirect to homepage
            router.push('/')

            // Optional: Reset form (if not redirecting to a different page)
            name.value = ''
            email.value = ''
            phone.value = ''
            role.value = ''
            password.value = ''
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: response.error || 'An unknown error occurred.',
            })
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Something went wrong.',
        })
    }
}
</script>
