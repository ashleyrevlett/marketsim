import { ref } from 'vue'
import { defineStore } from 'pinia'

const MAX_PRICE = 10
const MIN_PRICE = 1
const STEP_TIME = 1000 // ms

export interface PriceRecord {
  price: number,
  datetime: Date
}

export interface Stock {
  ticker: string
  price: number
  priceRecords: PriceRecord[]
  color: string
}

export const useMarketStore = defineStore('market', () => {

  const stocks = ref<Stock[]>([])

  // on a regular interval, randomize the price of each stock
  function tickStocks(priceDatetime: Date | null) {
    const volatility = .8; // Adjust this value to control price fluctuations
    const dt = STEP_TIME / 1000; // Time step (1 second)

    stocks.value.forEach(stock => {
      const randomFactor = Math.random() - 0.5; // Random number between -0.5 and 0.5
      const change = stock.price * volatility * randomFactor * Math.sqrt(dt);

      let newPrice = stock.price + change;
      newPrice = Math.max(MIN_PRICE, Math.min(MAX_PRICE, newPrice));
      stock.price = Number(newPrice.toFixed(2)); // Round to 2 decimal places
      stock.price = newPrice
      stock.priceRecords.push({
        price: newPrice,
        datetime: priceDatetime ? priceDatetime : new Date()
      })
    })
  }

  function seedStocks() {
    stocks.value = [
      { ticker: 'AAPL', price: 100, priceRecords: [], color: 'rgba(255, 0, 0, 1)' },
      { ticker: 'GOOG', price: 200, priceRecords: [], color: 'rgba(50, 255, 0, 1)' },
      { ticker: 'MSFT', price: 300, priceRecords: [], color: 'rgba(0, 0, 255, 1)' },
    ]

    // run a loop representing once a minute for the last 10 minutes
    // each loop, iterate through stocks and generate a fake price history for each stock
    for (let i = 0; i < 10; i++) {
      const priceDatetime = new Date(Date.now() - i * 60000);
      priceDatetime.setMilliseconds(0); // Set milliseconds to 0
      tickStocks(priceDatetime)
    }

    // start an interval to randomize the price of each stock
    setInterval(() => {
      tickStocks(null)
    }, STEP_TIME)
  }


  function getStock(ticker: string): Stock | undefined {
    return stocks.value.find(stock => stock.ticker === ticker)
  }

  function getPriceRecords(ticker: string): PriceRecord[] {
    const stock = getStock(ticker)
    return stock ? stock.priceRecords.slice(-10) : []
  }

  return { stocks, seedStocks, getStock, getPriceRecords }
})
