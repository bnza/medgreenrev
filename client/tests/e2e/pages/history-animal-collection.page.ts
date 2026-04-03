import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class HistoryAnimalCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/history/animals'
  public readonly apiUrl = '/api/data/history/animals'
}
