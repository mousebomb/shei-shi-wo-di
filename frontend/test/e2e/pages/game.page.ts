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
