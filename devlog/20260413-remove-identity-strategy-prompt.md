# 20260413 - 移除身份策略直给提示

## 概述

按需求将 AI 提示词中的“身份策略直给”移除，改为让 AI 基于公开信息自行判断局势，不再在系统提示中直接灌输“你是平民/你是卧底”的策略。

## 变更文件

### `backend/src/constants/prompts.ts`
- 在 `PROMPT_GAME_RULES` 增加中性规则：不要预设身份结论，需根据每轮公开信息动态判断局势并决策。
- `PROMPT_PERSONA_SYSTEM` 移除 `【身份策略】` 占位符与相关说明。
- 删除 `PROMPT_COMMONER_STRATEGY`、`PROMPT_UNDERCOVER_STRATEGY` 常量。
- 删除 `PROMPT_Vote_UnderCover`，统一只保留 `PROMPT_Vote`。

### `backend/src/manager/AiManager.ts`
- 移除身份策略相关导入和 `identityStrategy` 构建逻辑。
- `agentInit()` 不再替换 `【身份策略】`。
- `agentVote()` 改为统一使用 `PROMPT_Vote`，不再按身份分支选择提示词。
- 清理未使用的 `Identity` 导入。

## 验证

在 `backend` 目录执行构建：
- `npm run -s build`
- 结果：构建成功。


