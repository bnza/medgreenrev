<script setup lang="ts">
import useResourceUiStore from '~/stores/resource-ui'

const { tab } = storeToRefs(useResourceUiStore('/api/admin/users/{id}'))
</script>

<template>
  <data-item-page
    path="/api/admin/users/{id}"
    title="User"
    identifier-prop="email"
  >
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
              resourceItemPath: '/api/admin/users/{id}',
              item,
            }"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs>
      <data-dialog-user-password mode="reset" />
    </template>
  </data-item-page>
</template>
