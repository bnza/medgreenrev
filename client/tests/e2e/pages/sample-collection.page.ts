import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class SampleCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/samples'
  public readonly apiUrl = '/api/data/samples'
}
