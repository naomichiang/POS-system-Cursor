<!-- 用在 Step3_RestaurantMainOption 和 Step4_RestaurantSubOption，用於選擇額外資訊 -->

<script setup>
const props = defineProps({
  /**
   * 後端傳入的分類與選項（同 RestaurantConfig ExtraField 格式）
   * [
   *   {
   *     key: 'plan',
   *     label: '方案',
   *     options: [{ value: 'plan-599', label: '吃到飽 599' }, ...],
   *     isLargeBtn: true  // 此組為大寬度按鈕，未設則小寬度
   *   }
   * ]
   */
  groups: {
    type: Array,
    default: () => []
  },
  /**
   * v-model 綁定的選取結果
   * 預設為單選：
   * - isMultiple = false（預設）：{ [groupKey]: string | undefined }
   * - isMultiple = true：{ [groupKey]: string[] }
   *
   * 若某一組需要覆寫成多選，可在該 group 上設定 isMultiple: true
   */
  modelValue: {
    type: Object,
    default: () => ({})
  },
  /**
   * 是否允許多選
   * - 預設為 false（單選）
   * - 若 group 上有設定 isMultiple，會優先採用 group 的設定
   */
  isMultiple: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const toggleOption = (group, optionValue) => {
  const groupKey = group.key || group.label
  const multiple = typeof group.isMultiple === 'boolean' ? group.isMultiple : props.isMultiple

  const current = props.modelValue[groupKey]
  const currentArray = Array.isArray(current)
    ? [...current]
    : current != null
      ? [current]
      : []

  if (multiple) {
    const groupValues = [...currentArray]
    const index = groupValues.indexOf(optionValue)

    if (index === -1) {
      groupValues.push(optionValue)
    } else {
      groupValues.splice(index, 1)
    }

    emit('update:modelValue', {
      ...props.modelValue,
      [groupKey]: groupValues
    })
  } else {
    // 單選：再次點擊同一選項時，清空選擇
    const isSame = current === optionValue || currentArray[0] === optionValue
    emit('update:modelValue', {
      ...props.modelValue,
      [groupKey]: isSame ? undefined : optionValue
    })
  }
}

const isSelected = (groupKey, optionValue) => {
  const groupValues = props.modelValue[groupKey]
  if (Array.isArray(groupValues)) {
    return groupValues.includes(optionValue)
  }
  return groupValues === optionValue
}
</script>

<template>
  <div class="w-full flex flex-col justify-start items-start gap-6">
    <div
      v-for="group in groups"
      :key="group.key || group.label"
      class="w-full inline-flex justify-start items-start gap-6"
      :data-選項數量="group.options?.length || 0"
    >
      <!-- 左側標籤 -->
      <div class="w-20 h-btn-h-lg flex items-center shrink-0">
        <div class="text-text-helper text-lg font-medium font-noto tracking-wider">
          {{ group.label }}
        </div>
      </div>

      <!-- 右側選項群組 -->
      <div class="flex-1 flex justify-start items-start gap-4 flex-wrap content-start">
        <button
          v-for="option in group.options"
          :key="option.value ?? option.label"
          type="button"
          @click="toggleOption(group, option.value ?? option.label)"
          :class="[
            'h-btn-h-lg px-4 rounded-2xl flex justify-center items-center gap-2 transition-all active:scale-95',
            group.isLargeBtn === true ? 'min-w-60' : 'min-w-44 max-w-48',
            isSelected(group.key || group.label, option.value ?? option.label)
              ? 'bg-button-danger active:bg-button-danger-hover shadow-lg'
              : 'bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-hover'
          ]"
        >
          <div class="text-center text-text-on-color text-xl font-medium font-noto leading-7">
            {{ option.label }}
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

