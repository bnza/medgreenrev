import type { paths } from '~~/types'
import { RESOURCE_CONFIG_MAP } from '~/utils/consts/configs'

const useResourceConfig = <Path extends keyof paths>(path: Path) => {
  return defineStore(`resource-config:${path}`, () => {
    const { findApiResourcePath } = useOpenApiStore()

    const configKey =
      path in RESOURCE_CONFIG_MAP ? path : findApiResourcePath(path)

    if (!configKey) {
      throw new Error(`Unknown resource key for path ${path}`)
    }

    if (configKey in RESOURCE_CONFIG_MAP) {
      return {
        ...{ protectedFields: [] },
        ...RESOURCE_CONFIG_MAP[configKey as keyof typeof RESOURCE_CONFIG_MAP],
      }
    }

    throw new Error(`Unknown resource config for key ${configKey}`)
  })()
}

export default useResourceConfig
