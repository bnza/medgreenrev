import { test, expect } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { AnalysisCollectionPage } from '~~/tests/e2e/pages/analysis-collection.page'
import { AnalysisItemPage } from '~~/tests/e2e/pages/analysis-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Analysis lifecycle', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Basic site lifecycle works as expected', async ({ page }) => {
      const collectionPom = new AnalysisCollectionPage(page)
      const itemPom = new AnalysisItemPage(page)

      // OPEN/CLOSE CREATE DIALOG
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.closeDialog()

      // CREATE AND REDIRECT TO NEW SITE PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()

      await collectionPom.dataDialogCreate.form.getByLabel('type').click()
      await page.getByText('assemblage \\ zooarchaeology').click()

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'identifier' })
        .fill('UNIQ-ID')

      await collectionPom.dataDialogCreate.form
        .getByRole('combobox')
        .filter({ hasText: /status/ })
        .click()
      await page.getByRole('option').filter({ hasText: 'pending' }).click()

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'year' })
        .fill('2025')

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'laboratory' })
        .fill('Somewhere')

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'responsible' })
        .fill('Some One')

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'summary' })
        .fill('Some summary information about the analysis')
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )

      // Verify the created item details
      await itemPom.expectTextFieldToHaveValue('responsible', 'Some One')
      await itemPom.expectTextFieldToHaveValue('year', '2025')
      await itemPom.expectTextFieldToHaveValue('laboratory', 'Somewhere')
      await itemPom.expectTextFieldToHaveValue('identifier', 'UNIQ-ID')

      await itemPom.expectTextFieldToHaveValue(
        'summary',
        'Some summary information about the analysis',
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
        .filter({ hasText: /^status/ })
        .locator('i')
        .click()
      await page.getByRole('option').filter({ hasText: 'completed' }).click()

      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'summary' })
        .fill('Updated summary information about the analysis')
      await page
        .getByRole('textbox', { name: /^responsible/ })
        .fill('Some One Else')
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'year' })
        .fill('2024')
      await page
        .getByRole('textbox', { name: /^laboratory/ })
        .fill('Somewhere Else')

      await collectionPom.dataDialogUpdate.submitForm()

      // Verify updated item details
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )
      await collectionPom.table.expectRowToHaveText(
        'UNIQ-ID',
        'Updated summary information about the analysis',
      )
      await collectionPom.table.expectRowToHaveText('UNIQ-ID', 'completed')
      await collectionPom.table.expectRowToHaveText('UNIQ-ID', 'Some One Else')
      await collectionPom.table.expectRowToHaveText('UNIQ-ID', '2024')
      await collectionPom.table.expectRowToHaveText('UNIQ-ID', 'Somewhere Else')

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
      const collectionPom = new AnalysisCollectionPage(page)
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')

      // Test 1: Required field type - identifier

      await collectionPom.dataDialogCreate.submitButton.click()
      await expect(
        page.locator('.v-input:has(label:text("type"))'),
      ).toContainText(/required/)
      await expect(
        page.locator('.v-input:has(label:text("year"))'),
      ).toContainText(/required/)
      await expect(
        page.locator('.v-input:has(label:text("identifier"))'),
      ).toContainText(/required/)

      // Test 2: Unique validation - try to create with duplicate type identifier
      await collectionPom.dataDialogCreate.form.getByLabel('type').fill('ad')
      await page.getByText('material analysis \\ aDNA').click()
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'identifier' })
        .fill('aDNA.2025.TO102') // Assuming this exists in fixtures
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("type"))'),
      ).toContainText('Duplicate [type, identifier] combination')
      await expect(
        page.locator('.v-input:has(label:text("identifier"))'),
      ).toContainText('Duplicate [type, identifier] combination')

      // Test 3: Valid form submission after fixing validation errors
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'year' })
        .fill('2025')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'identifier' })
        .fill('aDNA.2025.TO999')
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
    })
  })
})
