import { BaseComponent } from '~~/tests/e2e/components/base.component'
import { type Page, expect } from '@playwright/test'

export class DataCollectionTableComponent extends BaseComponent {
  protected readonly table = this.container.locator('table')
  protected readonly header = this.container.locator('theader')
  protected readonly body = this.container.locator('tbody')
  protected readonly footer = this.container.locator('.v-data-table-footer')
  protected readonly pagination = this.container.locator(
    '.v-data-table-pagination',
  )
  protected readonly loadingIndicator = this.body.getByText(/Loading/)

  constructor(page: Page) {
    super(page, 'data-collection-table')
  }

  async expectData() {
    await expect(this.table).toBeVisible({ timeout: 10000 })
    await expect(this.loadingIndicator).not.toBeVisible()
  }

  getItemNavigationLink(rowSelector: number | string | RegExp, testId: string) {
    return this.getRow(rowSelector).getByTestId(testId)
  }

  getRow(nthOrText: number | string | RegExp) {
    return typeof nthOrText === 'number'
      ? this.body.getByRole('row').nth(nthOrText)
      : this.getRowByText(nthOrText)
  }

  /**
   * Finds and returns a row element within the body of a table that matches the given text or regular expression.
   * It's mainly used to find rows based on their code/id string.
   */
  getRowByText(text: string | RegExp) {
    if ('string' === typeof text) {
      text = new RegExp(`${text}`)
    }
    return this.body
      .getByRole('row')
      .filter({ has: this.page.locator('td', { hasText: text }) })
  }

  expectRowToHaveText(
    nthOrText: number | string | RegExp,
    text: string | RegExp,
  ) {
    return expect(this.getRow(nthOrText)).toContainText(text)
  }

  expectNotToHaveRowContainingText(text: string | RegExp) {
    return expect(this.getRowByText(text)).toHaveCount(0)
  }

  getTotalItemsCount() {
    return this.footer.locator('.v-data-table-footer__info').textContent()
  }

  async getPaginationInfo() {
    const text = await this.footer
      .locator('.v-data-table-footer__info')
      .textContent()
    return text?.trim() || ''
  }

  async getCurrentPageRange(key?: 'start' | 'end' | 'total') {
    const paginationText = await this.getPaginationInfo()

    // Parse text like "1-10 of 63" to extract numbers
    const match = paginationText.match(/^(\d+)-(\d+) of (\d+)$/)

    const paginationRange: { start?: number; end?: number; total?: number } = {
      start: undefined,
      end: undefined,
      total: undefined,
    }

    if (match) {
      paginationRange.start = match[1] ? parseInt(match[1], 10) : undefined
      paginationRange.end = match[2] ? parseInt(match[2], 10) : undefined
      paginationRange.total = match[3] ? parseInt(match[3], 10) : undefined
      if (key) {
        return paginationRange[key]
      }
      return paginationRange
    }

    return null
  }
}
