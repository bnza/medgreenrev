import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class HistoryPlantCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/history/plants'
  public readonly apiUrl = '/api/data/history/plants'
}
