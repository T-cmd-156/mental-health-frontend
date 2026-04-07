<template>
  <div class="portal-layout">
    <PortalNav />
    <router-view />
  </div>
</template>

<script setup>
import PortalNav from '@/components/portal/PortalNav.vue'
</script>

<style scoped>
.portal-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
