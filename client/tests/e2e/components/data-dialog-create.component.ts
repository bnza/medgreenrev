import type { Page } from '@playwright/test'
import { DataDialogComponent } from '~~/tests/e2e/components/data-dialog.component'

export class DataDialogCreateComponent extends DataDialogComponent {
  public readonly showCreatedItemCheckbox = this.container
    .getByTestId('show-created-item-checkbox')
    .getByRole('checkbox')

  constructor(page: Page) {
    super(page, 'data-dialog-create')
  }
}
