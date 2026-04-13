# voicebox request.ts Node.js 兼容性适配

## 原始需求

`openapi-typescript-codegen` 生成的 `request.ts` 使用了浏览器原生 API（`fetch`、`Headers`、`FormData`、`Blob`），在 Node.js 服务端运行报错，需要做兼容性适配，作为可复用模板。

## 改动内容

**文件**：`backend/src/voicebox/core/request.ts`

### 核心变更

| 原版（浏览器）| 适配版（Node.js）|
|---|---|
| `fetch(url, init)` | `axios.request({...})` |
| `new Headers()` 实例 | `Record<string, string>` 普通对象 |
| `Response` 返回类型 | `AxiosResponse` 返回类型 |
| `response.headers.get(key)` | `response.headers[key.toLowerCase()]` |
| `response.json() / .text()` | `response.data`（axios 自动解析）|

### isBlob 兼容
```typescript
// Node.js Buffer / Uint8Array 也视为 Blob
if (Buffer.isBuffer(value) || value instanceof Uint8Array) return true;
```

### sendRequest 改用 axios
```typescript
return await axios.request({
    url, method, headers, data: body ?? formData,
    cancelToken: source.token,
    withCredentials: config.WITH_CREDENTIALS,
    validateStatus: () => true, // 不自动抛出，交由 catchErrorCodes 处理
});
```

## 依赖变更

- `@types/node` 升级到 `^18`（获得 `btoa`、`FormData`、`Headers` 等 Web API 类型支持）
- `axios` 已有，无需新增依赖

## 结论

生成的 voicebox SDK 模板 `request.ts` 已改为 axios 实现，可直接在 Node.js 环境运行，同时保持原有函数签名和接口不变，方便 `openapi-typescript-codegen` 后续重新生成时覆盖替换。

