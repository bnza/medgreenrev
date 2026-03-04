<script setup lang="ts" generic="P extends GetFeatureCollectionPath">
import type { GetFeatureCollectionPath } from '~~/types'
import { GetExportFeatureCollectionOperation } from '~/api/operations/GetExportFeatureCollectionOperation'
import useCollectionQueryStore from '~/stores/useCollectionQueryStore'
import { API_FEATURES_RESOURCE_EXPORT_MAP } from '~/utils/consts/resources'
import useGetCollectionTotalItemQuery from '~/composables/queries/useGetCollectionTotalItemQuery'

const props = defineProps<{
  path: P
}>()

const mapVectorApiStore = useMapVectorApiStore(props.path)
const { isExportDialogOpen } = storeToRefs(mapVectorApiStore)

const formats = [
  { title: 'GeoJSON', value: 'geojson' },
  { title: 'Shapefile', value: 'shapefile' },
  { title: 'CSV', value: 'csv' },
  { title: 'KML', value: 'kml' },
  { title: 'GML3', value: 'gml3' },
]

const selectedFormat = ref('geojson')
const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

const apiPath = mapVectorApiStore.resourceConfig.apiPath

const { filterQueryObject } = storeToRefs(useCollectionQueryStore(apiPath))

const { totalItems, refetch } = useGetCollectionTotalItemQuery(apiPath)

const { addError, addSuccess } = useMessagesStore()

const download = async () => {
  status.value = 'pending'
  try {
    const exportPath = API_FEATURES_RESOURCE_EXPORT_MAP[props.path]
    const operation = new GetExportFeatureCollectionOperation(exportPath)
    const blob = await operation.request({
      query: {
        ...filterQueryObject.value,
        outputFormat: selectedFormat.value,
      },
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    const extensionMap: Record<string, string> = {
      geojson: 'geojson',
      shapefile: 'zip',
      csv: 'csv',
      kml: 'kml',
      gml3: 'gml',
    }
    const extension = extensionMap[selectedFormat.value] || selectedFormat.value
    const fileName = `${mapVectorApiStore.resourceConfig.labels[1]}-${
      new Date().toISOString().split('T')[0]
    }.${extension}`

    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    addSuccess('Download started successfully.')
    status.value = 'success'
    isExportDialogOpen.value = false
  } catch (e) {
    addError(e)
    status.value = 'error'
  }
}

const disabled = computed(
  () => totalItems.value === 0 || status.value === 'pending',
)
</script>

<template>
  <data-dialog
    v-if="isExportDialogOpen"
    :visible="isExportDialogOpen"
    :fullscreen="false"
    :title="`Download features (${mapVectorApiStore.resourceConfig.labels[1]})`"
    @update:visible="refetch()"
  >
    <template #default>
      <v-card-text style="min-height: 200px">
        <v-container v-if="status === 'pending'">
          <v-row align-content="center" class="fill-height" justify="center">
            <v-col class="text-subtitle-1 text-center" cols="12">
              Download in progress
            </v-col>
            <v-col cols="6">
              <v-progress-linear
                color="warning"
                height="6"
                indeterminate
                rounded
              />
            </v-col>
          </v-row>
        </v-container>
        <v-empty-state
          v-else-if="totalItems === 0"
          title="No items found"
          text="No items to download"
        />
        <v-container v-else>
          <v-row dense class="my-0 py-0 mx-4" justify="center">
            <v-col cols="12">
              <v-select
                v-model="selectedFormat"
                :items="formats"
                label="Output format"
                hide-details
                variant="outlined"
              />
            </v-col>
          </v-row>
          <v-row dense class="my-0 py-0 mx-4 pt-8 text-center" justify="center">
            Are you sure you want to download
          </v-row>
          <v-row
            dense
            class="my-0 pt-0 mx-4 text-center text-secondary font-weight-bold"
            justify="center"
          >
            {{ totalItems }}
          </v-row>
          <v-row dense class="my-0 pt-0 mx-4 text-center" justify="center">
            selected items?
          </v-row>
        </v-container>
      </v-card-text>
    </template>
    <template #actions>
      <layout-action-two-buttons>
        <template #left>
          <v-btn color="white" @click="isExportDialogOpen = false">close</v-btn>
        </template>
        <template #default>
          <v-btn :disabled :loading="status === 'pending'" @click="download">
            submit
          </v-btn>
        </template>
      </layout-action-two-buttons>
    </template>
  </data-dialog>
</template>
