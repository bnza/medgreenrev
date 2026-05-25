import { BasePage } from '~~/tests/e2e/pages/base.page'
import { DataCardComponent } from '~~/tests/e2e/components/data-card.component'
import type { Locator, Page } from '@playwright/test'
import { DataDialogCreateComponent } from '~~/tests/e2e/components/data-dialog-create.component'
import { DataDialogUpdateComponent } from '~~/tests/e2e/components/data-dialog-update.component'
import { DataDialogDeleteComponent } from '~~/tests/e2e/components/data-dialog-delete.component'

export abstract class BaseDataPage extends BasePage {
  public readonly dataCard: DataCardComponent

  // Dialog component for create operations
  public readonly dataDialogCreate = new DataDialogCreateComponent(this.page)

  public readonly dataDialogUpdate = new DataDialogUpdateComponent(this.page)

  public readonly dataDialogDelete = new DataDialogDeleteComponent(this.page)
  
  constructor(
    page: Page,
    actionMenuTestId: string,
    containerOrTestId: string | Locator = 'data-card',
  ) {
    super(page)
    this.dataCard = new DataCardComponent(
      page,
      actionMenuTestId,
      containerOrTestId,
    )
  }
}
