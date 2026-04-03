import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class HistoryWrittenSourceCitedWorkCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/history/written-sources/cited-works'
  public readonly apiUrl = '/api/data/history/written_sources_cited_works'
}
