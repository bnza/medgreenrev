import type { OpenAPIV3_1 } from 'openapi-types'

export default defineNuxtPlugin({
  name: 'openapi',
  // enforce: 'pre', // or 'post'
  async setup(nuxtApp) {
    const { addError } = useMessagesStore()
    await $fetch<OpenAPIV3_1.Document>('/api/docs.jsonopenapi', {
      baseURL: nuxtApp.$config.public.apiBaseUrl,
    })
      .then((response) => useOpenApiStore(response))
      .catch((e) => {
        console.error('miao', e)
        addError('Failed to fetch API spec')
      })
  },
})
