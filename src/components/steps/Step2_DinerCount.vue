<script setup>
import { ref, computed, watch } from 'vue'
import DinerPicker from '../DinerPicker.vue'
import { DEFAULT_DINER_PICKER_CONFIG } from '../../config/restaurantConfig'

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

// 初始化：根據 Config 產生對應的 Key
function initPickerValues() {
  const configs = props.pickerConfigs
  const next = {}
  for (const c of configs) {
    const prev = pickerValues.value[c.key]
    if (prev !== undefined) {
      // 1. 如果本地已經有值了（操作中），維持現狀
      next[c.key] = prev
    } else {
      // 2. 如果是主欄位且父組件有提供 modelValue（包含 0），則優先採用該值
      if (c.key === primaryKey.value && props.modelValue !== null) {
        next[c.key] = props.modelValue
      }
      // 3. 其餘情況，若配置有 defaultValue 就用 defaultValue
      else if (c.defaultValue !== undefined) {
        next[c.key] = c.defaultValue
      }
      // 4. 最後才退回到 0
      else {
        next[c.key] = 0
      }
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
  pickerValues.value[key] = value // 直接賦值，Vue 3 的 ref 會自動追蹤
}
</script>

<template>
  <!-- 內容區域（可滾動，不顯示卷軸） -->
  <div class="flex-1 overflow-y-auto scrollbar-hide p-8">
    <div class="space-y-4">
      <h2 class="text-xl font-bold text-text-secondary mb-6">設定用餐人數</h2>

      <!-- 由後端決定是否在主 picker（例如「總人數」）下方顯示分隔線，可在 pickerConfig 中加上 showSeparatorAfter -->
      <div v-for="config in pickerConfigs" :key="config.key">
        <DinerPicker
          :model-value="pickerValues[config.key] ?? 0"
          @update:model-value="(v) => updatePicker(config.key, v)"
          :label="config.label"
          :quick-options="config.quickOptions"
          :min="config.min"
          :max="config.max"
          :unit="config.unit ?? '人'"
        />

        <!-- 若該 picker 設定有 showSeparatorAfter，則在其下方顯示分隔線 -->
        <div
          v-if="config.showSeparatorAfter"
          class="my-4 h-0.5 self-stretch bg-border-primary"
        />
      </div>
    </div>
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
