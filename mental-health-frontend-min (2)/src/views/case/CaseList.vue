<template>
  <div class="page-wrap">
    <div class="page-head">
      <div class="head-main">
        <h2>个案列表</h2>
        <p class="page-desc">管理心理咨询个案，支持创建、更新与统计分析。</p>
      </div>
      <div class="head-actions">
        <el-button @click="openStatsDialog">个案统计</el-button>
        <el-button type="primary" @click="openCreateDialog">创建个案</el-button>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-value">{{ cases.length }}</span>
        <span class="stat-label">全部个案</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ openCount }}</span>
        <span class="stat-label">进行中</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ closedCount }}</span>
        <span class="stat-label">已结案</span>
      </div>
    </div>

    <el-card class="table-card" shadow="never">
      <el-table :data="cases" stripe v-loading="loading" style="width: 100%">
        <template #empty>
          <el-empty v-if="!loading" description="暂无个案" />
        </template>
        <el-table-column prop="case_title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="id" label="个案ID" width="180" show-overflow-tooltip />
        <el-table-column prop="student_name" label="学生" width="110" />
        <el-table-column prop="student_id" label="学生ID" width="140" show-overflow-tooltip />
        <el-table-column prop="problem_type" label="问题类型" width="130" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status_label || row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="170" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewDetail(row)">详情</el-button>
            <el-button type="warning" link size="small" @click="openUpdateDialog(row)">更新</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="createDialogVisible" title="创建个案" width="560px" destroy-on-close>
      <el-form :model="createForm" label-width="96px">
        <el-form-item label="学生ID" required>
          <el-input v-model="createForm.studentId" placeholder="请输入 studentId" />
        </el-form-item>
        <el-form-item label="个案标题" required>
          <el-input v-model="createForm.caseTitle" placeholder="请输入个案标题" />
        </el-form-item>
        <el-form-item label="问题类型">
          <el-input v-model="createForm.problemType" placeholder="如：情绪管理、人际关系" />
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker
            v-model="createForm.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="个案描述">
          <el-input
            v-model="createForm.caseDescription"
            type="textarea"
            :rows="4"
            placeholder="请输入个案描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="createSubmitting" @click="submitCreate">创建</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="updateDialogVisible" title="更新个案" width="560px" destroy-on-close>
      <el-form :model="updateForm" label-width="96px">
        <el-form-item label="个案ID">
          <el-input v-model="updateForm.caseId" disabled />
        </el-form-item>
        <el-form-item label="个案标题">
          <el-input v-model="updateForm.caseTitle" placeholder="请输入个案标题" />
        </el-form-item>
        <el-form-item label="状态" required>
          <el-select v-model="updateForm.caseStatus" style="width: 100%">
            <el-option label="进行中" value="ONGOING" />
            <el-option label="暂停" value="SUSPENDED" />
            <el-option label="已结案" value="CLOSED" />
          </el-select>
        </el-form-item>
        <el-form-item label="问题类型">
          <el-input v-model="updateForm.problemType" placeholder="请输入问题类型" />
        </el-form-item>
        <el-form-item label="结案日期" v-if="updateForm.caseStatus === 'CLOSED'">
          <el-date-picker
            v-model="updateForm.closeDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择结案日期"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="个案描述">
          <el-input
            v-model="updateForm.caseDescription"
            type="textarea"
            :rows="4"
            placeholder="请输入个案描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="updateDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="updateSubmitting" @click="submitUpdate">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="statsDialogVisible" title="个案统计" width="420px" destroy-on-close>
      <el-table :data="statsData" border size="small" v-loading="statsLoading" style="width: 100%">
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="count" label="数量" width="120" />
      </el-table>
      <template #footer>
        <el-button @click="statsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  createCaseAsync,
  fetchCases,
  fetchCaseStats,
  normalizeCaseListItem,
  updateCaseAsync,
} from '../../api/case'

const cases = ref<any[]>([])
const loading = ref(false)
const router = useRouter()

const createDialogVisible = ref(false)
const updateDialogVisible = ref(false)
const statsDialogVisible = ref(false)

const createSubmitting = ref(false)
const updateSubmitting = ref(false)
const statsLoading = ref(false)
const statsData = ref<any[]>([])

const createForm = ref({
  studentId: '',
  caseTitle: '',
  problemType: '',
  caseDescription: '',
  startDate: '',
})

const updateForm = ref({
  caseId: '',
  caseTitle: '',
  caseStatus: 'ONGOING',
  problemType: '',
  caseDescription: '',
  closeDate: '',
})

const openCount = computed(() =>
  cases.value.filter((c) => {
    const s = String(c.status ?? '').toUpperCase()
    return s === 'ONGOING' || s === 'SUSPENDED'
  }).length,
)
const closedCount = computed(() =>
  cases.value.filter((c) => String(c.status ?? '').toUpperCase() === 'CLOSED').length,
)

function resetCreateForm() {
  createForm.value = {
    studentId: '',
    caseTitle: '',
    problemType: '',
    caseDescription: '',
    startDate: '',
  }
}

function getStatusType(status: string) {
  const s = String(status ?? '').toUpperCase()
  if (!s) return 'info'
  if (s === 'CLOSED') return 'info'
  if (s === 'SUSPENDED') return 'warning'
  if (s === 'ONGOING') return 'success'
  return 'primary'
}

async function loadCases() {
  loading.value = true
  try {
    cases.value = await fetchCases()
  } catch (e: any) {
    cases.value = []
    ElMessage.error(e?.message || '加载个案列表失败')
  } finally {
    loading.value = false
  }
}

function viewDetail(row: any) {
  router.push(`/case/${row.id}`)
}

function openCreateDialog() {
  resetCreateForm()
  createDialogVisible.value = true
}

async function submitCreate() {
  if (!createForm.value.studentId.trim()) {
    ElMessage.warning('请填写学生ID')
    return
  }
  if (!createForm.value.caseTitle.trim()) {
    ElMessage.warning('请填写个案标题')
    return
  }
  createSubmitting.value = true
  try {
    await createCaseAsync({
      studentId: createForm.value.studentId.trim(),
      caseTitle: createForm.value.caseTitle.trim(),
      problemType: createForm.value.problemType.trim(),
      caseDescription: createForm.value.caseDescription.trim(),
      startDate: createForm.value.startDate || '',
    })
    ElMessage.success('创建成功')
    createDialogVisible.value = false
    await loadCases()
  } catch (e: any) {
    ElMessage.error(e?.message || '创建个案失败')
  } finally {
    createSubmitting.value = false
  }
}

function openUpdateDialog(row: any) {
  updateForm.value = {
    caseId: String(row.id || ''),
    caseTitle: String(row.case_title || ''),
    caseStatus: String(row.status || 'ONGOING').toUpperCase(),
    problemType: String(row.problem_type || ''),
    caseDescription: String(row.description || ''),
    closeDate: String(row.close_date || ''),
  }
  updateDialogVisible.value = true
}

async function submitUpdate() {
  if (!updateForm.value.caseId) {
    ElMessage.warning('个案ID不能为空')
    return
  }
  if (!updateForm.value.caseStatus) {
    ElMessage.warning('请选择个案状态')
    return
  }
  updateSubmitting.value = true
  try {
    await updateCaseAsync(updateForm.value.caseId, {
      caseTitle: updateForm.value.caseTitle.trim(),
      caseStatus: updateForm.value.caseStatus,
      problemType: updateForm.value.problemType.trim(),
      caseDescription: updateForm.value.caseDescription.trim(),
      closeDate:
        updateForm.value.caseStatus === 'CLOSED'
          ? updateForm.value.closeDate || ''
          : '',
    })
    ElMessage.success('更新成功')
    updateDialogVisible.value = false
    await loadCases()
  } catch (e: any) {
    ElMessage.error(e?.message || '更新个案失败')
  } finally {
    updateSubmitting.value = false
  }
}

async function openStatsDialog() {
  statsDialogVisible.value = true
  statsLoading.value = true
  try {
    statsData.value = await fetchCaseStats()
  } catch (e: any) {
    statsData.value = []
    ElMessage.error(e?.message || '加载个案统计失败')
  } finally {
    statsLoading.value = false
  }
}

onMounted(async () => {
  await loadCases()
})
</script>

<style scoped>
.page-wrap {
  max-width: 1200px;
  padding: 0;
}

.page-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fff 0%, #f0f9ff 100%);
  border-radius: 14px;
  border: 1px solid #bae6fd;
}

.head-main h2 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.page-desc {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

.head-actions {
  display: flex;
  gap: 10px;
}

.stats-row {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
  padding: 16px 24px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1e4f9c;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

.table-card {
  border-radius: 14px;
  border: 1px solid #e2e8f0;
}
</style>
