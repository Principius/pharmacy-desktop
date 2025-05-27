<template>
  <div class="min-h-screen px-4 py-10 text-gray-800 transition-all bg-white dark:bg-gray-900 dark:text-gray-100">
    <div class="max-w-md p-6 mx-auto space-y-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <Back />

      <h1 class="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">Connect to Cloud</h1>
      <p class="text-sm text-center text-gray-600 dark:text-gray-400">
        Enter your cloud credentials to sync your data
      </p>

      <form @submit.prevent="submitLogin" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input v-model="email" type="email" placeholder="e.g. admin@example.com" required
            class="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>

        <!-- Password -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input v-model="password" type="password" placeholder="Your password" required
            class="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>

        <!-- Tenant Subdomain -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Tenant Subdomain</label>
          <input v-model="tenantSubdomain" type="text" placeholder="e.g. tenant1" required
            class="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>

        <!-- Device Name -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Device Name</label>
          <input v-model="deviceName" type="text" placeholder="e.g. Office PC" required
            class="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>

        <!-- Button -->
        <button type="submit" :disabled="loading"
          class="w-full py-3 font-semibold text-white transition-colors bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ loading ? 'Connecting...' : 'Send to Cloud' }}
        </button>

        <!-- Feedback -->
        <p v-if="error" class="text-sm text-center text-red-500">{{ error }}</p>
        <p v-if="success" class="text-sm text-center text-green-500">Connected to Cloud!</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import Back from '@/components/Back.vue'

const email = ref('')
const password = ref('')
const tenantSubdomain = ref('')
const deviceName = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(false)

async function submitLogin() {
  error.value = null
  success.value = false
  loading.value = true

  try {
    await window.electronAPI.cloudUser({
      email: email.value.trim(),
      password: password.value,
      tenantSubdomain: tenantSubdomain.value.trim(),
      deviceName: deviceName.value.trim(),
    })

    success.value = true

    // Show success message with only "Restart Now"
    await Swal.fire({
      icon: 'success',
      title: 'Connected to Cloud!',
      text: 'The app needs to restart for changes to take effect.',
      confirmButtonText: 'Restart Now',
      allowOutsideClick: false,
      allowEscapeKey: false,
    })

    await window.electronAPI.restartApp() // Will quit and relaunch

  } catch (err) {
    error.value = err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

