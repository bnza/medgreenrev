<script setup lang="ts">
import useResourceUiStore from '~/stores/useResourceUiStore'

const path = '/api/admin/users/{id}' as const

const { tab } = storeToRefs(useResourceUiStore(path))

const redirectToCollectionPath = useRedirectToCollectionPath(path)
</script>

<template>
  <data-item-page path="/api/admin/users/{id}" identifier-prop="email">
    <template #default="{ item }">
      <lazy-data-item-form-info-user :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="privileges">sites privileges</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="privileges" data-testid="tab-privileges">
          <data-collection-page-user-site-privilege
            v-if="item?.id"
            path="/api/admin/users/{parentId}/site_user_privileges"
            :parent="{
              key: 'user',
              item,
            }"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs="{ refetch }">
      <data-dialog-user-password mode="reset" />
      <data-dialog-delete-user @refresh="redirectToCollectionPath()" />
      <data-dialog-update-user @refresh="refetch()" />
    </template>
  </data-item-page>
</template>
