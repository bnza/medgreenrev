import { BaseComponent } from '~~/tests/e2e/components/base.component'
import { type Locator, type Page, expect } from '@playwright/test'

export class DataCardComponent extends BaseComponent {
  public readonly toolbar = this.container
    .getByTestId('data-card-toolbar')
    .first()
  public readonly actionMenuButton: Locator
  public readonly actionMenu: Locator
  public readonly title = this.toolbar.getByTestId(
    'data-card-toolbar-main-title',
  )
  public readonly backButton = this.toolbar.getByTestId(
    'navigation-back-button',
  )
  constructor(
    page: Page,
    actionMenuTestId = 'data-toolbar-item-action-menu',
    containerOrTestId: string | Locator = 'data-card',
  ) {
    super(page, containerOrTestId)
    this.actionMenu = this.page.getByTestId(actionMenuTestId)
    this.actionMenuButton = this.toolbar.getByTestId(
      `${actionMenuTestId}-button`,
    )
  }

  expectToHaveTitle(text: string | RegExp) {
    return expect(this.title).toHaveText(text)
  }

  async clickOnActionMenuButton(text: string | RegExp) {
    await this.actionMenuButton.click()
    await this.actionMenu.getByText(text).click()
  }
}
