<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Chart } from 'chart.js/auto';
import type { PropType } from 'vue';
import type { Stock } from '../stores/market';

const props = defineProps({
  stock: {
    type: Object as PropType<Stock>,
    required: true
  }
});

const priceChartElement = ref<HTMLCanvasElement | null>(null);
const mostRecentPastPrices = computed(() => props.stock.priceRecords.slice(-10));
const price = computed(() => props.stock.price);

function formatDate(time: Date): string {
  return time.toLocaleString("sv-SE")
}

function updateChart(priceChart: Chart) {
  if (priceChart && mostRecentPastPrices.value) {
    priceChart.data.datasets[0].data = mostRecentPastPrices.value.map((record) => record.price)
    priceChart.data.labels = mostRecentPastPrices.value.map((record) => formatDate(record.datetime) )
    priceChart.update()
  }
}

onMounted(() => {
  const ctx = priceChartElement.value;
  if (!ctx) {
    console.error("No canvas element found");
    return;
  }

  const priceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.stock.priceRecords.slice(-10).map(record => new Date(record.datetime).toLocaleString("sv-SE")),
      datasets: [{
        label: 'Price',
        data: props.stock.priceRecords.slice(-10).map(record => record.price),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          min: 1,
          max: 10
        }
      },
      animation: false
    }
  });

  const updateInterval = setInterval(() => {
    updateChart(priceChart);
  }, 2000);

  // Clean up the interval when the component is unmounted
  onUnmounted(() => {
    clearInterval(updateInterval);
  });
})


</script>

<template>
  <div class="stock-chart p-4 border border-gray-200">

    <h1 class="text-xl font-bold text-center my-2">{{ props.stock.ticker }}</h1>

    <canvas width="200" height="200" ref="priceChartElement"></canvas>

    <p class="my-2 text-center">Current Price: <strong>${{ price?.toFixed(2) }}</strong></p>

    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th width="w-1/2">Time</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pastPrice in mostRecentPastPrices">
          <td class="p-2">{{ formatDate(pastPrice.datetime) }}</td>
          <td class="p-2">{{ pastPrice.price.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

