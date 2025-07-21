<script setup lang="ts">
import { ApiRole } from '~/utils/consts/auth'

const { data } = useAuth()
const tab = ref('data')

const role = computed(() =>
  data.value ? reduceAppRoles(data.value.roles) : ApiRole.User,
)
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
    <template #default="{ item }">
      <lazy-data-item-form-info-user :item />
      <v-tabs v-model="tab" background-color="transparent">
        <v-tab value="privileges">sites privileges</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="privileges" data-testid="tab-privileges">
          <data-collection-page
            path="/api/users/me/site_user_privileges"
            title="Granted sites privileges"
          >
            <data-collection-table path="/api/users/me/site_user_privileges">
              <template #[`item.privilege`]="{ item }">
                <auth-sites-user-privilege-button
                  disabled
                  :privilege="item.privilege"
                />
              </template>
            </data-collection-table>
          </data-collection-page>
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template #dialogs>
      <data-dialog-user-password mode="reset" />
    </template>
  </data-item-page>
</template>
