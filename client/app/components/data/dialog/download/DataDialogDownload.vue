<script setup lang="ts" generic="P extends GetCollectionPath">
import type { GetCollectionPath, OperationPathParams } from '~~/types'
import { useCollectionDownload } from '~/composables/useCollectionDownload'

const props = defineProps<{
  path: P
  title: string
  parentId?: string
}>()

const { visible, params } = storeToRefs(
  useResourceDownloadDialogStore(props.path),
)

watch(
  () => props.parentId,
  (parentId) => {
    if (parentId) {
      // More defensive approach - only set if the path actually expects a parentId
      if (props.path.includes('{parentId}')) {
        params.value = { parentId } as OperationPathParams<P, 'get'>
      }
    } else {
      params.value = undefined
    }
  },
  { immediate: true },
)

const { totalItems, status, downloadAndFeedback } = useCollectionDownload(
  props.title,
  props.path,
  params,
)
const disabled = computed(
  () => totalItems.value === 0 || status.value === 'pending',
)

const submit = async () => {
  if (disabled.value) {
    return
  }
  await downloadAndFeedback()
  visible.value = false
}
</script>

<template>
  <data-dialog
    v-if="visible"
    data-testid="data-dialog-update"
    :fullscreen="false"
    :visible
    :title="`Download (${title})`"
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
          <v-row class="mx-4 pt-4" justify="center">
            <v-spacer />
            <v-col cols="12" sm="2">
              <v-icon icon="fas fa-circle-info" size="large" color="info" />
            </v-col>
            <v-spacer />
          </v-row>
          <v-row dense class="my-0 py-0 mx-4 pt-8 text-center" justify="center">
            Are you sure you want to download
          </v-row>
          <v-row
            data-testid="download-resource-total-items"
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
          <v-btn color="white" @click="visible = false">close</v-btn>
        </template>
        <template #default>
          <v-btn :disabled @click="submit">submit</v-btn>
        </template>
      </layout-action-two-buttons>
    </template>
  </data-dialog>
</template>
