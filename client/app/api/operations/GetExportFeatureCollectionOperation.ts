import type {
  ApiRequestOptions,
  GetExportFeatureCollectionPath,
} from '~~/types'
import { BaseOperation } from '~/api/operations/BaseOperation'

export class GetExportFeatureCollectionOperation<
  P extends GetExportFeatureCollectionPath,
> extends BaseOperation<P> {
  request(options?: ApiRequestOptions) {
    return this._request<Blob>(this.path, {
      ...options,
      method: 'get',
      responseType: 'blob',
    })
  }
}
