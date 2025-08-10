import type { ApiRequestOptions, OperationPathParams, paths } from '~~/types'
import qs from 'qs'

const { signOut, status } = useAuth()
const { add: addMessage } = useMessagesStore()

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
      ...restOptions
    } = options
    let finalUrl = url
    if (query) {
      const queryString = qs.stringify(query)

      if (queryString) {
        finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
      }
    }

    // Serialize body to JSON string if it's an object
    const processedBody =
      body && typeof body === 'object' ? JSON.stringify(body) : body

    return $fetch<T>(finalUrl, {
      baseURL: this.baseURL,
      headers: this.getHeaders(options),
      body: processedBody,
      ...restOptions,
      onResponseError: async (context) => {
        // Your existing error handling
        if (
          status.value === 'authenticated' &&
          context.response.status === 401
        ) {
          const responseData = context.response._data
          if (responseData?.message === 'Expired JWT Token') {
            addMessage({
              text: 'Session expired. Please login again.',
              color: 'warning',
              timeout: 0,
            })
            await signOut({ callbackUrl: 'login', redirect: true })
          }
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
      },
    })
  }
}
