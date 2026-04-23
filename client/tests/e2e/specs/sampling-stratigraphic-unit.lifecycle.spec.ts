import { test } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { testMediaObjectLifecycle } from '~~/tests/e2e/utils/media-object-test-helper'
import { SamplingStratigraphicUnitCollectionPage } from '~~/tests/e2e/pages/sampling-stratigraphic-unit-collection.page'
import { SamplingStratigraphicUnitsItemPage } from '~~/tests/e2e/pages/sampling-stratigraphic-units-item.page'
import { NavigationLinksButton } from '~~/tests/e2e/utils'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Sampling site lifecycle', () => {
  test.describe('Geoarchaeologist user', () => {
    test.use({ storageState: 'playwright/.auth/geo.json' })
    test('Media object', async ({ page }) => {
      const collectionPom = new SamplingStratigraphicUnitCollectionPage(page)
      const itemPom = new SamplingStratigraphicUnitsItemPage(page)
      await testMediaObjectLifecycle(page, itemPom, async () => {
        await collectionPom.open()
        await collectionPom.table.expectData()
        await collectionPom.table
          .getItemNavigationLink('SC3.807', NavigationLinksButton.Read)
          .click()
        await itemPom.form.waitForLoad()
        await itemPom.clickTab('media')
      })
    })
  })
})
