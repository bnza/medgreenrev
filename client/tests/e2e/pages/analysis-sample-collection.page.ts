import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'
export class AnalysisSampleCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/analyses/samples'
  public readonly apiUrl = '/api/data/analyses/samples'
}
