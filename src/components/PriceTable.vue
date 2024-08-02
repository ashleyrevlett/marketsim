<script setup lang="ts">
import { computed } from 'vue';
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

const mostRecentPastPrices = computed(() => marketStore.getPriceRecords(props.stock.ticker));
const price = computed(() => props.stock.price);

</script>

<template>
  <div class="stock-chart p-4 border border-gray-200">

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
../utils/utils
