import { BaseDataPage } from '~~/tests/e2e/pages/base-data.page'
import { DataCollectionTableComponent } from '~~/tests/e2e/components/data-collection-table.component'
import type { Locator, Page } from '@playwright/test'
import { DataDialogCreateComponent } from '~~/tests/e2e/components/data-dialog-create.component'
import { DataDialogUpdateComponent } from '~~/tests/e2e/components/data-dialog-update.component'
import { DataDialogDeleteComponent } from '~~/tests/e2e/components/data-dialog-delete.component'

export abstract class BaseCollectionPage extends BaseDataPage {
  public table = new DataCollectionTableComponent(this.page)

  public readonly searchInput = this.dataCard.container.getByRole('textbox', {
    name: 'search',
  })

  public abstract readonly apiUrl: string

  // Dialog component for create operations
  public readonly dataDialogCreate = new DataDialogCreateComponent(this.page)

  public readonly dataDialogUpdate = new DataDialogUpdateComponent(this.page)

  public readonly dataDialogDelete = new DataDialogDeleteComponent(this.page)

  constructor(
    page: Page,
    actionMenuTestId = 'data-toolbar-collection-action-menu',
    containerOrTestId: string | Locator = 'data-card',
  ) {
    super(page, actionMenuTestId, containerOrTestId)
  }

  public async awaitSearchResults(text: string) {
    return this.awaitForApiResponse(`***${this.apiUrl}***`, () =>
      this.searchInput.fill(text),
    )
  }
}
