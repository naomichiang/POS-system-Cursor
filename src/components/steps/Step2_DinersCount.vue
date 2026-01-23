<script setup>
defineProps({
  modelValue: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const selectDiners = (count) => {
  emit('update:modelValue', count)
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-text-primary mb-6">設定用餐人數</h2>
    <div class="grid grid-cols-4 gap-4">
      <button
        v-for="count in 12"
        :key="count"
        @click="selectDiners(count)"
        :class="[
          'flex items-center justify-center p-6 rounded-xl border-2 transition-all text-lg font-semibold',
          modelValue === count
            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105'
            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:shadow-md'
        ]"
      >
        {{ count }}人
      </button>
    </div>
    <div class="mt-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">或輸入自訂人數</label>
      <input
        type="number"
        :value="modelValue"
        @input="emit('update:modelValue', parseInt($event.target.value) || null)"
        min="1"
        max="50"
        placeholder="請輸入人數"
        class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
      />
    </div>
  </div>
</template>
