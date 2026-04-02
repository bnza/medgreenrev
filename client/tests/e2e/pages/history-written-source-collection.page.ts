import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class HistoryWrittenSourceCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/history/written-sources'
  public readonly apiUrl = '/api/data/history/written_sources'
}
