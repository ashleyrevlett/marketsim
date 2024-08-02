<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useMarketStore } from '../stores/market'
import StockChart from './StockChart.vue'
import PriceTable from './PriceTable.vue'

const market = useMarketStore()
const stocks = computed(() => market.stocks)

onMounted(() => {
  market.seedStocks()
})

</script>

<template>
  <div class="w-full grid grid-cols-3">

    <div class="p-4" v-for="stock in stocks" :key="stock.ticker">
      <h1 class="text-xl font-bold text-center my-2">{{ stock.ticker }}</h1>
      <StockChart :stock="stock" />
      <PriceTable :stock="stock" />
    </div>

  </div>
</template>
