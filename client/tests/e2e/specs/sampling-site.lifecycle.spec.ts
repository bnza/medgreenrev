import { test, expect } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { SamplingSiteCollectionPage } from '~~/tests/e2e/pages/sampling-site-collection.page'
import { SamplingSiteItemPage } from '~~/tests/e2e/pages/sampling-site-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Sampling site lifecycle', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Basic sampling site lifecycle works as expected', async ({
      page,
    }) => {
      const collectionPom = new SamplingSiteCollectionPage(page)
      const itemPom = new SamplingSiteItemPage(page)

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
        .fill('SS')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('New Sampling Site')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'coordinate N' })
        .fill('40.123')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'coordinate E' })
        .fill('-3.456')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'description' })
        .fill('A new sampling site for testing purposes')
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )

      await itemPom.expectTextFieldToHaveValue('code', 'SS')
      await itemPom.expectTextFieldToHaveValue('name', 'New Sampling Site')
      await itemPom.expectTextFieldToHaveValue(
        'description',
        'A new sampling site for testing purposes',
      )
      // Coordinates are not shown in the read view currently, so we don't check them here

      await itemPom.dataCard.backButton.click()
      await collectionPom.table.expectData()

      //UPDATE
      await collectionPom.table
        .getItemNavigationLink('SS', NavigationLinksButton.Update)
        .click()
      await collectionPom.dataDialogUpdate.expectOldFormData()
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'name' })
        .fill('Newer Sampling Site')
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'coordinate N' })
        .fill('41.123')
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'coordinate E' })
        .fill('-2.456')
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'description' })
        .fill('A modified sampling site description')

      await collectionPom.dataDialogUpdate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )

      await collectionPom.table.expectRowToHaveText('SS', 'Newer Sampling Site')
      await collectionPom.table.expectRowToHaveText(
        'SS',
        'A modified sampling site description',
      )

      // DELETE
      await collectionPom.table
        .getItemNavigationLink('SS', NavigationLinksButton.Delete)
        .click()
      await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
        'name',
        'Newer Sampling Site',
      )
      await collectionPom.dataDialogDelete.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.table.expectNotToHaveRowContainingText('SS')

      //CREATE AND NOT REDIRECT TO NEW SITE PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.uncheck()
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('SS1')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('New Sampling Site (again)')
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await collectionPom.table.expectData()
    })

    test('Data validation', async ({ page }) => {
      const collectionPom = new SamplingSiteCollectionPage(page)
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
        page.locator('.v-input:has(label:text("code"))'),
      ).toContainText(/required/)

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
        page.locator('.v-input:has(label:text("name"))'),
      ).toContainText(/required/)

      // Test 3: Unique validation - try to create with existing code
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('SC1')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('Valid Name')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("code"))'),
      ).toContainText('Code must be unique')

      // Test 4: Unique validation - try to create with existing name
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('NEW')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('Sediment cores 3')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("name"))'),
      ).toContainText('Name must be unique')

      // Test 5: Coordinate validation - invalid format
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'coordinate N' })
        .fill('not_a_number')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("coordinate N"))'),
      ).toContainText(/must be decimal/i)

      // Test 6: Coordinate validation - range too low
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'coordinate N' })
        .fill('-91')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("coordinate N"))'),
      ).toContainText(/must be greater than/i)

      // Test 7: Coordinate validation - range too high
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'coordinate N' })
        .fill('91')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("coordinate N"))'),
      ).toContainText(/must be less than/i)

      // Test 8: Coordinate validation - "Both coordinates must be present or absent"
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

      // Test 9: Valid form submission after fixing validation errors
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'code' })
        .fill('NEW')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'name' })
        .fill('Valid Test Sampling Site')
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
