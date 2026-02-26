import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class SamplingStratigraphicUnitCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/stratigraphic-units/sampling'
  public readonly apiUrl = '/api/data/sampling_stratigraphic_units'
}
