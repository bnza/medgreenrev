import type {
  ApiRequestOptions,
  DataTableComponentOptions,
  GetCollectionPath,
  GetItemPath,
  OperationPathParams, PostCollectionPath
} from "~~/types";
import type {RepositoryPath} from "~/repositories/Api";
import type {ApiResourcePath} from "~/utils/consts/resources";
import type {BaseApiRepository} from "~/repositories/BaseApiRepository";

const defaultPaginationFn = () => ({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
}) as const as DataTableComponentOptions

type QueryRootKey = RepositoryPath | ApiResourcePath
export default function useAppQuery<
  TCollection extends GetCollectionPath,
  TItem extends GetItemPath,
  TPost extends PostCollectionPath
>(
  rootKey: QueryRootKey,
  repository: BaseApiRepository<TCollection, TItem, TPost>
) {

  const {invalidateQueries} = useQueryCache()


  const QUERY_KEYS = {
    root: [rootKey] as const,
  } as const

  const RESOURCE_QUERY_KEY = {
    root: [rootKey, repository.resourcePath ] as const,
    byFilter: (query?: Record<string, any>) => [...RESOURCE_QUERY_KEY.root, query || {} ] as const,
    byId: (params: Record<string, string> ) => [...RESOURCE_QUERY_KEY.root, params ] as const,
  }

  const getCollectionFn = (options: ApiRequestOptions = {}) => (query: Record<string, any>) =>
    defineQueryOptions({
      key: RESOURCE_QUERY_KEY.byFilter(query),
      query: () => repository.getCollection({...options, query}),
    })

  const useGetCollectionFn = (options: ApiRequestOptions = {}) => {
    const getCollection = getCollectionFn(options)
    return defineQuery(() => {
      const pagination = reactive(defaultPaginationFn())
      const filter = ref({})
      const query = computed(() => ({
        ...dataTableOptionsToQsObject(pagination),
        ...filter.value})
      )
      const response = useQuery(getCollection, () => query.value)

      const items = computed(() => response.data.value?.member ?? [])
      const totalItems = computed(() => response.data.value?.totalItems ?? 0)
      return {
        items,
        ...response,
        totalItems,
        pagination,
        filter
      }
  })}
  const getItemQuery = (params: OperationPathParams<TItem, 'get'>) =>
    defineQueryOptions({
      key: RESOURCE_QUERY_KEY.byId(params as Record<string, string>),
      query: () => repository.getItem(params),
      enabled: Boolean(params),
    })

  const usePostCollectionMutationFn = () => defineMutation(() => {
    const mutation = useMutation({
      mutation: (item: Record<string, any>) => repository.post({body: item}),
      onSuccess: () => invalidateQueries({
        key: RESOURCE_QUERY_KEY.byFilter()
      }, "all")
    })
    return {
      mutation
    }
  })

  return {
    QUERY_KEYS,
    RESOURCE_QUERY_KEY,
    defaultPaginationFn,
    getItemQuery,
    useGetCollectionFn,
    usePostCollectionMutationFn
  }
}
