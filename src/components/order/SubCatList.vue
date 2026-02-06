<script setup>
defineProps({
  items: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])

const handleClick = (item) => {
  emit('select', item)
}
</script>

<template>
  <div class="flex-1 flex flex-col p-4">
    <div class="flex flex-wrap items-start content-start gap-2 w-full h-full overflow-y-auto scrollbar-hide">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        @click="handleClick(item)"
        class="rounded-2xl flex justify-center items-center transition-all active:scale-95 h-btn-h-sm px-6 min-w-24 max-w-48 bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-hover"
      >
        <div class="flex items-center justify-center text-text-on-color font-noto font-medium leading-tight text-xl">
          <span class="text-center">{{ item.name }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

