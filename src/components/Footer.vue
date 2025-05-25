<template>
    <footer class="p-4 py-4 text-white transition duration-300 transform bg-gray-800 rounded shadow-md dark:bg-gray-800 hover:scale-105">
        <div class="container flex flex-col items-center mx-auto space-y-4">
            <!-- Footer Details -->
            <div class="space-y-2 text-center">
                <p class="text-sm">© {{ currentYear }} {{ appName }}. All Rights Reserved.</p>
                <p class="text-sm">Phone: +255 623 827 005</p>
                <p class="text-sm">Address: 65001 Dar es Salaam, Tanzania</p>
                <p class="text-sm">Email: automatextinfo@gmail.com</p>
            </div>
            <div class="mt-4">
                 <PushNotification />
            </div>
        </div>
    </footer>
</template>


<script setup>
import PushNotification from './PushNotification.vue';


const currentYear = new Date().getFullYear();
const appName = "Automate-XT"; // Replace with the actual name of your app
</script>

<style scoped>
footer {
    font-size: 14px;
}
</style>
