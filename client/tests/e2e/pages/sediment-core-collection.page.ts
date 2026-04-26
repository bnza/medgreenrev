import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class SedimentCoreCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/sediment-cores'
  public readonly apiUrl = '/api/data/sediment_cores'
}
