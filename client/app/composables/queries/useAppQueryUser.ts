import useAppQuery from "~/composables/queries/useAppQuery";
import type {RepositoryPath} from "~/api/Api";


export default function useAppQueryUser(resourcePath: RepositoryPath = '/api/users') {
  const repository = useNuxtApp().$api.getRepository(resourcePath)
  const {useGetCollectionFn, getItemQuery, usePostCollectionMutationFn, useDeleteItemMutationFn} = useAppQuery('/api/users', repository)

  const useGetCollection = useGetCollectionFn({
    onRequest: () => {console.log('request')},
    onResponse: () => {console.log('response')}
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
