import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'

export class PaleoclimateSampleItemPage extends BaseItemPage {
  protected readonly path = '/data/paleoclimate/samples/[id]'

  constructor(page: Page) {
    super(page, 'sample-action-menu')
  }
}
