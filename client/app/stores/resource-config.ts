import type { paths } from '~~/types'
import { RESOURCE_CONFIG_MAP } from '~/utils/consts/configs'

const useResourceConfig = <Path extends keyof paths>(path: Path) => {
  return defineStore(`resource-config:${path}`, () => {
    const { findApiResourcePath } = useOpenApiStore()

    // Check if the given path exists as a key of RESOURCE_CONFIG_MAP
    // If not, apply findApiResourcePath(path) to normalize the path
    let configKey: string | undefined
    if (path in RESOURCE_CONFIG_MAP) {
      configKey = path
    } else {
      configKey = findApiResourcePath(path)
    }

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
