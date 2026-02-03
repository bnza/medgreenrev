<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'

const path = '/api/data/stratigraphic_units/{id}' as const

const { tab } = storeToRefs(
  useResourceUiStore(path, ['description', 'chronology']),
)

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="code">
    <template #default="{ item }">
      <lazy-data-item-form-info-stratigraphic-unit :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="data">data</v-tab>
        <v-tab value="relationships">relationships</v-tab>
        <v-tab value="contexts">contexts</v-tab>
        <v-tab value="samples">samples</v-tab>
        <v-tab value="mus">MUs</v-tab>
        <v-tab value="individuals">individuals</v-tab>
        <v-tab value="potteries">potteries</v-tab>
        <v-tab value="core-depths">core (depths)</v-tab>
        <v-tab value="botany-charcoals">botany (charcoals)</v-tab>
        <v-tab value="botany-seeds">botany (seeds)</v-tab>
        <v-tab value="zoo-bones">zoo (bones)</v-tab>
        <v-tab value="zoo-teeth">zoo (teeth)</v-tab>
        <v-tab value="media">media</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab" class="w-100 h-100">
        <v-tabs-window-item value="data" data-testid="tab-window-data">
          <data-item-form-detail-stratigraphic-unit :item />
        </v-tabs-window-item>
        <v-tabs-window-item
          value="relationships"
          data-testid="tab-relationships"
        >
          <data-su-relationship-container :lft-su="item" />
        </v-tabs-window-item>
        <v-tabs-window-item value="contexts" data-testid="tab-contexts">
          <data-collection-page-join-context-stratigraphic-unit
            path="/api/data/stratigraphic_units/{parentId}/contexts"
            :parent="{
              key: 'stratigraphicUnit',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="samples" data-testid="tab-samples">
          <data-collection-page-join-sample-stratigraphic-unit
            path="/api/data/stratigraphic_units/{parentId}/samples"
            :parent="{
              key: 'stratigraphicUnit',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="core-depths" data-testid="tab-core-depths">
          <data-collection-page-sediment-core-depth
            path="/api/data/stratigraphic_units/{parentId}/sediment_cores/depths"
            :parent="{
              key: 'stratigraphicUnit',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="mus" data-testid="tab-mus">
          <data-collection-page-microstratigraphic-unit
            path="/api/data/stratigraphic_units/{parentId}/microstratigraphic_units"
            :parent="{
              key: 'stratigraphicUnit',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="individuals" data-testid="tab-individuals">
          <data-collection-page-individual
            path="/api/data/stratigraphic_units/{parentId}/individuals"
            :parent="{
              key: 'stratigraphicUnit',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="potteries" data-testid="tab-potteries">
          <data-collection-page-pottery
            path="/api/data/stratigraphic_units/{parentId}/potteries"
            :parent="{
              key: 'stratigraphicUnit',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item
          value="botany-charcoals"
          data-testid="tab-botany-charcoals"
        >
          <data-collection-page-botany-charcoal
            path="/api/data/stratigraphic_units/{parentId}/botany/charcoals"
            :parent="{
              key: 'stratigraphicUnit',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="botany-seeds" data-testid="tab-botany-seeds">
          <data-collection-page-botany-seed
            path="/api/data/stratigraphic_units/{parentId}/botany/seeds"
            :parent="{
              key: 'stratigraphicUnit',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="media" data-testid="tab-media">
          <data-media-object-join-container
            path="/api/data/stratigraphic_units/{parentId}/media_objects"
            post-path="/api/data/media_object_stratigraphic_units"
            delete-path="/api/data/media_object_stratigraphic_units/{id}"
            :parent-iri="item['@id']!"
            :can-update="item._acl?.canUpdate"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="zoo-bones" data-testid="tab-zoo-bones">
          <data-collection-page-zoo-bone
            path="/api/data/stratigraphic_units/{parentId}/zoo/bones"
            :parent="{
              key: 'stratigraphicUnit',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="zoo-teeth" data-testid="tab-zoo-teeth">
          <data-collection-page-zoo-tooth
            path="/api/data/stratigraphic_units/{parentId}/zoo/teeth"
            :parent="{
              key: 'stratigraphicUnit',
              item,
            }"
          />
        </v-tabs-window-item>
        <v-tabs-window-item value="media" data-testid="tab-media">
          <data-media-object-join-container
            path="/api/data/stratigraphic_units/{parentId}/media_objects"
            post-path="/api/data/media_object_stratigraphic_units"
            delete-path="/api/data/media_object_stratigraphic_units/{id}"
            :parent-iri="item['@id']!"
            :can-update="item._acl?.canUpdate"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-stratigraphic-unit
        @refresh="redirectToCollectionPath()"
      />
      <data-dialog-update-stratigraphic-unit @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
