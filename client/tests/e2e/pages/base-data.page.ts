import { BasePage } from '~~/tests/e2e/pages/base.page'
import { DataCardComponent } from '~~/tests/e2e/components/data-card.component'
import type { Page } from '@playwright/test'
import { AppBarComponent } from '~~/tests/e2e/components/app-bar.component'
import { AppDataNavigationDrawerComponent } from '~~/tests/e2e/components/app-data-navigation-drawer.component'

export abstract class BaseDataPage extends BasePage {
  public readonly dataCard: DataCardComponent
  constructor(page: Page, actionMenuTestId: string) {
    super(page)
    this.dataCard = new DataCardComponent(page, actionMenuTestId)
  }
}
