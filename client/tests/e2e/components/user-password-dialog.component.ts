import { BaseComponent } from '~~/tests/e2e/components/base.component'
import { expect, type Page } from '@playwright/test'

export class UserPasswordDialogComponent extends BaseComponent {
  public readonly cancelButton = this.container.getByRole('button', {
    name: 'Cancel',
  })
  public readonly resetButton = this.container.getByRole('button', {
    name: 'Reset',
  })
  public readonly copyButton = this.container.getByRole('button', {
    name: 'Copy',
  })
  public readonly closeButton = this.container.getByRole('button', {
    name: 'Close',
  })
  public readonly changeButton = this.container.getByRole('button', {
    name: 'Change',
  })
  public readonly plainPassword = this.container.locator('#plainPassword')

  public readonly oldPassword = this.container.getByRole('textbox', {
    name: 'old password',
  })
  public readonly newPassword = this.container.getByRole('textbox', {
    name: 'new password',
  })
  public readonly repeatPassword = this.container.getByRole('textbox', {
    name: 'repeat password',
  })
  constructor(page: Page) {
    super(page, 'data-dialog-user-password')
  }

  async expectPlainPasswordMessage() {
    await expect(this.plainPassword).toHaveCount(1)
  }

  async updatePassword(updateData: {
    oldPassword: string
    newPassword: string
    repeatPassword: string
  }) {
    await this.oldPassword.fill(updateData.oldPassword)
    await this.newPassword.fill(updateData.newPassword)
    await this.repeatPassword.fill(updateData.repeatPassword)
    await this.changeButton.click()
  }

  // async expectPlainPasswordToBeCopied() {
  //   await this.expectPlainPasswordMessage()
  //   await this.copyButton.click()
  //   await this.pom.expectAppMessageToHaveText(/copied/i)
  // }

  async getPlainPassword() {
    await this.expectPlainPasswordMessage()
    return await this.plainPassword.textContent()
  }

  async expectCloseButtonClosesDialog() {
    await this.closeButton.click()
    await expect(this.container).not.toBeVisible()
  }
}
