import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class PaleoclimateSamplingSiteCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/sites/paleoclimate-sampling'
  public readonly apiUrl = '/api/data/paleoclimate_sampling_sites'
}
