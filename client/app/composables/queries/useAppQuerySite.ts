import useAppQuery from "~/composables/queries/useAppQuery";
import type {RepositoryPath} from "~/api/Api";
import type {SiteRepository} from "~/api/repositories/SiteRepository";


export default function useAppQuerySite(resourcePath: RepositoryPath = '/api/sites') {
  const repository = useNuxtApp().$api.getRepository(resourcePath) as SiteRepository
  const {useGetCollectionFn, getItemQuery, usePostCollectionMutationFn, useDeleteItemMutationFn } = useAppQuery('/api/sites', repository)

  const useGetCollection = useGetCollectionFn({
    onRequest: (req) => {console.log('request')},
    onResponse: (res) => {console.log('response')}
  })

  const usePostCollection = usePostCollectionMutationFn()

  const useDeleteItem = useDeleteItemMutationFn()

  return {
    useDeleteItem,
    useGetCollection,
    usePostCollection,
    getItemQuery
  }
}
