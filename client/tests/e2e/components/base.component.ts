import type { Page, Locator } from '@playwright/test'

export abstract class BaseComponent {
  readonly page: Page
  readonly container: Locator

  constructor(page: Page, locatorOrTestId: Locator | string) {
    this.page = page
    this.container =
      typeof locatorOrTestId === 'string'
        ? page.getByTestId(locatorOrTestId)
        : locatorOrTestId
  }

  // Common methods that all components might need
  async isVisible(): Promise<boolean> {
    return await this.container.isVisible()
  }

  async waitForLoad(): Promise<void> {
    await this.container.waitFor({ state: 'visible' })
  }
}
