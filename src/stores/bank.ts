import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBankStore = defineStore('bank', () => {
  const balance = ref(100)
  const inventory = ref(0)

  function withdraw(amount: number) {
    balance.value -= amount
  }

  function deposit(amount: number) {
    balance.value += amount
  }

  function addInventory(amount: number) {
    inventory.value += amount
  }

  function removeInventory(amount: number) {
    inventory.value -= amount
  }

  return { balance, inventory, deposit, withdraw, addInventory, removeInventory }
})
