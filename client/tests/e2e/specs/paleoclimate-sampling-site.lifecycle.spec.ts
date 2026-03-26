import { test, expect } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { PaleoclimateSamplingSiteCollectionPage } from '~~/tests/e2e/pages/paleoclimate-sampling-site-collection.page'
import { PaleoclimateSamplingSiteItemPage } from '~~/tests/e2e/pages/paleoclimate-sampling-site-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Paleoclimate sampling site lifecycle', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Basic paleoclimate sampling site lifecycle works as expected', async ({
      page,
    }) => {
      const collectionPom = new PaleoclimateSamplingSiteCollectionPage(page)
      const itemPom = new PaleoclimateSamplingSiteItemPage(page)

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
        .fill('PSS')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('New Paleoclimate Sampling Site')
      await collectionPom.dataDialogCreate.form.getByLabel('region').click()
      await page
        .getByRole('option', { name: /catalan/i })
        .first()
        .click()
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'coordinate N' })
        .fill('40.123')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'coordinate E' })
        .fill('-3.456')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'description' })
        .fill('A new paleoclimate sampling site for testing purposes')
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )

      await itemPom.expectTextFieldToHaveValue('code', 'PSS')
      await itemPom.expectTextFieldToHaveValue(
        'name',
        'New Paleoclimate Sampling Site',
      )
      await expect(
        page.locator('.v-input:has(label:text("region"))'),
      ).toContainText(/catalan/i)
      await itemPom.expectTextFieldToHaveValue(
        'description',
        'A new paleoclimate sampling site for testing purposes',
      )

      await itemPom.dataCard.backButton.click()
      await collectionPom.table.expectData()

      //UPDATE
      await collectionPom.table
        .getItemNavigationLink('PSS', NavigationLinksButton.Update)
        .click()
      await collectionPom.dataDialogUpdate.expectOldFormData()
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'name' })
        .fill('Newer Paleoclimate Sampling Site')
      await collectionPom.dataDialogUpdate.form.getByLabel('region').click()
      await page
        .getByRole('option', { name: /balearic/i })
        .first()
        .click()
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'coordinate N' })
        .fill('41.123')
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'coordinate E' })
        .fill('-2.456')
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'description' })
        .fill('A modified paleoclimate sampling site description')

      await collectionPom.dataDialogUpdate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )

      await collectionPom.table.expectRowToHaveText(
        'PSS',
        'Newer Paleoclimate Sampling Site',
      )
      await collectionPom.table.expectRowToHaveText('PSS', 'Balearic islands')
      await collectionPom.table.expectRowToHaveText(
        'PSS',
        'A modified paleoclimate sampling site description',
      )

      // DELETE
      await collectionPom.table
        .getItemNavigationLink('PSS', NavigationLinksButton.Delete)
        .click()
      await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
        'name',
        'Newer Paleoclimate Sampling Site',
      )
      await collectionPom.dataDialogDelete.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.table.expectNotToHaveRowContainingText('PSS')

      //CREATE AND NOT REDIRECT TO NEW SITE PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.uncheck()
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('PSS1')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('New Paleoclimate Sampling Site (again)')
      await collectionPom.dataDialogCreate.form.getByLabel('region').click()
      await page
        .getByRole('option', { name: /balearic/i })
        .first()
        .click()
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await collectionPom.table.expectData()
    })

    test('Data validation', async ({ page }) => {
      const collectionPom = new PaleoclimateSamplingSiteCollectionPage(page)
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
      // Note: Assuming 'PCS1' is an existing code in fixtures, following the pattern from sampling-site
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('PCS1')
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
        .fill('NEW')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('Cueva de Nerja')
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

      // Coordinate validation - invalid format
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'coordinate N' })
        .fill('not_a_number')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("coordinate N"))'),
      ).toContainText(/must be decimal/i)

      // Coordinate validation - range too low
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'coordinate N' })
        .fill('-91')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("coordinate N"))'),
      ).toContainText(/must be greater than/i)

      // Coordinate validation - range too high
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'coordinate N' })
        .fill('91')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("coordinate N"))'),
      ).toContainText(/must be less than/i)

      // Coordinate validation - "Both coordinates must be present or absent"
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'coordinate N' })
        .fill('40')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'coordinate E' })
        .clear()
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("coordinate N"))'),
      ).toContainText('Both coordinates must be present or absent')

      // Valid form submission after fixing validation errors
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('NEW')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('Valid Test Paleoclimate Sampling Site')
      await collectionPom.dataDialogCreate.form.getByLabel('region').click()
      await page
        .getByRole('option', { name: /baleari/i })
        .first()
        .click()
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'coordinate N' })
        .fill('40')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'coordinate E' })
        .fill('0')
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
    })
  })
})
