<template>
  <div class="schedule">

    <h3>心理中心 - 智能排班</h3>

    <!-- 工具栏 -->
    <div class="toolbar">
      <select v-model="campus">
        <option>莲湖校区</option>
        <option>南坝校区</option>
      </select>

      <select v-model="counselor">
        <option v-for="c in counselors" :key="c.id">
          {{ c.name }}
        </option>
      </select>

      <input type="date" v-model="viewDate" />

      <button @click="prevWeek">⬅ 上一周</button>
      <button @click="toToday">📅 今天</button>
      <button @click="nextWeek">下一周 ➡</button>

      <button @click="viewMode='day'">按日查看</button>
      <button @click="viewMode='week'">按周查看</button>

      <button @click="openBatch">
        批量生成排班
      </button>

      <button @click="useTemplate">
        使用周模板
      </button>
    </div>

    <div v-if="viewMode==='week'" class="week-title">
      当前周：{{ weekRange() }}
    </div>

<!-- 可视化排班表 -->
<table class="grid">

  <!-- ===== 表头 ===== -->
  <thead>

    <!-- 第一行：周几 -->
    <tr>
      <th>时间</th>

      <template v-if="viewMode==='week'">
        <th v-for="d in week" :key="d">
          {{ d }}
        </th>
      </template>

      <th v-else>
        {{ viewDate }}
      </th>
    </tr>

    <!-- 第二行：具体日期 -->
    <tr v-if="viewMode==='week'">
      <th>日期</th>

      <th v-for="item in getWeekDates()" :key="item.date">
        {{ item.date }}
      </th>
    </tr>

  </thead>


  <!-- ===== 表格主体 ===== -->
  <tbody>

    <tr v-for="t in periods" :key="t">
      <td>{{ t }}</td>

      <td
        v-for="col in (viewMode==='week'
          ? getWeekDates()
          : [{ date: viewDate }])"

        :key="col.date"
        @click="edit(col, t)"
        :class="getCell(col, t)"
      >
        {{ show(col, t) }}
      </td>

    </tr>

  </tbody>

</table>


  </div>
</template>

<script setup>
import { ref } from 'vue'

// ===== 学期信息 =====
const semester = ref({
  start: '2026-03-01',
  end: '2026-07-10'
})

const viewDate = ref(
  (semester.value.start)
)


const viewMode = ref('week')   // week | day

// 节假日（以后从后端读）
const holidays = ref([
  '2026-04-05',
  '2026-05-01',
  '2026-06-10'
])


// ===== 假数据，之后从后端调 =====
const campus = ref('莲湖校区')
const counselor = ref('')

// 一周
const week = [
  '周一','周二','周三','周四','周五'
]

// 时间段
const periods = [
  '09:00-09:50',
  '09:50-10:40',
  '10:40-11:30',
  '11:30-12:20',
  '15:00-15:50',
  '15:50-16:40',
  '16:40-17:30'
]

// 咨询师
const counselors = ref([
  { id:'C1', name:'张老师' },
  { id:'C2', name:'李老师' },
  { id:'C3', name:'王老师' },
  { id:'C4', name:'赵老师' },
  { id:'C5', name:'钱老师' },
  { id:'C6', name:'罗老师' },
  { id:'C7', name:'穆老师' },
  { id:'C8', name:'何老师' },
  { id:'C9', name:'周老师' },
  { id:'C10', name:'冯老师' }
])

// 排班数据（以后换接口）
const schedule = ref([])

// 点击编辑
const edit = (col, t) => {

  console.log('点击:', col, t)

  // ===== 1. 统一成真实日期 =====
  const dateKey = col.date

  // ===== 2. 按 date + time 找 =====
  const index = schedule.value.findIndex(
    i =>
      i.date === dateKey &&
      i.time === t
  )

  const now =
    index !== -1
      ? schedule.value[index].counselor
      : '空闲'

  // ===== 3. 选择弹窗 =====
  let msg = `当前：${now}\n请选择：\n0. 设为空闲\n`

  counselors.value.forEach((c, i) => {
    msg += `${i + 1}. ${c.name}\n`
  })

  const r = prompt(msg)
  if (r === null) return

  // ===== 4. 设为空闲 =====
  if (r === '0') {
    if (index !== -1)
      schedule.value.splice(index, 1)
    return
  }

  const c = counselors.value[Number(r) - 1]
  if (!c) return

  // ===== 5. 已存在就改 =====
  if (index !== -1) {
    schedule.value[index].counselor = c.name
  } 
  // ===== 6. 不存在就新增（必须带 date！）=====
  else {
    schedule.value.push({
      date: dateKey,
      //day: d,        // 显示用
      time: t,
      counselor: c.name
    })
  }
}

// 根据选择的某天，算出本周一~周五真实日期
const getWeekDates = () => {
  const base = viewDate.value
    ? new Date(viewDate.value)
    : new Date()

  const day = base.getDay()
  const monday = new Date(base)

  // 把日期调到周一
  const diff = day === 0 ? -6 : 1 - day
  monday.setDate(base.getDate() + diff)

  const arr = []

  for (let i = 0; i < 5; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)

    arr.push({
      label: ['周一','周二','周三','周四','周五'][i],
      date: d.toISOString().slice(0,10)
    })
  }

  return arr
}

const changeWeek = (n) => {
  const d = viewDate.value
    ? new Date(viewDate.value)
    : new Date()

  d.setDate(d.getDate() + 7 * n)

  viewDate.value = d.toISOString().slice(0,10)
}


// 显示
const show = (col,t) => {

  const dateKey =
    viewMode.value === 'week'
      ? col.date
      : col.date

  const s = schedule.value.find(
    i => i.date === dateKey && i.time === t
  )

  return s ? s.counselor : ''
}

// ===== 周控制核心 =====

// 取某日期所在周一
const getMonday = (dateStr) => {
  const d = new Date(dateStr)
  const day = d.getDay()

  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)

  return d.toISOString().slice(0,10)
}

// 上一周
const prevWeek = () => {
  const d = new Date(viewDate.value)
  d.setDate(d.getDate() - 7)
  viewDate.value = d.toISOString().slice(0,10)
}

// 下一周
const nextWeek = () => {
  const d = new Date(viewDate.value)
  d.setDate(d.getDate() + 7)
  viewDate.value = d.toISOString().slice(0,10)
}

// 回到今天
const toToday = () => {
  viewDate.value = new Date().toISOString().slice(0,10)
}

// 当前周范围显示
const weekRange = () => {
  const arr = getWeekDates()
  if (!arr.length) return ''

  return `${arr[0].date}  ~  ${arr[4].date}`
}


const getCell = (col, t) => {

   const dateKey = col.date

  const s = schedule.value.find(
    i => i.date === dateKey && i.time === t
  )

  if (!s) return 'free'

  // 选择老师时高亮
  if (counselor.value) {
    return s.counselor === counselor.value
      ? 'mine'
      : 'other'
  }

  return 'busy'
}


const openBatch = () => {

  schedule.value = []

  const start = new Date(semester.value.start)
  const end = new Date(semester.value.end)

  let day = new Date(start)

  while (day <= end) {

    const weekDay = day.getDay()

    // 跳过周末
    if (weekDay === 0 || weekDay === 6) {
      day.setDate(day.getDate() + 1)
      continue
    }

    const ds = day.toISOString().slice(0,10)

    // 跳过节假日
    if (holidays.value.includes(ds)) {
      day.setDate(day.getDate() + 1)
      continue
    }

    // 按老师轮流分配
    periods.forEach(t => {

      const teacher =
        counselors.value[
          Math.floor(Math.random() * counselors.value.length)
        ].name

      schedule.value.push({
        date: ds,
        time: t,
        counselor: teacher
      })
    })

    day.setDate(day.getDate() + 1)
  }

// 自动跳到第一个排班日期所在周
const first = schedule.value[0]?.date
if (first) {
  viewDate.value = first
}


  // 自动把视图跳到学期第一周
  //viewDate.value = semester.value.start


  alert('已按学期生成排班')


    console.log('===== 生成的排班 =====')
  console.log(schedule.value)
}




const useTemplate = () => {
  alert('选择周模板')
}
</script>

<style scoped>
.grid {
  width: 100%;
  border-collapse: collapse;
}

.grid td, .grid th {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}

.busy {
  background: #dff0d8;
}

.mine {
  background: #cce5ff;
  font-weight: bold;
}

.other {
  background: #f0f0f0;
  color: #999;
}

.free {
  background: #fff;
}


.toolbar {
  margin-bottom: 10px;
}
</style>
