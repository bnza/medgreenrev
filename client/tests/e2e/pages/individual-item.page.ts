import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'

export class IndividualItemPage extends BaseItemPage {
  protected readonly path = '/data/individuals/[id]'

  constructor(page: Page) {
    super(page, 'item-action-menu')
  }
}
