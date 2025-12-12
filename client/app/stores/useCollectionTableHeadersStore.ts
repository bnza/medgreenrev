import type { GetCollectionPath } from '~~/types'

const useCollectionTableHeadersStore = <Path extends GetCollectionPath>(
  path: Path,
) => {
  return defineStore(`collection-table-headers:${path}`, () => {
    const { isAuthenticated } = useAppAuth()
    const { defaultHeaders, protectedFields } = useResourceConfig(path)

    const headers = computed(() =>
      isAuthenticated.value
        ? defaultHeaders
        : defaultHeaders.filter(
            (header) => protectedFields?.includes(header.value) === false,
          ),
    )

    return {
      headers,
    }
  })()
}

export default useCollectionTableHeadersStore
