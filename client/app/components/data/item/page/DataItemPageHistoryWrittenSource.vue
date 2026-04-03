<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'

const path = '/api/data/history/written_sources/{id}' as const

const { tab } = storeToRefs(useResourceUiStore(path))

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="id">
    <template #default="{ item }">
      <lazy-data-item-form-info-history-written-source :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="citedWorks">cited works</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item
          value="citedWorks"
          data-testid="tab-window-cited-works"
        >
          <data-collection-page-history-written-source-cited-work
            path="/api/data/history/written_sources/{parentId}/cited_works"
            :parent="{
              key: 'historyWrittenSource',
              item,
            }"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-history-written-source
        @refresh="redirectToCollectionPath()"
      />
      <data-dialog-update-history-written-source @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
