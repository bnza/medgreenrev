import type {ApiPath, ApiRequestOptions, OperationPathParams} from "~~/types";
import qs from "qs";

export abstract class BaseOperation {
  public readonly baseURL: string
  getHeaders: (options: ApiRequestOptions) => Record<string, string>

  protected constructor() {
    const {baseURL, getHeaders} = useApiRequestOption()
    this.baseURL = baseURL
    this.getHeaders = getHeaders
  }

  protected getItemPath<P extends ApiPath, M extends 'get' | 'patch' | 'delete'>(
    path: P,
    method: M,
    pathParams: OperationPathParams<P, M>
  ) {
    let finalPath = path as string;
    if (pathParams && typeof pathParams === 'object') {
      Object.entries(pathParams).forEach(([key, value]) => {
        finalPath = finalPath.replace(`{${key}}`, String(value));
      });
    }
    return finalPath
  }

  protected async _request<T>(
    url: string,
    options: ApiRequestOptions = {}
  ) {
    const {headers, query, body, ...restOptions} = options
    let finalUrl = url;
    if (query) {
      const queryString = qs.stringify(query, {
        arrayFormat: 'brackets',
      });

      if (queryString) {
        finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
      }
    }

    // Serialize body to JSON string if it's an object
    const processedBody = body && typeof body === 'object' ? JSON.stringify(body) : body;

    return $fetch<T>(finalUrl, {
      baseURL: this.baseURL,
      headers: this.getHeaders(options),
      body: processedBody,
      ...restOptions,
    })
  }
}
