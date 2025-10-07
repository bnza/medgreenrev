import { type Page, type Locator, expect } from '@playwright/test'
import { AppDataNavigationDrawerComponent } from '~~/tests/e2e/components/app-data-navigation-drawer.component'
import { AppBarComponent } from '~~/tests/e2e/components/app-bar.component'

export abstract class BasePage {
  protected abstract readonly path: string
  public readonly appMessage: Locator

  public readonly appDataNavigationDrawer: AppDataNavigationDrawerComponent
  public readonly appBar: AppBarComponent
  constructor(public readonly page: Page) {
    this.appMessage = this.page.getByTestId('app-message')
    this.appBar = new AppBarComponent(page)
    this.appDataNavigationDrawer = new AppDataNavigationDrawerComponent(page)
  }

  async clickAppDataNavigationDrawerItem(item: string | string[]) {
    await this.appBar.appBarNavIcon.click()
    await this.appDataNavigationDrawer.clickOnItem(item)
  }

  async open(path = '') {
    await this.page.goto('#' + (path || this.path))
  }

  async expectAppMessageToHaveText(text: string | RegExp, count = 1) {
    await expect(this.appMessage.getByText(text)).toHaveCount(count)
  }

  async awaitForApiResponse<T>(
    urlGlob: string,
    action: () => T | Promise<T>,
    status: number = 200,
  ): Promise<T> {
    const responsePromise = this.page.waitForResponse(urlGlob)
    const result = await action()
    const response = await responsePromise
    expect(response.status()).toBe(status)
    return result
  }
}
