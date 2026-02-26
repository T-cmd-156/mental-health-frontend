<template>
  <div class="module-page">
    <div class="page-head">
      <h2>学生管理</h2>
      <p class="page-desc">按学号/姓名/院系筛选学生档案，设置档案查看范围。功能完善中。</p>
    </div>
    <div class="page-content">
      <div class="empty-block">
        <div class="empty-icon">
          <el-icon><UserFilled /></el-icon>
        </div>
        <p class="empty-title">功能开发中</p>
        <p class="empty-desc">学生档案筛选与查看范围设置即将上线，敬请期待。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UserFilled } from '@element-plus/icons-vue'
</script>

<style scoped>
.module-page {
  max-width: 800px;
}

.page-head {
  margin-bottom: 24px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
  border-radius: 14px;
  border: 1px solid #e2e8f0;
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

.empty-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  color: #0284c7;
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
