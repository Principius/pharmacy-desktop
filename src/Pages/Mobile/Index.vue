<template>
    <div
        class="max-w-5xl p-8 mx-auto my-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl transition-all duration-300">
        <Back />
        <!-- Header -->
        <h1 class="mt-4 mb-6 text-4xl font-extrabold tracking-tight text-center text-purple-700 dark:text-purple-400">
            Want a Website or Mobile App for Your Business?
        </h1>

        <!-- Intro Paragraph -->
        <p class="max-w-3xl mx-auto mb-10 text-lg text-center text-gray-700 dark:text-gray-300">
            We can help you grow your  business with a custom-built
            <span class="font-semibold text-blue-600 dark:text-blue-400">mobile app</span> and
            <span class="font-semibold text-green-600 dark:text-green-400">website</span>.
            With our tech solutions, you'll reach more customers, streamline operations, and boost your brand online.
        </p>

        <!-- Benefit Cards -->
        <div class="grid gap-6 md:grid-cols-2">
            <!-- Website Benefits -->
            <div
                class="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg hover:border-purple-500 transition">
                <h2 class="mb-4 text-xl font-semibold text-green-700 dark:text-green-400">
                    🌐 Why Your Business Needs a Website
                </h2>
                <ul class="space-y-3 text-gray-700 dark:text-gray-300">
                    <li class="flex items-start gap-2">
                        <span>🧭</span> <span>Increase your online visibility & trust</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span>📍</span> <span>Let customers find your location & services</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span>🛒</span> <span>Accept orders & inquiries online</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span>🌟</span> <span>Promote offers & health tips</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span>📈</span> <span>Grow your business credibility</span>
                    </li>
                </ul>
            </div>

            <!-- Mobile App Benefits -->
            <div
                class="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg hover:border-purple-500 transition">
                <h2 class="mb-4 text-xl font-semibold text-blue-700 dark:text-blue-400">
                    📱 Why You Should Have a Mobile App
                </h2>
                <ul class="space-y-3 text-gray-700 dark:text-gray-300">
                    <li class="flex items-start gap-2">
                        <span>📦</span> <span>Customers can order products easily</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span>🔔</span> <span>Send push notifications for promos & reminders</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span>🎁</span> <span>Offer loyalty points or refill reminders</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span>⚡</span> <span>Speed up repeat customer purchases</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <span>🏆</span> <span>Stand out from your competition</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Call to Action -->
        <div class="mt-12 text-center">
            <p class="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
                Ready to grow your Business with technology?
            </p>
            <button @click="contactUs"
                class="inline-flex items-center gap-2 px-8 py-3 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full shadow hover:scale-105 hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-4 focus:ring-purple-400 dark:focus:ring-purple-700">
                🚀 Contact Us Now
            </button>
        </div>
    </div>
</template>

<script setup>
import Back from '@/components/Back.vue'
function contactUs() {
    window.open('mailto:afyatracktz@gmail.com?subject=Business Website and App Request', '_blank');
}
</script>
