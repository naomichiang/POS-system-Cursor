<script setup>
defineOptions({ name: 'BillAdjustPanel' })
import { ref, computed, watch, nextTick } from 'vue'
import { Utensils, DollarSign } from 'lucide-vue-next'
import { TABLE_STATUS } from '@/config/tableStatus'
import { useOrderStore } from '@/stores/useOrderStore'
import { useScrollControls } from '@/composables/useScrollControls'

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
    type: 'order-item',
    sourceIndex: idx,
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
// 全局折扣項目
const globalDiscountItem = computed(() => {
  const globalDiscount = orderStore.globalDiscount
  if (!globalDiscount) return null

  return {
    type: 'global-discount',
    cartItemId: 'global-discount-item',
    name: `${globalDiscount.title}-${globalDiscount.label}`, // 整單折扣項目名稱
    amount: Number(globalDiscount.amount) || 0, // 整單折扣項目金額
  }
})
// 顯示餐點列表（包含整單折扣項目）
const displayItems = computed(() => {
  const surchargeDisplayItems = orderStore.surchargeItems.map((item) => ({
    type: 'surcharge',
    cartItemId: `surcharge-${item.id}`,
    name: item.name,
    amount: item.amount,
    id: item.id,
  }))
  const discountItems = globalDiscountItem.value ? [globalDiscountItem.value] : []
  return [...discountItems, ...surchargeDisplayItems, ...orderItems.value]
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
// 整理清單中每個 item 的類型，方便畫UI: 整單折扣/單品折扣/正常商品
function getItemType(item) {
  if (item.type === 'global-discount') return 'globalDiscount'
  if (item.type === 'surcharge') return 'surcharge'
  if (item.isGift || item.discountLabel) return 'discounted'
  return 'normal'
}

/** 帳單列序號：僅實際餐點（order-item）參與編號，其他類型皆跳過 */
function getOrderLineNumber(index) {
  const rows = displayItems.value
  let countBefore = 0
  for (let i = 0; i < index; i++) {
    if (rows[i]?.type === 'order-item') countBefore++
  }
  return countBefore + 1
}

// 餐點列表捲動（共用邏輯）
const scrollEl = ref(null)
const {
  showArrows,
  isAtStart: isAtTop,
  isAtEnd: isAtBottom,
  scrollPrev,
  scrollNext,
  updateScrollState,
} = useScrollControls(scrollEl, {
  axis: 'vertical',
  step: 200,
})

watch(
  () => displayItems.value,
  () => nextTick(updateScrollState),
  { deep: true }
)

function handleSelectItem(item) {
  if (item.type !== 'order-item') return
  orderStore.setSelectedOrderItem(item.sourceIndex)
}
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
      <div v-else-if="displayItems.length === 0"
        class="flex h-full min-h-24 items-center justify-center text-text-placeholder font-noto text-lg">
        - 尚未點餐 -
      </div>
      <transition-group v-else name="bill-adjust-item" tag="div" class="flex flex-col">
        <!-- 餐點列表 -->
        <div v-for="(item, index) in displayItems" :key="item.cartItemId" @click="handleSelectItem(item)" :class="[
          'relative flex items-start gap-2 px-2.5 py-3 cursor-pointer transition-colors',
          getItemType(item) === 'globalDiscount'
            ? 'bg-red-50 min-h-[80px]'
            : getItemType(item) === 'surcharge'
              ? 'min-h-[80px]'
              : selectedItemIndex === item.sourceIndex
                ? 'bg-layer-highlight-yellow'
                : 'bg-transparent'
        ]">
          <!-- 序號：整單折扣為-，單品為序號 -->
          <span class="shrink-0 w-4 text-center font-inter text-sm pt-1 font-medium text-text-placeholder">
            {{ getItemType(item) === 'globalDiscount' || getItemType(item) === 'surcharge' ? '-' :
              getOrderLineNumber(index) }}
          </span>
          <!-- 餐點資訊（整單折扣列：底部與分隔線固定 16px 間距） -->
          <div class="flex-1 min-w-0 flex flex-col gap-1"
            :class="getItemType(item) === 'globalDiscount' ? 'pb-0.5' : ''">
            <div class="flex items-start justify-between gap-2">
              <!-- 餐點名稱：整單折扣為紅色，單品為黑色 -->
              <span class="font-noto text-lg break-all pt-0.5 line-clamp-2 leading-tight" :class="getItemType(item) === 'globalDiscount'
                ? 'text-text-error font-medium '
                : 'text-text-primary'">
                {{ item.name }}
              </span>

              <!-- 餐點價格：三種類型不同 -->
              <div class="flex items-center gap-0.5 shrink-0">
                <!-- 整單折扣時 -->
                <template v-if="getItemType(item) === 'globalDiscount'">
                  <span class="font-inter text-lg font-bold text-text-amount-negative tabular-nums">
                    {{ item.amount.toLocaleString() }}
                  </span>
                  <DollarSign :size="16" :stroke-width="2.5" class="text-text-error shrink-0" />
                </template>

                <!-- 追加金額時 -->
                <template v-else-if="getItemType(item) === 'surcharge'">
                  <span class="font-inter text-lg tabular-nums inline-flex items-center gap-0.5">
                    <span class="text-text-amount-positive font-medium">
                      {{ Number(item.amount || 0).toLocaleString() }}
                    </span>
                  </span>
                  <DollarSign :size="16" :stroke-width="2.5" class="text-yellow-600 shrink-0" />
                </template>

                <!-- 單品折價時的原價出現刪除線 -->
                <template v-else-if="getItemType(item) === 'discounted'">
                  <span
                    class="font-inter text-lg tabular-nums inline-flex items-center gap-0.5 text-text-helper line-through">
                    <span class="text-text-helper font-normal">
                      {{ item.price.toLocaleString() }}
                    </span>
                    <DollarSign :size="16" :stroke-width="2.5" class="shrink-0 text-text-placeholder" />
                  </span>
                </template>

                <!-- 正常商品時的原價 -->
                <template v-else>
                  <span class="font-inter text-lg tabular-nums inline-flex items-center gap-0.5">
                    <span class="text-text-amount-positive font-medium">
                      {{ item.price.toLocaleString() }}
                    </span>
                    <DollarSign :size="16" :stroke-width="2.5" class="shrink-0 text-yellow-600" />
                  </span>
                </template>

              </div>
            </div>
            <!-- 整單折扣恢復按鈕：第二行靠右，與列底分隔線固定間隔-->
            <div v-if="getItemType(item) === 'globalDiscount'" class="mt-1 flex justify-end">
              <button type="button"
                class="rounded-md border border-text-error px-2 py-0.5 font-noto text-sm text-text-error transition-colors hover:bg-red-100 active:bg-red-200"
                @click.stop="orderStore.clearGlobalDiscount()">刪除折扣
              </button>
            </div>
            <div v-if="getItemType(item) === 'surcharge'" class="mt-1 flex justify-end">
              <button type="button"
                class="rounded-md border border-text-error px-2 py-0.5 font-noto text-sm text-text-error transition-colors hover:bg-red-100 active:bg-red-200"
                @click.stop="orderStore.removeSurchargeItem(item.id)">刪除
              </button>
            </div>
            <!-- 單品折扣時，多出一行顯示折扣資訊 -->
            <div v-if="getItemType(item) === 'discounted'" class="flex items-center justify-between gap-2">
              <span class="font-noto text-base font-medium text-text-error">
                └ {{ getDiscountDisplay(item) }}
              </span>
              <div class="flex items-center gap-1 shrink-0">
                <!-- 餐點單品折扣後金額 -->
                <span class="font-inter text-lg font-bold text-text-amount-negative tabular-nums">
                  {{ item.isGift ? '0' : item.subtotal.toLocaleString() }}
                </span>
                <DollarSign :size="16" :stroke-width="2.5" class="text-yellow-600 shrink-0" />
              </div>
            </div>
            <!-- 底部分隔線 -->
            <div class="absolute bottom-0 left-3 right-3 h-px bg-border-primary"></div>
          </div>

          <!-- 整單折扣項目即便被選取時，底色也為紅色 -->
          <div v-if="getItemType(item) !== 'globalDiscount' && selectedItemIndex === item.sourceIndex"
            class="absolute left-0 top-0 bottom-0 w-1 bg-indianred-400"></div>
        </div>
      </transition-group>
    </div>

    <!-- 3. 按鈕列（上下頁） -->
    <div class="flex shrink-0 h-14 w-full items-stretch border-t border-border-primary bg-layer-secondary">
      <button type="button" aria-label="往上捲動" :disabled="!showArrows || isAtTop" :class="[
        'flex flex-1 items-center justify-center border-r border-border-primary transition-colors text-ash-600',
        !showArrows || isAtTop
          ? 'opacity-30 cursor-not-allowed'
          : 'active:bg-layer-secondary-hover'
      ]" @click="scrollPrev">
        <svg class="w-icon-lg h-icon-lg shrink-0" viewBox="0 0 23 13" fill="none">
          <path
            d="M1.33333 12.5333C0.933333 12.5333 0.611556 12.4 0.368 12.1333C0.124444 11.8667 0.00177778 11.5556 0 11.2C0 11.1111 0.133334 10.8 0.4 10.2667L10.0667 0.599998C10.2889 0.377776 10.5111 0.222223 10.7333 0.133334C10.9556 0.0444449 11.2 0 11.4667 0C11.7333 0 11.9778 0.0444449 12.2 0.133334C12.4222 0.222223 12.6444 0.377776 12.8667 0.599998L22.5333 10.2667C22.6667 10.4 22.7671 10.5449 22.8347 10.7013C22.9022 10.8578 22.9351 11.024 22.9333 11.2C22.9333 11.5556 22.8116 11.8667 22.568 12.1333C22.3244 12.4 22.0018 12.5333 21.6 12.5333H1.33333Z"
            fill="currentColor" />
        </svg>
      </button>
      <button type="button" aria-label="往下捲動" :disabled="!showArrows || isAtBottom" :class="[
        'flex flex-1 items-center justify-center transition-colors text-ash-600',
        !showArrows || isAtBottom
          ? 'opacity-30 cursor-not-allowed'
          : 'active:bg-layer-secondary-hover'
      ]" @click="scrollNext">
        <svg class="w-icon-lg h-icon-lg shrink-0 rotate-180" viewBox="0 0 23 13" fill="none">
          <path
            d="M1.33333 12.5333C0.933333 12.5333 0.611556 12.4 0.368 12.1333C0.124444 11.8667 0.00177778 11.5556 0 11.2C0 11.1111 0.133334 10.8 0.4 10.2667L10.0667 0.599998C10.2889 0.377776 10.5111 0.222223 10.7333 0.133334C10.9556 0.0444449 11.2 0 11.4667 0C11.7333 0 11.9778 0.0444449 12.2 0.133334C12.4222 0.222223 12.6444 0.377776 12.8667 0.599998L22.5333 10.2667C22.6667 10.4 22.7671 10.5449 22.8347 10.7013C22.9022 10.8578 22.9351 11.024 22.9333 11.2C22.9333 11.5556 22.8116 11.8667 22.568 12.1333C22.3244 12.4 22.0018 12.5333 21.6 12.5333H1.33333Z"
            fill="currentColor" />
        </svg>
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

<style scoped>
.bill-adjust-item-move {
  transition: transform 160ms ease;
}

.bill-adjust-item-enter-active {
  transition: transform 200ms ease, opacity 200ms ease;
}

.bill-adjust-item-leave-active {
  transition: opacity 90ms ease-out;
}

.bill-adjust-item-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}

.bill-adjust-item-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.bill-adjust-item-leave-to {
  opacity: 0;
}
</style>
