import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'

export class HistoryWrittenSourceCitedWorkItemPage extends BaseItemPage {
  protected readonly path = '/data/history/written-sources/cited-works/[id]'

  constructor(page: Page) {
    super(page, 'item-action-menu')
  }
}
