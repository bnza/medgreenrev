import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class AnalysisCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/analyses'
  public readonly apiUrl = '/api/data/analyses'
}
