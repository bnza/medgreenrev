import { test, expect } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { SiteCollectionPage } from '~~/tests/e2e/pages/site-collection.page'
import { SiteItemPage } from '~~/tests/e2e/pages/site-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'

test.beforeAll(async () => {
  loadFixtures()
})

test.describe('Site lifecycle', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Basic site lifecycle works as expected', async ({ page }) => {
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
        .getByRole('textbox', { name: 'field director' })
        .fill('Some One')
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      // await itemPom.expectAppDataCardToHaveResourceLabelAsTitle()
      await page.getByTestId('chronology-panel').click()
      await itemPom.expectTextFieldToHaveValue('code', 'NW')
      await itemPom.expectTextFieldToHaveValue('name', 'New Shining Site')
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
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'name' })
        .fill('Newer Shining Site')
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'description' })
        .fill('A modified shining site description')
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('900')
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'chronology (upper)' })
        .fill('1200')
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'field director' })
        .fill('Some One Else')
      await collectionPom.dataDialogUpdate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )
      await collectionPom.table.expectRowToHaveText('NW', 'Newer Shining Site')
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
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await collectionPom.table.expectData()
    })
    test('Data validation', async ({ page }) => {
      const collectionPom = new SiteCollectionPage(page)
      const itemPom = new SiteItemPage(page)
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')

      // Test 1: Required field validation - code field
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('AA')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .clear()
      await page.keyboard.press('Tab')
      await expect(
        collectionPom.dataDialogCreate.form.getByText(/required/),
      ).toBeVisible()

      // Test 2: Required field validation - name field
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
        collectionPom.dataDialogCreate.form.getByText(/required/),
      ).toBeVisible()

      // Test 3: Unique validation - try to create with existing code
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('TO') // Assuming this exists in fixtures
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('Valid Name')
      await page.keyboard.press('Tab')
      await expect(
        collectionPom.dataDialogCreate.form.getByText('Code must be unique'),
      ).toBeVisible()

      // Test 4: Unique validation - try to create with existing name
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('NEW') // Assuming this exists in fixtures
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('Tozar')
      await page.keyboard.press('Tab')
      await expect(
        collectionPom.dataDialogCreate.form.getByText('Name must be unique'),
      ).toBeVisible()

      // Test 5: Chronology validation - invalid year format
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('NEW')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('not_a_number')
      await page.keyboard.press('Tab')
      await expect(
        collectionPom.dataDialogCreate.form.getByText('Must be an integer'),
      ).toBeVisible()

      // Test 6: Chronology validation - year too low
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('-50000')
      await page.keyboard.press('Tab')
      await expect(
        collectionPom.dataDialogCreate.form.getByText(/must be greater than/i),
      ).toBeVisible()

      // Test 7: Chronology validation - year too high (future year)
      const futureYear = new Date().getFullYear() + 100
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill(futureYear.toString())
      await page.keyboard.press('Tab')
      await expect(
        collectionPom.dataDialogCreate.form.getByText(/must be less than/i),
      ).toBeVisible()

      // Test 8: Chronology validation - lower > upper
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (lower)' })
        .fill('1500')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'chronology (upper)' })
        .fill('1000')
      await page.keyboard.press('Tab')
      await expect(
        collectionPom.dataDialogCreate.form.getByText(
          'Lower chronology must be greater than or equal upper chronology.',
        ),
      ).toBeVisible()

      // Test 9: Valid form submission after fixing validation errors
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('NEW')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('Valid Test Site')
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
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'description' })
        .fill('A new shining site for testing purposes')
      await collectionPom.dataDialogCreate.form
        .getByRole('combobox')
        .first()
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
        .first()
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
})
