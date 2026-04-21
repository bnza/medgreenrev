import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'
export class AnalysisBotanySeedItemPage extends BaseItemPage {
  protected readonly path = '/data/analyses/botany/seeds/[id]'
  constructor(page: Page) {
    super(page, 'item-action-menu')
  }
}
