import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'
export class AnalysisZooBoneItemPage extends BaseItemPage {
  protected readonly path = '/data/analyses/zoo/bones/[id]'
  constructor(page: Page) {
    super(page, 'item-action-menu')
  }
}
