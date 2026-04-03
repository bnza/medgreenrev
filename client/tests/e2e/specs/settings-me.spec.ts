import { expect, test } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { HomePage } from '~~/tests/e2e/pages/home.page'
import { SettingsMePage } from '~~/tests/e2e/pages/settings-me.page'
import { AuthTestHelper } from '~~/tests/e2e/utils/auth-test-helper'
test.beforeAll(async () => {
  loadFixtures()
})

test.describe('setting/me page', () => {
  test.describe('base user', () => {
    test.use({ storageState: 'playwright/.auth/base.json' })
    test('Can change his password', async ({ page, browser }) => {
      const homePom = new HomePage(page)
      const pom = new SettingsMePage(page)
      await homePom.open()
      await homePom.appBar.clickOnUserSettingsButton()
      await pom.dataCard.expectToHaveTitle('user_base@example.com')
      await pom.dataCard.clickOnActionMenuButton('change password')
      await pom.userPasswordDialog.updatePassword({
        oldPassword: '0000',
        newPassword: 'NewPassword1!',
        repeatPassword: 'NewPassword1!',
      })
      await pom.expectAppMessageToHaveText('Password successfully changed')
      // CHECK RESET PASSWORD LOGIN
      const authTestHelper = new AuthTestHelper(browser)
      await authTestHelper.verifyLoginWithPassword(
        'user_base@example.com',
        'NewPassword1!',
      )
    })
    test('Password validation rules work correctly', async ({ page }) => {
      const pom = new SettingsMePage(page)
      await pom.open()
      await pom.dataCard.expectToHaveTitle('user_base@example.com')
      await pom.dataCard.clickOnActionMenuButton('change password')

      // Fill old password to focus on new password validation
      await pom.userPasswordDialog.oldPassword.fill('0000')

      // Test 1: Empty password should show required error
      await pom.userPasswordDialog.newPassword.fill('a')
      await page.keyboard.press('Backspace')
      await pom.userPasswordDialog.newPassword.blur()
      await expect(page.getByText('Password cannot be blank.')).toBeVisible()

      // Test 2: Too short password should show length error
      await pom.userPasswordDialog.newPassword.fill('Ab1!')
      await pom.userPasswordDialog.newPassword.blur()
      await expect(
        page.getByText('Password must be at least 8 characters long.'),
      ).toBeVisible()

      // Test 3: Too long password should show length error
      await pom.userPasswordDialog.newPassword.fill(
        'ThisPasswordIsTooLongForValidation123!',
      )
      await pom.userPasswordDialog.newPassword.blur()
      await expect(
        page.getByText('Password cannot be longer than 20 characters.'),
      ).toBeVisible()

      // Test 4: Password without uppercase should show uppercase error
      await pom.userPasswordDialog.newPassword.fill('lowercase123!')
      await pom.userPasswordDialog.newPassword.blur()
      await expect(
        page.getByText('Password must contain at least one uppercase letter.'),
      ).toBeVisible()

      // Test 5: Password without lowercase should show lowercase error
      await pom.userPasswordDialog.newPassword.fill('UPPERCASE123!')
      await pom.userPasswordDialog.newPassword.blur()
      await expect(
        page.getByText('Password must contain at least one lowercase letter.'),
      ).toBeVisible()

      // Test 6: Password without digit should show digit error
      await pom.userPasswordDialog.newPassword.fill('NoDigitPass!')
      await pom.userPasswordDialog.newPassword.blur()
      await expect(
        page.getByText('Password must contain at least one digit.'),
      ).toBeVisible()

      // Test 7: Password without special character should show special char error
      await pom.userPasswordDialog.newPassword.fill('NoSpecialChar123')
      await pom.userPasswordDialog.newPassword.blur()
      await expect(
        page.getByText('Password must contain at least one special character.'),
      ).toBeVisible()

      // Test 8: Valid password should not show any validation errors
      await pom.userPasswordDialog.newPassword.fill('ValidPass123!')
      await pom.userPasswordDialog.newPassword.blur()

      // Wait a moment for validation to process
      await page.waitForTimeout(500)

      // Check that no password validation errors are visible
      await expect(
        page.getByText('Password cannot be blank.'),
      ).not.toBeVisible()
      await expect(
        page.getByText('Password must be at least 8 characters long.'),
      ).not.toBeVisible()
      await expect(
        page.getByText('Password cannot be longer than 20 characters.'),
      ).not.toBeVisible()
      await expect(
        page.getByText('Password must contain at least one uppercase letter.'),
      ).not.toBeVisible()
      await expect(
        page.getByText('Password must contain at least one lowercase letter.'),
      ).not.toBeVisible()
      await expect(
        page.getByText('Password must contain at least one digit.'),
      ).not.toBeVisible()
      await expect(
        page.getByText('Password must contain at least one special character.'),
      ).not.toBeVisible()

      // Test 9: Password mismatch should show error when repeat password is different
      await pom.userPasswordDialog.repeatPassword.fill('DifferentPass123!')
      await pom.userPasswordDialog.repeatPassword.blur()
      await expect(page.getByText('Passwords must match.')).toBeVisible()

      // Test 10: Matching passwords should not show mismatch error
      await pom.userPasswordDialog.repeatPassword.fill('ValidPass123!')
      await pom.userPasswordDialog.repeatPassword.blur()
      await page.waitForTimeout(500)
      await expect(page.getByText('Passwords must match.')).not.toBeVisible()
    })
  })
})
