<script setup>
import { ref, computed, watch } from 'vue'
import DinerPicker from '../DinerPicker.vue'
import { DEFAULT_DINER_PICKER_CONFIG } from '../../config/dinerPickerConfig'

const props = defineProps({
  modelValue: {
    type: Number,
    default: null
  },
  tableId: {
    type: [Number, String],
    default: null
  },
  /** 由後端提供的 picker 設定，決定要顯示幾個 picker 與各自選項；未提供時使用預設設定 */
  pickerConfigs: {
    type: Array,
    default: () => DEFAULT_DINER_PICKER_CONFIG
  }
})

const emit = defineEmits(['update:modelValue'])

const primaryKey = computed(
  () => props.pickerConfigs.find((c) => c.isPrimary)?.key ?? props.pickerConfigs[0]?.key
)

const pickerValues = ref({})

function initPickerValues() {
  const configs = props.pickerConfigs
  const next = {}
  for (const c of configs) {
    const prev = pickerValues.value[c.key]
    if (prev !== undefined) {
      next[c.key] = prev
    } else {
      next[c.key] = c.key === primaryKey.value ? (props.modelValue ?? 0) : 0
    }
  }
  pickerValues.value = next
}

watch(
  () => props.pickerConfigs,
  () => initPickerValues(),
  { immediate: true }
)

watch(
  () => pickerValues.value[primaryKey.value],
  (v) => emit('update:modelValue', v ?? 0),
  { immediate: true }
)

watch(
  () => props.modelValue,
  (v) => {
    const pk = primaryKey.value
    if (!pk) return
    const current = pickerValues.value[pk]
    const next = v ?? 0
    if (current !== next) {
      pickerValues.value = { ...pickerValues.value, [pk]: next }
    }
  }
)

function updatePicker(key, value) {
  pickerValues.value = { ...pickerValues.value, [key]: value }
}
</script>

<template>
  <div class="flex-1 bg-white rounded-2xl shadow-sm overflow-y-auto">
    <div class="p-8 space-y-8">
      <h2 class="text-2xl font-bold text-text-primary mb-6">設定用餐人數</h2>

      <DinerPicker
        v-for="config in pickerConfigs"
        :key="config.key"
        :model-value="pickerValues[config.key] ?? 0"
        @update:model-value="(v) => updatePicker(config.key, v)"
        :label="config.label"
        :quick-options="config.quickOptions"
        :min="config.min"
        :max="config.max"
        :unit="config.unit ?? '人'"
      />
    </div>
  </div>
</template>
