<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useMarketStore } from '../stores/market'
import StockChart from './StockChart.vue'

const market = useMarketStore()
const stocks = computed(() => market.stocks)

onMounted(() => {
  // seed stocks
  market.seedStocks()
})

</script>

<template>
  <div class="w-full grid grid-cols-3">

    <div class="p-4" v-for="stock in stocks" :key="stock.ticker">
      <StockChart :stock="stock" />
    </div>

  </div>
</template>
