import { expect, type Page } from '@playwright/test'
import { DataDialogComponent } from '~~/tests/e2e/components/data-dialog.component'

export class DataDialogDeleteComponent extends DataDialogComponent {
  constructor(page: Page) {
    super(page, 'data-dialog-delete')
  }
  async expectTextFieldToHaveValue(fieldName: string, expectedValue: string) {
    const textField = this.container.getByRole('textbox', { name: fieldName })
    await expect(textField).toHaveValue(expectedValue)
  }
}
