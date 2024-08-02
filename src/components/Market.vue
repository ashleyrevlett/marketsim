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
  <div class="w-full">
    <div class="w-full relative h-[500px]">
      <StockChart :stocks="stocks" />
    </div>

    <div class="grid grid-cols-3">
      <div class="p-4 w-full" v-for="stock in stocks" :key="stock.ticker">
          <h1 class="text-xl font-bold text-center my-2">{{ stock.ticker }}</h1>
        <StockChart class="h-[300px]" :stocks="[stock]" />
        <PriceTable :stock="stock" />
      </div>
    </div>

  </div>
</template>
