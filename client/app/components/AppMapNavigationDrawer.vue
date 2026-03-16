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
          <map-list-item-vector-api
            title="Botany Seed"
            path="/api/features/botany/seeds"
            group-key="archaeologicalSite"
          />
          <map-list-item-vector-api
            title="Individual"
            path="/api/features/individuals"
            group-key="archaeologicalSite"
          />
          <map-list-item-vector-api
            title="Microstratigraphic Unit"
            path="/api/features/microstratigraphic_units"
            group-key="archaeologicalSite"
          />
          <map-list-item-vector-api
            title="Pottery"
            path="/api/features/potteries"
            group-key="archaeologicalSite"
          />
          <map-list-item-vector-api
            title="Zoo Bone"
            path="/api/features/zoo/bones"
            group-key="archaeologicalSite"
          />
          <map-list-item-vector-api
            title="Zoo Tooth"
            path="/api/features/zoo/teeth"
            group-key="archaeologicalSite"
          />
        </v-list-group>
        <v-list-group value="Written Sources">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Written Sources"
              data-testid="app-map-nav-drawer-li-historical-locations"
            />
          </template>
          <map-list-item-vector-api
            title="Historical Locations"
            path="/api/features/history/locations"
            group-key="vocHistoryLocation"
          />
          <map-list-item-vector-api
            title="Animals"
            path="/api/features/history/animals"
            group-key="vocHistoryLocation"
          />
          <map-list-item-vector-api
            title="Plants"
            path="/api/features/history/plants"
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
