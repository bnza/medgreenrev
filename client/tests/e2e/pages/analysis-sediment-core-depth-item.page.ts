import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'
export class AnalysisSedimentCoreDepthItemPage extends BaseItemPage {
  protected readonly path = '/data/analyses/sediment-core-depths/[id]'
  constructor(page: Page) {
    super(page, 'item-action-menu')
  }
}
