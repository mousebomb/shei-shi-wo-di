# Voicebox 改为基于 profile name 配置

## 原始需求

用户反馈：`profileId` 难以查找，而 `profile name` 在界面中更容易获取。希望改为：

1. 用户只需要配置 `profile name`
2. 程序启动时根据 `profile name` 找出对应 `profileId` 并存入字典
3. 后续统一使用 `profileId`

## 改动内容

**涉及文件**：

- `backend/src/constants/index.ts`
- `backend/src/constants/personas.ts`
- `backend/src/manager/VoiceManager.ts`
- `backend/src/manager/GameManager.ts`
- `backend/src/index.ts`
- `backend/test/api/VoiceSynthesize.test.ts`
- `backend/.env.example`

### 1) 配置层改为 profile_name

- 新增 `VOICEBOX_HOST_PROFILE_NAME`（兼容旧变量 `VOICEBOX_HOST_PROFILE_ID`）
- 新增 `VOICEBOX_AI_PROFILE_NAME`（默认复用主持人音色）
- `Persona` 字段从 `voiceProfileId` 改为 `voiceProfileName`

### 2) 启动期预加载 name -> id

在 `VoiceManager` 新增：

- `profileNameToId` 字典缓存
- `warmupProfileMap()` 启动预热方法
- `loadProfileMap()`：先 `listProfilesProfilesGet` 拉取已有 profiles，再对缺失名称尝试 `createProfileProfilesPost` 自动补齐并写入字典

### 3) 运行期统一用 profile_id

- `synthesize(text, profileName?)` 先按名称解析 `profile_id`
- 调用 `/generate/stream` 时统一传 `profile_id`
- `GameManager` 的 AI 语音调用参数改为 `player.persona?.voiceProfileName`

### 4) 启动流程接入

- 在 `backend/src/index.ts` 的 `init()` 中增加 `await VoiceManager.getInstance().warmupProfileMap()`，确保服务启动后即可用

### 5) 测试与示例配置

- `VoiceSynthesize.test.ts` 改为用 `VOICEBOX_HOST_PROFILE_NAME` 而不是硬编码 UUID
- `.env.example` 改为引导配置 `VOICEBOX_HOST_PROFILE_NAME`

## 验证

已执行：

- `cd backend && npm --no-color run build`

结果：构建成功。

## 结论

本次改造后，用户侧可直接配置并维护 `profile name`，服务启动时自动建立 `name -> id` 映射，合成阶段统一走 `profile_id`，符合“配置易用 + 运行稳定”的目标。
