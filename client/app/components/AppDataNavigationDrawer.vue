<script setup lang="ts">
const { visible, dataOpened } = storeToRefs(useDataNavigationDrawerStore())
const { hasRoleAdmin } = useAppAuth()
</script>

<template>
  <v-navigation-drawer
    :model-value="visible"
    :permanent="true"
    data-testid="app-navigation-drawer"
  >
    <v-list v-model:opened="dataOpened">
      <v-list-item
        nuxt
        to="/"
        router
        exact
        prepend-icon="fas fa-house"
        data-testid="app-navigation-drawer-li-home"
        title="Home"
      />
      <v-list-group value="Data">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="fas fa-table-list"
            title="Data"
            data-testid="app-nav-drawer-li-data"
          />
        </template>
        <v-list-item
          nuxt
          to="/data/sites"
          router
          title="Sites"
          data-testid="app-nav-drawer-li-sites"
        />
      </v-list-group>
      <v-list-group v-if="hasRoleAdmin" value="Admin">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="fas fa-screwdriver-wrench"
            title="Admin"
            data-testid="app-nav-drawer-li-admin"
          />
        </template>
        <v-list-item
          nuxt
          to="/admin/users"
          router
          title="Users"
          data-testid="app-nav-drawer-li-users"
        />
      </v-list-group>
      <v-list-item
        nuxt
        to="/about"
        router
        exact
        prepend-icon="fas fa-info"
        data-testid="app-navigation-drawer-li-about"
        title="About"
      />
    </v-list>
  </v-navigation-drawer>
</template>
