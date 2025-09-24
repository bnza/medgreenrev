import { test, expect } from '@playwright/test'
import { loadFixtures, resetFixtureMedia } from '~~/tests/e2e/utils/api'
import { MediaObjectCollectionPage } from '~~/tests/e2e/pages/media-object-collection.page'
import { MediaObjectItemPage } from '~~/tests/e2e/pages/media-object-item.page'
import { NavigationLinksButton, getFixturePath } from '~~/tests/e2e/utils'

test.beforeEach(async () => {
  loadFixtures()
  resetFixtureMedia()
})

test.describe('Media object lifecycle', () => {
  test.describe('Base user', () => {
    test.use({ storageState: 'playwright/.auth/base.json' })

    test('Basic media object lifecycle works as expected', async ({ page }) => {
      const collectionPom = new MediaObjectCollectionPage(page)
      const itemPom = new MediaObjectItemPage(page)

      // OPEN/CLOSE CREATE DIALOG
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.closeDialog()

      // CREATE AND REDIRECT TO NEW SITE PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()

      await collectionPom.dataDialogCreate.form.getByLabel('type').click()
      await page.getByText('document \\ summary').click()

      await collectionPom.fileInput.setInputFiles(
        getFixturePath('input/lorem ipsum.txt'),
      )

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'description' })
        .fill('Some general information about the file content')
      await page.pause()
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )

      // Verify the created item details
      await itemPom.expectTextFieldToHaveValue('type', 'summary')

      await itemPom.expectTextFieldToHaveValue(
        'description',
        'Some general information about the file content',
      )
      await itemPom.dataCard.backButton.click()
      await collectionPom.table.expectData()

      // UPDATE

      await collectionPom.table
        .getItemNavigationLink(0, NavigationLinksButton.Update)
        .click()
      await collectionPom.dataDialogUpdate.expectOldFormData()

      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'description' })
        .fill('Updated summary information about the file')

      await collectionPom.dataDialogUpdate.submitForm()

      // Verify updated item details
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )
      await collectionPom.table.expectRowToHaveText(
        0,
        'Updated summary information about the file',
      )

      // DELETE
      await collectionPom.table
        .getItemNavigationLink(0, NavigationLinksButton.Delete)
        .click()
      await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
        'description',
        'Updated summary information about the file',
      )
      await collectionPom.dataDialogDelete.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.table.expectNotToHaveRowContainingText('UNIQ-ID')
    })
    test('Data validation', async ({ page }) => {
      const collectionPom = new MediaObjectCollectionPage(page)
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')

      // Test 1: Required field type - identifier

      await collectionPom.dataDialogCreate.submitButton.click()
      await expect(
        page.locator('.v-input:has(label:text("type"))'),
      ).toContainText(/required/)
      await expect(collectionPom.dataDialogCreate.container).toContainText(
        'File is required',
      )

      // Test 2: Unique validation - try to create with duplicate type identifier
      await collectionPom.fileInput.setInputFiles(
        getFixturePath('input/unnecessary stuff.csv'),
      )
      await expect(collectionPom.dataDialogCreate.container).toContainText(
        /Duplicate file/,
      )

      // Test 3: Valid form submission after fixing validation errors
      await collectionPom.fileInput.setInputFiles(
        getFixturePath('input/lorem ipsum.txt'),
      )
      await collectionPom.dataDialogCreate.form.getByLabel('type').click()
      await page.getByText('document \\ summary').click()
      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
    })
  })
})
