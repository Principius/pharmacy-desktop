<template>
    <div
        class="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <div class="w-full max-w-md p-8 text-center bg-white shadow-xl rounded-2xl">
            <h1
                class="mb-6 text-4xl font-extrabold text-transparent transition-all duration-700 ease-in-out bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 animate-fade-in">
                {{ pharmacyName }}
            </h1>


            <form @submit.prevent="handleLogin" class="space-y-5 text-left">
                <label class="block">
                    <span class="font-semibold text-gray-700">Email</span>
                    <input v-model="email" type="email" required placeholder="you@example.com"
                        class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:border-purple-500 focus:ring focus:ring-purple-300 focus:ring-opacity-50" />
                </label>

                <label class="block">
                    <span class="font-semibold text-gray-700">Password</span>
                    <input v-model="password" type="password" required placeholder="Enter your password"
                        class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:border-purple-500 focus:ring focus:ring-purple-300 focus:ring-opacity-50" />
                </label>

                <button type="submit"
                    class="w-full py-3 font-semibold text-white transition bg-purple-600 hover:bg-purple-700 rounded-xl">
                    Login
                </button>
                <!-- Contact & Footer -->
                <p class="mt-4 text-center text-gray-600 dark:text-gray-400">
                    Contact: <a href="tel:+225653951700" class="text-indigo-600 dark:text-indigo-400">+225 653 951
                        700</a>
                </p>

                <p class="mt-2 text-center text-gray-600 dark:text-gray-400">
                    &copy; {{ currentYear }} Automate-XT All rights reserved.
                </p>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const email = ref('')
const password = ref('')
const pharmacyName = ref('Pharmacy')
const router = useRouter()

onMounted(async () => {
  try {
    const result = await window.electronAPI.getPharmacyData?.()
    if (result?.name) pharmacyName.value = result.name.toUpperCase()
  } catch (error) {
    console.error('Failed to load pharmacy name:', error)
  }
})

async function handleLogin() {
  try {
    const response = await window.electronAPI.loginUser({
      email: email.value,
      password: password.value,
    })

    const user = response.user?.user || response.user

    if (response.success && user) {
      localStorage.setItem('user', JSON.stringify(user))

      await Swal.fire({
        title: `Welcome, ${user.name || user.email}!`,
        icon: 'success',
        confirmButtonText: 'Continue',
      })

      router.push({ name: 'Dashboard' })
    } else {
      Swal.fire('Login Failed', response.error || 'An error occurred.', 'error')
    }
  } catch (error) {
    Swal.fire('Error', error.message || 'Unexpected error occurred.', 'error')
  }
}
</script>
