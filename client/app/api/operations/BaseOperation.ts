import type { ApiRequestOptions, OperationPathParams, paths } from '~~/types'
import qs from 'qs'

const { status, refresh } = useAuth()

export abstract class BaseOperation<P extends keyof paths> {
  public readonly baseURL: string
  getHeaders: (options: ApiRequestOptions) => Record<string, string>

  constructor(public readonly path: P) {
    const { baseURL, getHeaders } = useApiRequestOption()
    this.baseURL = baseURL
    this.getHeaders = getHeaders
  }

  protected expandUrlTemplate<M extends 'get' | 'patch' | 'delete' | 'post'>(
    _method: M,
    pathParams = {} as OperationPathParams<P, M>,
  ) {
    let finalPath = this.path as string
    if (pathParams && typeof pathParams === 'object') {
      Object.entries(pathParams).forEach(([key, value]) => {
        finalPath = finalPath.replace(`{${key}}`, String(value))
      })
    }
    return finalPath
  }

  protected async _request<T>(url: string, options: ApiRequestOptions = {}) {
    const {
      query,
      body,
      onResponseError: onResponseErrorOption,
      headers: _headers, // Exclude headers from restOptions
      ...restOptions
    } = options
    let finalUrl = url
    if (query) {
      const queryString = qs.stringify(query)

      if (queryString) {
        finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
      }
    }

    // Only serialize to JSON if it's not FormData or other special body types
    const processedBody =
      body &&
      typeof body === 'object' &&
      !(body instanceof FormData) &&
      !(body instanceof URLSearchParams) &&
      !(body instanceof Blob)
        ? JSON.stringify(body)
        : body

    const headers = this.getHeaders(options)
    return $fetch<T>(finalUrl, {
      baseURL: this.baseURL,
      headers,
      body: processedBody,
      ...restOptions,
      onResponseError: async (context) => {
        if (
          status.value === 'authenticated' &&
          context.response.status === 401
        ) {
          const responseData = context.response._data
          if (responseData?.message === 'Expired JWT Token') {
            console.log('Expired JWT Token. Refreshing')
            await refresh()
          }

          // Handle the possible MaybeArray<FetchHook> case
          if (onResponseErrorOption) {
            if (Array.isArray(onResponseErrorOption)) {
              // If it's an array, call all handlers
              await Promise.all(onResponseErrorOption.map((fn) => fn(context)))
            } else if (typeof onResponseErrorOption === 'function') {
              // If it's a single function, call it
              await onResponseErrorOption(context)
            }
          }
        }
      },
    })
  }
}
