import { type Page, expect } from '@playwright/test'
import { DataDialogComponent } from '~~/tests/e2e/components/data-dialog.component'

export class DataDialogUpdateComponent extends DataDialogComponent {
  constructor(page: Page) {
    super(page, 'data-dialog-update')
  }

  expectOldFormData(name?: string) {
    return expect(
      this.container.getByRole('textbox', { name }).first(),
    ).not.toHaveValue('')
  }
}
