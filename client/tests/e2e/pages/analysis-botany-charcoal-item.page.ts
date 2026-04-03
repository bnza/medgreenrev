import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'

export class AnalysisBotanyCharcoalItemPage extends BaseItemPage {
  protected readonly path = '/data/analyses/botany/charcoals/[id]'

  constructor(page: Page) {
    super(page, 'item-action-menu')
  }
}
