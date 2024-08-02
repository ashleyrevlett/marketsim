import { ref } from 'vue'
import { defineStore } from 'pinia'

const MAX_PRICE = 10
const MIN_PRICE = 1

// define the type for a price record
export interface PriceRecord {
  price: number,
  datetime: Date
}

// define the type for a stock
export interface Stock {
  ticker: string
  price: number
  priceRecords: PriceRecord[]
}

export const useMarketStore = defineStore('market', () => {

  const stocks = ref<Stock[]>([])

  function seedStocks() {
    stocks.value = [
      { ticker: 'AAPL', price: 100, priceRecords: [] },
      { ticker: 'GOOG', price: 200, priceRecords: [] },
      { ticker: 'MSFT', price: 300, priceRecords: [] },
    ]

    // run a loop representing once a minute for the last 10 minutes
    // each loop, iterate through stocks and generate a fake price history for each stock
    for (let i = 0; i < 10; i++) {
      const priceDatetime = new Date(Date.now() - i * 60000);
      priceDatetime.setMilliseconds(0); // Set milliseconds to 0
      stocks.value.forEach(stock => {
        stock.price = Math.random() * (MAX_PRICE - MIN_PRICE) + MIN_PRICE

        stock.priceRecords.push({
          price: stock.price,
          datetime: priceDatetime
        })
      })
    }

    // start an interval to randomize the price of each stock
    setInterval(() => {
      tickStocks()
    }, 2000)
  }

  // on a regular interval, randomize the price of each stock
  function tickStocks() {
    stocks.value.forEach(stock => {
      const stockPrice = Math.random() * (MAX_PRICE - MIN_PRICE) + MIN_PRICE
      stock.price = stockPrice
      stock.priceRecords.push({
        price: stockPrice,
        datetime: new Date()
      })
    })
    console.log(stocks.value)
  }

  function getStock(ticker: string): Stock | undefined {
    return stocks.value.find(stock => stock.ticker === ticker)
  }

  return { stocks, seedStocks, getStock }
})
