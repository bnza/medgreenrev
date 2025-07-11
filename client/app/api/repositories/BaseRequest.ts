import type {ApiRequestOptions} from "~~/types";
import qs from "qs";

export abstract class BaseRequest {
  public readonly baseURL: string
  getHeaders: (options: ApiRequestOptions) => Record<string, string>

  protected constructor() {
    const {baseURL, getHeaders} = useApiRequestOption()
    this.baseURL = baseURL
    this.getHeaders = getHeaders
  }

  protected async _request<T>(
    url: string,
    options: ApiRequestOptions = {}
  ) {
    const {headers, query,  ...restOptions} = options
    let finalUrl = url;
    if (query) {
      const queryString = qs.stringify(query, {
        arrayFormat: 'brackets',
      });

      if (queryString) {
        finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
      }
    }
    return $fetch<T>(finalUrl, {
      baseURL: this.baseURL,
      headers: this.getHeaders(options),
      ...restOptions,
    })
  }
}
