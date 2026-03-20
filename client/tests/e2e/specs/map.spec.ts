import { test, expect } from '@playwright/test'
import { HomePage } from '~~/tests/e2e/pages/home.page'
import { AppMapComponent } from '~~/tests/e2e/components/app-map.component'

import {
  waitForMapRenderComplete,
  isCanvasPainted,
  getRenderedCanvasCount,
} from '~~/tests/e2e/utils/map-test-helper'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { SiteItemPage } from '~~/tests/e2e/pages/site-item.page'

test.describe('Map mode', () => {
  test.describe('Read-only tests', () => {
    test.beforeAll(async () => {
      loadFixtures()
    })
    test('UI mode switcher toggles between data and map mode', async ({
      page,
    }) => {
      const homePom = new HomePage(page)
      await homePom.open()

      // Default mode: data navigation drawer is visible, map is not
      await expect(page.getByTestId('app-navigation-drawer')).toBeVisible()
      await expect(
        page.getByTestId('app-map-navigation-drawer'),
      ).not.toBeVisible()

      // Switch to map mode
      await homePom.appBar.uiModeSwitcher.click()

      // Map mode: map navigation drawer is visible, data navigation drawer is not
      await expect(page.getByTestId('app-map-navigation-drawer')).toBeVisible()
      await expect(page.getByTestId('app-navigation-drawer')).not.toBeVisible()

      // Switch back to data mode
      await homePom.appBar.uiModeSwitcher.click()

      // Data mode restored
      await expect(page.getByTestId('app-navigation-drawer')).toBeVisible()
      await expect(
        page.getByTestId('app-map-navigation-drawer'),
      ).not.toBeVisible()
    })

    test('Canvas is rendered and base maps are loaded in map mode', async ({
      page,
    }) => {
      const homePom = new HomePage(page)
      const appMap = new AppMapComponent(page)
      await homePom.open()

      // Switch to map mode
      await homePom.appBar.uiModeSwitcher.click()
      await expect(page.getByTestId('app-map-navigation-drawer')).toBeVisible()

      // Wait for the map canvas to appear in the viewport
      await waitForMapRenderComplete(page)

      // Assert the map container and canvas are visible
      await appMap.expectCanvasToBeVisible()

      // Verify the canvas has non-zero dimensions (has been painted)
      const painted = await isCanvasPainted(page)
      expect(painted).toBe(true)

      // Verify at least one canvas layer is rendered (base map tiles)
      const canvasCount = await getRenderedCanvasCount(page)
      expect(canvasCount).toBeGreaterThanOrEqual(1)

      // Verify the OL viewport structure exists within the map container
      await expect(appMap.container.locator('.ol-viewport')).toBeVisible()
    })

    test('Map features interaction', async ({ page }) => {
      const homePom = new HomePage(page)
      const appMap = new AppMapComponent(page)
      const itemPom = new SiteItemPage(page)
      await homePom.open()

      // Switch to map mode
      await homePom.appBar.uiModeSwitcher.click()
      await expect(page.getByTestId('app-map-navigation-drawer')).toBeVisible()

      // Wait for the map canvas to appear in the viewport
      await waitForMapRenderComplete(page)

      // Assert the map container and canvas are visible
      await appMap.expectCanvasToBeVisible()

      await page.waitForResponse((response) =>
        response.url().includes('api/features/archaeological_sites'),
      )

      await page.waitForTimeout(1000)

      await page.mouse.click(945, 489)

      await expect(appMap.container.locator('.ol-viewport')).toContainText(
        'Cabrera',
      )

      await page.getByTestId('read-item-button').click()

      await itemPom.dataCard.expectToHaveTitle(/archaeological site/i)

      await expect(itemPom.dataCard.toolbar).toContainText(/CA/)

      await page.getByTestId('ui-mode-switcher').click()

      await appMap.expectCanvasToBeVisible()

      await expect(appMap.container.locator('.ol-viewport')).not.toContainText(
        'Cabrera',
      )
    })
  })
})
