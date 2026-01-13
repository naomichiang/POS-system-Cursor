<script setup>
  import { ref } from 'vue'
  import TopBar from './components/TopBar.vue'
  import AppSidebar from './components/AppSidebar.vue'
  import CheckoutPanel from './components/CheckoutPanel.vue'
  import CheckoutArea from './components/CheckoutArea.vue'

  // 付款列表狀態
  const payments = ref([
    { type: 'cash', amount: 5500 },
    { type: 'credit', amount: 17500 },
    { type: 'cash', amount: 8000 },
  ])

  // 處理新增付款
  const handleAddPayment = (payment) => {
    payments.value.push(payment)
  }

  // 刪除付款項目
  const handleRemovePayment = (index) => {
    payments.value.splice(index, 1)
  }
  </script>

<template>
    <div class="flex flex-col w-full h-screen overflow-hidden bg-ash-100 font-noto">
      <TopBar class="shrink-0 z-20" />

      <div class="flex flex-1 min-h-0">

        <AppSidebar class="w-20 shrink-0" h-full z-10/>
        <!-- Main Content -->
        <main class="flex flex-1 p-4 gap-4 min-h-0 min-w-0">
          <!-- Checkout Panel -->
          <CheckoutPanel
          class="w-[280px] h-full shrink-0 bg-white rounded-2xl shadow-sm overflow-hidden"
          :payments="payments"
          @remove-payment="handleRemovePayment"
          />
          <!-- Checkout Area -->
          <CheckoutArea
            class="flex-1 bg-white rounded-2xl shadow-sm border border-ash-200 overflow-y-auto"
            @add-payment="handleAddPayment"
          />
        </main>
      </div>
    </div>
  </template>

<style scoped>
main {
  padding: 1rem; /* 對應 p-4 */
}
</style>
