import { test } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { testMediaObjectLifecycle } from '~~/tests/e2e/utils/media-object-test-helper'
import { SedimentCoreCollectionPage } from '~~/tests/e2e/pages/sediment-core-collection.page'
import { SedimentCoresItemPage } from '~~/tests/e2e/pages/sediment-cores-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Sediment core lifecycle', () => {
  test.describe('Geoarchaeologist user', () => {
    test.use({ storageState: 'playwright/.auth/geo.json' })
    test('Media object', async ({ page }) => {
      const collectionPom = new SedimentCoreCollectionPage(page)
      const itemPom = new SedimentCoresItemPage(page)
      await testMediaObjectLifecycle(page, itemPom, async () => {
        await collectionPom.open()
        await collectionPom.table.expectData()
        await collectionPom.table
          .getItemNavigationLink('SC3.25.3', NavigationLinksButton.Read)
          .click()
        await itemPom.form.waitForLoad()
        await itemPom.clickTab('media')
      })
    })
  })
})
