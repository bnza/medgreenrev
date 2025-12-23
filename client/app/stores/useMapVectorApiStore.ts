import type { ApiResourcePath, GetFeatureCollectionPath } from '~~/types'
import type { TextLabelOptions } from '~/utils/map'

export const useMapVectorApiStore = <P extends GetFeatureCollectionPath>(
  path: P,
) =>
  defineStore(`map-vector-api:${path}`, () => {
    const visible = ref(true)
    const opacity = ref(100)
    const labelOptions: Ref<TextLabelOptions> = ref({
      labelProperty: 'value',
      visible: false,
    })

    const isSettingsDialogOpen = ref(false)

    const labelVisible = computed<boolean>({
      get: () => {
        return labelOptions.value.visible
      },
      set: (value: boolean) => {
        labelOptions.value = { ...labelOptions.value, visible: value }
      },
    })

    const { findApiResourcePath } = useOpenApiStore()

    const resourceKey = findApiResourcePath(path)

    const isResourceConfig = (
      value: ApiResourcePath | undefined,
    ): value is ApiResourcePath => typeof value !== 'undefined'

    if (!isResourceConfig(resourceKey)) {
      throw new Error(`Unknown resource key for path ${path}`)
    }

    const resourceConfig = useResourceConfig(resourceKey)

    return {
      visible,
      opacity,
      labelOptions,
      labelVisible,
      isSettingsDialogOpen,
      resourceConfig,
    }
  })()
