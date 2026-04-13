# 修复 streamSpeechGenerateStreamPost 在 Node.js 报 getReader 错误

## 用户原始需求

将 `streamSpeechGenerateStreamPost` 切到新的 Stream Post 接口后，接口成功返回 file attachment（音频文件），但后端报错：

`TypeError: resp.getReader is not a function`

需要修正 Node.js 环境下的读取逻辑。

## 问题根因

`resp.getReader()` 属于浏览器 `ReadableStream` API。

当前项目后端运行在 Node.js，且 SDK 请求层已改为 `axios`，`streamSpeechGenerateStreamPost` 返回值并不是 Web Stream，而是 `Buffer/Uint8Array/ArrayBuffer` 等二进制数据，所以调用 `getReader` 会抛错。

## 本次改动

### 1) `backend/src/manager/VoiceManager.ts`

- 移除浏览器流读取逻辑（`resp.getReader()` + chunk 合并）。
- 改为统一二进制归一化：新增 `normalizeAudioData(data)`，兼容：
  - `Uint8Array`
  - `Buffer`
  - `ArrayBuffer`
  - `ArrayBufferView`（DataView/TypedArray）
  - `{ type: 'Buffer', data: number[] }`
- 归一化失败时抛出明确错误并在外层统一捕获日志。

### 2) `backend/src/voicebox/services/DefaultService.ts`

- 在 `streamSpeechGenerateStreamPost` 请求中增加：
  - `headers: { Accept: 'audio/wav' }`
- 让请求层明确按音频返回处理。

### 3) `backend/src/voicebox/core/request.ts`

- 请求发送层增强：按 `Accept` 自动选择 axios `responseType`
  - 音频/视频/图片/octet-stream → `arraybuffer`
  - 其他 → `json`
- 响应解析增强：按 `content-type` 解析
  - JSON 类型：尝试 `JSON.parse`
  - 文本类型：UTF-8 字符串
  - 二进制：`Uint8Array`

## 验证结果

执行构建验证通过：

- 命令：`cd backend && npm run build`
- 结果：`构建成功`

## 结论

该问题已修复：`streamSpeechGenerateStreamPost` 在 Node.js 下不再使用 `getReader`，可直接获取并返回可用的音频二进制数据（`Uint8Array`）。后续重新生成 SDK 时，可保留以上改动作为模板。
