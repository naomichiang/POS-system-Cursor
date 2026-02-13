<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  activeId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['select'])

const scrollEl = ref(null)
const scrollStep = 150 // 一組約 3–4 個項目 (每項 h-12)

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

const handleSelect = (id) => {
  emit('select', id)
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
  if (scrollEl.value && !isAtBottom.value) {
    scrollEl.value.scrollBy({ top: scrollStep, behavior: 'smooth' })
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
  () => props.items,
  () => nextTick(updateScrollState),
  { deep: true }
)

// pb-14 加入後需重新計算邊界
watch(showArrows, (val) => {
  if (val) nextTick(updateScrollState)
})
</script>

<template>
  <div class="w-32 flex flex-col bg-app-bg">
    <div ref="scrollEl" :class="[
      'flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-2 touch-manipulation',
      showArrows && 'pb-14'
    ]">
      <button v-for="item in items" :key="item.id" type="button" @click="handleSelect(item.id)" :class="[
        // 通用設定：固定高度、動畫、Flex 佈局
        'flex-none h-btn-h-xs px-2 flex font-medium items-center justify-center leading-tight font-noto text-md transition-all active:scale-95 text-left',

        item.id === activeId
          ? [ // 選中狀態：寬度 100%，圓角右側設為 0 (如果要完全黏住)
            'w-full  bg-layer-primary text-lg text-yellow-900 shadow-md z-10',
            'rounded-l-xl rounded-r-none' // 右邊不設圓角，視覺上更黏合右側
          ]
          : [ // 未選中狀態：寬度縮減 8px，四邊維持圓角
            'w-[calc(100%-8px)] bg-button-primary text-text-on-color rounded-xl opacity-85',
            'active:bg-button-primary-hover active:scale-95'
          ]
      ]">
        <span class="block truncate w-full text-center">
          {{ item.name }}
        </span>
      </button>
    </div>

    <!-- 上下切換按鈕（溢出時顯示） -->
    <div v-if="showArrows" class="flex pr-2 py-0 w-full h-14">
      <button type="button" aria-label="上一組" :disabled="isAtTop" :class="[
        'flex-1 flex items-center justify-center rounded-l-xl bg-layer-secondary transition-colors',
        isAtTop ? 'opacity-30 cursor-not-allowed' : 'active:bg-layer-secondary-hover'
      ]" @click="scrollPrev">
        <svg class="w-icon-md h-icon-md shrink-0 text-text-tertiary" viewBox="0 0 23 13" fill="none">
          <path
            d="M1.33333 12.5333C0.933333 12.5333 0.611556 12.4 0.368 12.1333C0.124444 11.8667 0.00177778 11.5556 0 11.2C0 11.1111 0.133334 10.8 0.4 10.2667L10.0667 0.599998C10.2889 0.377776 10.5111 0.222223 10.7333 0.133334C10.9556 0.0444449 11.2 0 11.4667 0C11.7333 0 11.9778 0.0444449 12.2 0.133334C12.4222 0.222223 12.6444 0.377776 12.8667 0.599998L22.5333 10.2667C22.6667 10.4 22.7671 10.5449 22.8347 10.7013C22.9022 10.8578 22.9351 11.024 22.9333 11.2C22.9333 11.5556 22.8116 11.8667 22.568 12.1333C22.3244 12.4 22.0018 12.5333 21.6 12.5333H1.33333Z"
            fill="currentColor" />
        </svg>
      </button>
      <div class="w-[2px] h-full self-center bg-border-primary/60"></div>
      <button type="button" aria-label="下一組" :disabled="isAtBottom" :class="[
        'flex-1 flex items-center justify-center rounded-r-xl bg-layer-secondary border-border-primary transition-colors',
        isAtBottom ? 'opacity-30 cursor-not-allowed' : 'active:bg-layer-secondary-hover'
      ]" @click="scrollNext">
        <svg class="w-icon-md h-icon-md shrink-0 rotate-180 text-text-tertiary" viewBox="0 0 23 13" fill="none">
          <path
            d="M1.33333 12.5333C0.933333 12.5333 0.611556 12.4 0.368 12.1333C0.124444 11.8667 0.00177778 11.5556 0 11.2C0 11.1111 0.133334 10.8 0.4 10.2667L10.0667 0.599998C10.2889 0.377776 10.5111 0.222223 10.7333 0.133334C10.9556 0.0444449 11.2 0 11.4667 0C11.7333 0 11.9778 0.0444449 12.2 0.133334C12.4222 0.222223 12.6444 0.377776 12.8667 0.599998L22.5333 10.2667C22.6667 10.4 22.7671 10.5449 22.8347 10.7013C22.9022 10.8578 22.9351 11.024 22.9333 11.2C22.9333 11.5556 22.8116 11.8667 22.568 12.1333C22.3244 12.4 22.0018 12.5333 21.6 12.5333H1.33333Z"
            fill="currentColor" />
        </svg>
      </button>
    </div>
  </div>
</template>
