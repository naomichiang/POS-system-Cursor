<script setup>
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
  max: { type: Number, default: 99 }
})

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
    <div class="flex flex-col flex-1 min-w-0">
      <div class="text-xs text-text-helper truncate">
        {{ itemName || '請選擇品項' }}
      </div>
      <div class="text-base font-inter font-semibold text-text-amount-positive">
        {{ Number(unitPrice).toLocaleString() }}
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
