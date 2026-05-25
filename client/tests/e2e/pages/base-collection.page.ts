import { BaseDataPage } from '~~/tests/e2e/pages/base-data.page'
import { DataCollectionTableComponent } from '~~/tests/e2e/components/data-collection-table.component'
import type { Locator, Page } from '@playwright/test'


export abstract class BaseCollectionPage extends BaseDataPage {
  public table = new DataCollectionTableComponent(this.page)

  public readonly searchInput = this.dataCard.container.getByRole('textbox', {
    name: 'search',
  })

  public abstract readonly apiUrl: string



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
