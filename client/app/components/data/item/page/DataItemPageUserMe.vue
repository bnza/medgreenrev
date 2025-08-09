<script setup lang="ts">
const { data } = useAuth()
const tab = ref('data')
</script>

<template>
  <resource-not-found
    v-if="!data"
    path="/"
    :error="new Error('Unauthenticated user')"
  />
  <data-item-page
    path="/api/users/me"
    :title="data?.email || ''"
    identifier-prop="email"
  >
    <template #toolbar-append>
      <data-toolbar-item-user-me />
    </template>
    <template #default="{ item }">
      <lazy-data-item-form-info-user :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="privileges">sites privileges</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="privileges" data-testid="tab-privileges">
          <data-collection-page
            path="/api/admin/users/me/site_user_privileges"
            title="Granted sites privileges"
            :acl="{ canCreate: false, canExport: false }"
            parent
          >
            <data-collection-table
              path="/api/admin/users/me/site_user_privileges"
            >
              <template #[`item.privilege`]="{ item: privilegeItem }">
                <auth-sites-user-privilege-button
                  disabled
                  :privilege="privilegeItem.privilege"
                />
              </template>
            </data-collection-table>
          </data-collection-page>
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs>
      <data-dialog-user-password mode="change" />
    </template>
  </data-item-page>
</template>
