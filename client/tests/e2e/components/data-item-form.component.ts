import { BaseComponent } from '~~/tests/e2e/components/base.component'
import { type Locator, type Page, expect } from '@playwright/test'

export class DataItemFormComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, 'data-item-form')
  }

  async expectTextFieldToHaveValue(fieldName: string, expectedValue: string) {
    const textField = this.container.getByRole('textbox', { name: fieldName })
    await expect(textField).toHaveValue(expectedValue)
  }
}
