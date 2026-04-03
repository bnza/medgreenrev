import type { paths, ResourceConfig } from '~~/types'
import { RESOURCE_CONFIG_MAP } from '~/utils/consts/configs'

const useResourceConfig = <Path extends keyof paths>(path: Path) => {
  const { findApiResourcePath } = useOpenApiStore()

  const configKey =
    path in RESOURCE_CONFIG_MAP ? path : findApiResourcePath(path)

  if (!configKey) {
    throw new Error(`Unknown resource key for path ${path}`)
  }

  return {
    ...{ protectedFields: [] },
    ...RESOURCE_CONFIG_MAP[configKey as keyof typeof RESOURCE_CONFIG_MAP],
  } as Readonly<ResourceConfig>
}

export default useResourceConfig
