// src/types/crisis.ts

// 危机个案表类型定义，严格对齐数据库说明文档
export interface CrisisCase {
  id: string; // 主键
  student_id: string; // 学生ID
  counselor_id?: string; // 咨询师ID
  level?: string; // 危机等级
  status?: string; // 状态
  description?: string; // 危机描述
  created_at?: string; // 创建时间
  updated_at?: string; // 更新时间
}
