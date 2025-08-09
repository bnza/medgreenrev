import type { Browser } from '@playwright/test'
import { LoginPage } from '~~/tests/e2e/pages/login.page'
import type { UserPasswordDialogComponent } from '~~/tests/e2e/components/user-password-dialog.component'

export class AuthTestHelper {
  constructor(private browser: Browser) {}

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
