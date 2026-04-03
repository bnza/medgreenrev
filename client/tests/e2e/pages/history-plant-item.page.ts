import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'

export class HistoryPlantItemPage extends BaseItemPage {
  protected readonly path = '/data/history/plants/[id]'

  constructor(page: Page) {
    super(page, 'item-action-menu')
  }
}
