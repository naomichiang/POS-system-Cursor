<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { Utensils, DollarSign } from 'lucide-vue-next';
import { useOrderStore } from '@/stores/useOrderStore'

const orderStore = useOrderStore()

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  totalCount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: [Number, String],
    default: 0,
  },
})

const emit = defineEmits(['delete-all'])

const isExpanded = ref(false)

const formatOptions = (item) => {
  if (!item) return ''

  // 從菜單結構中取出使用者實際選擇的細項
  const modifiers = item.modifiers || {}
  const selections = modifiers.optionSelections || item.optionSelections || {}
  const groups = modifiers.displayGroups || item.optionGroups || []

  if (!groups.length || !selections || typeof selections !== 'object') {
    return ''
  }

  const labels = []

  for (const group of groups) {
    if (!group || !Array.isArray(group.options)) continue

    const key = group.key || group.label
    const selected = selections[key]
    if (!selected) continue

    const addLabelByValue = (value) => {
      const opt = group.options.find(o => (o.value ?? o.label) === value)
      if (opt && opt.label) {
        labels.push(opt.label)
      }
    }

    if (Array.isArray(selected)) {
      selected.forEach(v => addLabelByValue(v))
    } else {
      addLabelByValue(selected)
    }
  }

  return labels.join('、')
}

const toggle = () => {
  isExpanded.value = !isExpanded.value
}

const handleDeleteAll = () => {
  emit('delete-all')
}

const handleDeleteItem = (cartItemId) => {
  if (!cartItemId) return
  orderStore.removeFromCart(cartItemId)
}
</script>

<template>
  <!-- 側邊滑出容器 -->
  <div class="relative flex h-full shrink-0 flex-col transition-all duration-300 ease-in-out"
    :class="isExpanded ? 'w-[430px]' : 'w-60'">

    <div
      class="flex h-full w-full flex-col items-start justify-start overflow-hidden rounded-2xl bg-layer-primary shadow-[0px_4px_8px_0px] shadow-ash-700/40">
      <!-- list -->
      <div class="flex-1 w-full overflow-y-auto">
        <div v-if="props.items.length === 0"
          class="flex h-full items-start justify-center text-text-placeholder text-lg">
          <span class="text-center py-12">- 尚未點餐 -</span>
        </div>
        <TransitionGroup name="fade" tag="div">
          <div v-for="(item, index) in props.items" :key="item.cartItemId"
            class="relative flex w-full gap-3 px-3 pt-2 pb-3" :class="isExpanded ? 'items-start' : 'items-center'">
            <!-- delete-Button -->
            <button @click="handleDeleteItem(item.cartItemId)"
              class="flex-none w-btn-xs h-btn-xs mt-8-0-5 flex items-center justify-center rounded-xl bg-button-highlight-red active:bg-button-highlight-red-hover transition-colors">
              <Icon icon="tabler:x" class="w-icon-lg h-icon-lg text-text-disabled [&_path]:stroke-[2.2px]" />
            </button>

            <!-- index -->
            <div v-if="isExpanded"
              class="flex-none w-2 self-start pt-[3px] items-center justify-center text-sm text-text-placeholder font-medium">
              {{ index + 1 }}
            </div>

            <!-- content -->
            <div class="flex-1 min-w-0 flex flex-col">
              <!-- 第一行 餐點名稱靠左顯示，文字太多時會折行，顯示最多兩行，超過會變成...;右邊是份數 -->
              <div class="flex items-start justify-between w-full">
                <div
                  class="flex-1 text-left font-noto text-xl font-normal leading-7 text-text-primary line-clamp-2 break-all">
                  {{ item.name }}
                </div>

                <div v-if="isExpanded && item.quantity > 1"
                  class="flex-none w-12 text-right font-inter text-lg pr-8-0-5 font-medium leading-7 text-text-tertiary">
                  x {{ item.quantity }}
                </div>
              </div>
              <!-- 第二行 左邊是 餐點備註 靠左顯示，文字太多時會折行顯示;右邊是價格 -->
              <div v-if="isExpanded" class="flex items-end justify-between w-full gap-2">
                <div class="flex-1 text-left font-noto text-lg font-normal leading-5 text-text-helper break-all">
                  {{ formatOptions(item) }}
                </div>
                <div class="flex-none flex items-center justify-end gap-1 transform translate-y-[7px]">
                  <div class="text-right font-inter text-xl font-medium text-text-helper">
                    {{ item.price }}
                  </div>
                  <DollarSign :size="18" :stroke-width="2.5" class="text-yellow-500" />
                </div>
              </div>
            </div>
            <div class="absolute bottom-0 left-4 right-4 h-px bg-border-primary"></div>
          </div>
        </TransitionGroup>
      </div>

      <!-- bottom toolbar: delete / up / down -->
      <div class="flex z-10 h-14 w-full items-stretch shadow-[0px_-4px_8px_0px] shadow-ash-400/40 bg-button-light">

        <button type="button" class="flex flex-none w-btn-sm flex-col items-center justify-center border-r border-border-primary bg-button-highlight-red
          active:scale-95 active:bg-button-highlight-red-hover transition-all duration-200" @click="handleDeleteAll">
          <Icon icon="tabler:trash-x-filled" class="text-ash-700 h-icon-lg w-icon-lg" />
        </button>

        <button type="button"
          class="flex flex-1 items-center justify-center border-r border-border-primary-focus/20 text-ash-600 active:bg-button-light-hover transition-colors">
          <svg class="w-icon-lg h-icon-lg shrink-0" viewBox="0 0 23 13" fill="none">
            <path
              d="M1.33333 12.5333C0.933333 12.5333 0.611556 12.4 0.368 12.1333C0.124444 11.8667 0.00177778 11.5556 0 11.2C0 11.1111 0.133334 10.8 0.4 10.2667L10.0667 0.599998C10.2889 0.377776 10.5111 0.222223 10.7333 0.133334C10.9556 0.0444449 11.2 0 11.4667 0C11.7333 0 11.9778 0.0444449 12.2 0.133334C12.4222 0.222223 12.6444 0.377776 12.8667 0.599998L22.5333 10.2667C22.6667 10.4 22.7671 10.5449 22.8347 10.7013C22.9022 10.8578 22.9351 11.024 22.9333 11.2C22.9333 11.5556 22.8116 11.8667 22.568 12.1333C22.3244 12.4 22.0018 12.5333 21.6 12.5333H1.33333Z"
              fill="currentColor" />
          </svg>
        </button>

        <button type="button"
          class="flex flex-1 items-center justify-center text-ash-600 active:bg-button-light-hover transition-colors">
          <svg class="w-icon-lg h-icon-lg shrink-0 rotate-180" viewBox="0 0 23 13" fill="none">
            <path
              d="M1.33333 12.5333C0.933333 12.5333 0.611556 12.4 0.368 12.1333C0.124444 11.8667 0.00177778 11.5556 0 11.2C0 11.1111 0.133334 10.8 0.4 10.2667L10.0667 0.599998C10.2889 0.377776 10.5111 0.222223 10.7333 0.133334C10.9556 0.0444449 11.2 0 11.4667 0C11.7333 0 11.9778 0.0444449 12.2 0.133334C12.4222 0.222223 12.6444 0.377776 12.8667 0.599998L22.5333 10.2667C22.6667 10.4 22.7671 10.5449 22.8347 10.7013C22.9022 10.8578 22.9351 11.024 22.9333 11.2C22.9333 11.5556 22.8116 11.8667 22.568 12.1333C22.3244 12.4 22.0018 12.5333 21.6 12.5333H1.33333Z"
              fill="currentColor" />
          </svg>
        </button>
      </div>

      <!-- summary row: 已點餐點數 / 已點金額 -->
      <div
        class="flex z-10 h-16 items-center justify-between self-stretch border-y border-border-primary bg-layer-primary px-4">
        <!-- summary: 已點餐點數 -->
        <div class="flex items-center gap-2">
          <Utensils :stroke-width="2.8" :class="'text-ash-400 w-6 h-6'" />
          <div class="flex items-baseline gap-1">
            <span class="font-inter text-2xl font-bold leading-none text-button-primary">
              {{
                props.items.reduce(
                  (sum, item) => sum + Number(item.quantity || 0),
                  0
                )
              }}
            </span>
          </div>
        </div>
        <!-- summary: 已點金額 -->
        <div class="flex items-center justify-end gap-1">
          <div class="flex flex-col items-end">
            <span class="font-inter text-3xl font-bold leading-10 text-text-amount-positive">
              {{ totalAmount }}
            </span>
          </div>
          <DollarSign :stroke-width="3" :class="'text-yellow-600 w-6 h-6'" />
        </div>
      </div>

      <!-- footer buttons -->
      <div class="flex z-10 h-24 w-full items-start justify-start gap-3 p-3">
        <button type="button"
          class="flex h-full w-18 flex-none items-center justify-center rounded-2xl bg-button-primary active:bg-button-primary-hover transition-all"
          @click="toggle">
          <span v-if="isExpanded">
            <svg width="13" height="23" viewBox="0 0 13 23" fill="none">
              <path
                d="M8.99893 11.0833L0.423934 2.50834C0.132267 2.21667 -0.00889922 1.87134 0.000434109 1.47234C0.00976744 1.07334 0.160656 0.728392 0.453101 0.437503C0.745545 0.146614 1.09088 0.000780872 1.4891 3.09461e-06C1.88732 -0.000774683 2.23227 0.145059 2.52393 0.437503L11.4781 9.42084C11.7114 9.65417 11.8864 9.91667 12.0031 10.2083C12.1198 10.5 12.1781 10.7917 12.1781 11.0833C12.1781 11.375 12.1198 11.6667 12.0031 11.9583C11.8864 12.25 11.7114 12.5125 11.4781 12.7458L2.49477 21.7292C2.2031 22.0208 1.86282 22.162 1.47393 22.1527C1.08504 22.1433 0.744767 21.9924 0.453101 21.7C0.161434 21.4076 0.0156008 21.0622 0.0156008 20.664C0.0156008 20.2658 0.161434 19.9208 0.453101 19.6292L8.99893 11.0833Z"
                fill="white" />
            </svg>
          </span>
          <span v-else>
            <svg width="13" height="23" viewBox="0 0 13 23" fill="none">
              <path
                d="M3.17917 11.0698L11.7542 19.6448C12.0458 19.9364 12.187 20.2767 12.1777 20.6656C12.1683 21.0545 12.0174 21.3948 11.725 21.6864C11.4326 21.9781 11.0923 22.1239 10.7042 22.1239C10.3161 22.1239 9.97578 21.9781 9.68333 21.6864L0.7 12.7323C0.466667 12.4989 0.291667 12.2364 0.175 11.9448C0.0583334 11.6531 0 11.3614 0 11.0698C0 10.7781 0.0583334 10.4864 0.175 10.1948C0.291667 9.9031 0.466667 9.6406 0.7 9.40727L9.68333 0.423934C9.975 0.132267 10.3203 -0.00889922 10.7193 0.000434109C11.1183 0.00976744 11.4633 0.160656 11.7542 0.453101C12.0451 0.745545 12.1909 1.08582 12.1917 1.47393C12.1924 1.86205 12.0466 2.20232 11.7542 2.49477L3.17917 11.0698Z"
                fill="white" />
            </svg>
          </span>
        </button>
        <!-- 面板收起時隱藏暫存按鈕 -->
        <button v-if="isExpanded" type="button"
          class="flex h-full w-26 items-center justify-center rounded-2xl bg-button-primary px-4 active:bg-button-primary-hover active:scale-95 transition-transform">
          <div class="text-center font-noto text-2xl font-medium tracking-wide text-text-on-color">
            暫存
          </div>
        </button>

        <button type="button"
          class="flex h-full flex-1 items-center justify-center gap-2 rounded-2xl bg-button-danger px-4 active:bg-button-danger-hover active:scale-95 transition-transform">
          <div class="flex items-center justify-start pt-1" />
          <div
            class="justify-start text-center font-noto text-2xl font-medium leading-9 tracking-wide text-text-on-color">
            送出
          </div>
          <div class="flex items-center justify-start pt-1" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
