<script setup>
/**
 * 結帳頁（BillAdjustPage）中整單折扣專案區域
 */

import { ref, computed } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { MOCK_GLOBAL_DISCOUNT_COLUMNS } from '@/mock/MockGlobalDiscount'
import { useOrderStore } from '@/stores/useOrderStore'

defineOptions({ name: 'GlobalAdjust' })

const emit = defineEmits(['apply-discount'])

const columns = MOCK_GLOBAL_DISCOUNT_COLUMNS

const sectionBgClasses = { // 折扣專案背景色
  yellow: 'bg-layer-highlight-yellow',
  blue: 'bg-blue-100',
  red: 'bg-layer-highlight-red',
  green: 'bg-green-100',
}

const isConfirmOpen = ref(false)
const pendingSection = ref(null)
const pendingButton = ref(null)
const isDetailOpen = ref(false)

const orderStore = useOrderStore()

// 目前帳單總額（來自 currentOrder.summary）
const currentBillTotal = computed(() => {
  const summary = orderStore.currentOrder?.summary
  return Number(summary?.totalAmount ?? summary?.subtotal ?? 0)
})
// 折扣率
const discountRate = computed(() => {
  const rate = pendingButton.value?.discountRate
  if (!Number.isFinite(rate)) return 1
  return Number(rate)
})

// 折扣後總額
const discountedTotal = computed(() => {
  return Math.round(currentBillTotal.value * discountRate.value)
})

const discountAmount = computed(() => {
  return discountedTotal.value - currentBillTotal.value
})

function openConfirmModal(section, button) {
  pendingSection.value = section
  pendingButton.value = button
  isDetailOpen.value = false
  isConfirmOpen.value = true
}

function closeConfirmModal() {
  isConfirmOpen.value = false
  isDetailOpen.value = false
}

function handleConfirmApply() {
  if (!pendingSection.value || !pendingButton.value) {
    closeConfirmModal()
    return
  }

  // 整單折扣獨立於單一餐點，套用前先清除目前餐點選取狀態
  orderStore.setSelectedOrderItem(null)

  emit('apply-discount', {
    title: pendingSection.value.title,
    label: pendingButton.value.label,
    rate: pendingButton.value.discountRate,
  })

  closeConfirmModal()
}

function handleConfirmCancel() {
  closeConfirmModal()
}
</script>

<template>
  <div class="flex flex-col h-full min-h-0 bg-layer-secondary overflow-hidden">
    <div class="flex-1 min-h-0 grid grid-cols-2 overflow-hidden">
      <!-- 兩大欄：各自獨立的折扣專案 -->
      <div v-for="(sections, colIndex) in columns" :key="colIndex"
        class="flex flex-col min-h-0 overflow-y-auto border-l border-ash-400">
        <section v-for="(section, sectionIndex) in sections" :key="`${colIndex}-${sectionIndex}`" :class="[
          'flex flex-col gap-2 p-3',
          sectionBgClasses[section.bg], // 專案區塊背景色
          sectionIndex < sections.length - 1 // 是否為最後一個專案
            ? 'shrink-0 border-b border-ash-400'
            : 'flex-1',
        ]">
          <p class="font-noto text-md font-normal leading-[1.2] text-text-primary">
            {{ section.title }}
          </p>
          <button v-for="(btn, btnIndex) in section.buttons" :key="btnIndex" type="button"
            class="flex h-btn-h-md w-full shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-ash-600 font-noto text-xl font-medium leading-[1.2] text-text-on-color transition-colors active:bg-ash-700"
            @click="openConfirmModal(section, btn)">
            {{ btn.label }}
          </button>
        </section>
      </div>
    </div>

    <!-- 確認是否套用折扣燈箱（詳細收合 h386／展開 h504） -->
    <BaseModal :open="isConfirmOpen" :show-close="false" :header-icon="null" title="確認是否套用折扣?" :sub-title="''"
      content="" danger-button-text="確認套用" secondary-button-text="返回" body-content-class="text-left" :height-class="isDetailOpen
        ? 'h-[504px] max-h-[90vh] transition-all duration-100 ease-out'
        : 'h-[386px] max-h-[90vh] transition-all duration-100 ease-out'" width-class="w-[480px] max-w-[90vw]"
      @close="closeConfirmModal" @danger="handleConfirmApply" @secondary="handleConfirmCancel">
      <div class="w-full space-y-2">
        <!-- 三行金額資訊 -->
        <div class="w-full rounded-md bg-modal-section-surface px-4 py-3">
          <div class="flex flex-col gap-1 font-noto text-md">
            <div class="flex items-center justify-between">
              <span class="text-modal-title">折扣前</span>
              <span class="tabular-nums text-right font-medium text-text-amount-positive">
                {{ currentBillTotal }} $
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-text-error">
                {{ pendingSection && pendingButton ? `${pendingSection.title} - ${pendingButton.label}` : '折扣金額' }}
              </span>
              <span class="tabular-nums text-right font-medium text-text-amount-negative">
                {{ discountAmount }} $
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-modal-title">折扣後</span>
              <span class="tabular-nums text-right font-medium text-text-amount-positive">
                {{ discountedTotal }} $
              </span>
            </div>
          </div>
        </div>

        <!-- 詳細內容 toggle -->
        <div class="w-full rounded-md bg-modal-section-surface px-4 py-3">
          <button type="button" class="flex w-full items-center justify-between font-noto text-md text-modal-title"
            @click="isDetailOpen = !isDetailOpen">
            <span>{{ isDetailOpen ? '收合詳細' : '查看詳細' }}</span>
            <span class="inline-flex h-6 w-6 items-center justify-center">
              <svg class="h-6 w-6 transition-transform text-modal-accent-icon"
                :class="isDetailOpen ? 'rotate-180' : 'rotate-0'" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </button>
          <transition name="fade">
            <div v-if="isDetailOpen" class="mt-2 w-full rounded-md py-2 max-h-24 overflow-y-auto text-left">
              <p class="text-modal-muted font-noto text-md leading-relaxed whitespace-pre-line">
                {{ pendingSection?.description || '此折扣專案目前無詳細說明。' }}
              </p>
            </div>
          </transition>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
