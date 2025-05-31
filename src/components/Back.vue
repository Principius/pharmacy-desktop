<template>
  <button @click="goBack"
    class="inline-flex items-center justify-center px-5 py-2 mt-2 text-sm font-semibold text-white transition-all duration-300 rounded-md shadow bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:from-purple-600 dark:to-purple-800 dark:hover:from-purple-700 dark:hover:to-purple-900">
    ← Go Back
  </button>
</template>

<script>
export default {
  methods: {
    goBack() {
      window.history.back()
    }
  }
}
</script>
