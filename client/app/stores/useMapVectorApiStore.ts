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

    const markerOptions = ref<StyleCircleOptions>({
      radius: 4,
      fill: {
        color: 'green',
      },
      stroke: {
        color: 'white',
        width: 1,
      },
    })

    const mergeMarkerOptions = (
      options: Partial<StyleCircleOptions> | undefined,
    ) => {
      if (!options) return
      markerOptions.value.radius = options.radius ?? markerOptions.value.radius
      markerOptions.value.fill = {
        ...markerOptions.value.fill,
        ...(options.fill ?? {}),
      }
      markerOptions.value.stroke = {
        ...markerOptions.value.stroke,
        ...(options.stroke ?? {}),
      }
    }

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

    const resourcePath = computed(() => findApiResourcePath(path))

    const isResourcePath = (
      value: Ref<ApiResourcePath | undefined>,
    ): value is Ref<ApiResourcePath> => typeof value.value !== 'undefined'

    if (!isResourcePath(resourcePath)) {
      throw new Error(`Unknown resource key for path ${path}`)
    }

    const resourceConfig = useResourceConfig(resourcePath.value)

    return {
      visible,
      opacity,
      labelOptions,
      labelVisible,
      markerOptions,
      mergeMarkerOptions,
      isSettingsDialogOpen,
      resourceConfig,
      resourcePath,
    }
  })()
