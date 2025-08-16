import { test, expect } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { PotteryCollectionPage } from '~~/tests/e2e/pages/pottery-collection.page'
import { PotteryItemPage } from '~~/tests/e2e/pages/pottery-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Pottery lifecycle', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Basic pottery lifecycle works as expected', async ({ page }) => {
      const collectionPom = new PotteryCollectionPage(page)
      const itemPom = new PotteryItemPage(page)

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
      await page.getByRole('option').first().click() // Select first available stratigraphic unit

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'inventory' })
        .fill('POT-2024-001')

      // Fill shape field (using autocomplete)
      await collectionPom.dataDialogCreate.form.getByLabel('shape').click()
      await page.getByRole('option').first().click()

      // Fill functional group field (using autocomplete)
      await collectionPom.dataDialogCreate.form
        .getByLabel('functional group')
        .click()
      await page.getByRole('option').first().click()

      // Fill functional form field (using autocomplete)
      await collectionPom.dataDialogCreate.form
        .getByLabel('functional form')
        .click()
      await page.getByRole('option').first().click()

      // Fill cultural context field (using autocomplete)
      await collectionPom.dataDialogCreate.form
        .getByLabel('cultural contexts')
        .click()
      await page.getByRole('option').first().click()

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology lower' })
        .fill('-500')

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology upper' })
        .fill('-300')

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'notes' })
        .fill('Test pottery fragment found in archaeological excavation')

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )

      // Verify the created item details
      await itemPom.expectTextFieldToHaveValue('inventory', 'POT-2024-001')
      // await itemPom.expectTextFieldToHaveValue('chronology lower', '-500')
      // await itemPom.expectTextFieldToHaveValue('chronology upper', '-300')
      await itemPom.expectTextFieldToHaveValue(
        'notes',
        'Test pottery fragment found in archaeological excavation',
      )
      await itemPom.dataCard.backButton.click()
      await collectionPom.table.expectData()

      // UPDATE
      await collectionPom.table
        .getItemNavigationLink('POT-2024-001', NavigationLinksButton.Update)
        .click()
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'notes' })
        .fill(
          'Updated pottery fragment with detailed analysis and cultural significance',
        )

      const responsePromise = page.waitForResponse('**/api/data/potteries/**')
      await collectionPom.dataDialogUpdate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )
      await responsePromise
      await collectionPom.table.expectRowToHaveText(
        'POT-2024-001',
        'Updated pottery fragment with detailed analysis and cultural significance',
      )

      // DELETE
      await collectionPom.table
        .getItemNavigationLink('POT-2024-001', NavigationLinksButton.Delete)
        .click()
      await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
        'inventory',
        'POT-2024-001',
      )
      await collectionPom.dataDialogDelete.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.table.expectNotToHaveRowContainingText('POT-2024-001')

      // CREATE AND NOT REDIRECT TO NEW POTTERY PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.uncheck()

      // Fill stratigraphic unit field again
      await collectionPom.dataDialogCreate.form
        .getByLabel('stratigraphic unit')
        .click()
      await page.getByRole('option').first().click()

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'inventory' })
        .fill('POT-2024-002')

      await collectionPom.dataDialogCreate.form
        .getByLabel('functional group')
        .click()
      await page.getByRole('option').first().click()

      await collectionPom.dataDialogCreate.form
        .getByLabel('functional form')
        .click()
      await page.getByRole('option').first().click()

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'notes' })
        .fill('Another test pottery artifact')

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await collectionPom.table.expectData()
      await collectionPom.table.expectRowToHaveText(
        'POT-2024-002',
        'POT-2024-002',
      )
    })

    test('Data validation', async ({ page }) => {
      const collectionPom = new PotteryCollectionPage(page)

      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')

      // Test 1: Required field validation - stratigraphic unit field
      await collectionPom.dataDialogCreate.form
        .getByLabel('stratigraphic unit')
        .click()
      await page.getByRole('option').first().click()
      await collectionPom.dataDialogCreate.form
        .getByLabel('stratigraphic unit')
        .click()
      await page.keyboard.press('Backspace')

      // Wait for validation to trigger
      await page.waitForTimeout(500)

      await expect(
        page.locator('.v-input:has(label:text("stratigraphic unit"))'),
      ).toContainText(/required/)

      // Fix the validation error
      await collectionPom.dataDialogCreate.form
        .getByLabel('stratigraphic unit')
        .click()
      await page.getByRole('option').first().click()

      // Test 2: Required field validation - inventory field
      const inventoryField = collectionPom.dataDialogCreate.form.getByRole(
        'textbox',
        { name: 'inventory' },
      )
      await inventoryField.fill('TEST')
      await inventoryField.clear()

      // Wait for validation
      await page.waitForTimeout(500)

      await expect(
        page.locator('.v-input:has(label:text("inventory"))'),
      ).toContainText(/required/)

      // Fix the error
      await inventoryField.fill('POT-TEST-001')
      await expect(
        page.locator('.v-input:has(label:text("inventory"))'),
      ).not.toContainText(/required/)

      // Test 3: Chronology validation - invalid number format
      const chronologyLowerField =
        collectionPom.dataDialogCreate.form.getByRole('textbox', {
          name: 'chronology lower',
        })
      await chronologyLowerField.fill('not_a_number')
      await page.keyboard.press('Tab')

      await expect(
        page.locator('.v-input:has(label:text("chronology lower"))'),
      ).toContainText(/must be an integer/i)

      // Test 4: Chronology validation - year too low
      await chronologyLowerField.fill('-40000')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("chronology lower"))'),
      ).toContainText(/must be greater than/i)

      // Test 5: Chronology validation - year too high (future year)
      const futureYear = new Date().getFullYear() + 10
      const chronologyUpperField =
        collectionPom.dataDialogCreate.form.getByRole('textbox', {
          name: 'chronology upper',
        })
      await chronologyUpperField.fill(futureYear.toString())
      await page.keyboard.press('Tab')

      await expect(
        page.locator('.v-input:has(label:text("chronology upper"))'),
      ).toContainText(/must be less than/i)

      // Test 6: Chronology range validation - lower > upper
      await chronologyLowerField.fill('100')
      await chronologyUpperField.fill('50')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("chronology lower"))'),
      ).toContainText(
        /lower chronology must be greater than or equal upper chronology/i,
      )

      // Test 7: Unique inventory validation - try to create with existing inventory
      await inventoryField.fill('ME050.2023') // Assuming this exists in fixtures
      await page.keyboard.press('Tab')
      await page.waitForTimeout(1000) // Wait for async validation
      await expect(
        page.locator('.v-input:has(label:text("inventory"))'),
      ).toContainText(/inventory must be unique/i)

      // Test 8: Valid form submission after fixing validation errors
      await inventoryField.fill('POT-VALID-001')
      await chronologyLowerField.fill('-200')
      await chronologyUpperField.fill('-100')
      // Fill functional group field (using autocomplete)
      await collectionPom.dataDialogCreate.form
        .getByLabel('functional group')
        .click()
      await page.getByRole('option').first().click()

      // Fill functional form field (using autocomplete)
      await collectionPom.dataDialogCreate.form
        .getByLabel('functional form')
        .click()
      await page.getByRole('option').first().click()

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
    })
  })
})
