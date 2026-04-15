<template>
  <div class="user-manage">
    <div class="page-head">
      <h2>用户管理</h2>
      <p class="page-desc">管理所有端用户账号，含学生、家长、咨询师、辅导员等角色的账号与权限。</p>
      <div class="head-actions">
        <el-button type="primary" @click="openUserDialog()">新增用户</el-button>
        <el-button :icon="Refresh" @click="loadData">刷新</el-button>
      </div>
    </div>

    <el-card class="filter-card" shadow="never">
      <el-form :inline="true" :model="filter" class="filter-form">
        <el-form-item label="关键词">
          <el-input v-model="filter.keyword" placeholder="账号 / 姓名（对接 keyWords）" clearable style="width: 200px" @keyup.enter="onSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="never">
      <el-table :data="userList" stripe v-loading="loading">
        <el-table-column prop="account" label="账号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ row.roleLabel || roleMap[row.role] || row.role || '—' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'enabled' ? 'success' : 'info'" size="small">
              {{ row.status === 'enabled' ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最后登录" width="160" />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openUserDialog(row)">编辑</el-button>
            <el-button type="primary" link size="small" @click="toggleStatus(row)">
              {{ row.status === 'enabled' ? '停用' : '启用' }}
            </el-button>
            <el-button type="primary" link size="small" @click="resetPwd(row)">重置密码</el-button>
            <el-button type="danger" link size="small" @click="removeUser(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="totalCount"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @current-change="loadData"
          @size-change="onPageSizeChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="userDialogVisible" :title="editingUser ? '编辑用户' : '新增用户'" width="480px">
      <el-form :model="userForm" label-width="80px">
        <el-form-item label="账号" required>
          <el-input v-model="userForm.account" placeholder="登录账号" :disabled="!!editingUser" />
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="userForm.name" placeholder="真实姓名" />
        </el-form-item>
        <el-form-item label="角色" required>
          <el-select v-model="userForm.role" placeholder="请选择" style="width: 100%">
            <el-option v-for="r in roleOptions" :key="r.value" :label="r.label" :value="r.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userForm.phone" placeholder="选填" />
        </el-form-item>
        <el-form-item v-if="!editingUser" label="密码" required>
          <el-input v-model="userForm.password" type="password" placeholder="初始密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminUserList } from '../../api/adminApi'

const roleOptions = [
  { value: 'student', label: '学生' },
  { value: 'parent', label: '家长' },
  { value: 'counselor', label: '咨询师' },
  { value: 'tutor', label: '辅导员' },
  { value: 'center', label: '心理中心' },
  { value: 'admin', label: '管理员' },
]

const roleMap = Object.fromEntries(roleOptions.map((r) => [r.value, r.label]))

const filter = reactive({
  keyword: '',
})
const page = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const loading = ref(false)
const userList = ref([])
const userDialogVisible = ref(false)
const editingUser = ref(null)
const userForm = reactive({
  account: '',
  name: '',
  role: 'student',
  phone: '',
  password: '',
})

function fmtTime(v) {
  if (v == null || v === '') return '—'
  if (typeof v === 'string') {
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? v : d.toLocaleString('zh-CN')
  }
  return String(v)
}

function mapUser(u) {
  const status = u.accountStatus === 1 ? 'enabled' : 'disabled'
  return {
    id: u.userId,
    account: u.username,
    name: u.realName || u.username,
    role: u.roleCode || '',
    roleLabel: u.roleName || u.roleCode,
    phone: u.phone || '',
    status,
    lastLogin: fmtTime(u.lastLoginTime),
    createTime: fmtTime(u.createdAt),
    _raw: u,
  }
}

function normalizePage(res) {
  const payload = res?.data
  if (!payload || typeof payload !== 'object') return { records: [], total: 0 }
  const records = payload.records || payload.list || []
  const arr = Array.isArray(records) ? records : []
  let t = payload.total != null ? Number(payload.total) : arr.length
  if (!Number.isFinite(t)) t = arr.length
  return { records: arr, total: t }
}

async function loadData() {
  loading.value = true
  try {
    const res = await getAdminUserList({
      page: page.value,
      pageSize: pageSize.value,
      keyWords: filter.keyword?.trim() || undefined,
    })
    if (res?.code !== 200) {
      throw new Error(res?.msg || res?.message || '请求失败')
    }
    const { records, total } = normalizePage(res)
    userList.value = records.map(mapUser)
    totalCount.value = total
  } catch (e) {
    userList.value = []
    totalCount.value = 0
    ElMessage.error(e?.message || '加载用户列表失败')
  } finally {
    loading.value = false
  }
}

function onSearch() {
  page.value = 1
  loadData()
}

function onPageSizeChange() {
  page.value = 1
  loadData()
}

function resetFilter() {
  filter.keyword = ''
  page.value = 1
  loadData()
}

function openUserDialog(row = null) {
  editingUser.value = row
  if (row) {
    userForm.account = row.account
    userForm.name = row.name
    userForm.role = row.role
    userForm.phone = row.phone || ''
    userForm.password = ''
  } else {
    userForm.account = ''
    userForm.name = ''
    userForm.role = 'student'
    userForm.phone = ''
    userForm.password = '123456'
  }
  userDialogVisible.value = true
}

function saveUser() {
  if (!userForm.account || !userForm.name || !userForm.role) {
    ElMessage.warning('请填写账号、姓名并选择角色')
    return
  }
  if (!editingUser.value && !userForm.password) {
    ElMessage.warning('请输入初始密码')
    return
  }
  if (editingUser.value) {
    const u = userList.value.find((x) => x.id === editingUser.value.id)
    if (u) {
      u.name = userForm.name
      u.role = userForm.role
      u.phone = userForm.phone
    }
  } else {
    userList.value.push({
      id: String(Date.now()),
      account: userForm.account,
      name: userForm.name,
      role: userForm.role,
      phone: userForm.phone,
      status: 'enabled',
      lastLogin: '-',
      createTime: new Date().toLocaleString('zh-CN'),
    })
  }
  userDialogVisible.value = false
  ElMessage.success('保存成功')
}

function toggleStatus(row) {
  row.status = row.status === 'enabled' ? 'disabled' : 'enabled'
  ElMessage.success(row.status === 'enabled' ? '已启用' : '已停用')
}

function resetPwd(row) {
  ElMessageBox.confirm('确定重置该用户密码为默认密码？', '重置密码', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('密码已重置')
  }).catch(() => {})
}

function removeUser(row) {
  ElMessageBox.confirm('确定删除该用户？删除后不可恢复。', '删除用户', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    userList.value = userList.value.filter((u) => u.id !== row.id)
    ElMessage.success('已删除')
  }).catch(() => {})
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.user-manage { max-width: 1100px; }

.page-head {
  margin-bottom: 20px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.page-head h2 { margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #1e293b; }
.page-desc { margin: 0; font-size: 14px; color: #64748b; flex: 1; }

.filter-card, .table-card {
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.filter-form { margin-bottom: 0; }

.pagination-wrap { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
