<template>
  <div class="module-page">
    <div class="page-head">
      <h2>危机审批</h2>
      <p class="page-desc">危机个案上报、干预团队、等级管理、协同审批。功能完善中。</p>
    </div>
    <div class="page-content">
      <div class="empty-block">
        <div class="empty-icon crisis">
          <el-icon><Warning /></el-icon>
        </div>
        <p class="empty-title">暂无危机待办或功能开发中</p>
        <p class="empty-desc">危机事件上报与协同审批流程即将开放，请留意后续通知。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Warning } from '@element-plus/icons-vue'
</script>

<style scoped>
.module-page {
  max-width: 800px;
}

.page-head {
  margin-bottom: 24px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fff 0%, #fef2f2 100%);
  border-radius: 14px;
  border: 1px solid #fecaca;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.page-head h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.page-desc {
  margin: 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}

.page-content {
  padding: 32px 24px;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-block {
  text-align: center;
  padding: 24px;
}

.empty-icon.crisis {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
}

.empty-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon .el-icon {
  font-size: 36px;
}

.empty-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #334155;
}

.empty-desc {
  margin: 0;
  font-size: 14px;
  color: #94a3b8;
  max-width: 320px;
  line-height: 1.5;
}
</style>
