import { BaseComponent } from '~~/tests/e2e/components/base.component'
import type { Page } from '@playwright/test'

export class AppDataNavigationDrawerComponent extends BaseComponent {
  async clickOnItem(item: string | string[]): Promise<void> {
    if (typeof item === 'string') {
      return await this.container.getByText(item).click()
    }
    await Promise.all(item.map((i) => this.clickOnItem(i)))
    return
  }

  constructor(page: Page) {
    super(page, 'app-navigation-drawer')
  }
}
