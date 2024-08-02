<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Chart } from 'chart.js/auto';
import type { PropType } from 'vue';
import type { Stock } from '../stores/market';
import { formatDate } from '../utils/utils';
import { useMarketStore } from '../stores/market';

const marketStore = useMarketStore();

const props = defineProps({
  stock: {
    type: Object as PropType<Stock>,
    required: true
  }
});

const priceChartElement = ref<HTMLCanvasElement | null>(null);
const mostRecentPastPrices = computed(() => marketStore.getPriceRecords(props.stock.ticker));
const price = computed(() => props.stock.price);

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
    <canvas width="200" height="200" ref="priceChartElement"></canvas>
  </div>
</template>
