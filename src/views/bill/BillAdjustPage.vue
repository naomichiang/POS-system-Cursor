<script setup>
defineOptions({ name: 'BillAdjustPage' })
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/useOrderStore'
import { buildCheckoutDraftPayload, saveCheckoutDraft } from '@/api/orders'
import BillAdjustPanel from '@/components/bill/BillAdjustPanel.vue'
import ItemAdjust from '@/components/bill/ItemAdjust.vue'
import GlobalAdjust from '@/components/bill/GlobalAdjust.vue'
import BillActionFooter from '@/components/bill/BillActionFooter.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const tableId = route.params.tableId

const isSavingDraft = ref(false)

const secondButtonLabel = computed(() =>
  isSavingDraft.value ? '暫存中…' : '暫存'
)

onMounted(() => {
  orderStore.fetchOrderData(tableId)
})

function handleApplyGlobalDiscount(payload) {
  orderStore.applyGlobalDiscount(payload)
}

function handleGoToBillPay() {
  router.push({
    name: 'bill-pay',
    params: { tableId }
  })
}
async function handleSaveDraft() {
  if (isSavingDraft.value) return
  isSavingDraft.value = true
  try {
    const payload = buildCheckoutDraftPayload(orderStore, tableId)
    const res = await saveCheckoutDraft(payload)
    if (res?.revision != null) {
      orderStore.checkoutDraftRevision = res.revision
    }
    alert('已暫存（mock API）')
  } catch (e) {
    console.error(e)
    alert('暫存失敗，請稍後再試')
  } finally {
    isSavingDraft.value = false
  }
}
</script>

<template>
  <main class="flex flex-1 p-4 gap-4 min-h-0 min-w-0">
    <!-- 左側：結帳明細欄 -->
    <BillAdjustPanel />

    <!-- 右側大操作區 -->
    <div class="flex-1 flex flex-col min-h-0 bg-white rounded-2xl shadow-sm overflow-hidden">
      <!-- 上半部區域 -->
      <div class="flex-1 flex min-h-0">
        <ItemAdjust class="w-1/3 shrink-0" />
        <GlobalAdjust class="flex-1 min-w-0" @apply-discount="handleApplyGlobalDiscount" />
      </div>
      <!-- 下半部區域 -->
      <BillActionFooter
        :second-button-text="secondButtonLabel"
        primary-button-text="結帳"
        :class="{ 'opacity-60 pointer-events-none': isSavingDraft }"
        @second-click="handleSaveDraft"
        @primary-click="handleGoToBillPay"
      >
        <template #leftGroup>
          <button type="button"
            class="flex w-btn-md h-full justify-center items-center rounded-2xl bg-button-primary active:bg-button-primary-hover transition-colors">
            <span
              class="text-text-on-color text-center font-noto text-2xl font-medium leading-[128%] tracking-[0.05em]">
              功能
            </span>
          </button>
        </template>
      </BillActionFooter>
    </div>
  </main>
</template>
