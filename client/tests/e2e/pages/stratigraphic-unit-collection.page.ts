import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class StratigraphicUnitCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/stratigraphic-units/archaeology'
  public readonly apiUrl = '/api/data/stratigraphic_units'
}
