


<template>
  <div class="min-h-screen px-4 py-10 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
    <div class="max-w-2xl p-10 mx-auto text-center bg-white shadow-2xl rounded-3xl">
      <h1 class="mb-6 text-4xl font-bold text-gray-800">Welcome to the Dashboard</h1>
      <p class="text-xl text-gray-600">Hello, {{ name }}!</p>

      <button @click="logout"
        class="px-6 py-2 mt-10 font-semibold text-white transition bg-red-500 rounded-xl hover:bg-red-600">
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const name = route.params.name

function logout() {
  router.push('/login')
}
</script>
