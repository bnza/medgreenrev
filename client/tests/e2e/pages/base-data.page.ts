import { BasePage } from '~~/tests/e2e/pages/base.page'
import { DataCardComponent } from '~~/tests/e2e/components/data-card.component'
import type { Locator, Page } from '@playwright/test'

export abstract class BaseDataPage extends BasePage {
  public readonly dataCard: DataCardComponent
  constructor(page: Page, actionMenuTestId: string) {
    super(page)
    this.dataCard = new DataCardComponent(page, actionMenuTestId)
  }
}
