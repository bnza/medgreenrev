import type { Page } from '@playwright/test'

/**
 * Wait for the OpenLayers map to complete rendering.
 * Uses the 'rendercomplete' event on the OL map instance found in the viewport.
 */
export async function waitForMapRenderComplete(
  page: Page,
  timeout = 10000,
): Promise<void> {
  await page.waitForFunction(
    () => {
      const viewport = document.querySelector('.ol-viewport')
      return viewport !== null && viewport.querySelector('canvas') !== null
    },
    { timeout },
  )
}

/**
 * Get the number of tile layers that have loaded tiles.
 * Checks for canvas elements inside the OL viewport which indicate rendered layers.
 */
export async function getRenderedCanvasCount(page: Page): Promise<number> {
  return page.evaluate(() => {
    const viewport = document.querySelector('.ol-viewport')
    if (!viewport) return 0
    return viewport.querySelectorAll('canvas').length
  })
}

/**
 * Check if a canvas has been painted (has non-zero dimensions and rendered content).
 */
export async function isCanvasPainted(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const canvas = document.querySelector(
      '.ol-viewport canvas',
    ) as HTMLCanvasElement | null
    if (!canvas) return false
    return canvas.width > 0 && canvas.height > 0
  })
}
