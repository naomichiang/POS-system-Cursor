<script setup>
import { computed } from 'vue'
import DinerProfileGroups from '../common/ExtraField.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      preferences: {}
    })
  },
  /**
   * 後端傳入的顧客選項群組資料
   * 例如：
   * [
   *   {
   *     key: 'plan',
   *     label: '方案',
   *     options: [
   *       { value: 'plan-599', label: '吃到飽 599' },
   *       ...
   *     ]
   *   },
   *   ...
   * ]
   */
  preferenceGroups: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const preferencesValue = computed({
  get: () => props.modelValue.preferences || {},
  set: (val) => {
    emit('update:modelValue', {
      ...props.modelValue,
      preferences: val
    })
  }
})
</script>

<template>
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
