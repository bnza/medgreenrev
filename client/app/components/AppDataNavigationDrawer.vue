<script setup lang="ts">

const {visible, dataOpened} = storeToRefs(useDataNavigationDrawerStore())
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
    </v-list>
  </v-navigation-drawer>
</template>


