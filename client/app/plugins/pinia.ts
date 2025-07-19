// plugins/pinia.client.ts
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia()
  nuxtApp.vueApp.use(pinia)
  nuxtApp.vueApp.use(PiniaColada)
})
