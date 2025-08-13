<script setup lang="ts">
import { VForm } from 'vuetify/components'
import type { GetItemResponseMap } from '~~/types'

const props = defineProps<{
  file: File
  onClickRemove: () => void
  errors?: string[]
}>()

const sha256 = ref<string>()
const params = computed(() =>
  sha256.value ? { sha256: sha256.value } : undefined,
)
const { data: mediaObject } = useGetItemQuery(
  '/api/data/media_objects/{sha256}',
  params,
)

watch(
  () => props.file,
  async (file) => {
    sha256.value = file ? await calculateSHA256FileHash(file) : undefined
  },
  { immediate: true },
)

const emit = defineEmits<{
  found: [string | undefined]
}>()

watch(
  () => mediaObject.value,
  (value) => {
    emit('found', value?.['@id'])
  },
)

const clear = () => {
  emit('found', undefined)
  props.onClickRemove()
}

const isValidItem = (
  value: unknown,
): value is GetItemResponseMap['/api/data/media_objects/{sha256}'] =>
  isPlainObject(value)
</script>

<template>
  <v-list-item variant="outlined" rounded v-bind="props" class="pa-2">
    <template #default>
      <v-list-item-title class="pl-8">{{ file.name }}</v-list-item-title>
      <v-list-item-subtitle class="pl-8">{{ file.type }}</v-list-item-subtitle>
      <v-form v-if="isValidItem(mediaObject)" ref="form" class="d-flex">
        <v-container fluid>
          <v-row dense class="mb-4">
            <v-col cols="12" sm="6">
              <v-sheet color="info" rounded>
                <v-container fluid>
                  <v-icon icon="fas fa-info-circle" color="primary" />
                  <span class="ml-2 text-primary"
                    >Media already archived. You can anyway proceed to associate
                    it</span
                  >
                </v-container>
              </v-sheet>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                :model-value="mediaObject?.originalFilename"
                density="compact"
                label="filename"
                variant="solo-filled"
                flat
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="3">
              <v-text-field
                :model-value="mediaObject?.type?.group"
                density="compact"
                label="group"
                variant="solo-filled"
                flat
              />
            </v-col>
            <v-col cols="12" sm="3">
              <v-text-field
                :model-value="mediaObject?.type?.value"
                density="compact"
                label="type"
                variant="solo-filled"
                flat
              />
            </v-col>
            <v-spacer />
            <v-col cols="12" sm="3">
              <v-text-field
                :model-value="mediaObject?.sha256"
                density="compact"
                label="hash"
                variant="solo-filled"
                flat
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-textarea
                :model-value="mediaObject?.description"
                density="compact"
                label="description"
                variant="solo-filled"
                flat
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </template>
    <template #append>
      <v-btn
        class="mx-8"
        rounded="circle"
        size="x-small"
        icon="fas fa-close"
        @click="clear()"
      />
    </template>
  </v-list-item>
</template>
