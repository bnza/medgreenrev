import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'
export class AnalysisIndividualCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/analyses/individuals'
  public readonly apiUrl = '/api/data/analyses/individuals'
}
