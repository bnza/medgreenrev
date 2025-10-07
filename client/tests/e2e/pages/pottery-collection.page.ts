import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'

export class PotteryCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/potteries'
  public readonly apiUrl = '/api/data/potteries'
}
