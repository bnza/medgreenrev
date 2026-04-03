<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'

const path = '/api/data/history/animals/{id}' as const

const { tab } = storeToRefs(useResourceUiStore(path))

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page :path identifier-prop="identifier">
    <template #default="{ item }">
      <lazy-data-item-form-info-history-animal :item />
      <!--      <v-tabs v-model="tab" background-color="transparent">-->
      <!--        <v-tab value="plants">plants</v-tab>-->
      <!--        <v-tab value="animals">animals</v-tab>-->
      <!--      </v-tabs>-->
      <!--      <v-tabs-window v-model="tab">-->
      <!--        <v-tabs-window-item value="plants" data-testid="tab-plants">-->
      <!--          <p>Plants</p>-->
      <!--        </v-tabs-window-item>-->
      <!--        <v-tabs-window-item value="animals" data-testid="tab-animals">-->
      <!--          <p>Animals</p>-->
      <!--        </v-tabs-window-item>-->
      <!--      </v-tabs-window>-->
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-delete-history-animal
        @refresh="redirectToCollectionPath()"
      />
      <data-dialog-update-history-animal @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
