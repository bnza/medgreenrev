import type { Browser } from '@playwright/test'
import { LoginPage } from '~~/tests/e2e/pages/login.page'
import type { UserPasswordDialogComponent } from '~~/tests/e2e/components/user-password-dialog.component'
import { UserCollectionPage } from '~~/tests/e2e/pages/user-collection.page'
import { UserItemPage } from '~~/tests/e2e/pages/user-item.page'

export class AuthTestHelper {
  constructor(private browser: Browser) {}

  async createUser(
    userRole: string,
    specialistRoles: string[],
  ): Promise<{ email: string; password: string }> {
    const random = Math.random().toString(36).substring(7)
    const email = `username_${random}@example.com`
    const context = await this.browser.newContext({
      storageState: 'playwright/.auth/admin.json',
    })
    const page = await context.newPage()
    const collectionPom = new UserCollectionPage(page)
    const itemPom = new UserItemPage(page)

    try {
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'email' })
        .fill(email)
      await collectionPom.dataDialogCreate.form
        .getByRole('radio', { name: userRole })
        .click()

      for (const specialistRole of specialistRoles) {
        await collectionPom.dataDialogCreate.form
          .getByRole('checkbox', { name: new RegExp(specialistRole) })
          .click()
      }

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )

      const password = await itemPom.userPasswordDialog.getPlainPassword()

      return { email, password: password || '' }
    } finally {
      await page.close()
      await context.close()
    }
  }

  async verifyLoginWithPassword(
    email: string,
    password: string,
  ): Promise<void> {
    const context = await this.browser.newContext({
      storageState: { cookies: [], origins: [] },
    })
    const page = await context.newPage()
    const loginPage = new LoginPage(page)

    try {
      await loginPage.open()
      await loginPage.login({ email, password })
      await loginPage.expectAppMessageToHaveText(/successfully logged in/)
    } finally {
      await page.close()
      await context.close()
    }
  }

  async verifyLoginWithPasswordFromDialog(
    email: string,
    passwordDialog: UserPasswordDialogComponent,
  ): Promise<void> {
    const password = await passwordDialog.getPlainPassword()
    await this.verifyLoginWithPassword(email, password || '')
  }
}
