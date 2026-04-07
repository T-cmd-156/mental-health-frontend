<template>
  <div class="parent-layout">
    <PortalNav />
    <div class="parent-view-shell">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import PortalNav from '@/components/portal/PortalNav.vue'
</script>

<style scoped>
.parent-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 与门户「在线预约」等页一致：全宽网页内容区，避免窄栏像手机端 */
.parent-view-shell {
  flex: 1;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 20px 28px 40px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
}

@media (max-width: 768px) {
  .parent-view-shell {
    padding: 16px 12px 28px;
  }
}
</style>
