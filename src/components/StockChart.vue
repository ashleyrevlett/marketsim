<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Chart } from 'chart.js/auto';
import type { PropType } from 'vue';
import type { Stock } from '../stores/market';
import { formatDate } from '../utils/utils';
import { useMarketStore } from '../stores/market';

const marketStore = useMarketStore();

const props = defineProps({
  stocks: {
    type: Array as PropType<Stock[]>,
    required: true
  }
});


const labels = computed(() => marketStore.getPriceRecords(props.stocks[0]?.ticker).map(record => formatDate(record.datetime)));
const datasets = computed(() => props.stocks.map(stock => ({
  label: stock.ticker,
  data: marketStore.getPriceRecords(stock.ticker).map(record => record.price),
  borderColor: stock.color,
  borderWidth: 1
})));

const priceChartElement = ref<HTMLCanvasElement | null>(null);

function updateChart(priceChart: Chart) {
  if (priceChart && datasets.value) {
    priceChart.data.datasets = datasets.value
    priceChart.data.labels = labels.value
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
      labels: labels.value,
      datasets: datasets.value
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
  <div class="stock-chart p-4 border border-gray-200 h-full w-full">
    <canvas ref="priceChartElement"></canvas>
  </div>
</template>
