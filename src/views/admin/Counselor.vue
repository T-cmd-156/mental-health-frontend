<template>
  <div class="counselor-manage">
    <div class="page-head">
      <h2>咨询师档案</h2>
      <p class="page-desc">对接 GET /api/consultant/list。</p>
      <div class="head-actions">
        <el-button type="primary" @click="openCounselorDialog()">新增咨询师</el-button>
        <el-button :icon="Refresh" @click="loadData">刷新</el-button>
      </div>
    </div>

    <el-card class="filter-card" shadow="never">
      <el-form :inline="true" :model="filter" class="filter-form">
        <el-form-item label="关键词">
          <el-input v-model="filter.keyword" placeholder="姓名等" clearable style="width: 160px" @keyup.enter="onSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="never">
      <el-table :data="counselorList" stripe v-loading="loading">
        <el-table-column prop="workNo" label="编号" width="100" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="title" label="职称" width="100" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="collegeName" label="单位" min-width="120" show-overflow-tooltip />
        <el-table-column prop="specialty" label="简介/领域" min-width="160" show-overflow-tooltip />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="openCounselorDialog(row)">编辑</el-button>
            <el-button type="primary" link size="small" @click="viewSchedule(row)">排班</el-button>
            <el-button type="danger" link size="small" @click="toggleStatus(row)">
              {{ row.status === 'active' ? '停用' : '启用' }}
            </el-button>
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

    <el-dialog v-model="counselorDialogVisible" :title="editingCounselor ? '编辑咨询师' : '新增咨询师'" width="500px">
      <el-form :model="counselorForm" label-width="80px">
        <el-form-item label="工号" required>
          <el-input v-model="counselorForm.workNo" placeholder="如 C001" :disabled="!!editingCounselor" />
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="counselorForm.name" placeholder="真实姓名" />
        </el-form-item>
        <el-form-item label="职称">
          <el-input v-model="counselorForm.title" placeholder="如 心理咨询师" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="counselorForm.phone" placeholder="联系电话" />
        </el-form-item>
        <el-form-item label="擅长领域">
          <el-input v-model="counselorForm.specialty" type="textarea" :rows="2" placeholder="如 情绪管理、学业压力" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="counselorDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCounselor">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { fetchConsultantList } from '../../api/psychPlatformAppointment.js'

const router = useRouter()
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const counselorList = ref([])
const counselorDialogVisible = ref(false)
const editingCounselor = ref(null)

const filter = reactive({
  keyword: '',
})

const counselorForm = reactive({
  workNo: '',
  name: '',
  title: '',
  phone: '',
  specialty: '',
})

function mapCounselorRow(c) {
  return {
    id: c.id,
    workNo: c.id ? String(c.id).slice(0, 10) : '—',
    name: c.name || '—',
    title: c.title || '—',
    phone: c.phone || '—',
    collegeName: c.collegeName || '—',
    specialty: c.intro || c.office || '—',
    status: 'active',
    _raw: c,
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
    const res = await fetchConsultantList({
      page: page.value,
      pageSize: pageSize.value,
      keyWords: filter.keyword?.trim() || undefined,
    })
    if (res?.code !== 200) {
      throw new Error(res?.msg || res?.message || '请求失败')
    }
    const { records, total } = normalizePage(res)
    counselorList.value = records.map(mapCounselorRow)
    totalCount.value = total
  } catch (e) {
    counselorList.value = []
    totalCount.value = 0
    ElMessage.error(e?.message || '加载咨询师列表失败')
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

function openCounselorDialog(row = null) {
  editingCounselor.value = row
  if (row) {
    counselorForm.workNo = row.workNo
    counselorForm.name = row.name
    counselorForm.title = row.title || ''
    counselorForm.phone = row.phone || ''
    counselorForm.specialty = row.specialty || ''
  } else {
    counselorForm.workNo = ''
    counselorForm.name = ''
    counselorForm.title = ''
    counselorForm.phone = ''
    counselorForm.specialty = ''
  }
  counselorDialogVisible.value = true
}

function saveCounselor() {
  if (!counselorForm.workNo || !counselorForm.name) {
    ElMessage.warning('请填写编号和姓名')
    return
  }
  ElMessage.success('保存为界面占位；新增/编辑请对接后端咨询师维护接口')
  counselorDialogVisible.value = false
}

function viewSchedule(row) {
  router.push({ path: '/admin/schedule', query: { counselorId: row.id } })
}

function toggleStatus(row) {
  row.status = row.status === 'active' ? 'inactive' : 'active'
  ElMessage.success(row.status === 'active' ? '已启用（本地）' : '已停用（本地）')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.counselor-manage { max-width: 1100px; }

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

.filter-card, .table-card { margin-bottom: 16px; border-radius: 12px; border: 1px solid #e2e8f0; }
.filter-form { margin-bottom: 0; }
.pagination-wrap { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>
