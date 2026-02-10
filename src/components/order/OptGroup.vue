<script setup>
// 點餐頁細項設定容器：只是把 config 轉接給共用的 ExtraField
import ExtraField from '../common/ExtraField.vue'

defineProps({
  groups: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (val) => {
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="w-full">
    <ExtraField
      :groups="groups"
      :model-value="modelValue"
      mode="order"
      @update:model-value="handleChange"
    />
  </div>
</template>

