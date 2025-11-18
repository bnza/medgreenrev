import { test, expect } from '@playwright/test'
import { loadFixtures, resetFixtureMedia } from '~~/tests/e2e/utils/api'
import { StratigraphicUnitCollectionPage } from '~~/tests/e2e/pages/stratigraphic-unit-collection.page'
import { StratigraphicUnitsItemPage } from '~~/tests/e2e/pages/stratigraphic-units-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'
import { SiteCollectionPage } from '~~/tests/e2e/pages/site-collection.page'
import { SiteItemPage } from '~~/tests/e2e/pages/site-item.page'
import { SampleCollectionPage } from '~~/tests/e2e/pages/sample-collection.page'
import { SampleItemPage } from '~~/tests/e2e/pages/sample-item.page'
import { ContextCollectionPage } from '~~/tests/e2e/pages/context-collection.page'
import { ContextItemPage } from '~~/tests/e2e/pages/context-item.page'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Stratigraphic Unit lifecycle', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Basic lifecycle works as expected', async ({ page }) => {
      const collectionPom = new StratigraphicUnitCollectionPage(page)
      const itemPom = new StratigraphicUnitsItemPage(page)

      // OPEN/CLOSE CREATE DIALOG
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.closeDialog()

      // CREATE AND REDIRECT TO NEW STRATIGRAPHIC UNIT PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.check()

      // Fill site field (using autocomplete)
      await collectionPom.awaitForApiResponse('**/api/data/sites**', () =>
        collectionPom.dataDialogCreate.form.getByLabel('site').fill('pa'),
      )

      await collectionPom.dataDialogCreate.form.getByLabel('site').click()
      await page.getByRole('option', { name: /Pla/ }).first().click() // Select first available site

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'year' })
        .fill('2023')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'number' })
        .fill('001')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'interpretation' })
        .fill('Test stratigraphic unit for archaeological analysis')

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )

      // Verify the created item details
      await itemPom.expectTextFieldToHaveValue('year', '2023')
      await itemPom.expectTextFieldToHaveValue('number', '1')
      await itemPom.expectTextFieldToHaveValue(
        'interpretation',
        'Test stratigraphic unit for archaeological analysis',
      )
      await itemPom.dataCard.backButton.click()
      await collectionPom.table.expectData()

      // UPDATE
      await collectionPom.table
        .getItemNavigationLink('PA.23.1', NavigationLinksButton.Update) // Assuming code format is year-number
        .click()
      await collectionPom.dataDialogUpdate.expectOldFormData()
      await collectionPom.dataDialogUpdate.form
        .getByRole('textbox', { name: 'interpretation' })
        .fill('Updated stratigraphic unit interpretation with new findings')

      await collectionPom.dataDialogUpdate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully updated',
      )

      await collectionPom.table.expectRowToHaveText(
        'PA.23.1',
        'Updated stratigraphic unit interpretation with new findings',
      )

      // DELETE
      await collectionPom.table
        .getItemNavigationLink('PA.23.1', NavigationLinksButton.Delete)
        .click()
      await collectionPom.dataDialogDelete.expectTextFieldToHaveValue(
        'year',
        '2023',
      )
      await collectionPom.dataDialogDelete.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully deleted',
      )
      await collectionPom.table.expectNotToHaveRowContainingText('PA.23.1')

      // CREATE AND NOT REDIRECT TO NEW STRATIGRAPHIC UNIT PAGE
      await collectionPom.dataCard.clickOnActionMenuButton('add new')
      await collectionPom.dataDialogCreate.showCreatedItemCheckbox.uncheck()

      // Fill site field again
      await collectionPom.awaitForApiResponse('**/api/data/sites**', () =>
        collectionPom.dataDialogCreate.form.getByLabel('site').fill('pa'),
      )
      await collectionPom.dataDialogCreate.form.getByLabel('site').click()
      await page.getByRole('option', { name: /Pla/ }).first().click()

      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'year' })
        .fill('2023')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'number' })
        .fill('003')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'interpretation' })
        .fill('Another test stratigraphic unit')

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
      await collectionPom.table.expectData()
      await collectionPom.table.expectRowToHaveText('PA.23.3', 'PA.23.3')
    })

    test.describe('Sub tables', () => {
      test('Site', async ({ page }) => {
        const parentCollectionPom = new SiteCollectionPage(page)
        const parentItemPom = new SiteItemPage(page)
        const collectionPom = new StratigraphicUnitCollectionPage(
          page,
          undefined,
          'child-data-card',
        )
        await parentCollectionPom.open()
        await parentCollectionPom.table
          .getItemNavigationLink('TO', NavigationLinksButton.Read)
          .click()
        await parentItemPom.page
          .getByRole('tab', { name: /stratigraphic/i })
          .click()
        await collectionPom.dataCard.expectToHaveTitle(/stratigraphic units/i)
        await collectionPom.table.expectData()
        await collectionPom.dataCard.clickOnActionMenuButton('add new')
        await expect(
          collectionPom.dataDialogCreate.form.getByLabel('site'),
        ).toBeDisabled()
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'year' })
          .fill('2025')
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'number' })
          .fill('999')
        await collectionPom.dataDialogCreate.form
          .getByRole('textbox', { name: 'interpretation' })
          .fill(
            'Test stratigraphic unit for archaeological analysis created from site',
          )
        await collectionPom.dataDialogCreate.submitForm()
        await collectionPom.expectAppMessageToHaveText(
          'Resource successfully created',
        )
        await collectionPom.table.expectRowToHaveText(
          'TO.25.999',
          'Test stratigraphic unit for archaeological analysis created from site',
        )
      })
    })

    test.describe('Associations', () => {
      test('Samples', async ({ page }) => {
        const parentCollectionPom = new SampleCollectionPage(page)
        const parentItemPom = new SampleItemPage(page)
        const collectionPom = new StratigraphicUnitCollectionPage(
          page,
          undefined,
          'child-data-card',
        )
        await parentCollectionPom.open()
        await parentCollectionPom.awaitSearchResults('TO.CO')
        await parentCollectionPom.table
          .getItemNavigationLink(/TO\.CO/, NavigationLinksButton.Read)
          .click()
        await parentItemPom.form.waitForLoad()
        await parentItemPom.page
          .getByRole('tab', { name: /stratigraphic/i })
          .click()
        await collectionPom.dataCard.expectToHaveTitle(
          /sample\/SU associations/i,
        )
        await collectionPom.table.expectData()
        expect(await collectionPom.table.getCurrentPageRange('total')).toBe(1)
        await collectionPom.dataCard.clickOnActionMenuButton('add new')
        await expect(
          collectionPom.dataDialogCreate.form.getByLabel('sample'),
        ).toBeDisabled()
        await collectionPom.dataDialogCreate.form
          .getByLabel('stratigraphic unit')
          .fill('TO')
        await page.getByRole('option', { name: /TO/ }).first().click()
        await collectionPom.dataDialogCreate.submitForm()
        expect(await collectionPom.table.getCurrentPageRange('total')).toBe(2)
      })
      test('Context', async ({ page }) => {
        const parentCollectionPom = new ContextCollectionPage(page)
        const parentItemPom = new ContextItemPage(page)
        const collectionPom = new StratigraphicUnitCollectionPage(
          page,
          undefined,
          'child-data-card',
        )
        await parentCollectionPom.open()
        await parentCollectionPom.awaitSearchResults('floor')
        await parentCollectionPom.table
          .getItemNavigationLink(/floor I/, NavigationLinksButton.Read)
          .click()
        await parentItemPom.form.waitForLoad()
        await parentItemPom.page
          .getByRole('tab', { name: /stratigraphic/i })
          .click()
        await collectionPom.dataCard.expectToHaveTitle(
          /context\/SU associations/i,
        )
        await collectionPom.table.expectData()
        expect(await collectionPom.table.getCurrentPageRange('total')).toBe(2)
        await collectionPom.dataCard.clickOnActionMenuButton('add new')
        await expect(
          collectionPom.dataDialogCreate.form.getByLabel('context'),
        ).toBeDisabled()
        await collectionPom.dataDialogCreate.form
          .getByLabel('stratigraphic unit')
          .fill('SE')
        await page.getByRole('option', { name: /SE/ }).first().click()
        await collectionPom.dataDialogCreate.submitForm()
        expect(await collectionPom.table.getCurrentPageRange('total')).toBe(3)
      })
    })

    test('Data validation', async ({ page }) => {
      const collectionPom = new StratigraphicUnitCollectionPage(page)

      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.dataCard.clickOnActionMenuButton('add new')

      // Test 1: Required field validation - site field
      await collectionPom.dataDialogCreate.form.getByLabel('site').click()
      await page
        .getByRole('option', { name: /Sediment/ })
        .first()
        .click()
      await collectionPom.dataDialogCreate.form.getByLabel('site').click()
      await page.keyboard.press('Backspace')
      await expect(
        page.locator('.v-input:has(label:text("site"))'),
      ).toContainText(/required/)
      await collectionPom.dataDialogCreate.form.getByLabel('site').click()
      await page
        .getByRole('option', { name: /Sediment/ })
        .first()
        .click()

      // Test 3: Required field validation - number field
      await collectionPom.dataDialogCreate.form.getByLabel('number').fill('2')
      await collectionPom.dataDialogCreate.form.getByLabel('number').fill('')
      await expect(
        page.locator('.v-input:has(label:text("number"))'),
      ).toContainText(/required/)
      await collectionPom.dataDialogCreate.form.getByLabel('number').fill('999')
      await expect(
        page.locator('.v-input:has(label:text("number"))'),
      ).not.toContainText(/required/)

      // Test 4: Year validation - invalid year format
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'year' })
        .fill('not_a_year')
      await page.keyboard.press('Tab')
      await expect(
        page.locator('.v-input:has(label:text("year"))'),
      ).toContainText(/must be an integer/i)

      // Test 5: Year validation - year too low
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'year' })
        .fill('1899')
      await expect(
        page.locator('.v-input:has(label:text("year"))'),
      ).toContainText(/must be greater than/i)

      // Test 6: Year validation - year too high (future year)
      const futureYear = new Date().getFullYear() + 10
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'year' })
        .fill(futureYear.toString())
      await expect(
        page.locator('.v-input:has(label:text("year"))'),
      ).toContainText(/must be less than/i)

      // Test 7: Unique validation - try to create with existing combination
      await collectionPom.dataDialogCreate.form.getByLabel('site').fill('SE')
      await page
        .getByRole('option')
        .filter({ hasText: /esteban/i })
        .click()
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'year' })
        .fill('2025')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'number' })
        .fill('508')
      await expect(
        page.locator('.v-input:has(label:text("number"))'),
      ).toContainText(/duplicate/i)

      // Test 8: Valid form submission after fixing validation errors
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'number' })
        .fill('999')
      await collectionPom.dataDialogCreate.form
        .getByRole('textbox', { name: 'interpretation' })
        .fill('Valid test stratigraphic unit for validation testing')

      await collectionPom.dataDialogCreate.submitForm()
      await collectionPom.expectAppMessageToHaveText(
        'Resource successfully created',
      )
    })
  })
  test.describe('Base user', () => {
    test.use({ storageState: 'playwright/.auth/base.json' })
    test('Media object', async ({ page }) => {
      resetFixtureMedia()
      const collectionPom = new StratigraphicUnitCollectionPage(page)
      const itemPom = new StratigraphicUnitsItemPage(page)
      await collectionPom.open()
      await collectionPom.table.expectData()
      await collectionPom.awaitSearchResults('NI.408')
      await collectionPom.table
        .getItemNavigationLink('NI.25.408', NavigationLinksButton.Read)
        .click()

      await itemPom.form.waitForLoad()
      await itemPom.clickTab('media')
      await itemPom.mediaContainer.expectMediaObjectCardsToHaveCount(0)

      // CREATE (new media)
      await itemPom.mediaContainer.openCreateDialog()
      await itemPom.mediaContainer.dataDialogCreate.expectDialogToBeVisible()
      await itemPom.mediaContainer.dataDialogCreate.setFileInput(
        'input/lorem ipsum.txt',
      )
      await itemPom.mediaContainer.dataDialogCreate.form
        .getByLabel('type')
        .click()
      await page
        .getByRole('listbox')
        .getByText('report', { exact: true })
        .click()
      await itemPom.mediaContainer.dataDialogCreate.form
        .getByLabel('description')
        .fill('A short description of the media object')
      await itemPom.mediaContainer.dataDialogCreate.submitForm()
      await itemPom.mediaContainer.expectMediaObjectCardsToHaveCount(1)

      // CREATE (existing media)
      await itemPom.mediaContainer.openCreateDialog()
      await itemPom.mediaContainer.dataDialogCreate.expectDialogToBeVisible()
      await itemPom.mediaContainer.dataDialogCreate.setFileInput(
        'input/unnecessary stuff.csv',
      )
      await itemPom.mediaContainer.dataDialogCreate.expectFileAlreadyArchived()
      await itemPom.mediaContainer.dataDialogCreate.submitForm()
      await itemPom.mediaContainer.expectMediaObjectCardsToHaveCount(2)

      // DELETE
      await itemPom.mediaContainer.cards
        .first()
        .getByTestId('delete-media-button')
        .click()
      await itemPom.mediaContainer.dataDialogDelete
        .getByRole('button', { name: /delete/i })
        .click()
      await itemPom.mediaContainer.expectMediaObjectCardsToHaveCount(1)
    })
  })
})
