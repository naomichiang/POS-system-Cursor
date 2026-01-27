<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      name: '',
      phone: '',
      email: '',
      notes: ''
    })
  }
})

const emit = defineEmits(['update:modelValue'])

const updateField = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  })
}
</script>

<template>
  <!-- 內容區域（可滾動，不顯示卷軸） -->
  <div class="flex-1 overflow-y-auto scrollbar-hide p-8">
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-text-primary mb-6">顧客基本資料</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">姓名 *</label>
          <input
            type="text"
            :value="modelValue.name"
            @input="updateField('name', $event.target.value)"
            placeholder="請輸入姓名"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">電話</label>
          <input
            type="tel"
            :value="modelValue.phone"
            @input="updateField('phone', $event.target.value)"
            placeholder="請輸入電話"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">電子郵件</label>
          <input
            type="email"
            :value="modelValue.email"
            @input="updateField('email', $event.target.value)"
            placeholder="請輸入電子郵件"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">備註</label>
          <textarea
            :value="modelValue.notes"
            @input="updateField('notes', $event.target.value)"
            placeholder="請輸入備註（選填）"
            rows="4"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg resize-none"
          ></textarea>
        </div>
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
