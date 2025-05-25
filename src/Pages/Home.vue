<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500"
  >
    <div class="w-full max-w-md p-10 text-center bg-white shadow-xl rounded-2xl">
      <h1 class="mb-6 text-3xl font-bold text-gray-800">Pharmacy Management</h1>
      <p class="mb-10 text-gray-600">Welcome! Please register or login to continue.</p>

      <div class="flex justify-center space-x-4">
        <button
          @click="goToRegister"
          class="px-6 py-3 font-semibold text-white transition bg-blue-500 rounded-xl hover:bg-blue-600"
        >
          Register
        </button>

        <button
          @click="goToLogin"
          class="px-6 py-3 font-semibold text-white transition bg-green-500 rounded-xl hover:bg-green-600"
        >
          Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToRegister = () => {
  console.log('goToRegister called')
  console.log('Router instance:', router)
  router.push('/register')
    .then(() => console.log('Navigation to /register succeeded'))
    .catch(err => console.error('Navigation to /register failed:', err))
}

const goToLogin = () => {
  console.log('goToLogin called')
  console.log('Router instance:', router)
  router.push('/login')
    .then(() => console.log('Navigation to /login succeeded'))
    .catch(err => console.error('Navigation to /login failed:', err))
}
</script>

