import { getSemester, getCounselors, getHolidays, getPeriods,getWeek } from './mock'

export {
  getCounselors,
  getHolidays,
  getPeriods,
  getWeek,
  getSemester
}

// 内存排班数据（模拟数据库）
let schedule = []

// 根据周排班生成学期每周排版模板
export function initSchedule() {
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
      schedule.push({
        date: ds,
        time,
        counselor: getCounselors()[Math.floor(Math.random() * getCounselors().length)].name,
      });
    });
    day.setDate(day.getDate() + 1);
  }

  return schedule;
}

// 查询排班
export function fetchSchedule() {
  return Promise.resolve([...schedule])
}

// 修改排班
export function updateSchedule({ date, time, counselor }) {
  const idx = schedule.findIndex(i => i.date === date && i.time === time)
  if (idx !== -1) schedule[idx].counselor = counselor
  else schedule.push({ date, time, counselor })

  return Promise.resolve({ code: 200 })
}

// 清空
export function clearSchedule(date, time) {
  schedule = schedule.filter(i => !(i.date === date && i.time === time))
  return Promise.resolve({ code: 200 })
}

let weekTemplate = null;

export function saveWeekTemplate(weekSchedule) {
  weekTemplate = JSON.parse(JSON.stringify(weekSchedule));
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
    const templateDay = weekTemplate.find(
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
            counselor: t.counselor,
          });
        }
      });
    }

    day.setDate(day.getDate() + 1);
  }

  return result;
}
