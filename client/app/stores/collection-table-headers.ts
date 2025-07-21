import type { GetCollectionPath } from '~~/types'
import useResourceConfig from '~/stores/resource-config'

const useCollectionTableHeadersStore = <Path extends GetCollectionPath>(
  path: Path,
) => {
  return defineStore(`collection-table-headers:${path}`, () => {
    const config = useResourceConfig(path)

    const headers = computed(() => config.defaultHeaders)

    return {
      headers,
    }
  })()
}

export default useCollectionTableHeadersStore
