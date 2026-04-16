# E2E 测试实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标:** 使用 Playwright 浏览器测试验证前端界面交互流程，在大模型迭代时确保前后端通信不被破坏

**架构:** Playwright 测试直接操作浏览器，WebSocket 通信完全走真实前端环境，AI 玩家使用真实 LLM

**技术栈:** @playwright/test, playwright, TypeScript

---

## 文件结构

```
frontend/
  test/
    e2e/
      game-flow.spec.ts      # E2E 测试用例
      pages/
        game.page.ts          # Page Object: 游戏页面交互封装
      utils/
        setup.ts              # Playwright 全局配置
  playwright.config.ts       # Playwright 配置文件

docs/superpowers/plans/
  2026-04-16-e2e-testing-plan.md  # 本计划
```

---

## Task 1: 安装 Playwright 依赖

**Files:**
- Modify: `frontend/package.json`

- [ ] **Step 1: 安装 Playwright 依赖**

Run: `cd frontend && npm install -D @playwright/test playwright`

- [ ] **Step 2: 安装 Chromium 浏览器**

Run: `cd frontend && npx playwright install chromium`

- [ ] **Step 3: 提交**

```bash
cd frontend
git add package.json package-lock.json
git commit -m "chore: 添加 Playwright 测试依赖

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 2: 配置 Playwright

**Files:**
- Create: `frontend/playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: false,  // 单浏览器顺序执行
  forbidOnly: !!process.env.CI,
  retries: 0,  // 不重试，LLM 随机性可能导致不稳定
  workers: 1,
  reporter: 'list',
  timeout: 120000,  // 120秒超时，L LM 响应较慢

  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

- [ ] **Step 1: 创建 Playwright 配置文件**

```bash
cat > frontend/playwright.config.ts << 'EOF'
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 120000,

  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
EOF
```

- [ ] **Step 2: 提交**

```bash
git add frontend/playwright.config.ts
git commit -m "feat: 添加 Playwright 配置文件

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 3: 创建 Page Object - GamePage

**Files:**
- Create: `frontend/test/e2e/pages/game.page.ts`

```typescript
import { Locator, Page } from '@playwright/test';

export class GamePage {
  readonly page: Page;

  // 页面元素
  readonly startGameBtn: Locator;
  readonly wordCard: Locator;
  readonly wordLabel: Locator;
  readonly wordContent: Locator;
  readonly playerList: Locator;
  readonly messageList: Locator;
  readonly describeInput: Locator;
  readonly sendDescribeBtn: Locator;
  readonly voteConfirmBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startGameBtn = page.locator('.start-game-btn');
    this.wordCard = page.locator('.word-card');
    this.wordLabel = page.locator('.word-label');
    this.wordContent = page.locator('.word-content');
    this.playerList = page.locator('.players-status');
    this.messageList = page.locator('.list');
    this.describeInput = page.locator('.chat-input');
    this.sendDescribeBtn = page.locator('.send-btn');
    this.voteConfirmBtn = page.locator('.send-btn');
  }

  async goto() {
    await this.page.goto('/');
  }

  async startGame() {
    await this.startGameBtn.click();
  }

  async sendDescribe(content: string) {
    await this.describeInput.fill(content);
    await this.sendDescribeBtn.click();
  }

  async waitForDescribeInput(): Promise<boolean> {
    try {
      await this.describeInput.waitFor({ state: 'visible', timeout: 30000 });
      return true;
    } catch {
      return false;
    }
  }

  async waitForVoteOptions(): Promise<Locator> {
    // 等待投票选项出现，返回投票 RadioGroup
    return this.page.locator('.vote-options');
  }

  async selectVoteOption(playerName: string) {
    // 点击对应玩家名称的 Radio
    await this.page.locator(`.vote-options >> text=${playerName}`).click();
  }

  async confirmVote(reason: string) {
    await this.describeInput.fill(reason);
    await this.voteConfirmBtn.click();
  }

  async waitForMessageContaining(text: string, timeout = 60000): Promise<boolean> {
    try {
      await this.messageList.locator(`text=${text}`).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async isGameEnded(): Promise<boolean> {
    const content = await this.messageList.textContent();
    return !!(content?.includes('平民胜利') || content?.includes('卧底胜利'));
  }

  async getPlayerNames(): Promise<string[]> {
    return this.playerList.locator('.player-name').allTextContents();
  }
}
```

- [ ] **Step 1: 创建 GamePage Page Object**

```bash
cat > frontend/test/e2e/pages/game.page.ts << 'EOF'
import { Locator, Page } from '@playwright/test';

export class GamePage {
  readonly page: Page;

  // 页面元素
  readonly startGameBtn: Locator;
  readonly wordCard: Locator;
  readonly wordLabel: Locator;
  readonly wordContent: Locator;
  readonly playerList: Locator;
  readonly messageList: Locator;
  readonly describeInput: Locator;
  readonly sendDescribeBtn: Locator;
  readonly voteConfirmBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startGameBtn = page.locator('.start-game-btn');
    this.wordCard = page.locator('.word-card');
    this.wordLabel = page.locator('.word-label');
    this.wordContent = page.locator('.word-content');
    this.playerList = page.locator('.players-status');
    this.messageList = page.locator('.list');
    this.describeInput = page.locator('.chat-input');
    this.sendDescribeBtn = page.locator('.send-btn');
    this.voteConfirmBtn = page.locator('.send-btn');
  }

  async goto() {
    await this.page.goto('/');
  }

  async startGame() {
    await this.startGameBtn.click();
  }

  async sendDescribe(content: string) {
    await this.describeInput.fill(content);
    await this.sendDescribeBtn.click();
  }

  async waitForDescribeInput(): Promise<boolean> {
    try {
      await this.describeInput.waitFor({ state: 'visible', timeout: 30000 });
      return true;
    } catch {
      return false;
    }
  }

  async waitForVoteOptions(): Promise<Locator> {
    return this.page.locator('.vote-options');
  }

  async selectVoteOption(playerName: string) {
    await this.page.locator(`.vote-options >> text=${playerName}`).click();
  }

  async confirmVote(reason: string) {
    await this.describeInput.fill(reason);
    await this.voteConfirmBtn.click();
  }

  async waitForMessageContaining(text: string, timeout = 60000): Promise<boolean> {
    try {
      await this.messageList.locator(`text=${text}`).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async isGameEnded(): Promise<boolean> {
    const content = await this.messageList.textContent();
    return !!(content?.includes('平民胜利') || content?.includes('卧底胜利'));
  }

  async getPlayerNames(): Promise<string[]> {
    return this.playerList.locator('.player-name').allTextContents();
  }
}
EOF
```

- [ ] **Step 2: 提交**

```bash
git add frontend/test/e2e/pages/game.page.ts
git commit -m "feat: 添加 GamePage Page Object

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 4: 创建 Playwright Setup 配置

**Files:**
- Create: `frontend/test/e2e/utils/setup.ts`

```typescript
import { test as base } from '@playwright/test';
import { GamePage } from '../pages/game.page';

export const test = base.extend<{ gamePage: GamePage }>({
  gamePage: async ({ page }, use) => {
    const gamePage = new GamePage(page);
    await gamePage.goto();
    await use(gamePage);
  },
});

export { expect } from '@playwright/test';
```

- [ ] **Step 1: 创建 setup.ts**

```bash
cat > frontend/test/e2e/utils/setup.ts << 'EOF'
import { test as base } from '@playwright/test';
import { GamePage } from '../pages/game.page';

export const test = base.extend<{ gamePage: GamePage }>({
  gamePage: async ({ page }, use) => {
    const gamePage = new GamePage(page);
    await gamePage.goto();
    await use(gamePage);
  },
});

export { expect } from '@playwright/test';
EOF
```

- [ ] **Step 2: 提交**

```bash
git add frontend/test/e2e/utils/setup.ts
git commit -m "feat: 添加 Playwright test fixtures

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 5: 编写完整游戏流程 E2E 测试

**Files:**
- Create: `frontend/test/e2e/game-flow.spec.ts`

```typescript
import { test, expect } from './utils/setup';

/**
 * E2E 测试：完整游戏流程
 *
 * 前置条件：
 * 1. 后端服务运行在 ws://127.0.0.1:3000
 * 2. 前端服务运行在 http://localhost:8080
 *
 * 测试目标：验证前端界面交互流程正常，游戏能完整跑完
 */
test.describe('游戏主流程', () => {
  test('完整游戏流程 - 从开始到结算', async ({ gamePage }) => {
    // 1. 页面加载完成
    await expect(gamePage.page.locator('h1')).toContainText('谁是卧底');

    // 2. WebSocket 连接成功（无 error toast）
    // 等待一下确保连接建立
    await gamePage.page.waitForTimeout(1000);

    // 3. 点击"开始游戏"按钮
    await gamePage.startGame();

    // 4. 等待 GameStarted 消息，验证词语卡片和玩家列表显示
    await expect(gamePage.wordCard).toBeVisible({ timeout: 30000 });
    await expect(gamePage.playerList).toBeVisible({ timeout: 30000 });

    // 5. 进入描述/投票循环，直到游戏结束
    let gameEnded = false;
    let maxIterations = 20; // 防止死循环
    let iterations = 0;

    while (!gameEnded && iterations < maxIterations) {
      iterations++;

      // 描述阶段
      const hasDescribeInput = await gamePage.waitForDescribeInput();
      if (hasDescribeInput) {
        // 获取自己的词语（用于生成描述）
        const word = await gamePage.wordContent.textContent();

        // 发送描述
        await gamePage.sendDescribe(`我的词是${word}，这是一个东西`);

        // 等待消息显示
        await gamePage.page.waitForTimeout(500);
      }

      // 检查游戏是否结束
      gameEnded = await gamePage.isGameEnded();
      if (gameEnded) break;

      // 投票阶段
      try {
        const voteOptions = await gamePage.waitForVoteOptions();
        await voteOptions.waitFor({ state: 'visible', timeout: 5000 });

        // 获取玩家列表，随机选一个投票
        const players = await gamePage.getPlayerNames();
        if (players.length > 0) {
          // 投票给第一个玩家（排除自己，这里简化处理）
          const voteTarget = players[0];
          await gamePage.selectVoteOption(voteTarget);
          await gamePage.confirmVote('感觉不太对');
        }

        await gamePage.page.waitForTimeout(500);
      } catch {
        // 没有投票选项，可能是描述阶段还在进行
      }

      // 再次检查游戏是否结束
      gameEnded = await gamePage.isGameEnded();
    }

    // 6. 断言：游戏成功结束
    expect(gameEnded, '游戏未在最大迭代次数内结束').toBe(true);

    // 7. 验证消息列表包含胜负结果
    const hasCommonerWin = await gamePage.waitForMessageContaining('平民胜利', 5000);
    const hasUndercoverWin = await gamePage.waitForMessageContaining('卧底胜利', 5000);
    expect(hasCommonerWin || hasUndercoverWin, '游戏结束但未找到胜负结果').toBe(true);
  });
});
```

- [ ] **Step 1: 创建 game-flow.spec.ts**

```bash
cat > frontend/test/e2e/game-flow.spec.ts << 'EOF'
import { test, expect } from './utils/setup';

/**
 * E2E 测试：完整游戏流程
 *
 * 前置条件：
 * 1. 后端服务运行在 ws://127.0.0.1:3000
 * 2. 前端服务运行在 http://localhost:8080
 *
 * 测试目标：验证前端界面交互流程正常，游戏能完整跑完
 */
test.describe('游戏主流程', () => {
  test('完整游戏流程 - 从开始到结算', async ({ gamePage }) => {
    // 1. 页面加载完成
    await expect(gamePage.page.locator('h1')).toContainText('谁是卧底');

    // 2. WebSocket 连接成功（无 error toast）
    await gamePage.page.waitForTimeout(1000);

    // 3. 点击"开始游戏"按钮
    await gamePage.startGame();

    // 4. 等待 GameStarted 消息，验证词语卡片和玩家列表显示
    await expect(gamePage.wordCard).toBeVisible({ timeout: 30000 });
    await expect(gamePage.playerList).toBeVisible({ timeout: 30000 });

    // 5. 进入描述/投票循环，直到游戏结束
    let gameEnded = false;
    const maxIterations = 20;

    while (!gameEnded && iterations < maxIterations) {
      iterations++;

      // 描述阶段
      const hasDescribeInput = await gamePage.waitForDescribeInput();
      if (hasDescribeInput) {
        const word = await gamePage.wordContent.textContent();
        await gamePage.sendDescribe(`我的词是${word}，这是一个东西`);
        await gamePage.page.waitForTimeout(500);
      }

      gameEnded = await gamePage.isGameEnded();
      if (gameEnded) break;

      // 投票阶段
      try {
        const voteOptions = await gamePage.waitForVoteOptions();
        await voteOptions.waitFor({ state: 'visible', timeout: 5000 });
        const players = await gamePage.getPlayerNames();
        if (players.length > 0) {
          await gamePage.selectVoteOption(players[0]);
          await gamePage.confirmVote('感觉不太对');
        }
        await gamePage.page.waitForTimeout(500);
      } catch {
        // 没有投票选项，继续循环
      }

      gameEnded = await gamePage.isGameEnded();
    }

    // 6. 断言：游戏成功结束
    expect(gameEnded, '游戏未在最大迭代次数内结束').toBe(true);

    // 7. 验证消息列表包含胜负结果
    const hasCommonerWin = await gamePage.waitForMessageContaining('平民胜利', 5000);
    const hasUndercoverWin = await gamePage.waitForMessageContaining('卧底胜利', 5000);
    expect(hasCommonerWin || hasUndercoverWin, '游戏结束但未找到胜负结果').toBe(true);
  });
});
EOF
```

注意：上面代码有个 bug，`iterations` 未定义。修复：

```typescript
    let iterations = 0;
    while (!gameEnded && iterations < maxIterations) {
```

- [ ] **Step 2: 修复 iterations 变量未定义问题**

```bash
cat > frontend/test/e2e/game-flow.spec.ts << 'EOF'
import { test, expect } from './utils/setup';

/**
 * E2E 测试：完整游戏流程
 *
 * 前置条件：
 * 1. 后端服务运行在 ws://127.0.0.1:3000
 * 2. 前端服务运行在 http://localhost:8080
 *
 * 测试目标：验证前端界面交互流程正常，游戏能完整跑完
 */
test.describe('游戏主流程', () => {
  test('完整游戏流程 - 从开始到结算', async ({ gamePage }) => {
    // 1. 页面加载完成
    await expect(gamePage.page.locator('h1')).toContainText('谁是卧底');

    // 2. WebSocket 连接成功（无 error toast）
    await gamePage.page.waitForTimeout(1000);

    // 3. 点击"开始游戏"按钮
    await gamePage.startGame();

    // 4. 等待 GameStarted 消息，验证词语卡片和玩家列表显示
    await expect(gamePage.wordCard).toBeVisible({ timeout: 30000 });
    await expect(gamePage.playerList).toBeVisible({ timeout: 30000 });

    // 5. 进入描述/投票循环，直到游戏结束
    let gameEnded = false;
    const maxIterations = 20;
    let iterations = 0;

    while (!gameEnded && iterations < maxIterations) {
      iterations++;

      // 描述阶段
      const hasDescribeInput = await gamePage.waitForDescribeInput();
      if (hasDescribeInput) {
        const word = await gamePage.wordContent.textContent();
        await gamePage.sendDescribe(`我的词是${word}，这是一个东西`);
        await gamePage.page.waitForTimeout(500);
      }

      gameEnded = await gamePage.isGameEnded();
      if (gameEnded) break;

      // 投票阶段
      try {
        const voteOptions = await gamePage.waitForVoteOptions();
        await voteOptions.waitFor({ state: 'visible', timeout: 5000 });
        const players = await gamePage.getPlayerNames();
        if (players.length > 0) {
          await gamePage.selectVoteOption(players[0]);
          await gamePage.confirmVote('感觉不太对');
        }
        await gamePage.page.waitForTimeout(500);
      } catch {
        // 没有投票选项，继续循环
      }

      gameEnded = await gamePage.isGameEnded();
    }

    // 6. 断言：游戏成功结束
    expect(gameEnded, '游戏未在最大迭代次数内结束').toBe(true);

    // 7. 验证消息列表包含胜负结果
    const hasCommonerWin = await gamePage.waitForMessageContaining('平民胜利', 5000);
    const hasUndercoverWin = await gamePage.waitForMessageContaining('卧底胜利', 5000);
    expect(hasCommonerWin || hasUndercoverWin, '游戏结束但未找到胜负结果').toBe(true);
  });
});
EOF
```

- [ ] **Step 3: 提交**

```bash
git add frontend/test/e2e/game-flow.spec.ts
git commit -m "feat: 添加完整游戏流程 E2E 测试

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 6: 添加 npm scripts

**Files:**
- Modify: `frontend/package.json`

- [ ] **Step 1: 添加 npm scripts**

```bash
cd frontend
npm pkg set scripts.test:e2e="playwright test"
npm pkg set scripts.test:e2e:headed="playwright test --headed"
```

- [ ] **Step 2: 提交**

```bash
git add frontend/package.json
git commit -m "chore: 添加 E2E 测试 npm scripts

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## Task 7: 验证测试可运行

**验证步骤：**

- [ ] **Step 1: 确认前后端服务运行**

```bash
# 终端1: 启动后端
cd backend && npm run dev

# 终端2: 启动前端
cd frontend && npm run dev
```

- [ ] **Step 2: 运行 E2E 测试**

```bash
cd frontend
npm run test:e2e
```

预期结果：测试能完整跑完游戏流程，最终显示 PASSED

如果失败，可能是：
1. 服务未启动
2. 网络连接问题
3. LLM 响应超时（增加 timeout）
4. CSS 选择器不匹配（检查 HTML 结构）

---

## Task 8: 更新 README（可选）

**Files:**
- Modify: `README.md`（如果需要文档说明）

添加 E2E 测试运行说明：

```markdown
## E2E 测试

### 前置条件
1. 后端服务: `cd backend && npm run dev`
2. 前端服务: `cd frontend && npm run dev`

### 运行测试
```bash
cd frontend
npm run test:e2e
```

### 带 UI 显示
```bash
npm run test:e2e:headed
```
```

---

## 实施检查清单

- [ ] Task 1: Playwright 依赖安装完成
- [ ] Task 2: playwright.config.ts 创建完成
- [ ] Task 3: GamePage Page Object 创建完成
- [ ] Task 4: setup.ts 创建完成
- [ ] Task 5: game-flow.spec.ts 创建完成
- [ ] Task 6: npm scripts 添加完成
- [ ] Task 7: 测试验证通过
- [ ] Task 8: README 更新（可选）

---

## 实施顺序

建议按顺序执行各 Task，每个 Task 完成后运行测试验证。

**Plan complete and saved to `docs/superpowers/plans/2026-04-16-e2e-testing-plan.md`**

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
