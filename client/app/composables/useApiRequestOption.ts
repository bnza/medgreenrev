import type { ApiRequestOptions } from '~~/types'

function normalizeHeaders(headers?: HeadersInit): Record<string, string> {
  if (!headers) {
    return {}
  }

  if (
    typeof headers === 'object' &&
    !Array.isArray(headers) &&
    !(headers instanceof Headers)
  ) {
    return headers as Record<string, string>
  }

  if (headers instanceof Headers) {
    const result: Record<string, string> = {}
    headers.forEach((value, key) => {
      result[key] = value
    })
    return result
  }

  if (Array.isArray(headers)) {
    const result: Record<string, string> = {}
    headers.forEach(([key, value]) => {
      result[key] = value
    })
    return result
  }

  throw new Error('Invalid headers')
}

export default function useApiRequestOption() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl

  const { token } = useAuth()

  const defaultHeaders = computed(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/ld+json',
      Accept: 'application/ld+json',
    }
    if (token.value) {
      headers['Authorization'] = token.value
    }
    return headers
  })

  const getHeaders = (options?: ApiRequestOptions) => {
    const headers = defaultHeaders.value
    if (!options) {
      return headers
    }
    const { headers: optionHeaders, ...restOptions } = options

    const normalizedHeaders = normalizeHeaders(optionHeaders || {})

    if (
      options?.method?.toLowerCase() === 'patch' &&
      normalizedHeaders['Content-Type'] !== 'application/merge-patch+json'
    ) {
      normalizedHeaders['Content-Type'] = 'application/merge-patch+json'
    }
    return { ...headers, ...normalizedHeaders }
  }

  return {
    baseURL,
    getHeaders,
  }
}
