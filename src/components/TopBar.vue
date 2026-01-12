<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Coffee, Utensils, Star, Gem, Bell, Menu } from 'lucide-vue-next'

const currentDateTime = ref('')

// 在這裡宣告 interval（使用純 JS，避免 TS 解析問題）
let interval = null

const updateDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const weekday = weekdays[now.getDay()]

  currentDateTime.value = `${year}-${month}-${day} ${hours}:${minutes} (${weekday})`
}

onMounted(() => {
  updateDateTime()
  interval = setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

// 快捷鍵清單配置
const quickActions = [
  { icon: Coffee, label: '快捷 1' },
  { icon: Utensils, label: '快捷 2' },
  { icon: Star, label: '快捷 3' },
  { icon: Gem, label: '快捷 4' },
]
</script>

<template>
    <div class="flex justify-between items-center bg-ash-900 shadow-lg h-18 overflow-hidden border-b border-ash-800">

      <div class="flex items-center h-full">
        <div class="flex justify-center items-center w-[180px] h-full bg-black/50 shrink-0">
          <!-- h-full 讓圖片嘗試填滿高度，max-h-[60%] 防止圖片貼邊，保持呼吸感 -->
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/9b38f6cf2f5dff0e77628af0c4776b2bd83bb61c?width=368"
            alt="Logo"
            class="w-auto h-full max-h-[80%] object-contain"
          />
        </div>
        <div class="w-2 h-full"></div>
        <div class="flex items-center h-full">
          <button
            v-for="(item, index) in quickActions"
            :key="index"
            class="flex flex-col justify-center items-center w-24 h-full gap-1 hover:bg-ash-800 active:bg-black/50 transition-colors shrink-0">
            <component :is="item.icon" class="w-6 h-6 text-ash-200" />
            <div class="text-ash-200 text-center font-noto text-lg font-medium leading-none">
              {{ item.label }}
            </div>
          </button>
        </div>
      </div>

      <div class="flex items-center h-full">
        <button class="flex justify-center items-center w-18 h-full hover:bg-ash-800 transition-colors">
          <Bell :size="20" class="text-ash-200" />
        </button>

        <div class="flex pl-6 pr-12 items-center h-full">
          <div class="text-white font-inter text-xl font-medium tracking-wider ">
            {{ currentDateTime }}
          </div>
        </div>
        <div class="w-6 h-full"></div>
        <button class="flex justify-center items-center w-20 h-full bg-ash-800 hover:bg-ash-700 active:bg-ash-600 transition-colors">
          <Menu :size="28" class="text-white" />
        </button>
      </div>
    </div>
</template>
