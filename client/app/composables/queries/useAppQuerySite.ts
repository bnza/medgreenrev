import useAppQuery from "~/composables/queries/useAppQuery";
import type {RepositoryPath} from "~/api/Api";


export default function useAppQuerySite(resourcePath: RepositoryPath = '/api/sites') {
  const repository = useNuxtApp().$api.getRepository(resourcePath)
  const {useGetCollectionFn, getItemQuery, usePostCollectionMutationFn} = useAppQuery('/api/sites', repository)

  const useGetCollection = useGetCollectionFn({
    onRequest: (req) => {console.log('request')},
    onResponse: (res) => {console.log('response')}
  })

  const usePostCollection = usePostCollectionMutationFn()

  return {
    useGetCollection,
    usePostCollection,
    getItemQuery
  }
}
