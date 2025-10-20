import { test, expect } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { AnalysisSampleMicrostratigraphicUnitCollectionPage } from '~~/tests/e2e/pages/analysis-sample-microstratigraphic-unit-collection.page'
import { AnalysisSampleMicrostratigraphicUnitItemPage } from '~~/tests/e2e/pages/analysis-sample-microstratigraphic-unit-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Analysis subject join', () => {
  test.describe('Microstratigraphic Unit', () => {
    test.describe('Geo user', () => {
      test.use({ storageState: 'playwright/.auth/geo.json' })

      test('Basic lifecycle works as expected', async ({ page }) => {
        const collectionPom =
          new AnalysisSampleMicrostratigraphicUnitCollectionPage(page)
        const itemPom = new AnalysisSampleMicrostratigraphicUnitItemPage(page)

        // OPEN/CLOSE CREATE DIALOG
        await collectionPom.open()
        await collectionPom.table.expectData()
        await collectionPom.dataCard.clickOnActionMenuButton('add new')
        await collectionPom.dataDialogCreate.closeDialog()

        // CREATE AND REDIRECT TO NEW SITE PAGE
        await collectionPom.dataCard.clickOnActionMenuButton('add new')
        await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()

        await collectionPom.dataDialogCreate.form.getByLabel('subject').click()
        await page
          .getByRole('option', { name: /TO\.MM/ })
          .first()
          .click()

        await collectionPom.dataDialogCreate.form.getByLabel('analysis').click()
        await page.getByRole('option', { name: /thin/ }).first().click()

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'summary' })
          .fill('Some summary information about the analysis on the subject')
        await collectionPom.dataDialogCreate.submitForm()
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully created',
        )

        // Verify the created item details
        await itemPom.expectTextFieldToHaveValue(
          'summary',
          'Some summary information about the analysis on the subject',
        )
        await itemPom.dataCard.backButton.click()
        await collectionPom.table.expectData()

        // UPDATE

        await collectionPom.table
          .getItemNavigationLink(0, NavigationLinksButton.Update)
          .click()
        await collectionPom.dataDialogUpdate.expectOldFormData('summary')

        await collectionPom.dataDialogUpdate.form
          .getByRole('textbox', { name: 'summary' })
          .fill('Updated summary information about the analysis on the subject')

        await collectionPom.dataDialogUpdate.submitForm()

        // Verify updated item details
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully updated',
        )
        await collectionPom.table.expectRowToHaveText(
          0,
          'Updated summary information about the analysis on the subject',
        )

        // DELETE
        await collectionPom.table
          .getItemNavigationLink(0, NavigationLinksButton.Delete)
          .click()
        await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
          'summary',
          'Updated summary information about the analysis on the subject',
        )
        await collectionPom.dataDialogDelete.submitForm()
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully deleted',
        )
        await collectionPom.table.expectNotToHaveRowContainingText(
          'Updated summary information about the analysis on the subject',
        )
      })
      test('Data validation', async ({ page }) => {
        const collectionPom =
          new AnalysisSampleMicrostratigraphicUnitCollectionPage(page)
        await collectionPom.open()
        await collectionPom.table.expectData()
        await collectionPom.dataCard.clickOnActionMenuButton('add new')

        // Test 1: Required field type - identifier

        await collectionPom.dataDialogCreate.submitButton.click()
        await expect(
          page.locator('.v-input:has(label:text("subject"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text("analysis"))'),
        ).toContainText(/required/)

        // Test 2: Unique validation - try to create with duplicate type identifier
        await collectionPom.dataDialogCreate.form
          .getByLabel('subject')
          .fill('167')
        await page.waitForTimeout(500)
        await page.getByRole('option', { name: /167/ }).first().click()

        await collectionPom.dataDialogCreate.form
          .getByLabel('analysis')
          .fill('4')
        await page.waitForTimeout(500)
        await page.getByRole('option', { name: /thin/ }).first().click()
        await page.keyboard.press('Tab')

        await expect(
          page.locator('.v-input:has(label:text("subject"))'),
        ).toContainText('Duplicate [subject, analysis] combination')
        await expect(
          page.locator('.v-input:has(label:text("analysis"))'),
        ).toContainText('Duplicate [subject, analysis] combination')

        // Test 3: Valid form submission after fixing validation errors
        await collectionPom.dataDialogCreate.form
          .getByLabel('analysis')
          .fill('')
        await page.waitForTimeout(500)
        await collectionPom.dataDialogCreate.form.getByLabel('analysis').click()
        await page.getByRole('option', { name: /thin/ }).nth(2).click()
        await collectionPom.dataDialogCreate.submitForm()
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully created',
        )
      })
    })
  })
})
