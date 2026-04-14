# 2026-04-14 角色库抽离改造记录

## 用户原始需求

> 我现在想要把声音配置从人格池里面提取出来，然后把角色的姓名也从固定的写死姓名里面取出来。  
> 再单独创建一个角色库，角色库里面会指定：  
> 1. 这个角色的姓名  
> 2. 他的人格  
> 3. 他的嗓音  
> 然后游戏每局开始的时候，就不是随机取人格，而是随机取角色库里的角色。

## 本次改造结论

- 新增独立角色库文件 `backend/src/constants/aiRoles.ts`，定义 `AiRole`（`name`、`personaId`、`voiceProfileName`）与 `AI_ROLES`。
- 房间初始化逻辑改为随机抽取角色库角色：`RoomManager.createRoom` 使用 `selectRandomRoles`，并按 `personaId` 关联人格。
- AI 音色来源改为玩家角色字段：`GameManager` 中语音合成改为读取 `player.voiceProfileName`。
- 人格池仅保留人格策略与长度偏好：`personas.ts` 移除 `voiceProfileName`，新增 `DEFAULT_PERSONA_ID` 与 `getPersonaById` 兜底。
- 语音预热改为基于角色库：`VoiceManager` 使用 `getAiRoleProfileNames`。
- `PlayerVO` 增加 `roleId` 与 `voiceProfileName` 字段，支持角色身份与音色透传。
- `.env.example` 移除 `AI_PLAYER_NAMES`，改为提示角色库迁移到 `aiRoles.ts`。

## 验证

- 已执行 `backend` 构建：`npm run build`
- 结果：构建成功。


