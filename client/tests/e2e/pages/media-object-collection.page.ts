import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class MediaObjectCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/media'

  public readonly fileInput =
    this.dataDialogCreate.container.locator('input[type="file"]')
}
