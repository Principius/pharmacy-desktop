<template>
  <div v-if="visible" class="fixed z-50 p-6 bg-white border border-gray-200 shadow-xl bottom-4 right-4 dark:bg-gray-800 rounded-xl w-96 dark:border-gray-700">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-black">🔄 New Update Available</h2>
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-700">
      Version {{ version }} is available. Click below to download.
    </p>
    <div v-if="progress > 0" class="mt-4">
      <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div class="bg-blue-600 h-2.5 rounded-full transition-all" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="mt-1 text-xs text-gray-500">{{ progress }}%</p>
    </div>
    <div v-else class="flex gap-2 mt-4">
      <button @click="downloadUpdate" class="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Download</button>
      <button @click="visible = false" class="text-gray-500 hover:text-gray-700">Later</button>
    </div>
    <div v-if="downloaded" class="flex justify-end mt-4">
      <button @click="restartApp" class="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">Restart Now</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(false)
const version = ref('')
const progress = ref(0)
const downloaded = ref(false)

onMounted(() => {
  window.electronAPI.onUpdateAvailable((_event, info) => {
    visible.value = true
    version.value = info.version
  })

  window.electronAPI.onUpdateProgress((_event, progressObj) => {
    progress.value = Math.round(progressObj.percent)
  })

  window.electronAPI.onUpdateDownloaded(() => {
    downloaded.value = true
  })
})

function downloadUpdate() {
  window.electronAPI.requestUpdateDownload()
}

function restartApp() {
  window.electronAPI.restartApp()
}
</script>
