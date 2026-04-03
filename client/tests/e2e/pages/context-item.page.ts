import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'

export class ContextItemPage extends BaseItemPage {
  protected readonly path = '/data/contexts/[id]'

  constructor(page: Page) {
    super(page, 'item-action-menu')
  }
}
