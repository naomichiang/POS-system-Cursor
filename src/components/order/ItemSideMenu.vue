<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  activeId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['select'])

const handleSelect = (id) => {
  emit('select', id)
}

const handleMove = (direction) => {
  if (!props.items.length) return
  const currentIndex = props.items.findIndex(item => item.id === props.activeId)
  const idx = currentIndex === -1 ? 0 : currentIndex
  let nextIndex = idx
  if (direction === 'up') {
    nextIndex = idx > 0 ? idx - 1 : props.items.length - 1
  } else if (direction === 'down') {
    nextIndex = idx < props.items.length - 1 ? idx + 1 : 0
  }
  const nextItem = props.items[nextIndex]
  if (nextItem) {
    emit('select', nextItem.id)
  }
}
</script>

<template>
  <div class="w-40 flex flex-col border-r border-border-primary bg-layer-tertiary">
    <div class="flex-1 overflow-y-auto scrollbar-hide p-2 flex flex-col gap-2">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        @click="handleSelect(item.id)"
        :class="[
          'w-full h-10 px-3 rounded-xl text-xs font-medium font-noto text-left truncate transition-all active:scale-95',
          item.id === activeId
            ? 'bg-button-danger text-text-on-color shadow-sm'
            : 'bg-button-primary text-text-on-color hover:bg-button-primary-hover'
        ]"
      >
        {{ item.name }}
      </button>
    </div>

    <!-- 上下切換按鈕 -->
    <div class="flex w-full h-12 border-t border-border-primary">
      <button
        type="button"
        class="flex-1 flex items-center justify-center bg-layer-secondary hover:bg-layer-secondary-hover active:bg-layer-secondary-hover transition-colors"
        @click="handleMove('up')"
      >
        <span class="text-text-secondary text-lg font-bold leading-none">▲</span>
      </button>
      <button
        type="button"
        class="flex-1 flex items-center justify-center bg-layer-secondary hover:bg-layer-secondary-hover active:bg-layer-secondary-hover border-l border-border-primary transition-colors"
        @click="handleMove('down')"
      >
        <span class="text-text-secondary text-lg font-bold leading-none">▼</span>
      </button>
    </div>
  </div>
</template>

