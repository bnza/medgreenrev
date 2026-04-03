import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import { expect, type Page } from '@playwright/test'

export class PaleoclimateSamplingSiteItemPage extends BaseItemPage {
  protected readonly path = '/data/sites/paleoclimate-sampling/[id]'

  constructor(page: Page) {
    super(page, 'site-action-menu')
  }

  /**
   * Expects a specific panel to be visible by test id
   * @param panelTestId - the test id of the panel
   */
  async expectPanelToBeVisible(panelTestId: string) {
    const panel = this.page.getByTestId(panelTestId)
    await expect(panel).toBeVisible()
  }

  /**
   * Clicks on a panel by test id
   * @param panelTestId - the test id of the panel to click
   */
  async clickPanel(panelTestId: string) {
    const panel = this.page.getByTestId(panelTestId)
    await panel.click()
  }
}
