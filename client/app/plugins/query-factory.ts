import {RepositoryQueryFactory} from "~/api/RepositoryQueryFactory";

export default defineNuxtPlugin({
  name: 'query-factory',
  dependsOn: ['repositories'],
  enforce: 'pre', // or 'post'
  async setup () {
    const queryFactory = new RepositoryQueryFactory()
    return {
      provide: {
        queryFactory
      }
    }
  },
})
