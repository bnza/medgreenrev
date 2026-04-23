import { expect, type Page } from '@playwright/test'
import type { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'
import type { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils/index'

export interface SubjectConfig {
  createCollectionPom: (page: Page) => BaseCollectionPage
  createItemPom: (page: Page) => BaseItemPage
  subjectOption: RegExp
  analysisOption: RegExp
  nonDatingAnalysis: RegExp
  datingAnalysis: RegExp
  calibrationCurve: string
  validation: {
    duplicateSubjectSearch: string
    duplicateSubjectOption: RegExp
    duplicateAnalysisSearch: string
    duplicateAnalysisOption: RegExp
    fixAnalysisOption: { index: number; name: RegExp }
  }
}

export async function runBasicLifecycle(config: SubjectConfig, page: Page) {
  const collectionPom = config.createCollectionPom(page)
  const itemPom = config.createItemPom(page)

  await collectionPom.open()
  await collectionPom.table.expectData()

  // CREATE AND REDIRECT TO NEW ITEM PAGE
  await collectionPom.dataCard.clickOnActionMenuButton('add new')
  await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()

  await collectionPom.dataDialogCreate.form.getByLabel('subject').click()
  await page.getByRole('option', { name: config.subjectOption }).first().click()

  await collectionPom.dataDialogCreate.form.getByLabel('analysis').click()
  await page
    .getByRole('option', { name: config.analysisOption })
    .first()
    .click()

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
}

export async function runAbsoluteDatingLifecycle(
  config: SubjectConfig,
  page: Page,
) {
  const collectionPom = config.createCollectionPom(page)
  const itemPom = config.createItemPom(page)

  await collectionPom.open()

  // CREATE AND REDIRECT TO NEW ITEM PAGE
  await collectionPom.table.expectData()
  await collectionPom.dataCard.clickOnActionMenuButton('add new')
  await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()
  await collectionPom.dataDialogCreate.form.getByLabel('subject').click()
  await page.getByRole('option', { name: config.subjectOption }).first().click()
  await collectionPom.dataDialogCreate.form.getByLabel('analysis').click()
  await page
    .getByRole('option', { name: config.nonDatingAnalysis })
    .first()
    .click()
  await expect(
    page.getByRole('checkbox', { name: /add absolute dating data/i }),
  ).toHaveCount(0)
  await collectionPom.dataDialogCreate.form.getByLabel('analysis').click()
  await page
    .getByRole('option', { name: config.datingAnalysis })
    .first()
    .click()
  await page.keyboard.press('Escape')
  await expect(
    page.getByRole('checkbox', { name: /add absolute dating data/i }),
  ).toHaveCount(1)
  await collectionPom.dataDialogCreate.form
    .getByLabel('summary')
    .fill('Some summary about the tested analysis')

  // ABSOLUTE DATING DATA
  page.getByRole('checkbox', { name: /add absolute dating data/i }).click()
  await collectionPom.dataDialogCreate.form
    .getByRole('textbox', { name: 'dating (lower)' })
    .fill('700')
  await collectionPom.dataDialogCreate.form
    .getByRole('textbox', { name: 'dating (upper)' })
    .fill('750')
  await collectionPom.dataDialogCreate.form
    .getByRole('textbox', { name: 'dating (probability)' })
    .fill('94.59')
  await collectionPom.dataDialogCreate.form
    .getByRole('textbox', { name: 'uncalibrated dating' })
    .fill('1200')
  await collectionPom.dataDialogCreate.form
    .getByRole('textbox', { name: 'error' })
    .fill('50')
  await collectionPom.dataDialogCreate.form
    .getByRole('combobox', { name: 'calibration curve' })
    .click()
  await page
    .getByRole('option', { name: config.calibrationCurve })
    .first()
    .click()
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
    .first()
    .click()
  await itemPom.expectTextFieldToHaveValue('dating (lower)', '700')
  await itemPom.expectTextFieldToHaveValue('dating (upper)', '750')
  await itemPom.expectTextFieldToHaveValue('dating (probability)', '94.6')
  await itemPom.expectTextFieldToHaveValue('uncalibrated dating', '1200')
  await itemPom.expectTextFieldToHaveValue('error', '50')
  await itemPom.expectTextFieldToHaveValue(
    'calibration curve',
    config.calibrationCurve,
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
}

export async function runDataValidation(config: SubjectConfig, page: Page) {
  const collectionPom = config.createCollectionPom(page)
  await collectionPom.open()
  await collectionPom.table.expectData()
  await collectionPom.dataCard.clickOnActionMenuButton('add new')

  // Test 1: Required field validation
  await collectionPom.dataDialogCreate.submitButton.click()
  await expect(
    page.locator('.v-input:has(label:text("subject"))'),
  ).toContainText(/required/)
  await expect(
    page.locator('.v-input:has(label:text("analysis"))'),
  ).toContainText(/required/)

  // Test 2: Unique validation - try to create with duplicate subject+analysis
  await collectionPom.dataDialogCreate.form
    .getByLabel('subject')
    .fill(config.validation.duplicateSubjectSearch)
  await page.waitForTimeout(500)
  await page
    .getByRole('option', { name: config.validation.duplicateSubjectOption })
    .first()
    .click()

  await collectionPom.dataDialogCreate.form
    .getByLabel('analysis')
    .fill(config.validation.duplicateAnalysisSearch)
  await page.waitForTimeout(500)
  await page
    .getByRole('option', { name: config.validation.duplicateAnalysisOption })
    .first()
    .click()
  await page.keyboard.press('Tab')

  await expect(
    page.locator('.v-input:has(label:text("subject"))'),
  ).toContainText('Duplicate [subject, analysis] combination')
  await expect(
    page.locator('.v-input:has(label:text("analysis"))'),
  ).toContainText('Duplicate [subject, analysis] combination')

  // Test 3: Valid form submission after fixing validation errors
  await collectionPom.dataDialogCreate.form.getByLabel('analysis').fill('')
  await page.waitForTimeout(500)
  await collectionPom.dataDialogCreate.form.getByLabel('analysis').click()
  await page
    .getByRole('option', { name: config.validation.fixAnalysisOption.name })
    .nth(config.validation.fixAnalysisOption.index)
    .click()
  await collectionPom.dataDialogCreate.submitForm()
  await collectionPom.expectAppMessageToHaveText(
    'Resource successfully created',
  )
}
