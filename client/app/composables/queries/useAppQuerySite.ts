import useAppQuery from "~/composables/queries/useAppQuery";
import type {RepositoryPath} from "~/repositories/Api";
import type {PostCollectionRequestMap, PostCollectionResponseMap} from "~~/types";


export default function useAppQuerySite(resourcePath: RepositoryPath = '/api/sites') {
  const repository = useNuxtApp().$api.getRepository(resourcePath)
  const {useGetCollectionFn, getItemQuery, usePostCollectionMutationFn} = useAppQuery('/api/sites', repository)

  const useGetCollection = useGetCollectionFn({
    onRequest: (req) => {console.log('request')},
    onResponse: (res) => {console.log('response')}
  })

  const usePostCollection = usePostCollectionMutationFn()

  // const usePostCollection = defineMutation(() => {
  //   type A = PostCollectionResponseMap['/api/sites']
  //   const mutation = useMutation({
  //       mutation: (body: Record<string, any>) => repository.post({body}) as Promise<A>
  //     })
  //   return {
  //     mutation
  //   }
  // })

  return {
    useGetCollection,
    usePostCollection,
    getItemQuery
  }
}
