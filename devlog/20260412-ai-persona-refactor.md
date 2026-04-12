# 20260412 - AI人格驱动重构

## 概述

根据 `docs/superpowers/specs/2026-04-12-ai-persona-design.md` 设计文档，将AI玩家行为从"规则驱动"重构为"人格驱动"。

## 变更清单

### 新增文件
- **`backend/src/constants/personas.ts`**：定义6种AI人格模板（活泼小猴、沉稳老炮、幽默达人、观察家、佛系玩家、直觉型），包括 `Persona` 接口、人格池 `PERSONAS`、随机选取函数 `selectRandomPersonas()`、描述长度提示函数 `getDescribeLengthHint()`

### 删除文件
- **`backend/src/constants/WoDi.md`**：卧底提示词，已合并到人格模板 + 身份策略
- **`backend/src/constants/PingMin.md`**：平民提示词，已合并到人格模板 + 身份策略

### 修改文件

| 文件 | 变更内容 |
|------|----------|
| `backend/src/constants/prompts.ts` | 移除 `DESCRIBE_ANGLE`(12种硬编码角度)、`PROMPT_UnderCover`、`PROMPT_Commoner`；新增 `PROMPT_PERSONA_SYSTEM`(人格系统提示词模板)、`PROMPT_COMMONER_STRATEGY`(平民策略)、`PROMPT_UNDERCOVER_STRATEGY`(卧底策略)；精简游戏规则；修改描述提示词用 `【长度要求】` 替代固定字数 |
| `backend/src/vo/PlayerVO.ts` | 新增 `persona?: Persona` 字段 |
| `backend/src/manager/AiManager.ts` | `agentInit()` 改为人格驱动版，使用 `PROMPT_PERSONA_SYSTEM` + 身份策略构建system prompt；`agentDescribeWord()` 移除角度选择，改为人格风格驱动，描述长度由人格 `replyLength` 决定 |
| `backend/src/manager/RoomManager.ts` | `createRoom()` 中为AI玩家随机分配不重复人格，人类玩家清除persona |

## 核心设计

### Prompt 结构
```
System Prompt = [人格定义] + [身份策略] + [游戏规则]
```

### 人格与字数的关系
- `short` → 不超过10个字
- `medium` → 不超过15个字
- `long` → 不超过20个字

### 占位符对应关系
| 占位符 | 替换来源 |
|--------|----------|
| `【名字】` | `player.getFullName()` |
| `【其他人的名字】` | 其他玩家全名逗号拼接 |
| `【词】` | `player.word` |
| `【人格描述】` | `persona.description` |
| `【描述策略】` | `persona.describeStrategy` |
| `【投票策略】` | `persona.voteStrategy` |
| `【身份策略】` | 平民/卧底策略常量 |
| `【长度要求】` | `getDescribeLengthHint(persona.replyLength)` |

## 编译验证
✅ `tsc --noEmit` 通过，零编译错误

