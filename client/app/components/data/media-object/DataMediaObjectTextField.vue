<script setup lang="ts">
import type { Iri } from '~~/types'
import {
  mediaObjectJoinInjectionKey,
  useMediaObjectJoin,
} from '~/composables/injection/useMediaObjectJoin'

const model = defineModel<string | null | undefined>({ required: true })

const itemIri = computed(() => model.value as Iri)

const mediaObjectJoin = useMediaObjectJoin(itemIri)

provide(mediaObjectJoinInjectionKey, mediaObjectJoin)

const params = computed(() =>
  model.value ? { id: extractIdFromIri(itemIri.value) } : undefined,
)

const { data: mediaObject } = useGetItemQuery(
  '/api/data/media_objects/{id}',
  params,
)

defineProps<{ readonly: boolean }>()

const dataMediaObjectDialogCreatVisible = ref(false)
</script>

<template>
  <v-text-field :model-value="mediaObject?.mimeType" readonly flat>
    <template v-if="!readonly" #prepend-inner>
      <v-icon
        icon="fa fa-upload"
        size="small"
        @click="dataMediaObjectDialogCreatVisible = true"
      >
        <v-tooltip activator="parent" location="bottom"> select </v-tooltip>
      </v-icon>
      <data-media-object-dialog-create
        v-model:visible="dataMediaObjectDialogCreatVisible"
        @sync="model = $event?.['@id']"
      />
    </template>
    <template v-if="!readonly" #clear>
      <v-icon icon="fa fa-circle-xmark" size="small" @click="model = null">
        <v-tooltip activator="parent" location="bottom"> clear </v-tooltip>
      </v-icon>
    </template>
  </v-text-field>
</template>
