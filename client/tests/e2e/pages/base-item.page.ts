import { BaseDataPage } from '~~/tests/e2e/pages/base-data.page'
import { DataItemFormComponent } from '~~/tests/e2e/components/data-item-form.component'
import { expect } from '@playwright/test'
import { DataDialogUpdateComponent } from '~~/tests/e2e/components/data-dialog-update.component'
import { DataDialogDeleteComponent } from '~~/tests/e2e/components/data-dialog-delete.component'

export abstract class BaseItemPage extends BaseDataPage {
  public readonly form = new DataItemFormComponent(this.page)

  public readonly actionMenuButton = this.page.getByTestId(
    'data-toolbar-item-action-menu-button',
  )

  public readonly dataDialogUpdate = new DataDialogUpdateComponent(this.page)

  public readonly dataDialogDelete = new DataDialogDeleteComponent(this.page)

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
