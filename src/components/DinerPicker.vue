<!-- 用在 Step2_DinerCount，用於選擇用餐人數

@param {Number} modelValue 選擇的人數
@param {String} label 選擇的人數的標籤
@param {Array} quickOptions 快速選擇的人數
@param {String} unit 單位
 -->

<script setup>
import { computed } from 'vue'
import { Minus, Plus } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  label: { type: String, default: '總人數' },
  quickOptions: { type: Array, default: () => [2, 4, 6] },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 99 },
  unit: { type: String, default: '人' }
})

const emit = defineEmits(['update:modelValue'])

const currentValue = computed({
  get: () => props.modelValue || 0,
  set: (value) => {
    const clampedValue = Math.max(props.min, Math.min(props.max, value))
    emit('update:modelValue', clampedValue)
  }
})

const selectQuickOption = (value) => {
  currentValue.value = value
}

const increment = () => {
  if (currentValue.value < props.max) {
    currentValue.value = currentValue.value + 1
  }
}

const decrement = () => {
  if (currentValue.value > props.min) {
    currentValue.value = currentValue.value - 1
  }
}
</script>

<template>
  <div class="h-btn-h-lg flex items-center gap-6 w-full">
    <div class="w-20 shrink-0">
      <div class="text-text-helper text-lg font-medium font-noto tracking-wider">
        {{ label }}
      </div>
    </div>

    <!-- 選擇器區域 -->
    <div class="flex-1 flex items-center gap-4 h-full min-w-0">
      <!-- 快速選擇按鈕 -->
      <button
        v-for="option in quickOptions"
        :key="option"
        @click="selectQuickOption(option)"
        :class="[
          'w-36 h-full rounded-2xl flex justify-center items-center transition-all active:scale-95 shadow-sm',
          currentValue === option
            ? 'bg-button-danger shadow-lg'
            : 'bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-hover'
        ]"
      >
      <div class="flex items-baseline gap-2">
        <span class="text-text-on-color text-4xl font-semibold font-inter">{{ option }}</span>
        <span class="text-text-on-color text-xl font-medium font-noto">{{ unit }}</span>
        </div>
      </button>

      <!-- 自訂數量輸入器 -->
      <div class="h-full bg-layer-light rounded-2xl flex items-stretch overflow-hidden">
      <!-- 減號按鈕 -->
        <button
          @click="decrement"
          :disabled="currentValue <= min"
          :class="[
            'w-20 flex items-center justify-center transition-all active:scale-95',
            currentValue <= min
              ? 'bg-button-primary-disabled cursor-not-allowed'
              : 'bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-hover'
          ]"
        >
          <Minus
            :class="[
              'w-icon-xl h-icon-xl',
              currentValue <= min ? 'text-text-disabled' : 'text-text-on-color'
            ]"
          />
        </button>

        <!-- 數字顯示 -->
        <div class="w-20 self-stretch inline-flex flex-col justify-center items-center">
          <div class="text-center justify-center text-text-secondary text-4xl font-semibold font-inter">
            {{ currentValue }}
          </div>
        </div>

        <!-- 加號按鈕 -->
        <button
          @click="increment"
          :disabled="currentValue >= max"
          :class="[
            'w-20 flex items-center justify-center transition-all active:scale-95',
            currentValue >= max
              ? 'bg-button-primary-disabled cursor-not-allowed'
              : 'bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-hover'
          ]"
        >
          <Plus
            :class="[
              'w-icon-xl h-icon-xl',
              currentValue >= max ? 'text-text-disabled' : 'text-text-on-color'
            ]"
          />
        </button>
      </div>

      <!-- 單位標籤 -->
      <div class="w-6 shrink-0 flex items-center justify-center">
        <span class="text-text-secondary text-xl font-medium font-noto">{{ unit }}</span>
      </div>
    </div>
  </div>
</template>

