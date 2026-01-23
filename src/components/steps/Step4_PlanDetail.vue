<script setup>
defineProps({
  modelValue: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const mealPlanOptions = [
  { value: 'standard', label: '標準方案' },
  { value: 'premium', label: '精選方案' },
  { value: 'vip', label: 'VIP 方案' }
]

const selectMealPlan = (plan) => {
  emit('update:modelValue', plan)
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-text-primary mb-6">選擇用餐方案</h2>
    <div class="grid grid-cols-3 gap-6">
      <button
        v-for="option in mealPlanOptions"
        :key="option.value"
        @click="selectMealPlan(option.value)"
        :class="[
          'flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all',
          modelValue === option.value
            ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
            : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
        ]"
      >
        <span class="text-xl font-semibold text-text-primary">{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>
