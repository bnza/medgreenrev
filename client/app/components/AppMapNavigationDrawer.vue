<script setup lang="ts">
const uiAppNavigationDrawerStore = useAppNavigationDrawerStore()

const { mapOpened, visible } = storeToRefs(uiAppNavigationDrawerStore)
</script>

<template>
  <v-navigation-drawer
    :model-value="visible"
    :permanent="true"
    data-testid="app-map-navigation-drawer"
    :width="400"
  >
    <v-list v-model:opened="mapOpened">
      <v-list-group value="Data">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="fas fa-table-list"
            title="Data"
            data-testid="app-map-nav-drawer-li-data"
          />
        </template>
        <map-list-item-vector-api
          title="Historical Locations"
          path="/api/features/history/locations"
        />
      </v-list-group>
      <v-list-group value="Base Maps">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="fas fa-earth-europe"
            title="Base Maps"
            data-testid="app-map-nav-drawer-li-data"
          />
        </template>
        <map-list-item-base-map title="OpenStreetMap" base-map="osm" />
        <map-list-item-base-map title="Esri" base-map="esri" />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>
