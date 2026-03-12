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
        <v-list-group value="Archaeological Sites">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Archaeological Sites"
              data-testid="app-map-nav-drawer-li-archaeological-sites"
            />
          </template>
          <map-list-item-vector-api
            title="Sites"
            path="/api/features/archaeological_sites"
            group-key="archaeologicalSite"
          />
          <map-list-item-vector-api
            title="Botany Charcoal"
            path="/api/features/botany/charcoals"
            group-key="archaeologicalSite"
          />
        </v-list-group>
        <v-list-group value="Historical Locations">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Historical Locations"
              data-testid="app-map-nav-drawer-li-historical-locations"
            />
          </template>
          <map-list-item-vector-api
            title="Historical Locations"
            path="/api/features/history/locations"
            group-key="vocHistoryLocation"
          />
        </v-list-group>
        <v-list-group value="Sampling Sites">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Sampling Sites"
              data-testid="app-map-nav-drawer-li-sampling-sites"
            />
          </template>
          <map-list-item-vector-api
            title="Sampling Sites"
            path="/api/features/sampling_sites"
            group-key="samplingSite"
          />
        </v-list-group>
      </v-list-group>
      <v-list-group value="Base Maps">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="fas fa-earth-europe"
            title="Base Maps"
            data-testid="app-map-nav-drawer-li-base-maps"
          />
        </template>
        <map-list-item-base-map title="OpenStreetMap" base-map="osm" />
        <map-list-item-base-map title="Esri" base-map="esri" />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>
