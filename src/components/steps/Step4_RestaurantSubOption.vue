<script setup>
import { computed } from 'vue'
import DinerProfileGroups from '../ExtraField.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      preferences: {}
    })
  },
  /**
   * 由 RestaurantConfig 提供的用餐方案按鈕
   */
  preferenceGroups: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const preferencesValue = computed({
  get: () => (props.modelValue && props.modelValue.preferences) || {},
  set: (val) => {
    emit('update:modelValue', {
      ...(props.modelValue || {}),
      preferences: val
    })
  }
})
</script>

<template>
  <!-- <div class="flex-1 overflow-y-auto scrollbar-hide">
    <h2 class="text-xl font-bold text-text-secondary mb-6">選擇用餐方案</h2>
    <div class="grid grid-cols-3 gap-4">
      <button
        v-for="option in props.options"
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
  </div> -->

  <!-- 內容區域（可滾動，不顯示卷軸） -->
  <div class="flex-1 overflow-y-auto scrollbar-hide p-8">
    <!-- 顧客選項群組（方案 / 用餐用途 ...） -->
    <DinerProfileGroups
      v-if="preferenceGroups.length"
      v-model="preferencesValue"
      :groups="preferenceGroups"
    />
  </div>
</template>

<style scoped>
/* 隱藏滾動條但保持滾動功能 */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
