# 语音合成从 CosyVoice 迁移到 Voicebox

## 原始需求

> 我要改造一下之前的 voice 合成使用的是 cosyvoice 的，现在完全舍弃 cosyvoice，换成 voicebox 的 API 方式调用。主要是接入 generateSpeechGeneratePost 方法。其中参数 profile_id 写在角色个性配置中传入。language 固定传 "zh"，其他几个固定传值：`model_size: "1.7B"`，`engine: "qwen"`。

## 改动小结

### 核心变更

| 文件 | 变更说明 |
|------|----------|
| `src/manager/VoiceManager.ts` | 完全重写：废弃 CosyVoice axios form 调用，改用 voicebox `DefaultService.generateSpeechGeneratePost`，生成后再通过 `GET /audio/{id}` 拉取音频二进制 |
| `src/constants/personas.ts` | `Persona` 接口新增 `voiceProfileId: string` 字段，每个人格添加对应占位配置（待填写实际 ID）|
| `src/constants/index.ts` | 移除 `CosyVoice_API`，新增 `VOICEBOX_API`（voicebox 服务地址）和 `VOICEBOX_HOST_PROFILE_ID`（主持人播报用的默认音色）|
| `src/manager/GameManager.ts` | AI 玩家描述/投票发言时，透传 `player.persona?.voiceProfileId` 给 `synthesize()`，使每个 AI 角色用自己的音色发声 |
| `.env.example` | 替换 `COSYVOICE_API` 为 `VOICEBOX_API` + `VOICEBOX_HOST_PROFILE_ID` |

### 固定参数

```
language: "zh"
model_size: "1.7B"
engine: "qwen"
```

### 调用流程

1. `VoiceManager.synthesize(text, profileId?)` 
2. → `DefaultService.generateSpeechGeneratePost({ profile_id, text, language, model_size, engine })`
3. → 获得 `GenerationResponse.id`
4. → `axios.get(VOICEBOX_API/audio/{id}, { responseType: 'arraybuffer' })`
5. → 返回 `Uint8Array` 给调用方

### 待办

- 每个 Persona 的 `voiceProfileId` 填写实际 voicebox profile ID（当前均为空字符串占位）
- `.env` / 生产环境配置 `VOICEBOX_API` 和 `VOICEBOX_HOST_PROFILE_ID`

