import { test, expect } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { MicrostratigraphicUnitCollectionPage } from '~~/tests/e2e/pages/microstratigraphic-unit-collection.page'
import { MicrostratigraphicUnitItemPage } from '~~/tests/e2e/pages/microstratigraphic-unit-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Microstratigraphic unit lifecycle', () => {
  test.describe('Geo user', () => {
    test.use({ storageState: 'playwright/.auth/geo.json' })

    test('Basic lifecycle works as expected', async ({ page }) => {
      const collectionPom = new MicrostratigraphicUnitCollectionPage(page)
      const itemPom = new MicrostratigraphicUnitItemPage(page)

      // OPEN/CLOSE CREATE DIALOG
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.closeDialog()

      // CREATE AND REDIRECT TO NEW POTTERY PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()

      // Fill stratigraphic unit field (using autocomplete)
      await collectionPom.dataDialogCreate.form
        .getByLabel('stratigraphic unit')
        .click()
      await page.getByRole('option', { name: 'SC2.24.705' }).click()

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'identifier' })
        .fill('NEW-G')

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'notes' })
        .fill('Test microstratigraphic unit found in archaeological excavation')

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )

      // Verify the created item details
      await itemPom.expectTextFieldToHaveValue('identifier', 'NEW-G')
      await itemPom.expectTextFieldToHaveValue(
        'notes',
        'Test microstratigraphic unit found in archaeological excavation',
      )
      await itemPom.dataCard.backButton.click()
      await collectionPom.table.expectData()

      // UPDATE
      await collectionPom.table
        .getItemNavigationLink('NEW-G', NavigationLinksButton.Update)
        .click()
      await collectionPom.dataDialogUpdate.expectOldFormData()
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'notes' })
        .fill('Updated microstratigraphic unit fragment with detailed analysis')

      await collectionPom.dataDialogUpdate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )
      await collectionPom.table.expectRowToHaveText(
        'NEW-G',
        'Updated microstratigraphic unit fragment with detailed analysis',
      )

      // DELETE
      await collectionPom.table
        .getItemNavigationLink('NEW-G', NavigationLinksButton.Delete)
        .click()
      await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
        'identifier',
        'NEW-G',
      )
      await collectionPom.dataDialogDelete.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.table.expectNotToHaveRowContainingText('NEW-G')

      // CREATE AND NOT REDIRECT TO NEW POTTERY PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.uncheck()

      // Fill stratigraphic unit field again
      await collectionPom.dataDialogCreate.form
        .getByLabel('stratigraphic unit')
        .click()
      await page.getByRole('option', { name: 'SC2.24.705' }).click()

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'identifier' })
        .fill('NEW-G2')

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'notes' })
        .fill('Another test microstratigraphic unit artifact')

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await collectionPom.table.expectData()
      await collectionPom.table.expectRowToHaveText('NEW-G2', 'NEW-G2')
    })

    test('Data validation', async ({ page }) => {
      const collectionPom = new MicrostratigraphicUnitCollectionPage(page)

      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')

      // Test 1: Required field validation - stratigraphic unit field
      await collectionPom.dataDialogCreate.submitButton.click()
      await expect(
        page.locator('.v-input:has(label:text("stratigraphic unit"))'),
      ).toContainText(/required/)
      await expect(
        page.locator('.v-input:has(label:text("identifier"))'),
      ).toContainText(/required/)

      // Test 2: Duplicate SU/identifier combination
      await collectionPom.dataDialogCreate.form
        .getByLabel('stratigraphic unit')
        .fill('308')
      await page.waitForTimeout(500)
      await page.getByRole('option', { name: /308/ }).first().click()

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'identifier' })
        .fill('a') // Assuming this exists in fixtures
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("stratigraphic unit"))'),
      ).toContainText('Duplicate [stratigraphic unit, identifier] combination')
      await expect(
        page.locator('.v-input:has(label:text("identifier"))'),
      ).toContainText('Duplicate [stratigraphic unit, identifier] combination')

      // Fill functional form field (using autocomplete)
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'identifier' })
        .fill('ZZ') // Assuming this not exists in fixtures

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
    })
  })
})
