<template>
  <div class="child-management">
    <h2>子女管理</h2>
    
    <!-- 绑定子女表单 -->
    <div class="bind-form">
      <h3>绑定子女</h3>
      <form @submit.prevent="bindChild">
        <div class="form-group">
          <label>姓名：</label>
          <input v-model="newChild.name" placeholder="请输入子女姓名" required />
        </div>
        <div class="form-group">
          <label>学号：</label>
          <input v-model="newChild.studentId" placeholder="请输入子女学号" required />
        </div>
        <div class="form-group">
          <label>班级：</label>
          <input v-model="newChild.class" placeholder="请输入子女班级" required />
        </div>
        <div class="form-group">
          <label>学院：</label>
          <input v-model="newChild.college" placeholder="请输入子女学院" required />
        </div>
        <div class="form-group">
          <label>关系：</label>
          <select v-model="newChild.relationship" required>
            <option value="">请选择关系</option>
            <option value="father">父亲</option>
            <option value="mother">母亲</option>
            <option value="grandfather">祖父</option>
            <option value="grandmother">祖母</option>
            <option value="other">其他</option>
          </select>
        </div>
        <button type="submit" class="bind-btn">绑定子女</button>
      </form>
    </div>

    <!-- 子女列表 -->
    <div class="child-list">
      <h3>我的子女</h3>
      <div v-if="children.length === 0" class="empty-state">
        <p>您还没有绑定子女</p>
      </div>
      <div v-else class="children-grid">
        <div v-for="child in children" :key="child.id" class="child-card">
          <div class="child-info">
            <h4>{{ child.name }}</h4>
            <p class="student-id">{{ child.studentId }}</p>
            <div class="child-details">
              <p><span class="label">班级：</span>{{ child.class }}</p>
              <p><span class="label">学院：</span>{{ child.college }}</p>
              <p><span class="label">关系：</span>{{ getRelationshipText(child.relationship) }}</p>
            </div>
          </div>
          <div class="child-actions">
            <button class="action-btn view-btn" @click="viewChild(child.id)">
              查看详情
            </button>
            <button class="action-btn unbind-btn" @click="unbindChild(child.id)">
              解绑
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟子女数据
const children = ref([
  {
    id: '1',
    name: '张三',
    studentId: '2024001',
    class: '计算机科学与技术1班',
    college: '计算机学院',
    relationship: 'father'
  },
  {
    id: '2',
    name: '李四',
    studentId: '2024002',
    class: '软件工程2班',
    college: '计算机学院',
    relationship: 'mother'
  }
])

const newChild = ref({
  name: '',
  studentId: '',
  class: '',
  college: '',
  relationship: ''
})

const bindChild = () => {
  // 模拟绑定子女
  const childId = (children.value.length + 1).toString()
  children.value.push({
    id: childId,
    ...newChild.value
  })
  
  // 重置表单
  newChild.value = {
    name: '',
    studentId: '',
    class: '',
    college: '',
    relationship: ''
  }
  
  alert('绑定成功')
}

const unbindChild = (id) => {
  if (confirm('确定要解绑该子女吗？')) {
    const index = children.value.findIndex(child => child.id === id)
    if (index !== -1) {
      children.value.splice(index, 1)
      alert('解绑成功')
    }
  }
}

const viewChild = (id) => {
  // 跳转到子女详情页
  router.push(`/parent/child/${id}`)
}

const getRelationshipText = (relationship) => {
  const relationshipMap = {
    father: '父亲',
    mother: '母亲',
    grandfather: '祖父',
    grandmother: '祖母',
    other: '其他'
  }
  return relationshipMap[relationship] || relationship
}
</script>

<style scoped>
.child-management {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.bind-form {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.bind-form h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.form-group {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.form-group label {
  font-weight: 500;
  color: #333;
  min-width: 100px;
}

.form-group input,
.form-group select {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.bind-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bind-btn:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a428e 100%);
  transform: translateY(-2px);
}

.child-list {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.child-list h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.children-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.child-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.child-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.child-info h4 {
  margin: 0 0 5px;
  color: #333;
  font-size: 1.1rem;
}

.student-id {
  margin: 0 0 15px;
  color: #666;
  font-size: 0.9rem;
}

.child-details {
  margin-bottom: 20px;
}

.child-details p {
  margin: 8px 0;
  color: #555;
  font-size: 0.9rem;
}

.child-details .label {
  font-weight: 500;
  color: #666;
}

.child-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
}

.view-btn:hover {
  background: #e9ecef;
}

.unbind-btn {
  background: #dc3545;
  color: white;
}

.unbind-btn:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .child-management {
    padding: 15px;
  }

  .bind-form,
  .child-list {
    padding: 20px;
  }

  .form-group {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .form-group label {
    min-width: auto;
  }

  .children-grid {
    grid-template-columns: 1fr;
  }

  .child-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
