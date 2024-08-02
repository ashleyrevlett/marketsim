<script setup lang="ts">
import Market from '../components/Market.vue'
import Bank from '../components/Bank.vue'
</script>

<template>
  <div class="w-full flex flex-row">
    <main class="w-3/4">
      <Market />
    </main>
    <aside class="w-1/4">
      <Bank />
    </aside>
  </div>
</template>
