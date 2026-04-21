import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'
export class AnalysisZooToothItemPage extends BaseItemPage {
  protected readonly path = '/data/analyses/zoo/teeth/[id]'
  constructor(page: Page) {
    super(page, 'item-action-menu')
  }
}
