import { test, expect } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { IndividualCollectionPage } from '~~/tests/e2e/pages/individual-collection.page'
import { IndividualItemPage } from '~~/tests/e2e/pages/individual-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Individual lifecycle', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Basic site lifecycle works as expected', async ({ page }) => {
      const collectionPom = new IndividualCollectionPage(page)
      const itemPom = new IndividualItemPage(page)

      // OPEN/CLOSE CREATE DIALOG
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.closeDialog()

      // CREATE AND REDIRECT TO NEW SITE PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()

      await collectionPom.dataDialogCreate.form
        .getByLabel('stratigraphic unit')
        .click()
      await page.getByRole('option', { name: /SC/ }).first().click() // Select first available stratigraphic unit

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'identifier' })
        .fill('UNIQ-ID')

      await collectionPom.dataDialogCreate.form
        .getByRole('combobox')
        .filter({ hasText: /sex/ })
        .click()
      await page.getByRole('option').filter({ hasText: 'F' }).click()

      await collectionPom.dataDialogCreate.form
        .getByRole('combobox')
        .filter({ hasText: 'age' })
        .click()
      await page.getByRole('option').filter({ hasText: 'old adult' }).click()

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'notes' })
        .fill('Some summary information about the individual')
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )

      // Verify the created item details
      await itemPom.expectTextFieldToHaveValue('identifier', 'UNIQ-ID')
      await itemPom.expectTextFieldToHaveValue('sex', 'F')
      await itemPom.expectTextFieldToHaveValue('age', 'old adult')
      await itemPom.expectTextFieldToHaveValue(
        'notes',
        'Some summary information about the individual',
      )
      await itemPom.dataCard.backButton.click()
      await collectionPom.table.expectData()

      // UPDATE

      await collectionPom.table
        .getItemNavigationLink('UNIQ-ID', NavigationLinksButton.Update)
        .click()
      await collectionPom.dataDialogUpdate.expectOldFormData()

      await page
        .getByRole('combobox')
        .filter({ hasText: /^sex/ })
        .locator('i')
        .click()
      await page.getByRole('option', { name: 'M', exact: true }).click()

      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'notes' })
        .fill('Updated summary information about the individual')

      await collectionPom.dataDialogUpdate.submitForm()

      // Verify updated item details
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )
      await collectionPom.table.expectRowToHaveText(
        'UNIQ-ID',
        'Updated summary information about the individual',
      )
      await collectionPom.table.expectRowToHaveText('UNIQ-ID', 'M')
      await collectionPom.table.expectRowToHaveText('UNIQ-ID', 'old adult')

      // DELETE
      await collectionPom.table
        .getItemNavigationLink('UNIQ-ID', NavigationLinksButton.Delete)
        .click()
      await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
        'identifier',
        'UNIQ-ID',
      )
      await collectionPom.dataDialogDelete.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.table.expectNotToHaveRowContainingText('UNIQ-ID')
    })
    test('Data validation', async ({ page }) => {
      const collectionPom = new IndividualCollectionPage(page)
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')

      // Test 1: Required field type - identifier

      await collectionPom.dataDialogCreate.submitButton.click()
      await expect(
        page.locator('.v-input:has(label:text("stratigraphic unit"))'),
      ).toContainText(/required/)
      await expect(
        page.locator('.v-input:has(label:text("identifier"))'),
      ).toContainText(/required/)

      // Test 2: Unique validation - try to create with duplicate identifier
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'identifier' })
        .fill('NI-408-001') // Assuming this exists in fixtures
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("identifier"))'),
      ).toContainText('Identifier must be unique')

      // Test 3: Valid form submission after fixing validation errors
      await collectionPom.dataDialogCreate.form
        .getByLabel('stratigraphic unit')
        .click()
      await page.getByRole('option', { name: /SC/ }).first().click()
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'identifier' })
        .fill('UNIQ-ID2')
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
    })
  })
})
