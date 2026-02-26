import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class SiteCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/sites/archaeology'
  public readonly apiUrl = '/api/data/archaeological_sites'
}
