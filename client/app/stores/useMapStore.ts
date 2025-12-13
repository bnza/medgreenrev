export const useMapStore = defineStore('map', () => {
  const center = ref([-28000, 4660000])
  const zoom = ref(6)
  const rotation = ref(0)
  const projection = ref('EPSG:3857')

  const extentArray = ref<number[] | null>(null)
  const bboxString = computed<string | null>(() =>
    extentArray.value
      ? extentArray.value.join(',') + ',' + projection.value.match(/\d+/)?.[0]
      : null,
  )

  function updateBbox(extent: number[]) {
    extentArray.value = [...extent]
  }

  function updateView(
    newCenter?: number[],
    newZoom?: number,
    newRotation?: number,
  ) {
    if (newCenter) center.value = [...newCenter]
    if (newZoom !== undefined) zoom.value = newZoom
    if (newRotation !== undefined) rotation.value = newRotation
  }

  return {
    // State
    center,
    zoom,
    rotation,
    projection,
    extentArray,
    bboxString,

    // Actions
    updateBbox,
    updateView,
  }
})
