import { type Page, type Locator, expect } from '@playwright/test'
import { BaseComponent } from '~~/tests/e2e/components/base.component'

export class AppMapComponent extends BaseComponent {
  public readonly canvas: Locator

  constructor(page: Page) {
    super(page, 'app-map')
    this.canvas = this.container.locator('.ol-viewport canvas').first()
  }

  async expectCanvasToBeVisible() {
    await expect(this.canvas).toBeVisible()
  }

  async expectMapToHaveLayers(count: number) {
    const layerCount = await this.container.evaluate((el) => {
      const viewport = el.querySelector('.ol-viewport')
      if (!viewport) return 0
      return viewport.querySelectorAll('canvas').length
    })
    expect(layerCount).toBeGreaterThanOrEqual(count)
  }

  async getMapState(): Promise<{
    zoom: number | undefined
    center: number[] | undefined
    layerCount: number
  }> {
    return this.container.evaluate((el) => {
      const viewport = el.querySelector('.ol-viewport')
      if (!viewport) {
        return { zoom: undefined, center: undefined, layerCount: 0 }
      }
      const canvases = viewport.querySelectorAll('canvas')
      return {
        zoom: undefined,
        center: undefined,
        layerCount: canvases.length,
      }
    })
  }
}
