import type { Page, Locator } from '@playwright/test'
import { BaseComponent } from '~~/tests/e2e/components/base.component'

export class AppMapNavigationDrawerComponent extends BaseComponent {
  public readonly dataGroup: Locator

  constructor(page: Page) {
    super(page, 'app-map-navigation-drawer')
    this.dataGroup = this.page.getByTestId('app-map-nav-drawer-li-data')
  }

  async expandDataGroup() {
    await this.dataGroup.click()
  }

  getVectorLayerItem(path: string): Locator {
    return this.page.getByTestId(`map-list-item-vector-api-${path}`)
  }

  getVectorLayerCheckbox(path: string): Locator {
    return this.getVectorLayerItem(path).locator('.v-checkbox-btn')
  }
}
