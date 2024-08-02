import { ref } from 'vue'
import { defineStore } from 'pinia'

const MAX_PRICE = 10
const MIN_PRICE = 1

// define the type for a price record
interface PriceRecord {
  time: string
  price: number
}


export const useMarketStore = defineStore('market', () => {
  const price = ref(MIN_PRICE)

  const pastPrices = ref<PriceRecord[]>([
    {
      time: new Date().toLocaleTimeString(),
      price: MIN_PRICE,
    }
  ])

  function randomPrice() {
    const change = Math.random() > 0.5 ? -1 : 1
    const amount = price.value + Math.random() * change
    price.value = Math.min(Math.max(amount, MIN_PRICE), MAX_PRICE)
    pastPrices.value.push({
      time: new Date().toLocaleTimeString(),
      price: price.value
    })
  }

  return { price, pastPrices, randomPrice }
})
