<template>
    <div class="p-4 transition duration-300 transform bg-white rounded shadow dark:bg-white hover:scale-105">
        <h2 class="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-600">{{ title }}</h2>
        <canvas ref="chartCanvas" class="max-h-72"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register the required Chart.js components
Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend
);

const props = defineProps({
    title: String,
    labels: {
        type: Array,
        required: true,
    },
    data: {
        type: Array,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        default: "#4F46E5",
    },
});

const chartCanvas = ref(null);
let chartInstance = null;

onMounted(() => {
    createChart();
});

watch(() => props.data, () => {
    if (chartInstance) {
        chartInstance.data.datasets[0].data = props.data;
        chartInstance.update();
    }
});

function createChart() {
    if (chartCanvas.value) {
        chartInstance = new Chart(chartCanvas.value, {
            type: "line",
            data: {
                labels: props.labels,
                datasets: [
                    {
                        label: props.label,
                        data: props.data,
                        borderColor: props.color,
                        fill: false,
                        tension: 0.4, // For a smooth spline
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true, labels: { color: "#1F2937" } },
                },
                scales: {
                    x: { title: { display: true, text: "Date", color: "#1F293" } },
                    y: { title: { display: true, text: props.label, color: "#1F2937" } },
                },
                elements: {
                    point: { radius: 3, hoverRadius: 5 }, // Enhancing interaction
                },
            },
        });
    }
}
</script>

<style scoped>
canvas {
    max-height: 300px;
    transition: all 0.3s ease-in-out; /* Smooth transition for hover effect */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
