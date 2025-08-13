import { test, expect } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { StratigraphicUnitCollectionPage } from '~~/tests/e2e/pages/stratigraphic-unit-collection.page'
import { StratigraphicUnitsItemPage } from '~~/tests/e2e/pages/stratigraphic-units-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Stratigraphic Unit lifecycle', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Basic stratigraphic unit lifecycle works as expected', async ({
      page,
    }) => {
      const collectionPom = new StratigraphicUnitCollectionPage(page)
      const itemPom = new StratigraphicUnitsItemPage(page)

      // OPEN/CLOSE CREATE DIALOG
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.closeDialog()

      // CREATE AND REDIRECT TO NEW STRATIGRAPHIC UNIT PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()

      // Fill site field (using autocomplete)
      await collectionPom.dataDialogCreate.form.getByLabel('site').click()
      await page.getByRole('option').first().click() // Select first available site

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'year' })
        .fill('2023')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'number' })
        .fill('001')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'interpretation' })
        .fill('Test stratigraphic unit for archaeological analysis')

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )

      // Verify the created item details
      await itemPom.expectTextFieldToHaveValue('year', '2023')
      await itemPom.expectTextFieldToHaveValue('number', '1')
      await itemPom.expectTextFieldToHaveValue(
        'interpretation',
        'Test stratigraphic unit for archaeological analysis',
      )
      await itemPom.dataCard.backButton.click()
      await collectionPom.table.expectData()

      // UPDATE
      await collectionPom.table
        .getItemNavigationLink('PA.23.1', NavigationLinksButton.Update) // Assuming code format is year-number
        .click()
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'interpretation' })
        .fill('Updated stratigraphic unit interpretation with new findings')

      const responsePromise = page.waitForResponse(
        '**/api/data/stratigraphic_units/**',
      )
      await collectionPom.dataDialogUpdate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )
      await responsePromise
      // await collectionPom.table.expectRowToHaveText('PA.23.1', '2024')
      await collectionPom.table.expectRowToHaveText(
        'PA.23.1',
        'Updated stratigraphic unit interpretation with new findings',
      )

      // DELETE
      await collectionPom.table
        .getItemNavigationLink('PA.23.1', NavigationLinksButton.Delete)
        .click()
      await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
        'year',
        '2023',
      )
      await collectionPom.dataDialogDelete.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.table.expectNotToHaveRowContainingText('PA.23.1')

      // CREATE AND NOT REDIRECT TO NEW STRATIGRAPHIC UNIT PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.uncheck()

      // Fill site field again
      await collectionPom.dataDialogCreate.form.getByLabel('site').click()
      await page.getByRole('option').first().click()

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'year' })
        .fill('2023')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'number' })
        .fill('003')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'interpretation' })
        .fill('Another test stratigraphic unit')

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await collectionPom.table.expectData()
      await collectionPom.table.expectRowToHaveText('PA.23.3', 'PA.23.3')
    })

    test('Data validation', async ({ page }) => {
      const collectionPom = new StratigraphicUnitCollectionPage(page)

      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')

      // Test 1: Required field validation - site field
      await collectionPom.dataDialogCreate.form.getByLabel('site').click()
      await page.getByRole('option').first().click()
      await collectionPom.dataDialogCreate.form.getByLabel('site').click()
      await page.keyboard.press('Backspace')
      await expect(
        collectionPom.dataDialogCreate.form.getByText(/required/),
      ).toBeVisible()
      await collectionPom.dataDialogCreate.form.getByLabel('site').click()
      await page.getByRole('option').first().click()

      // Test 2: Required field validation - year  field
      await collectionPom.dataDialogCreate.form.getByLabel('year').fill('2')
      await collectionPom.dataDialogCreate.form.getByLabel('year').fill('')
      await expect(
        collectionPom.dataDialogCreate.form.getByText(/required/),
      ).toBeVisible()
      await collectionPom.dataDialogCreate.form.getByLabel('year').fill('2023')
      await expect(
        collectionPom.dataDialogCreate.form.getByText(/required/),
      ).not.toBeVisible()

      // Test 3: Required field validation - number field
      await collectionPom.dataDialogCreate.form.getByLabel('number').fill('2')
      await collectionPom.dataDialogCreate.form.getByLabel('number').fill('')
      await expect(
        collectionPom.dataDialogCreate.form.getByText(/required/),
      ).toBeVisible()
      await collectionPom.dataDialogCreate.form.getByLabel('number').fill('999')
      await expect(
        collectionPom.dataDialogCreate.form.getByText(/required/),
      ).not.toBeVisible()

      // Test 4: Year validation - invalid year format
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'year' })
        .fill('not_a_year')
      await page.keyboard.press('Tab')
      await expect(
        collectionPom.dataDialogCreate.form.getByText('Must be an integer'),
      ).toBeVisible()

      // Test 5: Year validation - year too low
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'year' })
        .fill('1899')
      await expect(
        collectionPom.dataDialogCreate.form.getByText(/must be greater than/i),
      ).toBeVisible()

      // Test 6: Year validation - year too high (future year)
      const futureYear = new Date().getFullYear() + 10
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'year' })
        .fill(futureYear.toString())
      await expect(
        collectionPom.dataDialogCreate.form.getByText(/must be less than/i),
      ).toBeVisible()

      // Test 7: Unique validation - try to create with existing combination
      await collectionPom.dataDialogCreate.form.getByLabel('site').fill('SE')
      await page.getByRole('option').first().click()
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'year' })
        .fill('2025') // Assuming this exists in fixtures
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'number' })
        .fill('508') // Assuming this combination exists
      await expect(
        collectionPom.dataDialogCreate.form.getByText(/duplicate \[/i),
      ).toHaveCount(3)

      // Test 8: Valid form submission after fixing validation errors
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'number' })
        .fill('999')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'interpretation' })
        .fill('Valid test stratigraphic unit for validation testing')

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
    })
  })
})
