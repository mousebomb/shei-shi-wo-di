# 2026-04-13 LLM 过载重试机制

## 改动目标
- 为 `AiManager.llmRequest` 增加针对临时限流/过载错误的延迟重试能力。
- 默认策略：`1s -> 3s -> 10s`，共重试 3 次（总尝试 4 次）。
- 支持通过环境变量配置重试延迟。

## 具体改动
- 修改 `backend/src/constants/index.ts`
  - 新增 `LLM_RETRY_DELAYS_MS` 常量。
  - 新增解析函数 `parseRetryDelays`，支持从 `LLM_RETRY_DELAYS_MS` 环境变量读取逗号分隔毫秒值。
  - 当配置缺失或非法时，回退默认值 `[1000, 3000, 10000]`。

- 修改 `backend/src/manager/AiManager.ts`
  - `llmRequest` 改为重试循环。
  - 新增 `requestOnce`：单次请求与响应清洗逻辑。
  - 新增 `isRetryableLlmError`：仅识别 `529` / `overloaded_error` 为可重试。
  - 新增 `toLlmRequestError`：统一最终异常格式，保持原日志输出行为。
  - 新增 `sleep`：用于重试等待。

## 行为说明
- 命中过载错误时按配置延迟重试。
- 非过载错误不重试，立即抛出。
- 达到重试上限后抛出最后一次错误（格式与原逻辑兼容）。

## 配置示例
```env
LLM_RETRY_DELAYS_MS=1000,3000,10000
```

