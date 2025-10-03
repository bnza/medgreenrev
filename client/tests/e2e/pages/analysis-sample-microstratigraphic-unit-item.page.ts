import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'

export class AnalysisSampleMicrostratigraphicUnitItemPage extends BaseItemPage {
  protected readonly path = '/data/analyses/samples/microstratigraphy/[id]'

  constructor(page: Page) {
    super(page, 'item-action-menu')
  }
}
