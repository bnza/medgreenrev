<script setup lang="ts" generic="P extends MediaObjectGetCollectionPath">
import type {
  DeleteItemPath,
  GetItemResponseMap,
  Iri,
  MediaObjectGetCollectionPath,
  PostCollectionPath,
} from '~~/types'
import {
  mediaObjectJoinInjectionKey,
  useMediaObjectJoin,
} from '~/composables/injection/useMediaObjectJoin'

const props = defineProps<{
  path: P
  postPath: MediaObjectGetCollectionPath & PostCollectionPath
  deletePath: `${MediaObjectGetCollectionPath}/{id}` & DeleteItemPath
  parentIri: Iri
  canUpdate: boolean
}>()

const pathParams = computed(() =>
  isValidIri(props.parentIri)
    ? { parentId: extractIdFromIri(props.parentIri) }
    : undefined,
)

const { items, refetch } = useGetCollectionQuery(props.path, pathParams)

const isValidItem = (
  item: unknown,
): item is {
  '@id': Iri
  mediaObject: GetItemResponseMap['/api/data/media_objects/{id}']
} => {
  return (
    isPlainObject(item) &&
    '@id' in item &&
    'mediaObject' in item &&
    isPlainObject(item.mediaObject)
  )
}

const mediaObjectJoin = useMediaObjectJoin(toRef(props.parentIri))

provide(mediaObjectJoinInjectionKey, mediaObjectJoin)

const { deletingMediaObjectJoinItem, isCreateDialogOpen } = mediaObjectJoin
</script>

<template>
  <v-container fluid data-testid="media-object-join-container">
    <data-media-object-join-dialog-create
      :path="postPath"
      :parent-iri
      @refresh="refetch()"
    />
    <data-media-object-join-dialog-delete
      v-model="deletingMediaObjectJoinItem"
      :path="deletePath"
      @refresh="refetch()"
    />
    <v-row dense justify="end" style="min-height: 48px">
      <v-col cols="1" xs="1">
        <v-btn
          v-if="canUpdate"
          class="mr-4"
          density="compact"
          :icon="true"
          variant="text"
          data-testid="create-media-button"
          @click="isCreateDialogOpen = true"
        >
          <v-icon icon="fa fa-plus" size="large" />
          <v-tooltip activator="parent" location="bottom"
            >Add media association</v-tooltip
          >
        </v-btn></v-col
      >
    </v-row>
    <v-row v-if="items.length > 0" no-gutters>
      <v-col
        v-for="item of items"
        :key="item['@id']"
        cols="12"
        sm="6"
        md="4"
        lg="2"
      >
        <data-media-object-card
          v-if="isValidItem(item)"
          v-model="deletingMediaObjectJoinItem"
          :item
          :can-update
        />
      </v-col>
    </v-row>
    <v-row
      v-else
      no-gutters
      justify="center"
      align="center"
      style="height: 200px"
    >
      <v-empty-state>
        <template #text>
          <p class="text-body-2 text-grey-lighten-1 pa-1">
            No media association found
          </p>
        </template>
      </v-empty-state>
    </v-row>
  </v-container>
</template>
