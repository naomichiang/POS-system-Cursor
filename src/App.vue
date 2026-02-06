<script setup>
import { RouterView } from 'vue-router'
import TopBar from './components/layout/TopBar.vue'
import AppSidebar from './components/layout/AppSidebar.vue'
</script>

<template>
  <div class="flex flex-col w-full h-screen overflow-hidden bg-app-bg font-noto">
    <TopBar class="shrink-0 z-20" />

    <div class="flex flex-1 min-h-0 min-w-0">
      <AppSidebar class="w-18 shrink-0" h-full z-10 />
      <!-- 主內容區：min-w-0 讓內部可縮小，不擠壓右側 OrderPanel -->
      <main class="min-w-0 flex-1 flex flex-col min-h-0 overflow-hidden">
        <RouterView />
      </main>
    </div>
  </div>
</template>
