import { test, expect } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { AnalysisBotanyCharcoalCollectionPage } from '~~/tests/e2e/pages/analysis-botany-charcoal-collection.page'
import { AnalysisBotanyCharcoalItemPage } from '~~/tests/e2e/pages/analysis-botany-charcoal-item.page'
import { AnalysisSampleMicrostratigraphicUnitCollectionPage } from '~~/tests/e2e/pages/analysis-sample-microstratigraphic-unit-collection.page'
import { AnalysisSampleMicrostratigraphicUnitItemPage } from '~~/tests/e2e/pages/analysis-sample-microstratigraphic-unit-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Analysis subject join', () => {
  test.describe('Botany Charcoal', () => {
    test.describe('Material analyst user', () => {
      test.use({ storageState: 'playwright/.auth/mat.json' })
      test('Absolute dating lifecycle works as expected', async ({ page }) => {
        const collectionPom = new AnalysisBotanyCharcoalCollectionPage(page)
        const itemPom = new AnalysisBotanyCharcoalItemPage(page)

        await collectionPom.open()

        // CREATE AND REDIRECT TO NEW SITE PAGE
        await collectionPom.table.expectData()
        await collectionPom.dataCard.clickOnActionMenuButton('add new')
        await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()
        await collectionPom.dataDialogCreate.form.getByLabel('subject').click()
        await page.getByRole('option', { name: /SC/ }).first().click()
        await collectionPom.dataDialogCreate.form.getByLabel('analysis').click()
        await page.getByRole('option', { name: /AD/ }).first().click()
        await expect(
          page.getByRole('checkbox', { name: /add absolute dating data/i }),
        ).toHaveCount(0)
        await collectionPom.dataDialogCreate.form.getByLabel('analysis').click()
        await page.getByRole('option', { name: /C14/ }).first().click()
        await page.keyboard.press('Escape')
        await expect(
          page.getByRole('checkbox', { name: /add absolute dating data/i }),
        ).toHaveCount(1)
        await collectionPom.dataDialogCreate.form
          .getByLabel('summary')
          .fill('Some summary about the tested analysis')

        // ABSOLUTE DATING DATA
        page
          .getByRole('checkbox', { name: /add absolute dating data/i })
          .click()
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'dating (lower)' })
          .fill('700')
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'dating (upper)' })
          .fill('750')
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'uncalibrated dating' })
          .fill('1200')
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'error' })
          .fill('50')
        await collectionPom.dataDialogCreate.form
          .getByRole('combobox', { name: 'calibration curve' })
          .click()
        await page.getByRole('option', { name: 'IntCal20' }).first().click()
        await collectionPom.dataDialogCreate.form
          .getByLabel('notes')
          .fill('Some notes about the absolute dating')
        await collectionPom.dataDialogCreate.submitForm()
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully created',
        )

        // Verify the created item details
        await itemPom.expectTextFieldToHaveValue(
          'summary',
          'Some summary about the tested analysis',
        )
        await itemPom.page
          .getByRole('tab', { name: 'absolute dating', exact: true })
          .click()
        await itemPom.expectTextFieldToHaveValue('dating (lower)', '700')
        await itemPom.expectTextFieldToHaveValue('dating (upper)', '750')
        await itemPom.expectTextFieldToHaveValue('uncalibrated dating', '1200')
        await itemPom.expectTextFieldToHaveValue('error', '50')
        await itemPom.expectTextFieldToHaveValue(
          'calibration curve',
          'IntCal20',
        )
        await itemPom.dataCard.backButton.click()
        await collectionPom.table.expectData()

        // UPDATE ABSOLUTE DATING DATA
        await collectionPom.table
          .getItemNavigationLink(0, NavigationLinksButton.Update)
          .click()
        await collectionPom.dataDialogUpdate.expectOldFormData('summary')

        await collectionPom.dataDialogUpdate.form
          .getByRole('textbox', { name: 'summary' })
          .fill('Updated summary about the tested analysis')

        await collectionPom.dataDialogUpdate.expectOldFormData('error')
        await collectionPom.dataDialogUpdate.form
          .getByRole('textbox', { name: 'dating (upper)' })
          .fill('780')
        await collectionPom.dataDialogUpdate.form
          .getByRole('textbox', { name: 'error' })
          .fill('30', { timeout: 30000 })
        await collectionPom.dataDialogUpdate.submitForm()

        // Verify updated item details
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully updated',
        )

        await collectionPom.table
          .getItemNavigationLink(0, NavigationLinksButton.Read)
          .click()

        await page.waitForResponse(
          (r) =>
            /\/api\/data\/analyses\/absolute_dating/.test(r.url()) &&
            r.request().method() === 'GET' &&
            r.ok(),
          { timeout: 10000 },
        )

        await itemPom.expectTextFieldToHaveValue(
          'summary',
          'Updated summary about the tested analysis',
        )

        await itemPom.expectTextFieldToHaveValue('dating (upper)', '780')
        await itemPom.expectTextFieldToHaveValue('error', '30')
        await itemPom.dataCard.backButton.click()
        await collectionPom.table.expectData()

        // DELETE ABSOLUTE DATING DATA
        await collectionPom.table
          .getItemNavigationLink(0, NavigationLinksButton.Update)
          .click()
        await collectionPom.dataDialogUpdate.expectOldFormData('summary')
        await page
          .getByRole('button', { name: /remove absolute dating data/i })
          .click()
        await expect(
          page.getByText('Would you like to delete absolute dating data'),
        ).toBeVisible()
        await page.getByRole('button', { name: /delete/i }).click()
        await collectionPom.dataDialogUpdate.submitForm()

        // Verify updated item details
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully updated',
        )
        await collectionPom.table
          .getItemNavigationLink(0, NavigationLinksButton.Read)
          .click()

        await page.waitForResponse(
          (r) =>
            /\/api\/data\/analyses\/absolute_dating/.test(r.url()) &&
            r.request().method() === 'GET' &&
            r.status() === 404,
          { timeout: 10000 },
        )
        await itemPom.page
          .getByRole('tab', { name: 'absolute dating', exact: true })
          .click()
        await expect(
          page.getByText(
            'No associated absolute dating information for this subject',
          ),
        ).toBeVisible()
      })
    })
  })
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
        await page.getByRole('option', { name: /ths/i }).first().click()

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
        await page.getByRole('option', { name: /ths/i }).first().click()
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
        await page.getByRole('option', { name: /ths/i }).nth(2).click()
        await collectionPom.dataDialogCreate.submitForm()
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully created',
        )
      })
    })
  })
})
