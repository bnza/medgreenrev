import { BaseComponent } from '~~/tests/e2e/components/base.component'
import { expect, type Locator, type Page } from '@playwright/test'
import { DataCardComponent } from '~~/tests/e2e/components/data-card.component'

export class DataDialogComponent extends BaseComponent {
  // Button locators using data-testids from the component
  public readonly closeButton = this.container.getByTestId(
    'data-dialog-form-close-button',
  )
  public readonly submitButton = this.container.getByTestId(
    'data-dialog-form-submit-button',
  )

  // Form and checkbox locators
  public readonly form = this.container.getByTestId('data-dialog-form')

  public readonly dataCard = new DataCardComponent(this.page)

  /**
   * Checks if the create dialog is visible
   */
  async expectDialogToBeVisible() {
    await expect(this.container).toBeVisible()
  }

  /**
   * Checks if the create dialog is not visible/closed
   */
  async expectDialogToBeClosed() {
    await expect(this.container).not.toBeVisible()
  }

  /**
   * Expects the form to be visible and ready for input
   */
  async expectFormToBeVisible() {
    await expect(this.form).toBeVisible()
  }

  /**
   * Expects the submit button to be enabled
   */
  async expectSubmitButtonToBeEnabled() {
    await expect(this.submitButton).toBeEnabled()
  }

  /**
   * Expects the submit button to be disabled
   */
  async expectSubmitButtonToBeDisabled() {
    await expect(this.submitButton).toBeDisabled()
  }

  /**
   * Expects the close button to be enabled
   */
  async expectCloseButtonToBeEnabled() {
    await expect(this.closeButton).toBeEnabled()
  }

  /**
   * Expects the close button to be disabled
   */
  async expectCloseButtonToBeDisabled() {
    await expect(this.closeButton).toBeDisabled()
  }

  /**
   * Closes the dialog using the close button and verifies it's closed
   */
  async closeDialog() {
    await this.closeButton.click()
    await this.expectDialogToBeClosed()
  }

  /**
   * Submits the form and optionally verifies dialog closure
   * @param expectClosure - whether to expect the dialog to close after submission
   */
  async submitForm(expectClosure = true) {
    await this.submitButton.click()
    if (expectClosure) {
      await this.expectDialogToBeClosed()
    }
  }
}
