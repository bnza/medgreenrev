import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'

export class HistoryAnimalItemPage extends BaseItemPage {
  protected readonly path = '/data/history/animals/[id]'

  constructor(page: Page) {
    super(page, 'item-action-menu')
  }
}
