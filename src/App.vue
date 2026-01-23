<script setup>
import { RouterView } from 'vue-router'
import TopBar from './components/TopBar.vue'
import AppSidebar from './components/AppSidebar.vue'
</script>

<template>
  <div class="flex flex-col w-full h-screen overflow-hidden bg-app-bg font-noto">
    <TopBar class="shrink-0 z-20" />

    <div class="flex flex-1 min-h-0">
      <AppSidebar class="w-18 shrink-0" h-full z-10 />
      <!-- Router View -->
      <RouterView />
    </div>
  </div>
</template>
