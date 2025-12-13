import type { FeatureCollection } from 'geojson'
import type { ApiRequestOptions, GetFeatureCollectionPath } from '~~/types'
import { BaseOperation } from '~/api/operations/BaseOperation'

export class GetFeatureCollectionOperation<
  P extends GetFeatureCollectionPath,
> extends BaseOperation<P> {
  request(options?: ApiRequestOptions) {
    const _options = {
      ...{ headers: { Accept: 'application/geo+json' } },
      ...options,
    }
    return this._request<FeatureCollection>(this.path, {
      ..._options,
      method: 'get',
    })
  }
}
