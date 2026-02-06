<script setup>
const props = defineProps({
  /**
   * 後端傳入的分類與選項（同 RestaurantConfig ExtraField 格式）
   * [
   *   {
   *     key: 'plan',
   *     label: '方案',
   *     isMultiple: false, // 預設為單選
   *     options: [{ value: 'plan-599', label: '吃到飽 599' }, ...],
   *     isLargeBtn: true  // 此組為大寬度按鈕，未設則小寬度
   *   }
   * ]
   */
  groups: {
    type: Array,
    default: () => []
  },

  modelValue: {
    type: Object,
    default: () => ({})
  },

  isMultiple: {
    type: Boolean,
    default: false
  },
  /**
   * 顯示模式： default/order
   * - default：目前 Step3 / Step4 使用的大版面
   * - order：點餐頁細項設定用，小一號、間距更緊湊，並顯示加價金額
   */
  mode: {
    type: String,
    default: 'default'
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
  <div
    class="w-full flex flex-col justify-start items-start"
    :class="mode === 'order' ? 'gap-2' : 'gap-6'"
  >
    <div
      v-for="group in groups"
      :key="group.key || group.label"
      class="w-full inline-flex justify-start items-start"
      :class="mode === 'order' ? 'gap-2' : 'gap-6'"
      :data-選項數量="group.options?.length || 0"
    >
      <!-- 左側標籤 -->
      <div
        class="flex items-center shrink-0"
        :class="mode === 'order' ? 'w-16 h-10' : 'w-20 h-btn-h-lg'"
      >
        <div
          class="text-text-helper font-medium font-noto tracking-wider"
          :class="mode === 'order' ? 'text-sm' : 'text-lg'"
        >
          {{ group.label }}
        </div>
      </div>

      <!-- 右側選項群組 -->
      <div
        class="flex-1 flex justify-start items-start flex-wrap content-start"
        :class="mode === 'order' ? 'gap-2' : 'gap-4'"
      >
        <button
          v-for="option in group.options"
          :key="option.value ?? option.label"
          type="button"
          @click="toggleOption(group, option.value ?? option.label)"
          :class="[
            'rounded-2xl flex justify-center items-center transition-all active:scale-95',
            mode === 'order'
              ? 'min-w-28 h-10 px-3'
              : 'h-btn-h-lg px-4 ' + (group.isLargeBtn === true ? 'min-w-60' : 'min-w-44 max-w-48'),
            isSelected(group.key || group.label, option.value ?? option.label)
              ? 'bg-button-danger active:bg-button-danger-hover shadow-lg'
              : 'bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-hover'
          ]"
        >
          <div
            class="flex items-center justify-center text-text-on-color font-noto font-medium leading-tight"
            :class="mode === 'order' ? 'text-xs' : 'text-xl'"
          >
            <span class="text-center">
              {{ option.label }}
            </span>
            <span
              v-if="mode === 'order' && Number(option.price) > 0"
              class="ml-1 font-inter"
              :class="mode === 'order' ? 'text-[10px]' : 'text-sm'"
            >
              +{{ Number(option.price) }}
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

