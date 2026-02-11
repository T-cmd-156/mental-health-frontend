// src/types/case.ts

// 危机个案表类型定义，严格对齐数据库说明文档
export interface Case {
  id: string;
  student_id: string;
  counselor_id?: string;
  level?: string;
  status?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}
