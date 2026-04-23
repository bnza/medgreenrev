import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'
import { DataMediaObjectJoinContainerComponent } from '~~/tests/e2e/components/data-media-object-join-container'

export class PaleoclimateSampleItemPage extends BaseItemPage {
  protected readonly path = '/data/paleoclimate/samples/[id]'
  public readonly mediaContainer = new DataMediaObjectJoinContainerComponent(
    this.page,
    'media-object-join-container',
  )

  constructor(page: Page) {
    super(page, 'sample-action-menu')
  }
}
