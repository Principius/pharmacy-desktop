<template>
    <div class="chart-container">
      <canvas ref="donutChart"></canvas>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
  
  // Register required Chart.js elements
  Chart.register(DoughnutController, ArcElement, Tooltip, Legend);
  
  const props = defineProps({
    data: Array,
    labels: Array,
    title: String,
  });
  
  const donutChart = ref(null);
  
  onMounted(() => {
    new Chart(donutChart.value, {
      type: 'doughnut',
      data: {
        labels: props.labels,
        datasets: [{
          label: props.title,
          data: props.data,
          backgroundColor: ['#10B981', '#EF4444', '#FACC15', '#3B82F6'], // Example colors
          borderColor: '#ffffff',
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              },
            },
          },
        },
      },
    });
  });
  </script>
  
  <style scoped>
  .chart-container {
    position: relative;
    height: 300px; /* Adjust as needed */
  }
  </style>
  