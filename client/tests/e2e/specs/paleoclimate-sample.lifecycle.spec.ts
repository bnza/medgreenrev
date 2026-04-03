import { test, expect } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { PaleoclimateSampleCollectionPage } from '~~/tests/e2e/pages/paleoclimate-sample-collection.page'
import { PaleoclimateSampleItemPage } from '~~/tests/e2e/pages/paleoclimate-sample-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Paleoclimate sample lifecycle', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Basic paleoclimate sample lifecycle works as expected', async ({
      page,
    }) => {
      const collectionPom = new PaleoclimateSampleCollectionPage(page)
      const itemPom = new PaleoclimateSampleItemPage(page)

      // OPEN/CLOSE CREATE DIALOG
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.closeDialog()

      // CREATE AND REDIRECT TO NEW SAMPLE PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()

      // Select site (autocomplete)
      await collectionPom.dataDialogCreate.form.getByLabel('site').click()
      await collectionPom.awaitForApiResponse(
        '**/api/data/paleoclimate_sampling_sites?search=cueva*',
        () => page.keyboard.type('cueva'),
      )

      // Selecting the first option
      await page.getByRole('option', { name: /cueva/i }).first().click()

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'number' })
        .fill('101')

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('-1000')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (upper)' })
        .fill('2024')

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'description' })
        .fill('A new paleoclimate sample for testing purposes')

      await collectionPom.dataDialogCreate.form
        .getByRole('checkbox', { name: 'precipitations' })
        .check()
      await collectionPom.dataDialogCreate.form
        .getByRole('checkbox', { name: 'temperature' })
        .check()

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )

      // ITEM PAGE VERIFICATION
      await itemPom.expectTextFieldToHaveValue('number', '101')
      await itemPom.expectTextFieldToHaveValue('chronology (lower)', '-1000')
      await itemPom.expectTextFieldToHaveValue('chronology (upper)', '2024')
      await itemPom.expectTextFieldToHaveValue(
        'description',
        'A new paleoclimate sample for testing purposes',
      )
      await itemPom.expectCheckboxToBeChecked('precipitations', true)
      await itemPom.expectCheckboxToBeChecked('temperature', true)

      await itemPom.dataCard.backButton.click()
      await collectionPom.table.expectData()

      // UPDATE
      // Assuming '100' is the number that identifies the row in the table
      await collectionPom.table
        .getItemNavigationLink('101', NavigationLinksButton.Update)
        .click()
      await collectionPom.dataDialogUpdate.expectOldFormData()

      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('-2000')
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'description' })
        .fill('A modified paleoclimate sample description')

      await collectionPom.dataDialogUpdate.form
        .getByRole('checkbox', { name: 'fluid inclusions' })
        .check()

      await collectionPom.dataDialogUpdate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )

      await collectionPom.table.expectRowToHaveText('101', '-2000')
      await collectionPom.table.expectRowToHaveText(
        '101',
        'A modified paleoclimate sample description',
      )

      // DELETE
      await collectionPom.table
        .getItemNavigationLink('101', NavigationLinksButton.Delete)
        .click()
      await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
        'number',
        '101',
      )
      await collectionPom.dataDialogDelete.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.table.expectNotToHaveRowContainingText('101')
    })

    test('Data validation', async ({ page }) => {
      const collectionPom = new PaleoclimateSampleCollectionPage(page)
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')

      // Required field validation - number field
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'number' })
        .fill('50')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'number' })
        .clear()
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("number"))'),
      ).toContainText(/required/)

      // Min value validation - number field
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'number' })
        .fill('0')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("number"))'),
      ).toContainText(/must be greater than/i)

      // Chronology relationship validation
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('2000')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (upper)' })
        .fill('1000')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("chronology (lower)"))'),
      ).toContainText(/must be greater than or equal upper/i)
      await expect(
        page.locator('.v-input:has(label:text("chronology (upper)"))'),
      ).toContainText(/must be less than or equal lower/i)

      // Select site (autocomplete)
      await collectionPom.dataDialogCreate.form.getByLabel('site').click()
      await collectionPom.awaitForApiResponse(
        '**/api/data/paleoclimate_sampling_sites?search=cueva*',
        () => page.keyboard.type('cueva'),
      )

      // Selecting the first option
      await page.getByRole('option', { name: /cueva/i }).first().click()

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'number' })
        .fill('999')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('1000')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (upper)' })
        .fill('2000')

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
    })
  })
})
