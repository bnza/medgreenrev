import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class HistoryLocationCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/history/locations'
  public readonly apiUrl = '/api/data/vocabulary/history/locations'
}
