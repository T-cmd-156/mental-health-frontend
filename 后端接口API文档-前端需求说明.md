# 心理健康平台 - 后端接口 API 文档（前端需求说明）

本文档由前端项目逆向整理，描述前端对后端接口的依赖、请求方式、**传入参数（含类型与必填说明）**、**返回参数（含类型与说明）**及期望的响应格式，供后端开发实现与联调使用。每个接口均以「传入参数」「返回参数」表格形式给出数据类型与字段说明。

---

## 一、通用约定

### 1.1 基础地址与鉴权

- **生产环境 BaseUrl**：前端在 `app.js` 中配置为 `http://192.168.1.100:8080/api`，实际部署时由前端或运维修改。建议后端提供统一前缀，例如：`/api`。
- **请求头**：
  - `Content-Type: application/json`
  - 需要登录的接口：`Authorization: Bearer <token>`
- **Token 来源**：登录/注册成功后，前端将 `token` 存入本地（`wx.setStorageSync('token', token)`），后续请求均从本地读取并写入 `Authorization`。后端需在 token 失效时返回 **401**，前端会清除本地 token 并跳转登录页。

### 1.2 统一响应格式（建议）

前端在 `utils/request.js` 中按以下逻辑处理：

- **成功**：`res.data.code === 200` 或 `res.data.success === true` 时视为成功，并 resolve `res.data`。
- **业务失败**：其他 `code` 时前端会 `wx.showToast(res.data.message || '请求失败')` 并 reject。
- **未授权**：`code === 401` 时前端会清除 token/userInfo 并跳转登录页。

建议后端统一采用：

```json
{
  "code": 200,
  "success": true,
  "message": "操作成功",
  "data": { ... }
}
```

- `code`: 200 表示成功，401 表示未授权/登录过期，其他为业务错误。
- `message`: 提示文案，前端会直接用于 Toast。
- `data`: 业务数据，可为对象或数组。

### 1.3 数据类型约定

本文档中参数类型约定如下：

| 类型标识 | 说明 |
|----------|------|
| string | 字符串 |
| number | 数字（整数或小数） |
| boolean | 布尔值 true/false |
| object | 对象，其字段在表格或下文中说明 |
| string[] | 字符串数组 |
| 枚举 | 从给定取值中选一，如 `red \| orange \| yellow` |

- **传入参数**：Query 表示 URL 查询参数，Body 表示请求体（JSON）。
- **返回参数**：均指响应体中 `data` 字段下的结构（根级 `code`、`success`、`message` 不再重复列出）。

---

## 二、认证与用户

### 2.1 获取图形验证码（登录页）

- **路径**：`GET /getVerificationCode`（或等价，生产需后端提供）
- **用途**：登录页加载时获取验证码图片，提交登录时携带验证码与 key。

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| t | number | 否 | 时间戳，防缓存 |

**返回参数（data）**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| image | string | Base64 图片数据，如 `data:image/png;base64,...` |
| key | string | 验证码会话 key，登录时前端会在 Header 中传 `key: <此值>` |

**说明**：登录时前端还会传用户输入的 `verificationCode`（Query 或 Body）及 Header `key: captchaKey`。

---

### 2.2 账号密码登录

- **路径**：`POST /api/auth/login`（或开发用 loginReal 的完整 URL）
- **请求**：Query 形式为 `?username=xxx&password=xxx&verificationCode=xxx`，或 Body JSON；Header 带 `key: captchaKey`。

**传入参数（Query 或 Body）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 账号（学号/工号等） |
| password | string | 是 | 密码 |
| verificationCode | string | 是 | 用户输入的图形验证码 |

**返回参数（data）**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| token | string | 鉴权令牌，前端存本地并写入 Authorization |
| userInfo | object | 当前用户信息，见下表 |

**userInfo 对象字段**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 用户唯一 ID，必填 |
| studentId | string | 学号/工号，可选 |
| name | string | 姓名 |
| avatar | string | 头像 URL，可空 |
| college | string | 学院 |
| major | string | 专业 |
| grade | string | 年级 |
| phone | string | 手机号 |
| email | string | 邮箱 |
| role | string | 枚举：student / parent / teacher / counselor / part_time_counselor / college_leader / school_leader / center_admin / system_admin |

---

### 2.3 注册

**2.3.1 发送短信验证码**

- **路径**：`POST /api/auth/sms/send`（或 sendRegisterSmsCode）

**传入参数（Body）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | string | 是 | 手机号，11 位 |

**返回**：`code: 200` 表示发送成功，无需特定 data。

**2.3.2 提交注册**

- **路径**：`POST /api/auth/register`

**传入参数（Body）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| account | string | 是 | 账号（学号/工号等） |
| password | string | 是 | 密码 |
| name | string | 是 | 姓名 |
| role | string | 是 | 同 userInfo.role 枚举 |
| phone | string | 是 | 手机号 |
| smsCode | string | 是 | 短信验证码 |

**返回**：`code: 200` 即可，前端跳转登录页。

---

### 2.4 用户信息

**2.4.1 获取当前用户信息**

- **路径**：`GET /api/user/info`

**传入参数**：无（鉴权靠 Token）。

**返回参数（data）**：与 2.2 的 `userInfo` 结构一致（id、name、avatar、college、major、grade、phone、email、role 等）。

**2.4.2 更新用户信息**

- **路径**：`PUT /api/user/update`

**传入参数（Body）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 否 | 姓名 |
| phone | string | 否 | 手机号 |
| email | string | 否 | 邮箱 |
| （其他可写字段） | - | - | 按需扩展 |

**返回参数（data）**：可选返回更新后的用户对象，前端会合并到本地 userInfo。

---

### 2.5 头像上传

- **路径**：`POST /user/upload-avatar`（相对 baseUrl）
- **请求**：`wx.uploadFile`，表单字段名 `avatar`，带 Authorization。

**返回参数（data）**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| url 或 avatarUrl | string | 可访问的头像 URL |

---

### 2.6 微信相关（小程序）

以下路径均相对 baseUrl，除微信登录外需 `Authorization: Bearer <token>`。

**绑定微信** `POST /user/bind-wechat`

| 传入（Body） | 类型 | 说明 |
|--------------|------|------|
| code | string | 微信 login 返回的 code |
| encryptedData | string | 用户信息加密数据 |
| iv | string | 加密算法初始向量 |
| rawData | string | 未加密原始数据 |
| signature | string | 签名 |
| userInfo | object | { nickName, avatarUrl, gender } 等 |

**返回**：`code: 200`，data 可含绑定结果说明。

**解绑微信** `POST /user/unbind-wechat`  
无 Body。返回 `code: 200`。

**查询是否已绑定** `GET /user/wechat-binding`

**返回参数（data）**

| 参数名 | 类型 | 说明 |
|--------|------|------|
| isBound | boolean | 是否已绑定微信 |

**微信一键登录** `POST /auth/wechat-login`  
Body 同绑定微信的传入参数。返回与 2.2 一致：`data: { token, userInfo }`。

---

## 三、通知

### 3.1 通知列表

- **路径**：`GET /api/notice/list`

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码 |
| pageSize | number | 否 | 每页条数 |

**返回参数**：以下三种之一均可，前端会兼容。  
- `data` 为数组；或 `data.list` / `data.records` / `data.data` 为数组。

**列表项元素（每项）**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string \| number | 通知 ID |
| title | string | 标题 |
| summary | string | 摘要（或由 content/description 映射） |
| date | string | 展示用日期（或 publishTime / createdAt / publishTimeStr） |

### 3.2 通知详情

- **路径**：`GET /api/notice/detail`

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string \| number | 是 | 通知 ID |

**返回参数（data）**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string \| number | 通知 ID |
| title | string | 标题 |
| summary | string | 摘要 |
| content | string | 富文本 HTML |
| publishTime | string | 发布时间 |
| publisher | string | 发布单位 |
| date | string | 可选，展示用 |

---

## 四、首页与工作台

### 4.1 首页数据

- **路径**：`GET /api/home/data`

**传入参数**：无。

**返回参数（data）**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| statistics | object | 见下表 |
| notices | array | 通知列表，结构同 3.1 列表项 |
| activities | array | 活动简要列表 |

**statistics 对象**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| totalAppointments | number | 预约总数 |
| totalAssessments | number | 测评总数 |
| totalActivities | number | 活动总数 |

### 4.2 工作台（可选）

- 以下接口前端已配置，当前多为 Mock：  
  `GET /api/workbench/stats`、`/api/workbench/todo`、`/api/workbench/schedule`、`/api/workbench/notifications`。  
  入参/出参可与前端联调时再定。

---

## 五、咨询预约

### 5.1 咨询师与排班

**咨询师列表** `GET /api/consultant/list`  
传入：无或可选筛选。返回：`data` 为咨询师数组，每项含 id、name、avatar、title、intro 等。

**咨询师详情** `GET /api/consultant/detail`

| 传入（Query） | 类型 | 必填 | 说明 |
|---------------|------|------|------|
| id | string | 是 | 咨询师 ID |

**排班列表** `GET /api/schedule/list`

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| week | string | 否 | 当前周标识（如 YYYY-MM-DD 周一） |

**返回参数（data）**：数组，每项：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 排班项 ID |
| date | string | 日期 YYYY-MM-DD |
| weekDay | number | 星期几 1–7 |
| periods | array | 时段列表，见下 |

**periods 元素**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 时段 ID |
| time | string | 如 "09:00" |
| status | string | 枚举：free / booked / full |
| studentName | string | 已预约时可选 |
| type | string | 如 "个体咨询"、"团体辅导" |
| max | number | 可选，容量 |
| current | number | 可选，已约人数 |
| title | string | 可选，团体活动标题 |

**预评估列表** `GET /api/appointment/pre-assessment`  
无入参。返回预评估题目或列表。

**知情同意内容** `GET /api/appointment/consent`  
无入参。返回 `data` 为富文本或结构化内容。

### 5.2 预约操作

**创建预约** `POST /api/appointment/create`

**传入参数（Body）**：需包含咨询师 ID、时段 ID、预约日期等，具体字段与后端约定。

**预约列表** `GET /api/appointment/list`  
可选 Query：page、pageSize、status。返回 `data` 或 `data.list` 为预约列表。

**预约详情** `GET /api/appointment/detail`

| 传入（Query） | 类型 | 必填 |
|---------------|------|------|
| id | string | 是 |

**取消预约** `POST /api/appointment/cancel`

| 传入（Body） | 类型 | 必填 | 说明 |
|--------------|------|------|------|
| id | string | 是 | 预约 ID |
| reason | string | 否 | 取消原因 |

### 5.3 预约记录（咨询师端）

**保存咨询记录** `POST /api/appointment/record/save`

**传入参数（Body）**：前端表单包含以下字段（供参考）：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| studentName | string | 学生姓名 |
| studentId | string | 学号 |
| appointmentDate | string | 预约日期 |
| appointmentTime | string | 时段 |
| content | string | 咨询过程正文 |
| summary | string | 摘要 |
| problemType | string | 问题类型 |
| images | string[] | 附件图片 URL 数组 |

**返回**：`code: 200`，可选 `message: "保存成功"`。

### 5.4 我的预约（学生/用户端）

- **我的预约列表**：建议 `GET /api/appointment/my`，Query：`page`(number)、`pageSize`(number)、`status`(string)。
- **取消/评价/确认/拒绝/完成/爽约**：见 5.2 及上表；确认/拒绝/完成/爽约 Body 建议至少含 `id`(string)。
- **创建留言**：`POST`，Body 含预约相关 id 及 content。

---

## 六、心理测评

### 6.1 测评列表与详情

**列表** `GET /api/assessment/list`  
无必填参数。返回 `data` 为测评列表。

**详情** `GET /api/assessment/detail`

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 测评/量表 ID |

**返回参数（data）**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 量表 ID |
| title | string | 量表名称 |
| description | string | 说明文字 |
| totalQuestions | number | 题目总数 |
| questions | array | 题目列表，见下 |

**questions 元素**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number \| string | 题号 |
| type | string | 枚举：scale / single / multi |
| content | string | 题干 |
| options | array | 选项列表 |

**options 元素**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| value | number \| string | 选项值 |
| label | string | 选项文案 |

### 6.2 开始与提交测评

**开始** `POST /api/assessment/start`

| 传入（Body） | 类型 | 必填 | 说明 |
|--------------|------|------|------|
| assessmentId | string | 是 | 量表 ID |

返回可含本次作答记录 ID，供提交或结果页使用。

**提交** `POST /api/assessment/submit`

| 传入（Body） | 类型 | 必填 | 说明 |
|--------------|------|------|------|
| assessmentId | string | 是 | 量表 ID |
| answers | object | 是 | 键为题号，值为选项值，如 { "1": 2, "2": 3 } |
| duration | number | 是 | 作答耗时（秒） |

返回 `code: 200`，可选返回结果记录 id，前端用于跳转结果页。

### 6.3 测评结果

- **路径**：`GET /api/assessment/result`

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 测评记录/结果 ID |

**返回参数（data）**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| studentName | string | 学生姓名 |
| gender | string | 性别 |
| nation | string | 民族 |
| birthday | string | 出生日期 |
| college | string | 学院 |
| major | string | 专业 |
| studentId | string | 学号 |
| phone | string | 手机号 |
| level | string | 预警等级，如 "黄色" |
| levelText | string | 等级描述，如 "中度风险" |
| problemType | string | 问题类型，如 "焦虑倾向" |
| score | number | 总分 |
| factors | array | 因子分，用于雷达图，见下 |
| suggestion | string | 建议文案 |
| measures | string | 措施文案 |
| responsiblePerson | string | 责任人 |

**factors 元素**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| name | string | 因子名，如 "躯体化" |
| score | number | 得分 |

### 6.4 我的测评

- **路径**：建议 `GET /api/assessment/my`

**传入参数（Query）**：`page`(number)、`pageSize`(number)。  
**返回**：`data` 或 `data.list` 为当前用户的测评记录列表（含 id、量表名、完成时间、结果等级等）。

---

## 七、团体活动

### 7.1 列表与详情

**列表** `GET /api/activity/list`  
可选 Query：category、page、pageSize。返回活动列表。

**详情** `GET /api/activity/detail`

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 活动 ID |

**返回参数（data）**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 活动 ID |
| title | string | 标题 |
| image | string | 封面图 URL，可空 |
| status | string | 枚举：upcoming / ongoing / finished |
| statusText | string | 状态文案，如 "即将开始" |
| time | string | 时间描述 |
| location | string | 地点 |
| organizer | string | 主办方 |
| participants | number | 已报名人数 |
| maxParticipants | number | 人数上限 |
| isRegistered | boolean | 当前用户是否已报名 |
| content | string | 富文本介绍 |

### 7.2 报名与签到

**报名** `POST /api/activity/join`

| 传入（Body） | 类型 | 必填 | 说明 |
|--------------|------|------|------|
| id | string | 是 | 活动 ID |

**返回参数（data）**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| isRegistered | boolean |  true 表示报名成功 |
| participants | number | 更新后已报名人数 |

**取消报名** `POST /api/activity/cancel`  
Body：`{ id: string }`（活动 ID）。返回 `code: 200`。

**签到** `POST /api/activity/checkin`

| 传入（Body） | 类型 | 必填 | 说明 |
|--------------|------|------|------|
| id | string | 是 | 活动 ID |
| code | string | 是 | 签到码 |

返回 `code: 200`，可选 `message` 如 "签到成功"。

### 7.3 我的活动

- **我的活动列表**：建议 `GET /api/activity/my`，Query：`page`(number)、`pageSize`(number)。返回 `data` 或 `data.list` 为当前用户报名/参与的活动列表。
- **取消报名**：同 7.2 `POST /api/activity/cancel`。前端另用 `api.cancelActivityRegistration`，可与 cancel 同一接口。

---

## 八、心理自助（文章）

### 8.1 列表与详情

**列表** `GET /api/self-help/list` 或 `GET /api/psychology/article`

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| category | string | 否 | 分类 |

**详情** `GET /api/self-help/detail`

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 文章 ID |

**返回参数（data）**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 文章 ID |
| title | string | 标题 |
| author | string | 作者 |
| publishTime | string | 发布时间 |
| readCount | number | 阅读数 |
| likeCount | number | 点赞数 |
| collectCount | number | 收藏数 |
| isLiked | boolean | 当前用户是否已点赞 |
| isCollected | boolean | 当前用户是否已收藏 |
| content | string | 富文本正文 |

### 8.2 点赞与收藏

**点赞** `POST /api/self-help/like`

| 传入（Body） | 类型 | 必填 | 说明 |
|--------------|------|------|------|
| id | string | 是 | 文章 ID |
| currentStatus | boolean | 是 | 当前是否已点赞（前端用于切换） |
| count | number | 是 | 当前点赞数 |

**返回参数（data）**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| status | boolean | 操作后是否已点赞 |
| count | number | 操作后点赞数 |

**收藏** `POST /api/self-help/collect`  
传入、返回与点赞接口结构一致：`id`、`currentStatus`、`count` → `status`、`count`。

---

## 九、危机干预

### 9.1 上报与列表

**上报** `POST /api/crisis/report`

**传入参数（Body）**：前端表单，建议包含学生信息（姓名、学号、学院等）、危机等级、描述、上报人等，具体字段与后端约定。  
**返回**：`code: 200`，`message: "上报成功"`。

**列表** `GET /api/crisis/list`

**传入参数（Query）**：可选筛选（学院、等级、状态等）。

**返回参数（data）**：数组，每项：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 个案 ID |
| studentName | string | 学生姓名 |
| studentId | string | 学号 |
| college | string | 学院 |
| level | string | 枚举：red / orange / yellow / blue / green |
| reportDate | string | 上报日期 |
| reporter | string | 上报人 |
| status | string | 处理状态，如 processing / closed |
| statusText | string | 状态文案，如 "干预中"、"已结案" |
| team | string[] | 干预团队成员名单 |

### 9.2 危机详情与更新

**详情** `GET /api/crisis/detail`

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 个案 ID |

**返回参数（data）**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 个案 ID |
| basicInfo | object | 见下 |
| currentLevel | string | 如 orange |
| currentLevelText | string | 如 "橙色 · 高危" |
| levelHistory | array | 见下 |
| interventions | array | 见下 |
| assessments | array | 关联测评，含 id、title、date、result、resultLevel、score |
| appointments | array | 关联预约，含 id、date、consultant、status、type |

**basicInfo**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| name | string | 姓名 |
| gender | string | 性别 |
| studentId | string | 学号 |
| college | string | 学院 |
| major | string | 专业 |
| class | string | 班级 |
| dorm | string | 宿舍 |
| phone | string | 手机 |
| urgentContact | string | 紧急联系人 |
| familyHistory | string | 家庭背景简述 |

**levelHistory 元素**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| level | string | 等级 |
| date | string | 变更时间 |
| operator | string | 操作人 |
| reason | string | 变更原因 |

**interventions 元素**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number \| string | 记录 ID |
| date | string | 时间 |
| type | string | 类型，如 "谈心谈话" |
| content | string | 内容 |
| operator | string | 操作人 |

**更新等级** `POST /api/crisis/update-level`

| 传入（Body） | 类型 | 必填 | 说明 |
|--------------|------|------|------|
| id | string | 是 | 个案 ID |
| level | string | 是 | red / orange / yellow / blue / green |

**返回参数（data）**：`level`(string)、`levelText`(string)。

**更新记录** `POST /api/crisis/update-record`  
Body 为需新增或更新的干预记录字段，与后端约定。

---

## 十、心理微课

### 10.1 列表与详情

**列表** `GET /api/micro-course/list`  
可选 Query：page、pageSize。返回课程列表。

**详情** `GET /api/micro-course/detail`

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 课程 ID |

**返回参数（data）**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 课程 ID |
| title | string | 标题 |
| description | string | 简介 |
| videoUrl | string | 视频地址 |
| poster | string | 封面图，可空 |
| duration | number | 总时长（秒） |
| progress | number | 上次播放位置（秒） |
| teacher | string | 讲师 |
| viewCount | number | 播放量 |
| catalog | array | 章节列表，见下 |

**catalog 元素**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 章节 ID |
| title | string | 章节标题 |
| duration | string | 如 "05:00" |
| isLocked | boolean | 是否未解锁 |
| isCurrent | boolean | 是否当前节 |

### 10.2 进度与我的课程

**更新进度** `POST /api/micro-course/progress`

| 传入（Body） | 类型 | 必填 | 说明 |
|--------------|------|------|------|
| id | string | 是 | 课程 ID |
| progress | number | 是 | 当前播放位置（秒） |
| isFinished | boolean | 否 | 是否已学完 |

返回 `code: 200` 即可。

**我的课程列表** `GET /api/micro-course/my`

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| userId | string | 否 | 当前用户 ID（也可从 Token 取） |

**返回参数（data）**：数组，每项含 `id`、`title`、`progress`(0–100)、`lastStudyTime`、`isFavorite` 等，供「我的课程」页与统计使用。

---

## 十一、心理档案与统计

### 11.1 心理档案

- 前端已配置：`GET /api/profile/detail`、`/api/profile/assessment`、`/api/profile/appointment`、`/api/profile/crisis`。  
  入参可为当前用户或学生 ID（Query）；返回各模块档案汇总与关联数据，结构可与后端约定。

### 11.2 统计（领导/管理端）

**概览** `GET /api/stats/overview`

**传入参数**：无或按角色/院系筛选。

**返回参数（data）**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| overview | object | 见下 |
| crisisDistribution | array | 见下 |
| collegeRanking | array | 见下 |

**overview**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| totalStudents | number | 学生总数 |
| assessedCount | number | 已测评人数 |
| assessmentRate | number | 测评率（如 94.4） |
| crisisCount | number | 危机个案数 |
| consultationHours | number | 咨询时长等 |

**crisisDistribution 元素**：`level`(string)、`count`(number)、`label`(string)。

**collegeRanking 元素**：`name`(string)、`score`(number)。

**漏斗/学院对比/趋势**：`GET /api/statistics/funnel`、`/api/statistics/college`、`/api/statistics/trend`，入参与图表所需维度由前后端约定。

### 11.3 学生列表（辅导员/管理端）

**路径**：`GET /api/student/list`

**传入参数（Query）**：可选学院、风险等级、关键词等。

**返回参数（data）**：数组，每项：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 学生 ID |
| name | string | 姓名 |
| studentId | string | 学号 |
| college | string | 学院 |
| riskLevel | string | 如 red / orange / yellow / green |
| riskLabel | string | 如 "极高危" |
| lastIntervention | string | 最近干预时间描述 |
| tags | string[] | 标签，如 ["学业预警","家庭变故"] |

---

## 十二、月报与报表

### 12.1 月报

**路径**：`GET /api/report/monthly`

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| month | string | 否 | 如 "2024-05" |
| college | string | 否 | 院系 |

**返回参数（data）**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| month | string | 月份 |
| college | string | 院系 |
| stats | object | crisisCount、consultationCount、activityCount 等 |
| content | object | 预填内容：focusStudents、activities、difficulties 等 |

### 12.2 报表下载

**路径**：`GET /api/report/download/:id`

**传入参数**：路径参数 `id`（报表 ID）。  
**返回**：文件流或 302 重定向到临时下载 URL，需校验权限。

---

## 十三、家长/学生/领导 — 联系辅导员

### 13.1 辅导员列表

**按学生查辅导员** `GET /api/parent/counselor`

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| studentId | string | 是 | 学生 ID（家长选中的子女/学生本人） |

**返回参数（data）**：`data.list`(array) 或 `data.counselor`(object)。列表项：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 辅导员 ID |
| name | string | 姓名 |
| collegeName | string | 学院 |
| title | string | 职务 |
| phone | string | 电话 |
| email | string | 邮箱 |
| avatar | string | 头像 URL |
| office | string | 办公室 |
| officeHours | string | 值班时间 |
| intro | string | 简介 |

**领导查辅导员列表** `GET /api/teacher/counselor/list`

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| scope | string | 是 | 枚举：all（全校）/ college（本院系） |

**返回**：`data.list` 或 `data` 为数组，元素结构同上。

### 13.2 留言与记录

**发送留言** `POST /api/parent/message/send`

**传入参数（Body）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| counselorId | string | 是 | 辅导员 ID |
| content | string | 是 | 留言内容 |
| fromRole | string | 是 | 枚举：parent / student / leader |
| studentId | string | 条件 | 家长/学生时必传（子女或本人学号） |
| senderId | string | 条件 | 领导时传当前用户 ID |

**返回**：`code: 200`，可选返回新建记录 id 等。

**我的留言记录** `GET /api/parent/message/list`

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| studentId | string | 条件 | 家长按子女 ID、学生按本人 ID |
| userId | string | 条件 | 领导时传当前用户 ID |
| fromRole | string | 否 | 同上 fromRole |

**返回参数（data）**：`data.list` 或 `data` 为数组，每项：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 记录 ID |
| counselorName | string | 辅导员姓名 |
| content | string | 留言内容 |
| time | string | 时间描述 |
| status | string | 如 pending / replied |
| reply | string | 回复内容，可选 |

---

## 十四、辅导员/教师 — 家长留言（信息管理）

### 14.1 收件箱

**路径**：`GET /api/teacher/message/inbox`

**传入参数**：无（按 Token 取当前辅导员）。

**返回参数（data）**：`data.list` 或 `data` 为数组，每项：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 留言 ID |
| studentId | string | 学生 ID，可选 |
| studentName | string | 学生姓名 |
| fromRole | string | parent / student / leader |
| fromRoleText | string | 如 "家长" |
| content | string | 留言内容 |
| time | string | 时间描述 |
| read | boolean | 是否已读 |
| replied | boolean | 是否已回复 |
| reply | string | 回复内容，可选 |

### 14.2 回复

**路径**：`POST /api/teacher/message/reply`

**传入参数（Body）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| messageId | string | 是 | 留言 ID |
| content | string | 是 | 回复内容，建议 ≤500 字 |

**返回**：`code: 200`，可选 `message`。

---

## 十五、消息中心（站内信）

前端在「消息」页使用了以下能力，但 **config/api.js 中未定义对应 URL**，需后端提供并在前端 config 中补全。

**消息列表** `GET /api/message/list`

**传入参数（Query）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页条数，如 20 |
| userId | string | 是 | 当前用户 ID |

**返回参数（data）**：`data.list` 为数组，每项：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | string | 消息 ID |
| type | string | 枚举：appointment / assessment / crisis / system / activity |
| title | string | 标题 |
| content | string | 内容 |
| read | boolean | 是否已读 |
| createTime | string | 创建时间 |

**标记已读** `POST /api/message/read`

| 传入（Body） | 类型 | 必填 | 说明 |
|--------------|------|------|------|
| messageIds | string[] | 是 | 消息 ID 数组 |

**标记未读** `POST /api/message/unread`  
Body 同上：`{ messageIds: string[] }`。

**删除消息** `DELETE /api/message/delete`  
Body：`{ messageIds: string[] }`。

---

## 十六、通用与其它

### 16.1 文件上传

**路径**：`POST /api/common/upload`

**传入**：表单上传，字段名一般为 `file` 或与前端约定。  
**返回参数（data）**

| 字段名 | 类型 | 说明 |
|--------|------|------|
| url 或 path | string | 文件可访问 URL |

### 16.2 反馈

**路径**：`POST /api/feedback`（前端 config 未定义，需后端提供并前端补全）

**传入参数（Body）**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| content | string | 是 | 反馈内容，≤500 字 |
| type | string | 是 | 枚举：function / bug / experience / other |
| contact | string | 否 | 联系方式 |
| isAnonymous | boolean | 否 | 是否匿名 |
| timestamp | string | 否 | ISO 时间戳，前端会传 |
| platform | string | 否 | 如 "微信小程序" |
| appVersion | string | 否 | 如 "1.0.0" |
| userInfo | object | 条件 | 非匿名时：userId、account、name、role、roleName、college、major、grade |

**返回**：`code: 200` 即可。

---

## 十七、前端未在 config 中定义但页面已使用的接口汇总

以下为代码中已调用、但未在 `config/api.js` 中配置的接口，建议后端实现后与前端对齐 URL 并写入 config：

| 功能 | 建议方法 | 建议路径 | 说明 |
|------|----------|----------|------|
| 消息列表 | GET | /api/message/list | 参数 page, pageSize, userId |
| 消息已读 | POST | /api/message/read | Body: { messageIds } |
| 消息未读 | POST | /api/message/unread | Body: { messageIds } |
| 消息删除 | DELETE | /api/message/delete | Body: { messageIds } |
| 我的课程 | GET | /api/micro-course/my | 参数 userId |
| 我的测评 | GET | /api/assessment/my | 分页 |
| 我的预约 | GET | /api/appointment/my | 分页、状态筛选 |
| 预约评价/确认/拒绝/完成/爽约 | POST | 见 5.4 | 与预约模块统一 |
| 我的活动 | GET | /api/activity/my | 分页 |
| 活动取消报名/签到 | POST | 见 7.2、7.3 | 与活动模块统一 |
| 反馈提交 | POST | /api/feedback | 见 16.2 |

---

## 十八、附录：前端环境与 Mock

- 开发模式：`config/api.js` 中 `ENV = 'dev'` 时，请求会走 `utils/mock.js`，不请求真实后端。
- 生产联调：将 `ENV` 改为 `'prod'`，并确保 `app.globalData.baseUrl` 指向后端 BaseUrl（如 `http://your-api-host/api`）。
- 登录容错：开发环境下若验证码输入 `1234` 且真实登录请求失败，前端会走本地 Mock 登录，便于无后端时演示。

文档版本：基于当前前端代码整理，联调时请以实际接口协议为准并同步更新本文档。
