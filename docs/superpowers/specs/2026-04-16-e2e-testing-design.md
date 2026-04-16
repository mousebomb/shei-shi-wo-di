# E2E 测试设计方案

## 目标

通过 Playwright 浏览器测试，验证前端界面的用户交互流程是否正常工作，确保在后续大模型开发迭代中，前端与后端的通信不会被破坏。

## 技术栈

- **测试框架**: @playwright/test
- **测试浏览器**: Chromium (Headless)
- **前后端通信**: WebSocket (TSRPC)

## 测试环境配置

| 服务 | 地址 | 启动命令 |
|------|------|----------|
| 后端 | ws://127.0.0.1:3000 | `cd backend && npm run dev` |
| 前端 | http://localhost:8080 | `cd frontend && npm run dev` |

## 测试范围

### 游戏主流程测试 (game-flow.spec.ts)

| 测试用例 | 验证内容 |
|----------|----------|
| 页面加载 | 游戏页面正常渲染，"谁是卧底"标题显示 |
| 连接成功 | WebSocket 连接成功，无错误提示 |
| 开始游戏 | 点击"开始游戏"按钮，连接建立 |
| 游戏初始化 | 收到 GameStarted 消息后，词语卡片、玩家列表显示 |
| 描述阶段 | 收到 PlsDescribe 后，输入框出现，可输入并发送描述 |
| 消息显示 | 发送的描述在消息列表中正确显示 |
| 投票阶段 | 收到 PlsVote 后，投票选项（玩家按钮）出现，可选择并投票 |
| 游戏结算 | 游戏结束后，消息列表包含"平民胜利"或"卧底胜利" |

## 项目结构

```
frontend/
  test/
    e2e/
      game-flow.spec.ts      # E2E 测试用例
      pages/
        game.page.ts          # Page Object: 游戏页面交互封装
      utils/
        setup.ts              # Playwright 全局配置
        server.ts             # 测试前后启动/停止服务
```

## 测试流程

```
1. beforeAll: 启动后端和前端服务
2. beforeEach: 打开浏览器页面，导航到 http://localhost:8080
3. 测试用例执行
4. afterEach: 关闭当前页面
5. afterAll: 停止服务，关闭浏览器
```

### 完整游戏流程测试步骤

1. 页面加载完成
2. WebSocket 连接成功（无 error toast）
3. 点击"开始游戏"按钮
4. 等待 `GameStarted` 消息 → 验证词语卡片显示、玩家列表显示
5. 进入描述阶段循环（轮次可能 1-3 轮）:
   - 等待 `PlsDescribe` 消息 → 描述输入框出现
   - 输入描述文本（最多 50 字）
   - 点击"发送描述"按钮
   - 等待消息列表中出现自己的描述
6. 进入投票阶段循环（每轮描述后）:
   - 等待 `PlsVote` 消息 → 投票选项出现
   - 选择一个玩家
   - 输入投票理由
   - 点击"确认投票"按钮
   - 等待消息列表中出现投票结果
7. 循环直到游戏结束（收到包含"平民胜利"或"卧底胜利"的消息）
8. 断言: 游戏成功结束

## Page Object: GamePage

```typescript
class GamePage {
  // 页面元素
  startGameBtn: Locator        # 开始游戏按钮
  wordCard: Locator            # 词语卡片
  playerList: Locator          # 玩家列表
  messageList: Locator         # 消息列表
  describeInput: Locator       # 描述输入框
  sendDescribeBtn: Locator     # 发送描述按钮
  voteOptions: Locator         # 投票选项列表
  voteConfirmBtn: Locator      # 确认投票按钮

  // 操作方法
  async startGame()
  async sendDescribe(content: string)
  async selectVoteOption(playerNum: number)
  async confirmVote(reason: string)
  async waitForGameEnd()  # 等待游戏结束，返回胜负结果
}
```

## 依赖安装

```bash
cd frontend
npm install -D @playwright/test playwright
npx playwright install chromium
```

## 新增 npm scripts

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

## 运行方式

```bash
# 启动前后端服务后（手动或 CI 脚本）
cd frontend
npm run test:e2e

# 带 UI 显示
npm run test:e2e:headed
```

## 注意事项

1. 测试依赖后端服务运行，需确保 `backend/.env` 配置正确
2. AI 玩家使用真实 LLM，测试结果可能有微小波动（描述内容），但流程应稳定
3. 测试超时时间设置较长（60s），因为 LLM 响应可能较慢
4. 投票阶段玩家序号需要动态获取，不使用硬编码

## 未来扩展

- 多浏览器并行测试（模拟多人真人游戏）
- 截图/视频录制失败场景
- CI/CD 集成
