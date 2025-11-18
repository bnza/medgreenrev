import { test } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { SampleCollectionPage } from '~~/tests/e2e/pages/sample-collection.page'
import { SampleItemPage } from '~~/tests/e2e/pages/sample-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Sample lifecycle', () => {
  test.describe('Base user', () => {
    test.use({ storageState: 'playwright/.auth/base.json' })

    test('Basic lifecycle works as expected', async ({ page }) => {
      const collectionPom = new SampleCollectionPage(page)
      const itemPom = new SampleItemPage(page)

      // OPEN/CLOSE CREATE DIALOG
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.closeDialog()

      // CREATE AND REDIRECT TO NEW SAMPLE PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()
      await collectionPom.dataDialogCreate.form
        .getByRole('combobox', { name: 'site' })
        .click()
      await page.getByRole('option', { name: 'Nivar' }).first().click() // Select first available site

      await collectionPom.dataDialogCreate.form.getByLabel('type').click()
      await page.getByRole('option', { name: /coal/ }).first().click()

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'year' })
        .fill('2024')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'number' })
        .fill('001')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'description' })
        .fill('Test sample for archaeological analysis')

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )

      // Verify the created item details
      await itemPom.expectTextFieldToHaveValue('code', 'NI.CO.24.1')
      await itemPom.expectTextFieldToHaveValue('year', '2024')
      await itemPom.expectTextFieldToHaveValue('number', '1')
      await itemPom.expectTextFieldToHaveValue(
        'description',
        'Test sample for archaeological analysis',
      )
      await itemPom.dataCard.backButton.click()
      await collectionPom.table.expectData()

      // UPDATE
      await collectionPom.table
        .getItemNavigationLink('NI.CO.24.1', NavigationLinksButton.Update)
        .click()
      await collectionPom.dataDialogUpdate.expectOldFormData()
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'description' })
        .fill('Updated sample with detailed archaeological context')
      await page.keyboard.press('Tab')

      await collectionPom.dataDialogUpdate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )

      await collectionPom.table.expectRowToHaveText(
        'NI.CO.24.1',
        'Updated sample with detailed archaeological context',
      )

      // DELETE
      await collectionPom.table
        .getItemNavigationLink('NI.CO.24.1', NavigationLinksButton.Delete)
        .click()
      await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
        'code',
        'NI.CO.24.1',
      )
      await collectionPom.dataDialogDelete.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.table.expectNotToHaveRowContainingText('NI.CO.24.1')

      // CREATE AND NOT REDIRECT TO NEW SAMPLE PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.uncheck()
      await collectionPom.dataDialogCreate.form
        .getByRole('combobox', { name: 'site' })
        .click()
      await page.getByRole('option', { name: 'Nivar' }).first().click() // Select first available site

      await collectionPom.dataDialogCreate.form.getByLabel('type').click()
      await page.getByRole('option', { name: /coal/ }).first().click()

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'year' })
        .fill('2024')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'number' })
        .fill('2')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'description' })
        .fill('Second test sample for archaeological analysis')

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await collectionPom.table.expectData()
      await collectionPom.table.expectRowToHaveText(
        'NI.CO.24.2',
        'Second test sample for archaeological analysis',
      )
    })
  })
})
