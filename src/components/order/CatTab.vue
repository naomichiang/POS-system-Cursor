<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  activeKey: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['change'])

const scrollEl = ref(null)
const scrollStep = 200
const showArrows = ref(false)

function checkOverflow() {
  if (!scrollEl.value) return
  showArrows.value = scrollEl.value.scrollWidth > scrollEl.value.clientWidth
}

const handleClick = (key) => {
  if (key === props.activeKey) return
  emit('change', key)
}

const scrollPrev = () => {
  if (scrollEl.value) scrollEl.value.scrollBy({ left: -scrollStep, behavior: 'smooth' })
}

const scrollNext = () => {
  if (scrollEl.value) scrollEl.value.scrollBy({ left: scrollStep, behavior: 'smooth' })
}

let resizeObserver = null

onMounted(() => {
  nextTick(() => checkOverflow())
  if (scrollEl.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => checkOverflow())
    resizeObserver.observe(scrollEl.value)
  }
})

onUnmounted(() => {
  if (resizeObserver && scrollEl.value) {
    resizeObserver.disconnect()
  }
})

watch(
  () => props.categories,
  () => {
    nextTick(checkOverflow)
  },
  { deep: true }
)
</script>

<template>
  <div class="flex w-full min-w-0 h-btn-h-sm shrink-0 justify-start items-center overflow-hidden">
    <!-- Previous -->
    <div
      v-if="showArrows"
      class="w-12 h-full shrink-0 inline-flex flex-col justify-start">
      <button
        type="button"
        aria-label="上一頁"
        class="w-10 h-full flex justify-center items-center rounded-lg transition-opacity text-ash-600 active:bg-yellow-500"
        @click="scrollPrev"
      >
        <svg width="17" height="21" viewBox="0 0 17 21" fill="none">
          <path
            d="M0.751723 11.7083C0.501723 11.5417 0.314501 11.3333 0.190057 11.0833C0.0656123 10.8333 0.0022792 10.5694 5.69802e-05 10.2917C-0.00216524 10.0139 0.0606124 9.75 0.18839 9.5C0.316168 9.25 0.50339 9.04167 0.750057 8.875L14.3334 0.25C14.4723 0.166667 14.6184 0.104445 14.7717 0.0633335C14.9251 0.0222224 15.0712 0.00111111 15.2101 0C15.6545 0 16.0434 0.16 16.3767 0.48C16.7101 0.8 16.8767 1.19556 16.8767 1.66667V18.9167C16.8767 19.3889 16.7101 19.785 16.3767 20.105C16.0434 20.425 15.6545 20.5844 15.2101 20.5833C15.0712 20.5833 14.9256 20.5622 14.7734 20.52C14.6212 20.4778 14.4751 20.4156 14.3351 20.3333L0.751723 11.7083Z"
            fill="currentColor" />
        </svg>
      </button>
    </div>

    <!-- Tab list -->
    <div
      ref="scrollEl"
      class="flex-1 flex h-full justify-start items-center gap-1 overflow-x-auto overflow-y-hidden scrollbar-hide min-w-0"
    >
      <button
        v-for="cat in categories"
        :key="cat.key"
        type="button"
        :data-state="cat.key === activeKey ? 'Tertiary' : 'Secondary'"
        :class="[
          'shrink-0 w-28 h-full min-w-20 px-4 rounded-2xl flex justify-center items-center',
          'text-center text-text-on-color text-xl font-medium font-noto leading-7',
          'transition-colors active:scale-[0.98]',
          cat.key === activeKey
            ? 'bg-yellow-800'
            : 'bg-button-primary hover:bg-button-primary-hover'
        ]"
        @click="handleClick(cat.key)"
      >
        {{ cat.label }}
      </button>
    </div>

    <!-- Next -->
    <div
      v-if="showArrows"
      class="w-12 h-full shrink-0 inline-flex flex-col justify-start">
      <button
        type="button"
        aria-label="下一頁"
        class="w-10 h-full flex justify-center items-center rounded-lg transition-opacity text-ash-600 active:bg-yellow-500"
        @click="scrollNext"
      >
        <svg width="17" height="21" viewBox="0 0 17 21" fill="none" >
          <path
            d="M0 18.9167V1.66667C0 1.19445 0.166667 0.798339 0.5 0.478339C0.833334 0.158339 1.22222 -0.00110534 1.66667 5.767e-06C1.80556 5.767e-06 1.95167 0.0205616 2.105 0.0616727C2.25833 0.102784 2.40389 0.165561 2.54167 0.250006L16.125 8.875C16.375 9.04167 16.5628 9.25 16.6883 9.5C16.8139 9.75 16.8761 10.0139 16.875 10.2917C16.8739 10.5695 16.8117 10.8333 16.6883 11.0833C16.565 11.3333 16.3772 11.5417 16.125 11.7083L2.54167 20.3333C2.40278 20.4167 2.25722 20.4795 2.105 20.5217C1.95278 20.5639 1.80667 20.5844 1.66667 20.5833C1.22222 20.5833 0.833334 20.4233 0.5 20.1033C0.166667 19.7833 0 19.3878 0 18.9167Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

