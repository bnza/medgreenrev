import {Api} from "~/api/Api";

export default defineNuxtPlugin({
  name: 'repositories',
  enforce: 'pre', // or 'post'
  async setup () {
    const api = new Api()
    return {
      provide: {
        api
      }
    }
  },
})
