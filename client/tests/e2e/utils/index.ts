import type { Locator } from '@playwright/test'
import path from 'path'

export enum NavigationLinksButton {
  Delete = 'delete-item-button',
  Read = 'read-item-button',
  Update = 'update-item-button',
}
export const isInViewport = async (element: Locator) => {
  const viewportSize = element.page().viewportSize()
  const boundingBox = await element.boundingBox()

  if (!viewportSize || !boundingBox) {
    return false
  }

  const isBoundingBoxVisible = boundingBox.x >= 0 && boundingBox.y >= 0
  const isBoundingBoxInViewport =
    boundingBox.x + boundingBox.width <= viewportSize.width &&
    boundingBox.y + boundingBox.height <= viewportSize.height

  return isBoundingBoxVisible && isBoundingBoxInViewport
}

export function getFixturePath(relativePath: string): string {
  return path.join(process.cwd(), 'tests/fixtures', relativePath)
}
