<template>
  <div class="admin-students">
    <div class="page-head">
      <h2>学生管理</h2>
      <p class="page-desc">按学号、姓名、手机关键字筛选（对接 /api/admin/student/list）。</p>
    </div>

    <el-card class="filter-card" shadow="never">
      <el-form :inline="true" :model="filter" class="filter-form">
        <el-form-item label="关键词">
          <el-input v-model="filter.keyword" placeholder="学号 / 姓名 / 手机" clearable style="width: 200px" @keyup.enter="onSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="stats-bar">
      <span>共 <b>{{ totalCount }}</b> 名学生</span>
    </div>

    <el-card class="table-card" shadow="never">
      <el-table :data="studentList" stripe v-loading="loading">
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="gender" label="性别" width="70" />
        <el-table-column prop="college" label="院系" width="140" />
        <el-table-column prop="className" label="班级" width="120" />
        <el-table-column prop="grade" label="年级" width="90" />
        <el-table-column prop="phone" label="手机" width="120" />
        <el-table-column label="操作" fixed="right" width="140">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewDetail(row)">查看</el-button>
            <el-button type="info" link size="small" @click="viewProfile(row)">档案</el-button>
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

    <el-dialog v-model="detailVisible" title="学生详情" width="720px">
      <div v-if="currentStudent" class="student-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ currentStudent.name }}</el-descriptions-item>
          <el-descriptions-item label="学号">{{ currentStudent.studentId }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ currentStudent.gender }}</el-descriptions-item>
          <el-descriptions-item label="院系">{{ currentStudent.college }}</el-descriptions-item>
          <el-descriptions-item label="班级">{{ currentStudent.className }}</el-descriptions-item>
          <el-descriptions-item label="年级">{{ currentStudent.grade }}</el-descriptions-item>
          <el-descriptions-item label="手机">{{ currentStudent.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ currentStudent.email || '—' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getAdminStudentList, getAdminStudentDetail } from '../../api/adminApi'

const router = useRouter()
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const studentList = ref([])

const filter = reactive({
  keyword: '',
})

const detailVisible = ref(false)
const currentStudent = ref(null)

function mapRow(vo) {
  return {
    raw: vo,
    userId: vo.userId,
    studentId: vo.studentNo || vo.studentId,
    name: vo.name || '—',
    gender: vo.gender || '—',
    college: vo.collegeName || '—',
    className: vo.className || '—',
    grade: vo.grade || '—',
    phone: vo.phone || '—',
    email: vo.email || '',
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
    const res = await getAdminStudentList({
      page: page.value,
      pageSize: pageSize.value,
      keyword: filter.keyword?.trim() || undefined,
    })
    if (res?.code !== 200) {
      throw new Error(res?.msg || res?.message || '请求失败')
    }
    const { records, total } = normalizePage(res)
    studentList.value = records.map(mapRow)
    totalCount.value = total
  } catch (e) {
    studentList.value = []
    totalCount.value = 0
    ElMessage.error(e?.message || '加载学生列表失败')
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

async function viewDetail(row) {
  const sid = row.raw?.studentId || row.studentId
  if (!sid) {
    currentStudent.value = { ...row }
    detailVisible.value = true
    return
  }
  try {
    const res = await getAdminStudentDetail(sid)
    const vo = res?.data
    if (res?.code === 200 && vo) {
      currentStudent.value = mapRow(vo)
    } else {
      currentStudent.value = { ...row }
    }
    detailVisible.value = true
  } catch {
    currentStudent.value = { ...row }
    detailVisible.value = true
  }
}

function viewProfile(row) {
  const sid = row.raw?.studentId
  if (sid) {
    router.push(`/student/psych-profile/${sid}`)
  } else {
    ElMessage.warning('缺少学生档案 ID，无法打开心理档案页')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-students { max-width: 1100px; }

.page-head {
  margin-bottom: 20px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
  border-radius: 14px;
  border: 1px solid #e2e8f0;
}

.page-head h2 { margin: 0 0 8px 0; font-size: 20px; font-weight: 600; color: #1e293b; }
.page-desc { margin: 0; font-size: 14px; color: #64748b; }

.filter-card, .table-card { margin-bottom: 16px; border-radius: 12px; border: 1px solid #e2e8f0; }
.filter-form { margin-bottom: 0; }

.stats-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #64748b;
}

.stats-bar b { color: #1e293b; }

.pagination-wrap { margin-top: 16px; display: flex; justify-content: flex-end; }

.student-detail .detail-section { margin-top: 16px; }
.student-detail .detail-section h4 { margin: 0 0 12px 0; font-size: 15px; color: #1e293b; }
.text-muted { color: #94a3b8; }
</style>
