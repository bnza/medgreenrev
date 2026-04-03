import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'

export class MicrostratigraphicUnitItemPage extends BaseItemPage {
  protected readonly path = '/data/microstratigraphic_units/[id]'

  constructor(page: Page) {
    super(page, 'item-action-menu')
  }
}
