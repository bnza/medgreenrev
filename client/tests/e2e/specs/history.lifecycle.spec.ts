import { test, expect } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { NavigationLinksButton } from '~~/tests/e2e/utils'
import { HistoryAnimalCollectionPage } from '~~/tests/e2e/pages/history-animal-collection.page'
import { HistoryAnimalItemPage } from '~~/tests/e2e/pages/history-animal-item.page'
import { HistoryPlantCollectionPage } from '~~/tests/e2e/pages/history-plant-collection.page'
import { HistoryPlantItemPage } from '~~/tests/e2e/pages/history-plant-item.page'
import { AuthTestHelper } from '~~/tests/e2e/utils/auth-test-helper'
import { LoginPage } from '~~/tests/e2e/pages/login.page'
import { HistoryLocationCollectionPage } from '~~/tests/e2e/pages/history-location-collection.page'
import { HistoryWrittenSourceCollectionPage } from '~~/tests/e2e/pages/history-written-source-collection.page'
import { HistoryWrittenSourceItemPage } from '~~/tests/e2e/pages/history-written-source-item.page'
import { HistoryWrittenSourceCitedWorkCollectionPage } from '~~/tests/e2e/pages/history-written-source-cited-work-collection.page'
import { HistoryWrittenSourceCitedWorkItemPage } from '~~/tests/e2e/pages/history-written-source-cited-work-item.page'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('History item lifecycle', () => {
  test.describe('Animals', () => {
    test.describe('Historian user', () => {
      test.use({ storageState: 'playwright/.auth/his.json' })

      test('Basic lifecycle works as expected', async ({ page }) => {
        const collectionPom = new HistoryAnimalCollectionPage(page)
        const itemPom = new HistoryAnimalItemPage(page)

        // OPEN/CLOSE CREATE DIALOG
        await collectionPom.open()
        await collectionPom.table.expectData()
        await collectionPom.dataCard.clickOnActionMenuButton('add new')
        await collectionPom.dataDialogCreate.closeDialog()

        // CREATE AND REDIRECT TO NEW ITEM PAGE
        await collectionPom.dataCard.clickOnActionMenuButton('add new')
        await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()

        await collectionPom.dataDialogCreate.form.getByLabel('location').click()
        await page.getByRole('option', { name: /^Ant/ }).first().click() // Select Antequera

        await collectionPom.dataDialogCreate.form.getByLabel('language').click()
        await page
          .getByRole('option', { name: /^arabic/ })
          .first()
          .click() // Select arabic

        await collectionPom.dataDialogCreate.form.getByLabel('animal').click()
        await page.getByRole('option', { name: /^asno/ }).first().click() // Select asno

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'chronology (lower)' })
          .fill('1050')

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'chronology (upper)' })
          .fill('1150')

        await collectionPom.dataDialogCreate.form
          .getByLabel('reference', { exact: true })
          .fill('Test reference')

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'notes' })
          .fill(
            'Some summary information about the animal historical reference',
          )

        await collectionPom.dataDialogCreate.submitForm()

        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully created',
        )

        // Verify the created item details
        await itemPom.expectTextFieldToHaveValue('location', 'Antequera')
        await itemPom.expectTextFieldToHaveValue('language', 'arabic')
        await itemPom.expectTextFieldToHaveValue('animal', 'asno')
        await itemPom.expectTextFieldToHaveValue('chronology (upper)', '1150')
        await itemPom.expectTextFieldToHaveValue('chronology (lower)', '1050')
        await itemPom.expectTextFieldToHaveValue('reference', 'Test reference')
        await itemPom.expectTextFieldToHaveValue(
          'notes',
          'Some summary information about the animal historical reference',
        )
        await itemPom.dataCard.backButton.click()
        await collectionPom.table.expectData()

        // UPDATE

        await collectionPom.table
          .getItemNavigationLink(0, NavigationLinksButton.Update)
          .click()
        await collectionPom.dataDialogUpdate.expectOldFormData()

        await collectionPom.dataDialogUpdate.form
          .getByLabel('reference', { exact: true })
          .fill('Updated test reference')

        await collectionPom.dataDialogUpdate.form
          .getByRole('textbox', { name: 'notes' })
          .fill(
            'Updated summary information about the animal historical reference',
          )

        await collectionPom.dataDialogUpdate.submitForm()

        // Verify updated item details
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully updated',
        )
        await collectionPom.table.expectRowToHaveText(
          0,
          'Updated summary information about the animal historical reference',
        )
        await collectionPom.table.expectRowToHaveText(
          0,
          'Updated test reference',
        )

        // DELETE
        await collectionPom.table
          .getItemNavigationLink(0, NavigationLinksButton.Delete)
          .click()
        await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
          'reference',
          'Updated test reference',
        )
        await collectionPom.dataDialogDelete.submitForm()
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully deleted',
        )
        // await collectionPom.table.expectNotToHaveRowContainingText('UNIQ-ID')
      })
      test('Data validation', async ({ page }) => {
        const collectionPom = new HistoryAnimalCollectionPage(page)
        await collectionPom.open()
        await collectionPom.table.expectData()
        await collectionPom.dataCard.clickOnActionMenuButton('add new')

        // Test 1: Required field type - identifier

        await collectionPom.dataDialogCreate.submitButton.click()
        await expect(
          page.locator('.v-input:has(label:text("location"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text("language"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text("animal"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text("chronology (lower)"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text("chronology (upper)"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text("reference"))'),
        ).toContainText(/required/)

        // Test 3: Chronology validation - lower > upper
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'chronology (lower)' })
          .fill('1500')
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'chronology (upper)' })
          .fill('1000')
        await page.keyboard.press('Tab')
        await expect(
          page.locator('.v-input:has(label:text("chronology (lower)"))'),
        ).toContainText(
          'Lower chronology must be greater than or equal upper chronology.',
        )

        // Test 3: Valid form submission after fixing validation errors
        await collectionPom.dataDialogCreate.form.getByLabel('location').click()
        await page.getByRole('option', { name: /^Ant/ }).first().click() // Select Antequera

        await collectionPom.dataDialogCreate.form.getByLabel('language').click()
        await page
          .getByRole('option', { name: /^arabic/ })
          .first()
          .click() // Select arabic

        await collectionPom.dataDialogCreate.form.getByLabel('animal').click()
        await page.getByRole('option', { name: /^asno/ }).first().click() // Select asno

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'chronology (lower)' })
          .fill('1050')

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'chronology (upper)' })
          .fill('1150')

        await collectionPom.dataDialogCreate.form
          .getByLabel('reference', { exact: true })
          .fill('Test reference')

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'notes' })
          .fill(
            'Some summary information about the animal historical reference',
          )
        await collectionPom.dataDialogCreate.submitForm()
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully created',
        )
      })
    })
  })
  test.describe('Plants', () => {
    test.describe('Historian user', () => {
      test.use({ storageState: 'playwright/.auth/his.json' })

      test('Basic lifecycle works as expected', async ({ page }) => {
        const collectionPom = new HistoryPlantCollectionPage(page)
        const itemPom = new HistoryPlantItemPage(page)

        // OPEN/CLOSE CREATE DIALOG
        await collectionPom.open()
        await collectionPom.table.expectData()
        await collectionPom.dataCard.clickOnActionMenuButton('add new')
        await collectionPom.dataDialogCreate.closeDialog()

        // CREATE AND REDIRECT TO NEW SITE PAGE
        await collectionPom.dataCard.clickOnActionMenuButton('add new')
        await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()

        await collectionPom.dataDialogCreate.form.getByLabel('location').click()
        await page.getByRole('option', { name: /^Ant/ }).first().click() // Select Antequera

        await collectionPom.dataDialogCreate.form.getByLabel('language').click()
        await page.getByRole('option', { name: /^lat/ }).first().click() // Select latin

        await collectionPom.dataDialogCreate.form.getByLabel('plant').click()
        await page.getByRole('option', { name: /^albu/ }).first().click() // Select albudeca

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'chronology (lower)' })
          .fill('1050')

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'chronology (upper)' })
          .fill('1150')

        await collectionPom.dataDialogCreate.form
          .getByLabel('reference', { exact: true })
          .fill('Test reference')

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'notes' })
          .fill('Some summary information about the plant historical reference')

        await collectionPom.dataDialogCreate.submitForm()

        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully created',
        )

        // Verify the created item details
        await itemPom.expectTextFieldToHaveValue('location', 'Antequera')
        await itemPom.expectTextFieldToHaveValue('language', 'latin')
        await itemPom.expectTextFieldToHaveValue('plant', 'albudeca')
        await itemPom.expectTextFieldToHaveValue('chronology (upper)', '1150')
        await itemPom.expectTextFieldToHaveValue('chronology (lower)', '1050')
        await itemPom.expectTextFieldToHaveValue('reference', 'Test reference')
        await itemPom.expectTextFieldToHaveValue(
          'notes',
          'Some summary information about the plant historical reference',
        )
        await itemPom.dataCard.backButton.click()
        await collectionPom.table.expectData()

        // UPDATE

        await collectionPom.table
          .getItemNavigationLink(0, NavigationLinksButton.Update)
          .click()
        await collectionPom.dataDialogUpdate.expectOldFormData()

        await collectionPom.dataDialogUpdate.form
          .getByLabel('reference', { exact: true })
          .fill('Updated test reference')

        await collectionPom.dataDialogUpdate.form
          .getByRole('textbox', { name: 'notes' })
          .fill(
            'Updated summary information about the plant historical reference',
          )

        await collectionPom.dataDialogUpdate.submitForm()

        // Verify updated item details
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully updated',
        )
        await collectionPom.table.expectRowToHaveText(
          0,
          'Updated summary information about the plant historical reference',
        )
        await collectionPom.table.expectRowToHaveText(
          0,
          'Updated test reference',
        )

        // DELETE
        await collectionPom.table
          .getItemNavigationLink(0, NavigationLinksButton.Delete)
          .click()
        await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
          'reference',
          'Updated test reference',
        )
        await collectionPom.dataDialogDelete.submitForm()
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully deleted',
        )
        // await collectionPom.table.expectNotToHaveRowContainingText('UNIQ-ID')
      })
      test('Data validation', async ({ page }) => {
        const collectionPom = new HistoryPlantCollectionPage(page)
        await collectionPom.open()
        await collectionPom.table.expectData()
        await collectionPom.dataCard.clickOnActionMenuButton('add new')

        // Test 1: Required field type - identifier

        await collectionPom.dataDialogCreate.submitButton.click()
        await expect(
          page.locator('.v-input:has(label:text("location"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text("language"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text("plant"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text("chronology (lower)"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text("chronology (upper)"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text("reference"))'),
        ).toContainText(/required/)

        // Test 3: Chronology validation - lower > upper
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'chronology (lower)' })
          .fill('1500')
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'chronology (upper)' })
          .fill('1000')
        await page.keyboard.press('Tab')
        await expect(
          page.locator('.v-input:has(label:text("chronology (lower)"))'),
        ).toContainText(
          'Lower chronology must be greater than or equal upper chronology.',
        )

        // Test 3: Valid form submission after fixing validation errors
        await collectionPom.dataDialogCreate.form.getByLabel('location').click()
        await page.getByRole('option', { name: /^Ant/ }).first().click() // Select Antequera

        await collectionPom.dataDialogCreate.form.getByLabel('language').click()
        await page.getByRole('option', { name: /^lat/ }).first().click() // Select latin

        await collectionPom.dataDialogCreate.form.getByLabel('plant').click()
        await page.getByRole('option', { name: /^albu/ }).first().click() // Select albudeca

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'chronology (lower)' })
          .fill('1050')

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'chronology (upper)' })
          .fill('1150')

        await collectionPom.dataDialogCreate.form
          .getByLabel('reference', { exact: true })
          .fill('Test reference')

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'notes' })
          .fill('Some summary information about the plant historical reference')
        await collectionPom.dataDialogCreate.submitForm()
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully created',
        )
      })
    })
  })
  test.describe('Locations', () => {
    test.describe('Admin user', () => {
      test.use({ storageState: 'playwright/.auth/admin.json' })

      test('Data validation', async ({ page }) => {
        const collectionPom = new HistoryLocationCollectionPage(page)
        await collectionPom.open()
        await collectionPom.table.expectData()
        await collectionPom.dataCard.clickOnActionMenuButton('add new')

        // Required field type - identifier

        await collectionPom.dataDialogCreate.submitButton.click()
        await expect(
          page.locator('.v-input:has(label:text("value"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text("region"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text("coordinate N"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text("coordinate E"))'),
        ).toContainText(/required/)

        // Coordinate N - valid values
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'coordinate N' })
          .fill('not a decimal')
        await expect(
          page.locator('.v-input:has(label:text("coordinate N"))'),
        ).toContainText(/The value must be decimal/)

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'coordinate N' })
          .fill('100')
        await expect(
          page.locator('.v-input:has(label:text("coordinate N"))'),
        ).toContainText(/The value must be less than or equal to 90/)

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'coordinate N' })
          .fill('-100')
        await expect(
          page.locator('.v-input:has(label:text("coordinate N"))'),
        ).toContainText(/The value must be greater than or equal to -90/)

        // Coordinate E - valid values
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'coordinate E' })
          .fill('not a decimal')
        await expect(
          page.locator('.v-input:has(label:text("coordinate E"))'),
        ).toContainText(/The value must be decimal/)

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'coordinate E' })
          .fill('200')
        await expect(
          page.locator('.v-input:has(label:text("coordinate E"))'),
        ).toContainText(/The value must be less than or equal to 180/)

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'coordinate E' })
          .fill('-200')
        await expect(
          page.locator('.v-input:has(label:text("coordinate E"))'),
        ).toContainText(/The value must be greater than or equal to -180/)

        // Valid form submission after fixing validation errors
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'value' })
          .fill('New location')

        await collectionPom.dataDialogCreate.form
          .getByRole('combobox', { name: 'region' })
          .click()
        await page.getByRole('option', { name: /catalan/i }).click()

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'coordinate N' })
          .fill('37.5')

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'coordinate E' })
          .fill('-4.5')

        await collectionPom.dataDialogCreate.submitForm()
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully created',
        )
      })
    })
    test.describe('Editor/historian user', () => {
      test('Basic lifecycle works as expected', async ({ page, browser }) => {
        const collectionPom = new HistoryLocationCollectionPage(page)
        const authTestHelper = new AuthTestHelper(browser)
        const credentials = await authTestHelper.createUser('editor', [
          'historian',
        ])
        const loginPage = new LoginPage(page)
        await loginPage.open()
        await loginPage.login(credentials)

        // Navigate to the site collection page
        await collectionPom.appNavBarIcon.click()
        await page
          .getByTestId('app-navigation-drawer')
          .getByText('Data', { exact: true })
          .click()
        await page
          .getByTestId('app-navigation-drawer')
          .getByText('Written sources', { exact: true })
          .first()
          .click()
        await page
          .getByTestId('app-navigation-drawer')
          .getByText('Locations', { exact: true })
          .first()
          .click()
        await collectionPom.table.expectData()
        await collectionPom.dataCard.clickOnActionMenuButton('add new')

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'value' })
          .fill('New location')
        await collectionPom.dataDialogCreate.form.getByLabel('region').click()
        await page.getByRole('option', { name: /catalan/i }).click()
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'coordinate E' })
          .fill('37.5')
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'coordinate N' })
          .fill('-4.5')

        await collectionPom.dataDialogCreate.submitForm()

        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully created',
        )

        await collectionPom.table.expectRowToHaveText('New location', 'Catalan')
        await collectionPom.table.expectRowToHaveText('New location', '37.5')
        await collectionPom.table.expectRowToHaveText('New location', '-4.5')

        // DELETE
        await collectionPom.table
          .getItemNavigationLink('New location', NavigationLinksButton.Delete)
          .click()
        await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
          'value',
          'New location',
        )
        await collectionPom.dataDialogDelete.submitForm()
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully deleted',
        )
        await collectionPom.table.expectNotToHaveRowContainingText(
          'New location',
        )
      })
    })
  })
  test.describe('Written Sources', () => {
    test.describe('Historian user', () => {
      test.use({ storageState: 'playwright/.auth/his.json' })

      test('Basic lifecycle works as expected', async ({ page }) => {
        const collectionPom = new HistoryWrittenSourceCollectionPage(page)
        const itemPom = new HistoryWrittenSourceItemPage(page)

        // OPEN/CLOSE CREATE DIALOG
        await collectionPom.open()
        await collectionPom.table.expectData()
        await collectionPom.dataCard.clickOnActionMenuButton('add new')
        await collectionPom.dataDialogCreate.closeDialog()

        // CREATE AND REDIRECT TO NEW ITEM PAGE
        await collectionPom.dataCard.clickOnActionMenuButton('add new')
        await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()

        await collectionPom.dataDialogCreate.form
          .getByLabel('written source type')
          .click({ force: true })
        await page
          .getByRole('listbox')
          .getByRole('option', { name: 'agr' })
          .first()
          .click()

        await collectionPom.dataDialogCreate.form
          .getByLabel('author')
          .click({ force: true })
        await page
          .getByRole('listbox')
          .getByRole('option', { name: 'Al-Buntī', includeHidden: false })
          .first()
          .click()

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'title', exact: true })
          .fill('Test written source title')

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'subtitle' })
          .fill('Test subtitle')

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'publication details' })
          .fill('Test publication details')

        await collectionPom.dataDialogCreate.form
          .getByLabel('centuries')
          .click({ force: true })
        await page
          .getByRole('listbox')
          .getByRole('option', { name: 'XIII', includeHidden: false })
          .first()
          .click()
        await page.keyboard.press('Escape')

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'notes' })
          .fill('Some notes about the written source')

        await collectionPom.dataDialogCreate.submitForm()

        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully created',
        )

        // Verify the created item details
        await itemPom.expectTextFieldToHaveValue(
          'title',
          'Test written source title',
        )
        await itemPom.expectTextFieldToHaveValue(
          'publication details',
          'Test publication details',
        )
        await itemPom.expectTextFieldToHaveValue(
          'notes',
          'Some notes about the written source',
        )
        await itemPom.dataCard.backButton.click()
        await collectionPom.table.expectData()

        // UPDATE

        await collectionPom.table
          .getItemNavigationLink(0, NavigationLinksButton.Update)
          .click()
        await collectionPom.dataDialogUpdate.expectOldFormData()

        await collectionPom.dataDialogUpdate.form
          .getByRole('textbox', { name: 'title', exact: true })
          .fill('Updated written source title')

        await collectionPom.dataDialogUpdate.form
          .getByRole('textbox', { name: 'publication details' })
          .fill('Updated publication details')

        await collectionPom.dataDialogUpdate.submitForm()

        // Verify updated item details
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully updated',
        )
        await collectionPom.table.expectRowToHaveText(
          0,
          'Updated written source title',
        )
        await collectionPom.table.expectRowToHaveText(
          0,
          'Updated publication details',
        )

        // DELETE
        await collectionPom.table
          .getItemNavigationLink(0, NavigationLinksButton.Delete)
          .click()
        await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
          'title',
          'Updated written source title',
        )
        await collectionPom.dataDialogDelete.submitForm()
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully deleted',
        )
      })

      test('Data validation', async ({ page }) => {
        const collectionPom = new HistoryWrittenSourceCollectionPage(page)
        await collectionPom.open()
        await collectionPom.table.expectData()
        await collectionPom.dataCard.clickOnActionMenuButton('add new')

        // Test 1: Required fields validation
        await collectionPom.dataDialogCreate.submitButton.click()
        await expect(
          page.locator('.v-input:has(label:text-is("written source type"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text-is("author"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text-is("title"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text-is("publication details"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text-is("centuries"))'),
        ).toContainText(/required/)

        // Test 2: Valid form submission after fixing validation errors
        await collectionPom.dataDialogCreate.form
          .getByLabel('written source type')
          .click()
        await page.getByRole('listbox').getByRole('option').first().click()

        await collectionPom.dataDialogCreate.form.getByLabel('author').click()
        await page.getByRole('listbox').getByRole('option').first().click()

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'title', exact: true })
          .fill('Test written source title')

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'publication details' })
          .fill('Test publication details')

        await collectionPom.dataDialogCreate.form
          .getByLabel('centuries')
          .click({ force: true })
        await page.getByRole('listbox').getByRole('option').first().click()
        await page.keyboard.press('Escape')

        await collectionPom.dataDialogCreate.submitForm()
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully created',
        )
      })
    })
  })

  test.describe('Written Source Cited Works', () => {
    test.describe('Historian user', () => {
      test.use({ storageState: 'playwright/.auth/his.json' })

      test('Basic lifecycle works as expected', async ({ page }) => {
        const collectionPom = new HistoryWrittenSourceCitedWorkCollectionPage(
          page,
        )
        const itemPom = new HistoryWrittenSourceCitedWorkItemPage(page)

        // OPEN/CLOSE CREATE DIALOG
        await collectionPom.open()
        await collectionPom.table.expectData()
        await collectionPom.dataCard.clickOnActionMenuButton('add new')
        await collectionPom.dataDialogCreate.closeDialog()

        // CREATE AND REDIRECT TO NEW ITEM PAGE
        await collectionPom.dataCard.clickOnActionMenuButton('add new')
        await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()

        await collectionPom.dataDialogCreate.form
          .getByLabel('written source', { exact: true })
          .click()
        await page.getByRole('listbox').getByRole('option').first().click()

        await collectionPom.dataDialogCreate.form
          .getByLabel('cited work')
          .click({ force: true })
        await page.getByRole('listbox').getByRole('option').first().click()

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'year completed' })
          .first()
          .fill('1050')

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'year completed (upper)' })
          .fill('1150')

        await collectionPom.dataDialogCreate.submitForm()

        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully created',
        )

        // Verify the created item details
        await itemPom.expectTextFieldToHaveValue('year completed', '1050')
        await itemPom.expectTextFieldToHaveValue(
          'year completed (upper)',
          '1150',
        )
        await itemPom.dataCard.backButton.click()
        await collectionPom.table.expectData()

        // UPDATE

        await collectionPom.table
          .getItemNavigationLink(0, NavigationLinksButton.Update)
          .click()
        await collectionPom.dataDialogUpdate.expectOldFormData()

        await collectionPom.dataDialogUpdate.form
          .getByRole('textbox', { name: 'year completed' })
          .first()
          .fill('1060')

        await collectionPom.dataDialogUpdate.submitForm()

        // Verify updated item details
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully updated',
        )
        await collectionPom.table.expectRowToHaveText(0, '1060')

        // DELETE
        await collectionPom.table
          .getItemNavigationLink(0, NavigationLinksButton.Delete)
          .click()
        await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
          'year completed',
          '1060',
        )
        await collectionPom.dataDialogDelete.submitForm()
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully deleted',
        )
      })

      test('Data validation', async ({ page }) => {
        const collectionPom = new HistoryWrittenSourceCitedWorkCollectionPage(
          page,
        )
        await collectionPom.open()
        await collectionPom.table.expectData()
        await collectionPom.dataCard.clickOnActionMenuButton('add new')

        // Test 1: Required fields validation
        await collectionPom.dataDialogCreate.submitButton.click()
        await expect(
          page.locator('.v-input:has(label:text-is("written source"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text-is("cited work"))'),
        ).toContainText(/required/)
        await expect(
          page.locator('.v-input:has(label:text-is("year completed"))').first(),
        ).toContainText(/required/)

        // Test 2: Year completed validation - lower > upper
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'year completed' })
          .first()
          .fill('1500')
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'year completed (upper)' })
          .fill('1000')
        await page.keyboard.press('Tab')
        await expect(
          page.locator('.v-input:has(label:text-is("year completed"))').first(),
        ).toContainText(
          'Year completed must be greater than or equal year completed upper.',
        )

        // Test 3: Valid form submission after fixing validation errors
        await collectionPom.dataDialogCreate.form
          .getByLabel('written source', { exact: true })
          .click()
        await page.getByRole('listbox').getByRole('option').first().click()

        await collectionPom.dataDialogCreate.form
          .getByLabel('cited work')
          .click()
        await page.getByRole('listbox').getByRole('option').first().click()

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'year completed' })
          .first()
          .fill('1050')

        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'year completed (upper)' })
          .fill('1150')

        await collectionPom.dataDialogCreate.submitForm()
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully created',
        )
      })
    })
  })
})
