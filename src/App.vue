<script setup>
  import { ref } from 'vue'
  import TopBar from './components/TopBar.vue'
  import Sidebar from './components/Sidebar.vue'
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
      <TopBar class="shrink-0 z-10" />

      <div class="flex flex-1 overflow-hidden">

        <Sidebar class="w-20 shrink-0" />

        <CheckoutPanel
          class="w-[440px] shrink-0"
          :payments="payments"
          @remove-payment="handleRemovePayment"
        />

        <CheckoutArea
          class="flex-1 overflow-y-auto bg-ash-50"
          @add-payment="handleAddPayment"
        />

      </div>
    </div>
  </template>

<style scoped></style>
