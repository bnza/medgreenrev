import {Api} from "~/repositories/Api";

export default defineNuxtPlugin({
  name: 'repositories',
  enforce: 'pre', // or 'post'
  async setup (nuxtApp) {
    const api = new Api()
    return {
      provide: {
        api
      }
    }
  },
})
