<script setup>
defineOptions({ name: 'BillAdjustPanel' })
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Utensils, ChevronUp, ChevronDown, DollarSign } from 'lucide-vue-next'
import { TABLE_STATUS } from '@/config/tableStatus'
import { useOrderStore } from '@/stores/useOrderStore'

const orderStore = useOrderStore()

// 訂單顯示資訊（由 store getter 統一提供）
const order = computed(() => orderStore.orderInfoForDisplay)

// 根據訂單狀態回傳對應的底色 class
const statusBgClass = computed(() => {
  const status = order.value?.status
  const map = {
    [TABLE_STATUS.AVAILABLE]: 'bg-ordstatus-0-primary',
    [TABLE_STATUS.OCCUPIED]: 'bg-ordstatus-1-primary',
    [TABLE_STATUS.WARNING]: 'bg-ordstatus-2-primary',
    [TABLE_STATUS.OVERTIME]: 'bg-ordstatus-3-primary',
    [TABLE_STATUS.CHECKED_OUT]: 'bg-ordstatus-4-primary',
    [TABLE_STATUS.CLEANING]: 'bg-ordstatus-5-primary',
    [TABLE_STATUS.RESERVED]: 'bg-ordstatus-9-primary',
  }
  return map[status] || 'bg-layer-dark-tertiary'
})

// 狀態顯示文字
const statusLabel = computed(() => order.value?.statusLabel || '查詢中')

// 餐點列表（從 orderStore.currentOrder.items 取得）
const orderItems = computed(() => {
  const order = orderStore.currentOrder
  if (!order?.items?.length) return []
  return order.items.map((item, idx) => ({
    cartItemId: `item-${idx}-${item.name}`,
    name: item.name,
    price: item.unitPrice,
    quantity: item.quantity,
    subtotal: item.subtotal,
    isGift: item.isGift ?? false,
    // 由調整面板設定的折扣/招待標籤（例如：招待 / 禮物）
    discountLabel: item.discountLabel ?? '',
    discountType: item.discountType ?? null,
    discountValue: item.discountValue ?? null
  }))
})

// 目前選取中的餐點 index（由 store 控制，可供其他元件使用）
const selectedItemIndex = computed(() => orderStore.selectedOrderItemIndex)

// 取得折扣顯示文字（例如 percentage：90% → 九折、85% → 85折）
function getDiscountDisplay(item) {
  if (item.discountType === 'percentage' && item.discountValue != null) {
    const v = Number(item.discountValue)
    if (!Number.isFinite(v)) return item.discountLabel

    if (v === 90) return '九折'
    if (v === 80) return '八折'
    if (v === 70) return '七折'
    if (v === 60) return '六折'
    if (v === 50) return '五折'

    return `${v}折`
  }

  return item.discountLabel
}

// 餐點列表捲動
const scrollEl = ref(null)
const scrollStep = 200
const showArrows = ref(false)
const isAtTop = ref(true)
const isAtBottom = ref(true)

function updateScrollState() {
  if (!scrollEl.value) return
  const { scrollHeight, clientHeight, scrollTop } = scrollEl.value
  const threshold = 5
  showArrows.value = scrollHeight > clientHeight
  isAtTop.value = scrollTop <= threshold
  isAtBottom.value = scrollTop + clientHeight >= scrollHeight - threshold
}

const scrollPrev = () => {
  const el = scrollEl.value
  if (!el || isAtTop.value) return
  if (el.scrollTop < scrollStep) {
    el.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    el.scrollBy({ top: -scrollStep, behavior: 'smooth' })
  }
}

const scrollNext = () => {
  const el = scrollEl.value
  if (!el || isAtBottom.value) return
  const maxScroll = el.scrollHeight - el.clientHeight
  if (maxScroll - el.scrollTop < scrollStep) {
    el.scrollTo({ top: maxScroll, behavior: 'smooth' })
  } else {
    el.scrollBy({ top: scrollStep, behavior: 'smooth' })
  }
}

let scrollElInst = null
let resizeObserver = null

onMounted(() => {
  nextTick(() => {
    updateScrollState()
    scrollElInst = scrollEl.value
    if (scrollElInst) {
      scrollElInst.addEventListener('scroll', updateScrollState)
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(updateScrollState)
        resizeObserver.observe(scrollElInst)
      }
    }
  })
})

onUnmounted(() => {
  if (scrollElInst) scrollElInst.removeEventListener('scroll', updateScrollState)
  if (resizeObserver && scrollElInst) resizeObserver.disconnect()
})

watch(
  () => orderItems.value,
  () => nextTick(updateScrollState),
  { deep: true }
)
</script>

<template>
  <div class="w-[330px] h-full shrink-0 flex flex-col rounded-2xl shadow-sm overflow-hidden bg-layer-primary">
    <!-- 1. Header 訂單資訊列(桌號、訂單狀態) -->
    <div class="flex w-full h-12 shrink-0 items-start">
      <div class="flex w-22 flex-col justify-center items-center shrink-0 self-stretch bg-layer-dark-primary">
        <div class="text-center font-noto pl-1 text-lg tracking-[0.2em] leading-tight text-text-on-color">{{
          order.tableNumber }}桌</div>
      </div>
      <div class="flex justify-between px-3 items-center flex-1 self-stretch" :class="statusBgClass">
        <div class="flex items-center gap-0.5">
          <div class="flex w-icon-md h-icon-md justify-center items-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.9997 16C14.533 16 13.2775 15.4778 12.233 14.4333C11.1886 13.3889 10.6663 12.1333 10.6663 10.6666C10.6663 9.19998 11.1886 7.94442 12.233 6.89998C13.2775 5.85554 14.533 5.33331 15.9997 5.33331C17.4663 5.33331 18.7219 5.85554 19.7663 6.89998C20.8108 7.94442 21.333 9.19998 21.333 10.6666C21.333 12.1333 20.8108 13.3889 19.7663 14.4333C18.7219 15.4778 17.4663 16 15.9997 16ZM5.33301 24V22.9333C5.33301 22.1778 5.52767 21.4835 5.91701 20.8506C6.30634 20.2178 6.82279 19.7342 7.46634 19.4C8.84412 18.7111 10.2441 18.1946 11.6663 17.8506C13.0886 17.5066 14.533 17.3342 15.9997 17.3333C17.4663 17.3324 18.9108 17.5049 20.333 17.8506C21.7552 18.1964 23.1552 18.7129 24.533 19.4C25.1775 19.7333 25.6943 20.2169 26.0837 20.8506C26.473 21.4844 26.6672 22.1786 26.6663 22.9333V24C26.6663 24.7333 26.4055 25.3613 25.8837 25.884C25.3619 26.4066 24.7339 26.6675 23.9997 26.6666H7.99967C7.26634 26.6666 6.63879 26.4058 6.11701 25.884C5.59523 25.3622 5.3339 24.7342 5.33301 24Z"
                fill="white" />
            </svg>
          </div>
          <div class="text-text-on-color font-inter text-md font-medium leading-tight">{{ order.diners }}</div>
        </div>
        <div class="text-text-on-color font-noto text-md font-normal leading-tight">{{ statusLabel }}</div>
        <div class="text-text-on-color font-inter text-md font-medium leading-tight">{{
          order.diningTime }}</div>
      </div>
    </div>

    <!-- 2. 餐點帳單 List（可捲動） -->
    <div ref="scrollEl" class="flex-1 min-h-0 overflow-y-auto scrollbar-hide bg-layer-primary">
      <div v-if="orderStore.isLoading"
        class="flex h-full min-h-24 items-center justify-center text-text-placeholder font-noto text-lg">
        載入中...
      </div>
      <div v-else-if="orderItems.length === 0"
        class="flex h-full min-h-24 items-center justify-center text-text-placeholder font-noto text-lg">
        - 尚未點餐 -
      </div>
      <div v-else class="flex flex-col">
        <div v-for="(item, index) in orderItems" :key="item.cartItemId" @click="orderStore.setSelectedOrderItem(index)"
          :class="[
            'relative flex items-start gap-2 px-2.5 py-3 cursor-pointer transition-colors',
            selectedItemIndex === index ? 'bg-layer-highlight-yellow' : 'bg-transparent'
          ]">
          <span class="shrink-0 w-4 text-center font-inter text-sm pt-1 font-medium text-text-placeholder">
            {{ index + 1 }}
          </span>

          <div class="flex-1 min-w-0 flex flex-col gap-1">
            <div class="flex items-start justify-between gap-2">
              <span class="font-noto text-lg text-text-primary line-clamp-2 break-all pt-0.5 leading-tight">
                {{ item.name }}
              </span>
              <div class="flex items-center gap-1 shrink-0">
                <span class="font-inter text-lg tabular-nums inline-flex items-center gap-0.5"
                  :class="item.isGift || item.discountLabel ? 'text-text-helper line-through' : ''">
                  <span
                    :class="item.isGift || item.discountLabel ? 'text-text-helper font-normal' : 'text-text-amount-positive font-medium'">
                    {{ item.price.toLocaleString() }}
                  </span>
                  <DollarSign :size="16" :stroke-width="2.5" class="shrink-0"
                    :class="item.isGift || item.discountLabel ? 'text-text-placeholder' : 'text-yellow-600'" />
                </span>
              </div>
            </div>

            <div v-if="item.isGift || item.discountLabel" class="flex items-center justify-between gap-2">
              <span class="font-noto text-base font-medium text-text-error">
                └ {{ getDiscountDisplay(item) }}
              </span>

              <div class="flex items-center gap-1 shrink-0">
                <span class="font-inter text-lg font-bold text-text-amount-negative tabular-nums">
                  {{ item.isGift ? '0' : item.subtotal.toLocaleString() }}
                </span>
                <DollarSign :size="16" :stroke-width="2.5" class="text-yellow-600 shrink-0" />
              </div>
            </div>
            <div class="absolute bottom-0 left-3 right-3 h-px bg-border-primary"></div>
          </div>

          <div v-if="selectedItemIndex === index" class="absolute left-0 top-0 bottom-0 w-1 bg-indianred-400"></div>
        </div>
      </div>
    </div>

    <!-- 3. 按鈕列（上下頁） -->
    <div class="flex shrink-0 h-14 w-full items-stretch border-t border-border-primary bg-layer-secondary">
      <button type="button" aria-label="往上捲動" :disabled="!showArrows || isAtTop" :class="[
        'flex flex-1 items-center justify-center border-r border-border-primary transition-colors',
        !showArrows || isAtTop
          ? 'opacity-30 cursor-not-allowed'
          : 'active:bg-layer-secondary-hover'
      ]" @click="scrollPrev">
        <ChevronUp class="w-icon-lg h-icon-lg text-ash-600" />
      </button>
      <button type="button" aria-label="往下捲動" :disabled="!showArrows || isAtBottom" :class="[
        'flex flex-1 items-center justify-center transition-colors',
        !showArrows || isAtBottom
          ? 'opacity-30 cursor-not-allowed'
          : 'active:bg-layer-secondary-hover'
      ]" @click="scrollNext">
        <ChevronDown class="w-icon-lg h-icon-lg text-ash-600" />
      </button>
    </div>

    <!-- 4. 餐點數目與金額 -->
    <div class="flex shrink-0 items-center justify-between px-4 py-3 bg-layer-dark-primary">
      <div class="flex items-center gap-2">
        <Utensils class="w-icon-lg h-icon-lg text-text-on-color shrink-0" />
        <span class="font-inter text-lg font-medium text-text-on-color">
          {{ order.totalItems }}
        </span>
      </div>
      <span class="font-inter text-2xl font-bold text-text-on-color tabular-nums">
        {{ order.totalAmount.toLocaleString() }} $
      </span>
    </div>
  </div>
</template>
