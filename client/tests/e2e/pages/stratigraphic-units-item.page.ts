import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'

export class StratigraphicUnitsItemPage extends BaseItemPage {
  protected readonly path = '/data/stratigraphic_units/[id]'

  constructor(page: Page) {
    super(page, 'item-action-menu')
  }
}
