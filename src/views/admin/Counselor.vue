<template>
  <div class="module-page">
    <div class="page-head">
      <h2>咨询师档案</h2>
      <p class="page-desc">管理咨询师信息与档案。功能完善中。</p>
    </div>
    <div class="page-content">
      <div class="empty-block">
        <el-empty description="功能开发中" />
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.module-page { max-width: 800px; }
.page-head { margin-bottom: 24px; padding: 20px 24px; background: linear-gradient(135deg, #fff 0%, #f8fafc 100%); border-radius: 14px; border: 1px solid #e2e8f0; }
.page-head h2 { margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #1e293b; }
.page-desc { margin: 0; font-size: 14px; color: #64748b; }
.page-content { padding: 32px; background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; min-height: 200px; display: flex; align-items: center; justify-content: center; }
</style>
