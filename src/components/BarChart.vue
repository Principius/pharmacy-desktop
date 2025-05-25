<template>
    <div class="chart-container">
      <canvas ref="barChart"></canvas>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
  
  // Register required Chart.js components
  Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
  
  const props = defineProps({
    labels: Array, // Month names
    data: Array,   // Number of sales per month
    title: String, // Chart title
  });
  
  const barChart = ref(null);
  
  onMounted(() => {
    new Chart(barChart.value, {
      type: 'bar',
      data: {
        labels: props.labels,
        datasets: [{
          label: props.title,
          data: props.data,
          backgroundColor: '#10B981', // Green bars
          borderColor: '#059669',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => `${tooltipItem.raw} Sales`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `${value} Sales`, // Format y-axis
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
    height: 400px; /* Adjust as needed */
  }
  </style>
  