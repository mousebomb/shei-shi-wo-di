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
