import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class PaleoclimateSampleCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/paleoclimate/samples'
  public readonly apiUrl = '/api/data/paleoclimate_samples'
}
