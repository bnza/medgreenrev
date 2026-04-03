import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class SamplingSiteCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/sites/sampling'
  public readonly apiUrl = '/api/data/sampling_sites'
}
