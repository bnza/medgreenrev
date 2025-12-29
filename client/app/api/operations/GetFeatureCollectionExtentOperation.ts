import type {
  ApiRequestOptions,
  ExtentResponse,
  GetFeatureCollectionExtentPath,
} from '~~/types'
import { BaseOperation } from '~/api/operations/BaseOperation'

export class GetFeatureCollectionExtentOperation<
  P extends GetFeatureCollectionExtentPath,
> extends BaseOperation<P> {
  request(options?: ApiRequestOptions) {
    return this._request<ExtentResponse>(this.path, {
      ...options,
      method: 'get',
    })
  }
}
