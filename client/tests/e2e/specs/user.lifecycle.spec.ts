import { test, expect } from '@playwright/test'
import { loadFixtures, resetFixtureMedia } from '~~/tests/e2e/utils/api'
import { UserCollectionPage } from '~~/tests/e2e/pages/user-collection.page'
import { UserItemPage } from '~~/tests/e2e/pages/user-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'
import { AuthTestHelper } from '~~/tests/e2e/utils/auth-test-helper'
import { LoginPage } from '~~/tests/e2e/pages/login.page'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('User lifecycle', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Basic lifecycle works as expected', async ({ page }) => {
      const collectionPom = new UserCollectionPage(page)
      const itemPom = new UserItemPage(page)

      // OPEN/CLOSE CREATE DIALOG
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.closeDialog()

      // CREATE AND REDIRECT TO NEW STRATIGRAPHIC UNIT PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()

      // Fill site field (using autocomplete)

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'email' })
        .fill('user_new@example.com')
      await collectionPom.dataDialogCreate.form
        .getByRole('radio', { name: 'editor' })
        .click()
      await collectionPom.dataDialogCreate.form
        .getByRole('checkbox', { name: /ceramic/ })
        .click()

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )

      // Expect new password to be displayed

      const newPassword = await itemPom.userPasswordDialog.getPlainPassword()

      expect(newPassword).not.toBeNull()

      await itemPom.userPasswordDialog.expectCloseButtonClosesDialog()

      // Verify the created item details
      await itemPom.expectTextFieldToHaveValue('email', 'user_new@example.com')
      await itemPom.expectRadioToBeChecked('editor')
      await itemPom.expectCheckboxToBeChecked(/ceramic/)
      await itemPom.dataCard.backButton.click()
      await collectionPom.table.expectData()

      // UPDATE
      await collectionPom.table
        .getItemNavigationLink(
          'user_new@example.com',
          NavigationLinksButton.Update,
        )
        .click()
      await collectionPom.dataDialogUpdate.expectOldFormData('email')
      await collectionPom.page
        .getByRole('radio', { name: 'administrator' })
        .click()
      await collectionPom.page
        .getByRole('checkbox', { name: /ceramic/ })
        .click()
      await collectionPom.page
        .getByRole('checkbox', { name: 'historian' })
        .click()
      await collectionPom.dataDialogUpdate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )

      await collectionPom.table.expectRowToHaveText(
        'user_new@example.com',
        'Admin',
      )

      // DELETE
      await collectionPom.table
        .getItemNavigationLink(
          'user_new@example.com',
          NavigationLinksButton.Delete,
        )
        .click()
      await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
        'email',
        'user_new@example.com',
      )
      await collectionPom.dataDialogDelete.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.table.expectNotToHaveRowContainingText(
        'user_new@example.com',
      )
    })
    test('Test new user login', async ({ page, browser }) => {
      const collectionPom = new UserCollectionPage(page)
      const itemPom = new UserItemPage(page)

      // OPEN/CLOSE CREATE DIALOG
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')

      // Fill site field (using autocomplete)
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'email' })
        .fill('user_new@example.com')
      await collectionPom.dataDialogCreate.form
        .getByRole('radio', { name: 'user' })
        .click()

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )

      const newPassword = await itemPom.userPasswordDialog.getPlainPassword()

      expect(newPassword).not.toBeNull()

      const authTestHelper = new AuthTestHelper(browser)
      await authTestHelper.verifyLoginWithPassword(
        'user_new@example.com',
        newPassword!,
      )
    })
  })
})
