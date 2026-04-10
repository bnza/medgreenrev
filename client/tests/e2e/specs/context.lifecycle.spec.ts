import { test } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { ContextCollectionPage } from '~~/tests/e2e/pages/context-collection.page'
import { ContextItemPage } from '~~/tests/e2e/pages/context-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Context lifecycle', () => {
  test.describe('Base user', () => {
    test.use({ storageState: 'playwright/.auth/base.json' })

    test('Basic lifecycle works as expected', async ({ page }) => {
      const collectionPom = new ContextCollectionPage(page)
      const itemPom = new ContextItemPage(page)

      // OPEN/CLOSE CREATE DIALOG
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.closeDialog()

      // CREATE AND REDIRECT TO NEW CONTEXT PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()
      await collectionPom.dataDialogCreate.form
        .getByRole('combobox', { name: 'site' })
        .click()
      await page.getByRole('option', { name: 'Nivar' }).first().click() // Select first available site

      // Fill stratigraphic unit field (using autocomplete)
      await collectionPom.dataDialogCreate.form
        .getByLabel('stratigraphic unit')
        .click()
      await page.getByRole('option', { name: /NI\./ }).first().click() // Select first available stratigraphic unit

      await collectionPom.dataDialogCreate.form.getByLabel('type', {exact: true}).fill('fill')

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('TEST.CTX.001')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'description' })
        .fill('Test context for archaeological analysis')

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )

      // Verify the created item details
      await itemPom.expectTextFieldToHaveValue('name', 'TEST.CTX.001')
      await itemPom.expectTextFieldToHaveValue(
        'description',
        'Test context for archaeological analysis',
      )
      await itemPom.dataCard.backButton.click()
      await collectionPom.table.expectData()

      // UPDATE
      await collectionPom.table
        .getItemNavigationLink('TEST.CTX.001', NavigationLinksButton.Update)
        .click()
      await collectionPom.dataDialogUpdate.expectOldFormData()
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'description' })
        .fill('Updated context with detailed archaeological information')
      await page.keyboard.press('Tab')

      await collectionPom.dataDialogUpdate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )

      await collectionPom.table.expectRowToHaveText(
        'TEST.CTX.001',
        'Updated context with detailed archaeological information',
      )

      // DELETE
      await collectionPom.table
        .getItemNavigationLink('TEST.CTX.001', NavigationLinksButton.Delete)
        .click()
      await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
        'name',
        'TEST.CTX.001',
      )
      await collectionPom.dataDialogDelete.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.table.expectNotToHaveRowContainingText('TEST.CTX.001')

      // CREATE AND NOT REDIRECT TO NEW CONTEXT PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.uncheck()
      await collectionPom.dataDialogCreate.form
        .getByRole('combobox', { name: 'site' })
        .click()
      await page.getByRole('option', { name: 'Nivar' }).first().click() // Select first available site

      // Fill stratigraphic unit field again
      await collectionPom.dataDialogCreate.form
        .getByLabel('stratigraphic unit')
        .click()
      await page.getByRole('option', { name: /NI\./ }).first().click() // Select first available stratigraphic unit

      await collectionPom.dataDialogCreate.form.getByLabel('type', {exact: true}).fill('fill')

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('TEST.CTX.002')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'description' })
        .fill('Second test context for archaeological analysis')

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await collectionPom.table.expectData()
      await collectionPom.table.expectRowToHaveText(
        'TEST.CTX.002',
        'Second test context for archaeological analysis',
      )
    })
  })
})
