import { test, expect } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { SiteCollectionPage } from '~~/tests/e2e/pages/site-collection.page'
import { SiteItemPage } from '~~/tests/e2e/pages/site-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'
import { AuthTestHelper } from '~~/tests/e2e/utils/auth-test-helper'
import { LoginPage } from '~~/tests/e2e/pages/login.page'
import { StratigraphicUnitCollectionPage } from '~~/tests/e2e/pages/stratigraphic-unit-collection.page'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Archaeological site lifecycle', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Basic archaeological site lifecycle works as expected', async ({
      page,
    }) => {
      const collectionPom = new SiteCollectionPage(page)
      const itemPom = new SiteItemPage(page)

      // OPEN/CLOSE CREATE DIALOG
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.closeDialog()

      // CREATE AND REDIRECT TO NEW SITE PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('NW')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('New Shining Site')
      await collectionPom.dataDialogCreate.form.getByLabel('region').click()
      await page
        .getByRole('option', { name: /andalusia/i })
        .first()
        .click()
      await collectionPom.dataDialogCreate.form
        .getByLabel('field director')
        .first()
        .fill('vi')
      await page
        .getByRole('option', { name: /victoria/i })
        .first()
        .click()
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'description' })
        .fill('A new shining site for testing purposes')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('1000')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (upper)' })
        .fill('1100')
      await collectionPom.dataDialogCreate.form
        .getByRole('combobox', { name: 'field director' })
        .fill('Some One')
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      // await itemPom.expectAppDataCardToHaveResourceLabelAsTitle()
      await page.getByTestId('chronology-panel').click()
      await itemPom.expectTextFieldToHaveValue('code', 'NW')
      await itemPom.expectTextFieldToHaveValue('name', 'New Shining Site')
      await expect(
        page.locator('.v-input:has(label:text("region"))'),
      ).toContainText(/andalusia/i)
      await itemPom.expectTextFieldToHaveValue(
        'description',
        'A new shining site for testing purposes',
      )
      await itemPom.expectTextFieldToHaveValue('chronology (lower)', '1000')
      await itemPom.expectTextFieldToHaveValue('chronology (upper)', '1100')
      await itemPom.expectTextFieldToHaveValue('field director', 'Some One')
      await itemPom.dataCard.backButton.click()
      await collectionPom.table.expectData()

      //UPDATE
      await collectionPom.table
        .getItemNavigationLink('NW', NavigationLinksButton.Update)
        .click()
      await collectionPom.dataDialogUpdate.expectOldFormData()
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'name' })
        .fill('Newer Shining Site')
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'description' })
        .fill('A modified shining site description')
      await collectionPom.dataDialogUpdate.form.getByLabel('region').click()
      await page
        .getByRole('option', { name: /baleari/i })
        .first()
        .click()
      await collectionPom.dataDialogUpdate.form
        .getByLabel('field director')
        .first()
        .fill('vi')
      await page
        .getByRole('option', { name: /victoria/i })
        .first()
        .click()
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('900')
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'chronology (upper)' })
        .fill('1200')

      // const patchResponsePromise = page.waitForResponse(
      //   (response) =>
      //     response.url().includes('/api/data/stratigraphic_units/') &&
      //     response.request().method() === 'PATCH',
      // )
      // const getResponsePromise = page.waitForResponse(
      //   (response) =>
      //     response.url().includes('/api/data/stratigraphic_units') &&
      //     response.request().method() === 'GET',
      // )

      await collectionPom.dataDialogUpdate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )

      // Wait for both the PATCH request and the subsequent GET request that refreshes the table
      // await patchResponsePromise
      // await getResponsePromise

      await collectionPom.table.expectRowToHaveText('NW', 'Newer Shining Site')
      await collectionPom.table.expectRowToHaveText('NW', 'Baleari')
      await collectionPom.table.expectRowToHaveText(
        'NW',
        'A modified shining site description',
      )

      // DELETE
      await collectionPom.table
        .getItemNavigationLink('NW', NavigationLinksButton.Delete)
        .click()
      await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
        'name',
        'Newer Shining Site',
      )
      await collectionPom.dataDialogDelete.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.table.expectNotToHaveRowContainingText('NW')

      //CREATE AND NOT REDIRECT TO NEW SITE PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.uncheck()
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('NW1')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('New Shining Site (again)')
      await collectionPom.dataDialogCreate.form.getByLabel('region').click()
      await page
        .getByRole('option', { name: /andalusia/i })
        .first()
        .click()
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await collectionPom.table.expectData()
    })
    test('Data validation', async ({ page }) => {
      const collectionPom = new SiteCollectionPage(page)
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')

      // Required field validation - code field
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('AA')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .clear()
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("code"))'),
      ).toContainText(/required/)

      // Required field validation - name field
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('TEST')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('a')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .clear()
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("name"))'),
      ).toContainText(/required/)

      // Unique validation - try to create with existing code
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('TO') // Assuming this exists in fixtures
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('Valid Name')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("code"))'),
      ).toContainText('Code must be unique')

      // Unique validation - try to create with existing name
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('NEW') // Assuming this exists in fixtures
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('Tozar')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("name"))'),
      ).toContainText('Name must be unique')

      // Region - required
      await collectionPom.dataDialogCreate.form.getByLabel('region').click()
      await page
        .getByRole('option', { name: /baleari/i })
        .first()
        .click()
      await collectionPom.dataDialogCreate.form.getByLabel('region').clear()
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("region"))'),
      ).toContainText(/required/)

      // Chronology validation - invalid year format
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('NEW')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('not_a_number')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("chronology (lower)"))'),
      ).toContainText(/must be an integer/i)

      // Chronology validation - year too low
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('-50000')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("chronology (lower)"))'),
      ).toContainText(/must be greater than/i)

      // Chronology validation - year too high (future year)
      const futureYear = new Date().getFullYear() + 100
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill(futureYear.toString())
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("chronology (lower)"))'),
      ).toContainText(/must be less than/i)

      // Chronology validation - lower > upper
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

      // Valid form submission after fixing validation errors
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('NEW')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('Valid Test Site')
      await collectionPom.dataDialogCreate.form.getByLabel('region').click()
      await page
        .getByRole('option', { name: /baleari/i })
        .first()
        .click()
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('1000')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (upper)' })
        .fill('1500')
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
    })

    test('Site chronology works as expected', async ({ page }) => {
      const collectionPom = new SiteCollectionPage(page)
      const itemPom = new SiteItemPage(page)
      await collectionPom.open()
      await collectionPom.table.expectData()

      //CREATE AND REDIRECT TO NEW SITE PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('NW')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('New Shining Site')
      await collectionPom.dataDialogCreate.form.getByLabel('region').click()
      await page
        .getByRole('option', { name: /andalusia/i })
        .first()
        .click()
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'description' })
        .fill('A new shining site for testing purposes')
      await collectionPom.dataDialogCreate.form
        .getByRole('combobox')
        .nth(4)
        .click()
      await page.getByRole('option', { name: 'taifa' }).click()
      await page.getByRole('option', { name: 'feudal' }).click()
      await page.keyboard.press('Tab')
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await page.getByTestId('chronology-panel').click()
      await expect(page.getByTestId('cultural-contexts-selection')).toHaveText(
        /(?=.*feudal)(?=.*taifa)/,
      )
      await itemPom.dataCard.backButton.click()
      await collectionPom.table.expectData()

      //UPDATE
      await collectionPom.table
        .getItemNavigationLink('NW', NavigationLinksButton.Update)
        .click()
      await collectionPom.dataDialogUpdate.form
        .getByRole('combobox')
        .nth(4)
        .click()
      await page.getByRole('option', { name: 'taifa' }).click() //uncheck
      await page.getByRole('option', { name: 'emirate' }).click()
      await page.getByRole('option', { name: 'caliphate' }).click()
      await page.keyboard.press('Tab')
      await collectionPom.dataDialogUpdate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )
      await collectionPom.table
        .getItemNavigationLink('NW', NavigationLinksButton.Read)
        .click()
      await expect(page.getByTestId('cultural-contexts-selection')).toHaveText(
        /(?=.*feudal)(?=.*emirate)(?=.*caliphate)/,
      )
    })
  })
  test.describe('Editor user', () => {
    test("Editor use can manage site related user's privileges", async ({
      page,
      browser,
    }) => {
      // create a new user and login
      const collectionPom = new SiteCollectionPage(page)
      const itemPom = new SiteItemPage(page)
      const authTestHelper = new AuthTestHelper(browser)
      const credentials = await authTestHelper.createUser('editor', [
        'geo archaeologist',
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
        .getByText('Archaeology', { exact: true })
        .click()
      await page
        .getByTestId('app-navigation-drawer')
        .getByText('Sites')
        .first()
        .click()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')

      // create a new site
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('NW')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('New Test Site')
      await collectionPom.dataDialogCreate.form.getByLabel('region').click()
      await page
        .getByRole('option', { name: /andalusia/i })
        .first()
        .click()
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )

      // Manage privileges for the new site
      await itemPom.clickTab('users privileges')
      const privilegesCollectionPom = new StratigraphicUnitCollectionPage(
        page,
        undefined,
        'child-data-card',
      )
      await privilegesCollectionPom.table.expectData()
      await privilegesCollectionPom.dataCard.clickOnActionMenuButton('add new')
      await privilegesCollectionPom.dataDialogCreate.form
        .getByLabel('user')
        .click()
      await page.getByRole('option', { name: /zoo/ }).first().click()
      await privilegesCollectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await privilegesCollectionPom.table
        .getItemNavigationLink(
          'user_zoo@example.com',
          NavigationLinksButton.Delete,
        )
        .click()
      await privilegesCollectionPom.dataDialogDelete.expectTextFieldToHaveValue(
        'user',
        'user_zoo@example.com',
      )
      await privilegesCollectionPom.dataDialogDelete.submitForm()
      await privilegesCollectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.table.expectNotToHaveRowContainingText(
        'user_zoo@example.com',
      )
    })
  })
})
