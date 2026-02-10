import { getSemester, getCounselors, getHolidays, getPeriods,getWeek } from '../api/mock'

export {
  getCounselors,
  getHolidays,
  getPeriods,
  getWeek,
  getSemester
}

// 内存排班数据（模拟数据库）
let schedule = []

const STORAGE_KEY = 'MOCK_WEEK_TEMPLATE'

// 根据周排班生成学期每周排版模板
export function initSchedule() {
  console.log('initSchedule 被调用')

  schedule = [];
  const start = new Date('2026-03-01');
  const end = new Date('2026-07-10');
  let day = new Date(start);

  while (day <= end) {
    const weekDay = day.getDay();
    if (weekDay === 0 || weekDay === 6) {
      day.setDate(day.getDate() + 1);
      continue;
    }

    const ds = day.toISOString().slice(0, 10);
    
    getPeriods().forEach((time) => {
      const c = getCounselors()[Math.floor(Math.random() * getCounselors().length)]
      schedule.push({
        date: ds,
        time,
        counselorId: c.id,
        counselorName: c.name,
      });
    });
    day.setDate(day.getDate() + 1);
  }

  console.log('schedule size =', schedule.length)
  return schedule;
}

// 查询排班
export function fetchSchedule() {
    if (schedule.length === 0) {
      console.warn('⚠ schedule 为空，自动 init')
    initSchedule()
  }
  return Promise.resolve([...schedule])
}

// 修改排班
export function updateSchedule({ date, time, counselorId, counselorName }) {
  const idx = schedule.findIndex(i => i.date === date && i.time === time)
  if (idx !== -1)  {
    schedule[idx].counselorId = counselorId
    schedule[idx].counselorName = counselorName
  }
  else schedule.push({ date, time, counselorId, counselorName })

  return Promise.resolve({ code: 200 })
}

// 清空
export function clearSchedule(date, time) {
  schedule = schedule.filter(i => !(i.date === date && i.time === time))
  return Promise.resolve({ code: 200 })
}

let weekTemplate = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')

export function saveWeekTemplate(weekSchedule) {
  weekTemplate = JSON.parse(JSON.stringify(weekSchedule))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(weekTemplate))
}

// 随机生成一学期每周的排班情况
export function generateFromTemplate() {
  if (!weekTemplate) return [];

  const semester = getSemester();
  const start = new Date(semester.start);
  const end = new Date(semester.end);

  const result = [];
  let day = new Date(start);

  while (day <= end) {
    const wd = day.getDay();
    if (wd === 0 || wd === 6) {
      day.setDate(day.getDate() + 1);
      continue;
    }

    const ds = day.toISOString().slice(0, 10);
    const templateDay = weekTemplate.filter(
      i => new Date(i.date).getDay() === wd
    );

    if (templateDay) {
      getPeriods().forEach(time => {
        const t = weekTemplate.find(
          i => new Date(i.date).getDay() === wd && i.time === time
        );
        if (t) {
          result.push({
            date: ds,
            time,
            counselorId: t.counselorId,
            counselorName: t.counselorName,
          });
        }
      });
    }

    day.setDate(day.getDate() + 1);
  }

  return result;
}

export function getWeekTemplate() {
  if (!weekTemplate) {
    const cache = localStorage.getItem(STORAGE_KEY)
    weekTemplate = cache ? JSON.parse(cache) : []
  }
  return weekTemplate 
}

export function initWeekTemplate() {
  const cache = localStorage.getItem(STORAGE_KEY)
  if (cache) return   // 已经有就不覆盖
  const demo = [
    {
      date: '2026-03-02',
      time: '09:00-09:50',
      counselorId: 'c_zhang',
      counselorName: '张老师'
    },
    {
      date: '2026-03-02',
      time: '10:00-10:50',
      counselorId: 'c_li',
      counselorName: '李老师'
    },
    {
      date: '2026-03-03',
      time: '09:00-09:50',
      counselorId: 'c_zhang',
      counselorName: '张老师'
    }
  ]

  localStorage.setItem(STORAGE_KEY, JSON.stringify(demo))
}
