import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'

export class SampleItemPage extends BaseItemPage {
  protected readonly path = '/data/samples/[id]'

  constructor(page: Page) {
    super(page, 'item-action-menu')
  }
}
