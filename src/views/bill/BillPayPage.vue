<script setup>
defineOptions({ name: 'BillPayPage' })
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/useOrderStore'
import { buildPaymentDraftPayload, savePaymentDraft } from '@/api/orders'
import BillPayPanel from '@/components/bill/BillPayPanel.vue'
import BillPayCalculator from '@/components/bill/BillPayCalculator.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const isSavingPaymentDraft = ref(false)

// 將 store 的 payment.details 映射為組件需要的 payments 格式
const payments = computed(() => orderStore.payment.details)

// 處理新增付款
const handleAddPayment = (payment) => {
  orderStore.addPayment(payment)
}

// 刪除付款項目
const handleRemovePayment = (index) => {
  orderStore.removePayment(index)
}

// 處理確認結帳成功：切換到桌次頁
const handleConfirmCheckoutSuccess = () => {
  console.log('確認結帳成功，切換到桌次頁')
  orderStore.resetOrder()
  router.push('/table-selection')
}

async function handleSavePaymentDraft() {
  if (isSavingPaymentDraft.value) return
  isSavingPaymentDraft.value = true
  try {
    const payload = buildPaymentDraftPayload(orderStore, route.params.tableId)
    const res = await savePaymentDraft(payload)
    if (res?.revision != null) {
      orderStore.paymentDraftRevision = res.revision
    }
    alert('已收／付款已暫存（mock API）')
  } catch (e) {
    console.error(e)
    alert('暫存失敗，請稍後再試')
  } finally {
    isSavingPaymentDraft.value = false
  }
}
</script>

<template>
  <main class="flex flex-1 p-4 gap-4 min-h-0 min-w-0">
    <!-- BillPay Panel -->
    <BillPayPanel class="w-[330px] h-full shrink-0 bg-white rounded-2xl shadow-sm overflow-hidden"
      :table-id="route.params.tableId" :payments="payments" @remove-payment="handleRemovePayment" />
    <!-- BillPay Calculator -->
    <BillPayCalculator
      class="flex-1 bg-white rounded-2xl shadow-sm  overflow-y-auto"
      :payments="payments"
      :draft-saving="isSavingPaymentDraft"
      @add-payment="handleAddPayment"
      @save-draft="handleSavePaymentDraft"
      @confirm-checkout-success="handleConfirmCheckoutSuccess"
    />
  </main>
</template>

<style scoped>
main {
  padding: 1rem;
  /* 對應 p-4 */
}
</style>
