<script  setup lang="ts">
import { computed } from 'vue';
import { useBankStore } from '../stores/bank';
import { useMarketStore } from '../stores/market';

const bank = useBankStore();
const market = useMarketStore();
const balance = computed(() => bank.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
const inventory = computed(() => bank.inventory);

function buyStock() {
  const amount = 10;
  const cost = market.price * amount;
  bank.withdraw(cost);
  bank.addInventory(amount);
}

function sellStock() {
  const amount = 10;
  const cost = market.price * amount;
  bank.deposit(cost);
  bank.removeInventory(amount);
}

</script>

<template>
  <div>
    <h1>Bank</h1>
    <p>Balance: {{ balance }}</p>
    <p>Inventory: {{ inventory }}</p>
    <div class="gap-2 flex flex-col">
      <button class="btn" @click="bank.deposit(10)">Deposit $10</button>
      <button class="btn" @click="bank.withdraw(10)">Withdraw $10</button>
      <button class="btn" @click="buyStock">Buy 10 shares</button>
      <button class="btn" @click="sellStock">Sell 10 shares</button>
    </div>
  </div>
</template>

