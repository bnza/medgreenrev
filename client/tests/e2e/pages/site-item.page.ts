import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import { expect, type Page } from '@playwright/test'

export class SiteItemPage extends BaseItemPage {
  protected readonly path = '/data/sites/[id]'

  constructor(page: Page) {
    super(page, 'site-action-menu')
  }

  // /**
  //  * Expects the app data card to have resource label as title
  //  */
  // async expectAppDataCardToHaveResourceLabelAsTitle() {
  //   await expect(this.dataCard.container).toBeVisible()
  //   // Assuming the data card has a title element with resource information
  //   const titleElement = this.dataCard.container.locator(
  //     '[data-testid="resource-title"]',
  //   )
  //   await expect(titleElement).toBeVisible()
  // }

  /**
   * Expects a text field to have a specific value
   * @param fieldName - the name/label of the text field
   * @param expectedValue - the expected value in the field
   */

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
