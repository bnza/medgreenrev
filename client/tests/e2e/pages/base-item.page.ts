import { BaseDataPage } from '~~/tests/e2e/pages/base-data.page'
import { DataItemFormComponent } from '~~/tests/e2e/components/data-item-form.component'
import { expect } from '@playwright/test'

export abstract class BaseItemPage extends BaseDataPage {
  public readonly form = new DataItemFormComponent(this.page)

  async expectTextFieldToHaveValue(fieldName: string, expectedValue: string) {
    const textField = this.page.getByRole('textbox', { name: fieldName })
    await expect(textField).toHaveValue(expectedValue)
  }

  async expectRadioToBeChecked(
    fieldName: string | RegExp,
    checked: boolean = true,
  ) {
    const input = this.page.getByRole('radio', { name: fieldName })
    if (checked) {
      return expect(input).toBeChecked()
    }
    return expect(input).not.toBeChecked()
  }

  async expectCheckboxToBeChecked(
    fieldName: string | RegExp,
    checked: boolean = true,
  ) {
    const input = this.page.getByRole('checkbox', { name: fieldName })
    if (checked) {
      return expect(input).toBeChecked()
    }
    return expect(input).not.toBeChecked()
  }

  clickTab(tabName: string) {
    return this.page.getByRole('tab', { name: tabName }).click()
  }
}
