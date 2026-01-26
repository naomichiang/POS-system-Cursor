<script setup>
import { ref } from 'vue'
import DinerPicker from '../DinerPicker.vue'

defineProps({
  modelValue: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

// 定義各種人數的狀態
const totalCount = ref(0)
const adultCount = ref(0)
const childCount = ref(0)
const maleCount = ref(0)
const femaleCount = ref(0)
const seniorCount = ref(0)

// 當總人數改變時，同步更新 modelValue
const updateTotalCount = (value) => {
  totalCount.value = value
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="flex-1 bg-white rounded-2xl shadow-sm overflow-y-auto">
    <div class="p-8 space-y-8">
      <h2 class="text-2xl font-bold text-text-primary mb-6">設定用餐人數</h2>

      <!-- 總人數 -->
      <DinerPicker
        v-model="totalCount"
        label="總人數"
        :quick-options="[2, 4, 6]"
        :min="0"
        :max="50"
        @update:model-value="updateTotalCount"
      />

      <!-- 成人 -->
      <DinerPicker
        v-model="adultCount"
        label="成人"
        :quick-options="[1, 2, 3]"
        :min="0"
        :max="50"
      />

      <!-- 小孩 -->
      <DinerPicker
        v-model="childCount"
        label="小孩"
        :quick-options="[0, 1, 2]"
        :min="0"
        :max="50"
      />

      <!-- 男性 -->
      <DinerPicker
        v-model="maleCount"
        label="男性"
        :quick-options="[1, 2, 3]"
        :min="0"
        :max="50"
      />

      <!-- 女性 -->
      <DinerPicker
        v-model="femaleCount"
        label="女性"
        :quick-options="[1, 2, 3]"
        :min="0"
        :max="50"
      />

      <!-- 老年人 -->
      <DinerPicker
        v-model="seniorCount"
        label="老年人"
        :quick-options="[0, 1, 2]"
        :min="0"
        :max="50"
      />
    </div>
  </div>
</template>
