<script setup>
import { ref } from 'vue'
import { useOrderStore } from '../../stores/useOrderStore'

const orderStore = useOrderStore()

const isExpanded = ref(true)

const toggle = () => {
  isExpanded.value = !isExpanded.value
}

const items = orderStore.cart.items
</script>

<template>
  <div
    class="relative h-full transition-all duration-300 ease-in-out flex flex-col shrink-0"
    :class="isExpanded ? 'w-[330px]' : 'w-44'"
  >
    <!-- 展開 / 收合按鈕 -->
    <button
      type="button"
      class="absolute -left-4 top-16 z-10 w-6 h-16 rounded-l-full bg-layer-dark-primary flex items-center justify-center text-text-on-color text-xs font-medium shadow-md active:scale-95 transition-transform"
      @click="toggle"
    >
      <span v-if="isExpanded">⟨</span>
      <span v-else>⟩</span>
    </button>

    <div class="flex-1 flex flex-col h-full bg-layer-primary rounded-l-2xl shadow-xl overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-3 h-10 bg-layer-dark-primary text-text-on-color">
        <div class="text-xs font-noto tracking-[0.2em]">
          訂單
        </div>
        <div class="text-xs font-inter">
          桌號：{{ orderStore.orderInfo.tableNumber || '-' }}
        </div>
      </div>

      <!-- Items -->
      <div class="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-2">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex flex-col p-2 rounded-lg bg-layer-secondary"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex-1 truncate">
              <div class="text-sm font-medium text-text-primary truncate">
                {{ item.name }}
              </div>
              <div
                v-if="item.modifiers?.optionSelections && Object.keys(item.modifiers.optionSelections).length"
                class="mt-1 text-[10px] text-text-helper leading-snug line-clamp-2"
              >
                <!-- 簡單文字化顯示選項 -->
                {{
                  Object.entries(item.modifiers.optionSelections)
                    .map(([key, val]) =>
                      Array.isArray(val) ? `${key}: ${val.join(',')}` : `${key}: ${val}`
                    )
                    .join(' / ')
                }}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="text-xs font-inter text-text-helper">
                × {{ item.quantity }}
              </div>
              <div class="text-sm font-inter font-semibold text-text-amount-positive">
                {{ (item.price * item.quantity).toLocaleString() }}
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="!items.length"
          class="flex items-center justify-center h-full text-xs text-text-helper"
        >
          尚未加入任何品項
        </div>
      </div>

      <!-- Footer 總計 / 送出 -->
      <div class="shrink-0 border-t border-border-primary bg-layer-total p-2 space-y-2">
        <div class="flex items-center justify-between">
          <div class="text-xs text-text-primary font-noto">
            小計
          </div>
          <div class="text-lg font-inter font-bold text-text-amount-positive">
            {{ orderStore.subtotal.toLocaleString() }}
          </div>
        </div>

        <button
          type="button"
          class="w-full h-10 rounded-xl bg-button-danger hover:bg-button-danger-hover active:bg-button-danger-hover text-text-on-color text-sm font-noto font-medium tracking-[0.3em] leading-none active:scale-95 transition-all"
        >
          送出
        </button>
      </div>
    </div>
  </div>
</template>

