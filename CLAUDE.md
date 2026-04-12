# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**谁是卧底** - 一个在线多人派对游戏，玩家在描述词语的同时要找出隐藏在其中的"卧底"。AI驱动的智能体与人类玩家一起游戏，通过WebSocket实时通信。

## 技术栈

- **后端**: Node.js + TSRPC (TypeScript RPC框架) + WebSocket
- **前端**: React 17 + TypeScript + Semi-UI + react-router-dom
- **AI**: LLMs (豆包/千问) 驱动AI玩家行为 + CosyVoice TTS语音合成
- **协议**: tslb-browser (前端), tsrpc (后端)

## 常用命令

```bash
# 后端开发 (热重载)
cd backend && npm run dev

# 前端开发 (热重载)
cd frontend && npm run dev

# 后端构建
cd backend && npm run build

# 前端构建
cd frontend && npm run build

# 后端测试
cd backend && npm run dev  # 先启动开发服务器
# 新开终端
cd backend && npm run test

# 生成 API 文档
cd backend && npm run doc
```

## 项目结构

```
├── backend/
│   ├── src/
│   │   ├── api/           # TSRPC API 处理器 (SendDescribe, SendVote, StartGame)
│   │   ├── constants/      # 游戏规则、提示词模板、词库
│   │   │   ├── prompts.ts # AI 描述/投票提示词
│   │   │   ├── WoDi.md    # 卧底提示词
│   │   │   ├── PingMin.md # 平民提示词
│   │   │   └── words.txt  # 游戏词语库
│   │   ├── manager/        # 核心游戏逻辑
│   │   │   ├── AiManager.ts    # AI 玩家管理 (调用 LLM)
│   │   │   ├── GameManager.ts  # 游戏流程控制
│   │   │   └── RoomManager.ts  # 房间管理
│   │   ├── session/        # WebSocket 会话管理
│   │   ├── shared/protocols/   # 共享协议定义 (serviceProto.ts)
│   │   └── vo/            # 值对象 (PlayerVO, RoomVO)
│   └── test/              # 测试文件
│
├── frontend/
│   └── src/
│       ├── Chatroom/       # 游戏房间界面
│       ├── constants/      # 前端常量
│       ├── hook/          # React Hooks (ClientSession, enableAuthentication)
│       └── shared -> backend/src/shared  # 共享协议 (符号链接)
```

## 核心架构

### 游戏流程 (backend/src/manager/GameManager.ts)
1. **游戏准备**: 分配卧底/平民词语，创建AI智能体
2. **描述阶段**: 玩家和AI依次描述自己的词语
3. **发言阶段**: 按顺序发言讨论
4. **投票阶段**: 投票找出卧底
5. **结果公布**: 平票则重新描述，否则公布结果

### AI 驱动 (backend/src/manager/AiManager.ts)
- 调用 LLM API 生成 AI 玩家的描述和投票决策
- 使用系统提示词区分卧底和平民角色
- 支持 CosyVoice TTS 合成语音

### 通信协议 (backend/src/shared/protocols/serviceProto.ts)
- **API**: `StartGame`, `SendDescribe`, `SendVote` (请求/响应)
- **Msg**: `Chat`, `GameStarted`, `PlsDescribe`, `PlsVote` (WebSocket 推送)

### 前端状态管理
- 通过 `useClient.ts` / `getClient.ts` 连接 TSRPC 客户端
- WebSocket 长连接接收服务器推送

## 环境变量

### backend/.env
```
LLM_MODEL=                    # LLM 模型名称
LLM_API=                      # LLM API 地址
LLM_API_KEY=                  # LLM API Key
COSYVOICE_API=                # CosyVoice TTS 服务地址
AI_PLAYER_NAMES=              # AI 玩家名称列表 (逗号分隔)
```

### frontend/.env
```
REACT_APP_API_URL=           # 后端 API 地址
```

## 注意事项

- 前端通过符号链接 `frontend/src/shared` 共享后端的协议定义
- 修改 `serviceProto.ts` 后需重新同步: `npm run sync` (后端) 和 `npm run sync` (前端)
- 游戏规则和AI提示词定义在 `backend/src/constants/` 目录下
