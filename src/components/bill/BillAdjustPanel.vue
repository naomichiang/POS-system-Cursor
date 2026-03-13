<script setup>
defineOptions({ name: 'BillAdjustPanel' })
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Users, Utensils, ChevronUp, ChevronDown, DollarSign } from 'lucide-vue-next'
import { useOrderStore } from '@/stores/useOrderStore'

const orderStore = useOrderStore()

// 訂單顯示資訊（由 store getter 統一提供）
const order = computed(() => orderStore.orderInfoForDisplay)

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
    isGift: item.isGift ?? false
  }))
})

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
    <!-- 1. 桌次資訊列 (OrderInfoHeader) -->
    <div class="flex shrink-0 items-center gap-2 px-3 py-2 bg-layer-dark-primary">
      <span class="rounded-lg px-2 py-0.5 font-noto text-lg font-medium text-ash-800 bg-blue-200">
        {{ order.tableNumber }}桌
      </span>
      <div class="flex items-center gap-1">
        <Users class="w-icon-md h-icon-md text-text-on-color shrink-0" />
        <span class="font-inter text-lg font-medium text-text-on-color">
          {{ order.diners }}
        </span>
      </div>
      <span class="rounded-lg px-2 py-0.5 font-noto text-lg font-normal text-ash-800 bg-blue-200">
        {{ order.statusLabel }}
      </span>
      <span class="ml-auto font-inter text-lg font-medium text-text-on-color tabular-nums">
        {{ order.diningTime }}
      </span>
    </div>

    <!-- 2. 餐點帳單 List（BillDetailList，可捲動） -->
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
        <div v-for="(item, index) in orderItems" :key="item.cartItemId"
          class="relative flex items-start gap-2 px-3 py-2 border-b border-border-primary">
          <span class="shrink-0 w-6 text-center font-inter text-lg font-medium text-text-placeholder">
            {{ index + 1 }}
          </span>
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline justify-between gap-2">
              <span class="font-noto text-lg font-normal text-text-primary line-clamp-2 break-all">
                {{ item.name }}
                <span v-if="item.isGift" class="text-text-helper text-sm">(招待)</span>
              </span>
              <span v-if="item.quantity > 1" class="shrink-0 font-inter text-lg font-medium text-text-tertiary">
                x {{ item.quantity }}
              </span>
            </div>
            <div class="flex items-center justify-end gap-1 mt-0.5">
              <span
                :class="item.isGift ? 'font-inter text-lg font-normal text-text-helper line-through' : 'font-inter text-lg font-medium text-text-primary'">
                {{ (item.subtotal ?? item.price * item.quantity).toLocaleString() }}
              </span>
              <DollarSign :size="16" :stroke-width="2.5" class="text-ash-600 shrink-0" />
            </div>
          </div>
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
