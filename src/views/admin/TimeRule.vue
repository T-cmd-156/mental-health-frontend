<template>
  <div>
    <!-- 操作区 -->
    <el-button v-if="canEdit" @click="onAdd">新增规则</el-button>
    <el-button v-if="canEdit" @click="onPublish">发布</el-button>


    <!-- 表格 -->
    <el-table :data="tableData" style="margin-top: 16px">
      <el-table-column prop="name" label="规则名称" />
      <el-table-column prop="time" label="咨询时间" />

      <!-- 操作列：只有 admin / center 能看到 -->
      <el-table-column
        v-if="canEdit"
        label="操作"
        width="180"
      >
        <template #default>
          <el-button size="small" @click="onEdit">编辑</el-button>
          <el-button size="small" type="danger" @click="onDelete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePermission } from '../../hooks/usePermission'


const role = localStorage.getItem('admin_role')

// 是否有编辑权限
const { can: canEdit, guard } = usePermission(['admin', 'center'])

const tableData = ref([
  { name: '工作日规则', time: '9:00-17:00' },
  { name: '周末规则', time: '10:00-16:00' }
])

function onAdd() {
  if (!guard()) return
  console.log('新增规则')
}

function onPublish() {
  if (!guard()) return
   console.log('发布规则')
}

function onEdit() {
  if (!guard()) return
  console.log('编辑')
}

function onDelete() {
  if (!guard()) return
  console.log('删除')
}

console.log('当前角色：', localStorage.getItem('admin_role'))
console.log('canEdit:', canEdit.value)

</script>
