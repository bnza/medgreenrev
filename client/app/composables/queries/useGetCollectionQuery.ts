import type {
  DataTableComponentOptions,
  GetCollectionPath,
} from "~~/types";
import {GetCollectionOperation} from "~/api/operations/GetCollectionOperation";
import useAppQueryCache from "./useAppQueryCache";

const defaultPagination = () => ({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
}) as const as DataTableComponentOptions

export function useDefineGetCollectionQuery(path: GetCollectionPath) {
  const getCollectionOperation = new GetCollectionOperation(path)

  const {RESOURCE_QUERY_KEY} = useAppQueryCache(path)

  const queryOptions = (query: Record<string, any>) =>
    defineQueryOptions({
      key: RESOURCE_QUERY_KEY.byFilter(query),
      query: () => getCollectionOperation.request(query),
    })

  const useGetCollection = defineQuery(() => {
    const pagination = reactive(defaultPagination())
    const query = useQuery(queryOptions, () => ({
      pagination
    }))

    const items = computed(() => query.data.value?.member ?? [])
    const totalItems = computed(() => query.data.value?.totalItems ?? 0)
    return {
      items,
      ...query,
      totalItems,
      pagination
    }
  })

  return {
    useGetCollection,
  }
}

export default useDefineGetCollectionQuery

