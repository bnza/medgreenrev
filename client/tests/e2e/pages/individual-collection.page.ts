import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class IndividualCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/individuals'
  public readonly apiUrl = '/api/data/individuals'
}
