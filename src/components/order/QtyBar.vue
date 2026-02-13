<script setup>
import { ref, onUnmounted, nextTick, watch, computed } from 'vue'
import { Minus, Plus } from 'lucide-vue-next'

const props = defineProps({
  itemName: {
    type: String,
    default: ''
  },
  unitPrice: {
    type: [Number, Object],
    default: 0
  },
  quantity: {
    type: Number,
    default: 1
  },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 99 },
  /** OptGroup 滾動容器 ref，溢出時顯示上下切換按鈕 */
  scrollContainer: {
    type: Object,
    default: null
  }
})

// 取得實際 DOM（支援 ref 或直接傳入元素）
const scrollEl = computed(() => {
  const c = props.scrollContainer
  if (!c) return null
  return c?.value ?? c
})

const scrollStep = 150
const isAtTop = ref(true)
const isAtBottom = ref(true)

function updateScrollState() {
  const el = scrollEl.value
  if (!el) return
  const { scrollHeight, clientHeight, scrollTop } = el
  const threshold = 5
  isAtTop.value = scrollTop <= threshold
  isAtBottom.value = scrollTop + clientHeight >= scrollHeight - threshold
}

const scrollPrev = () => {
  const el = scrollEl.value
  if (!el || isAtTop.value) return

  // 如果目前的捲動位置已經小於一個步長，直接回頂部
  if (el.scrollTop < scrollStep) {
    el.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    el.scrollBy({ top: -scrollStep, behavior: 'smooth' })
  }
}

const scrollNext = () => {
  const el = scrollEl.value
  if (!el || isAtBottom.value) return

  // 同理，如果快到底了，直接捲到底
  const remaining = el.scrollHeight - (el.scrollTop + el.clientHeight)
  if (remaining < scrollStep) {
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  } else {
    el.scrollBy({ top: scrollStep, behavior: 'smooth' })
  }
}

let scrollElInst = null
let resizeObserver = null

function setupScrollListeners(el) {
  if (!el) return
  scrollElInst = el
  el.addEventListener('scroll', updateScrollState)
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updateScrollState)
    resizeObserver.observe(el)
  }
  nextTick(updateScrollState)
}

function cleanupScrollListeners() {
  if (scrollElInst) {
    scrollElInst.removeEventListener('scroll', updateScrollState)
    scrollElInst = null
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
}

watch(
  () => scrollEl.value,
  (el) => {
    cleanupScrollListeners()
    if (el) setupScrollListeners(el)
  },
  { immediate: true }
)

onUnmounted(cleanupScrollListeners)

const emit = defineEmits(['update:quantity', 'increase', 'decrease', 'add'])

const handleIncrease = () => {
  if (props.quantity < props.max) emit('increase')
}

const handleDecrease = () => {
  if (props.quantity > props.min) emit('decrease')
}

const handleAdd = () => {
  emit('add')
}
</script>

<template>
  <div class="flex h-24 w-full items-center gap-2 p-3 border-t border-border-primary bg-layer-tertiary">
    <!-- 上下切換按鈕 -->
    <div class="flex flex-1 min-w-0 h-full min-h-0 shrink-0">
      <div class="flex h-full rounded-xl bg-layer-secondary">
        <button type="button" aria-label="上一組" :disabled="isAtTop" :class="[
          'flex w-18 h-full items-center justify-center transition-colors',
          isAtTop ? 'opacity-30 cursor-not-allowed' : 'active:bg-layer-secondary-hover'
        ]" @click="scrollPrev">
          <svg class="w-icon-md h-icon-md shrink-0 text-text-tertiary" viewBox="0 0 23 13" fill="none">
            <path
              d="M1.33333 12.5333C0.933333 12.5333 0.611556 12.4 0.368 12.1333C0.124444 11.8667 0.00177778 11.5556 0 11.2C0 11.1111 0.133334 10.8 0.4 10.2667L10.0667 0.599998C10.2889 0.377776 10.5111 0.222223 10.7333 0.133334C10.9556 0.0444449 11.2 0 11.4667 0C11.7333 0 11.9778 0.0444449 12.2 0.133334C12.4222 0.222223 12.6444 0.377776 12.8667 0.599998L22.5333 10.2667C22.6667 10.4 22.7671 10.5449 22.8347 10.7013C22.9022 10.8578 22.9351 11.024 22.9333 11.2C22.9333 11.5556 22.8116 11.8667 22.568 12.1333C22.3244 12.4 22.0018 12.5333 21.6 12.5333H1.33333Z"
              fill="currentColor" />
          </svg>
        </button>
        <div class="w-[2px] h-8 self-center bg-border-primary/60"></div>
        <button type="button" aria-label="下一組" :disabled="isAtBottom" :class="[
          'flex w-18 items-center justify-center transition-colors',
          isAtBottom ? 'opacity-30' : 'active:bg-layer-secondary-hover'
        ]" @click="scrollNext">
          <svg class="w-icon-md h-icon-md shrink-0 rotate-180 text-text-tertiary" viewBox="0 0 23 13" fill="none">
            <path
              d="M1.33333 12.5333C0.933333 12.5333 0.611556 12.4 0.368 12.1333C0.124444 11.8667 0.00177778 11.5556 0 11.2C0 11.1111 0.133334 10.8 0.4 10.2667L10.0667 0.599998C10.2889 0.377776 10.5111 0.222223 10.7333 0.133334C10.9556 0.0444449 11.2 0 11.4667 0C11.7333 0 11.9778 0.0444449 12.2 0.133334C12.4222 0.222223 12.6444 0.377776 12.8667 0.599998L22.5333 10.2667C22.6667 10.4 22.7671 10.5449 22.8347 10.7013C22.9022 10.8578 22.9351 11.024 22.9333 11.2C22.9333 11.5556 22.8116 11.8667 22.568 12.1333C22.3244 12.4 22.0018 12.5333 21.6 12.5333H1.33333Z"
              fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 數量選擇器 -->
    <div class="h-full flex bg-layer-light rounded-2xl items-stretch overflow-hidden">
      <!-- 減號按鈕 -->
      <button type="button" @click="handleDecrease" :disabled="quantity <= min"
        class="w-16 h-full flex items-center justify-center transition-all bg-button-light active:bg-button-light-hover">
        <Minus :class="['w-icon-lg h-icon-lg',
          quantity <= min ? 'text-text-placeholder' : 'text-ash-700'
        ]" />
      </button>

      <!-- 數字顯示 -->
      <div class="w-10 self-stretch inline-flex flex-col justify-center items-center">
        <div class="text-center text-text-amount-positive text-2xl font-semibold font-inter">
          {{ quantity }}
        </div>
      </div>

      <!-- 加號按鈕 -->
      <button type="button" @click="handleIncrease" :disabled="quantity >= max"
        class="w-16 h-full flex items-center justify-center transition-all bg-button-light active:bg-button-light-hover">
        <Plus :class="[
          'w-icon-lg h-icon-lg',
          quantity >= max ? 'text-text-disabled' : 'text-ash-700'
        ]" />
      </button>
    </div>

    <button type="button"
      class="h-full w-btn-lg px-6 rounded-2xl bg-button-danger hover:bg-button-danger-hover active:bg-button-danger-hover active:scale-95 transition-all"
      @click="handleAdd">
      <div class="justify-start text-center font-noto text-2xl font-medium leading-9 tracking-wide text-text-on-color">
        加入
      </div>
    </button>
  </div>
</template>
