# 2026-04-12 OpenAI SDK + MiniMax 兼容重构

## 背景
原有 `AiManager.llmRequest` 基于 `axios` 直接请求固定 `/chat/completions`，在接入 OpenAI 兼容生态（尤其 MiniMax）时扩展性较差。

## 本次改动
- 将 `backend/src/manager/AiManager.ts` 的 LLM 调用改为 `openai` 官方 SDK。
- 统一读取配置：
  - `OPENAI_BASE_URL` / `OPENAI_API_KEY`（优先）
  - 兼容旧配置 `LLM_API` / `LLM_API_KEY`（自动从 `LLM_API` 推导 baseURL）。
- 保持原行为兼容：
  - `llmRequest` 返回结构仍是 `{ raw, content }`
  - 继续清理 `</think>` 之前内容
  - 继续移除换行
  - 保留 `LLM_LOG_V` 的请求/响应日志
  - 保留错误日志与错误抛出语义
- 更新 `backend/.env.example`：默认改为 MiniMax OpenAI 兼容配置示例。
- 更新 `backend/package.json`：新增 `openai` 依赖。

## 验证结果
- 已执行：`cd backend && npm run build`
- 结果：构建通过。

## 备注
- 当前未启用 `reasoning_split`，仍通过清理 `<think>...</think>` 保持旧逻辑输出。
- 若后续要支持 Function Calling 多轮上下文，可在消息历史中保留完整 assistant message（含 `tool_calls`）。

