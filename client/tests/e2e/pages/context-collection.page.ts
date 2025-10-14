import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class ContextCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/contexts'
  public readonly apiUrl = '/api/data/contexts'
}
