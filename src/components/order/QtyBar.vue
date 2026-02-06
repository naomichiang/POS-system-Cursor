<script setup>
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
  }
})

const emit = defineEmits(['update:quantity', 'increase', 'decrease', 'add'])

const handleIncrease = () => {
  emit('increase')
}

const handleDecrease = () => {
  emit('decrease')
}

const handleAdd = () => {
  emit('add')
}
</script>

<template>
  <div class="flex items-center gap-3 px-4 py-2 border-t border-border-primary bg-layer-secondary">
    <div class="flex flex-col flex-1 min-w-0">
      <div class="text-xs text-text-helper truncate">
        {{ itemName || '請選擇品項' }}
      </div>
      <div class="text-base font-inter font-semibold text-text-amount-positive">
        {{ Number(unitPrice).toLocaleString() }}
      </div>
    </div>

    <div class="flex items-center gap-1">
      <button
        type="button"
        class="w-10 h-10 flex items-center justify-center rounded-xl bg-layer-primary hover:bg-layer-primary-hover active:bg-layer-primary-hover border border-border-primary text-lg font-bold text-text-secondary active:scale-95 transition-all"
        @click="handleDecrease"
      >
        -
      </button>
      <div class="w-10 text-center text-base font-inter font-semibold text-text-primary">
        {{ quantity }}
      </div>
      <button
        type="button"
        class="w-10 h-10 flex items-center justify-center rounded-xl bg-layer-primary hover:bg-layer-primary-hover active:bg-layer-primary-hover border border-border-primary text-lg font-bold text-text-secondary active:scale-95 transition-all"
        @click="handleIncrease"
      >
        +
      </button>
    </div>

    <button
      type="button"
      class="h-10 px-6 rounded-xl bg-button-danger hover:bg-button-danger-hover active:bg-button-danger-hover text-text-on-color text-sm font-noto font-medium tracking-[0.3em] leading-none active:scale-95 transition-all"
      @click="handleAdd"
    >
      加入
    </button>
  </div>
</template>

