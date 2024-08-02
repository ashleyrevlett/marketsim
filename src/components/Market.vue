<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMarketStore } from '../stores/market'
import Chart from 'chart.js/auto'

const market = useMarketStore()
const price = computed(() => market.price)
const pastPrices = computed(() => market.pastPrices)

const mostRecentPastPrices = computed(() => {
  return pastPrices.value.slice(-10)
})

let priceChart:Chart|null = null;

// every second, incrememnt the price by a random amount and update the chart
setInterval(() => {
  market.randomPrice()
  if (priceChart) {
    priceChart.data.datasets[0].data = mostRecentPastPrices.value.map((record) => record.price)
    priceChart.data.labels = mostRecentPastPrices.value.map((record) => record.time)
    priceChart.update()
  }
}, 1000)

onMounted(() => {
  const ctx = document.getElementById('chart') as HTMLCanvasElement
  priceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: mostRecentPastPrices.value.map((record) => record.time),
      datasets: [
        {
          label: 'Price',
          data: mostRecentPastPrices.value.map((record) => record.price),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ],
    },
    // configure scale to min and max price
    options: {
      scales: {
        y: {
          min: 1,
          max: 10
        }
      },
      animation: false,
    }
  })
})


</script>

<template>
  <div class="w-full">

      <canvas width="600" height="400" id="chart"></canvas>


    <p>Current Price: {{ price.toFixed(2) }}</p>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th width="w-1/2">Time</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pastPrice in mostRecentPastPrices">
          <td class="p-2">{{ pastPrice.time }}</td>
          <td class="p-2">{{ pastPrice.price.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
