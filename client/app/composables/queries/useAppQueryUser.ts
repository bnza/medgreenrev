import useAppQuery from "~/composables/queries/useAppQuery";
import type {RepositoryPath} from "~/repositories/Api";


export default function useAppQueryUser(resourcePath: RepositoryPath = '/api/users') {
  const repository = useNuxtApp().$api.getRepository(resourcePath)
  const {useGetCollectionFn, getItemQuery} = useAppQuery('/api/users', repository)

  const useGetCollection = useGetCollectionFn({
    onRequest: () => {console.log('request')},
    onResponse: () => {console.log('response')}
  })

  return {
    useGetCollection,
    getItemQuery
  }
}
