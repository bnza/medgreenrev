<script setup lang="ts">
const { visible, dataOpened } = storeToRefs(useDataNavigationDrawerStore())
const { hasRoleAdmin, isAuthenticated } = useAppAuth()
</script>

<template>
  <v-navigation-drawer
    :model-value="visible"
    permanent
    data-testid="app-navigation-drawer"
    width="350"
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
      <v-list-group value="Analyses">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="fas fa-magnifying-glass-chart"
            title="Analyses"
            data-testid="app-nav-drawer-li-analyses"
          />
        </template>
        <v-list-item
          nuxt
          to="/data/analyses"
          router
          title="Analyses"
          data-testid="app-nav-drawer-li-analyses-analyses"
        />
        <v-list-group value="Assemblage">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Assemblage"
              data-testid="app-nav-drawer-li-analyses-assemblage"
            />
          </template>
          <v-list-item
            nuxt
            to="/data/analyses/sites/anthropology"
            router
            title="Anthropology"
            data-testid="app-nav-drawer-li-analyses-anthropology"
          />
          <v-list-item
            nuxt
            to="/data/analyses/context/botany"
            router
            title="Archaeobotany"
            data-testid="app-nav-drawer-li-analyses-archaeobotany"
          />
          <v-list-item
            nuxt
            to="/data/analyses/samples/microstratigraphy"
            router
            title="Microstratigraphy"
            data-testid="app-nav-drawer-li-analysis-sample-mus"
          />
          <v-list-item
            nuxt
            to="/data/analyses/context/zoo"
            router
            title="Zooarchaeology"
            data-testid="app-nav-drawer-li-analysis-context-zoo"
          />
        </v-list-group>
        <v-list-group value="Element">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              title="Element"
              data-testid="app-nav-drawer-li-analyses"
            />
          </template>
          <v-list-item
            nuxt
            to="/data/analyses/zoo/bones"
            router
            title="Animal bones"
            data-testid="app-nav-drawer-li-analysis-zoo-bones"
          />
          <v-list-item
            nuxt
            to="/data/analyses/zoo/teeth"
            router
            title="Animal teeth"
            data-testid="app-nav-drawer-li-analysis-zoo-teeth"
          />
          <v-list-item
            nuxt
            to="/data/analyses/individuals"
            router
            title="Human Individuals"
            data-testid="app-nav-drawer-li-analysis-individuals"
          />
          <v-list-item
            nuxt
            to="/data/analyses/potteries"
            router
            title="Potteries"
            data-testid="app-nav-drawer-li-analysis-potteries"
          />
        </v-list-group>
      </v-list-group>
      <v-list-group value="Data">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="fas fa-table-list"
            title="Data"
            data-testid="app-nav-drawer-li-data"
          />
        </template>
        <v-list-group value="Botany">
          <template #activator="{ props: botanyProps }">
            <v-list-item
              v-bind="botanyProps"
              title="Botany"
              data-testid="app-nav-drawer-li-group-botany"
            />
          </template>
          <v-list-item
            nuxt
            to="/data/botany/charcoals"
            router
            title="Charcoals"
            data-testid="app-nav-drawer-li-botany-charcoals"
          />
          <v-list-item
            nuxt
            to="/data/botany/seeds"
            router
            title="Seeds"
            data-testid="app-nav-drawer-li-botany-seeds"
          />
        </v-list-group>
        <v-list-item
          nuxt
          to="/data/contexts"
          router
          title="Contexts"
          data-testid="app-nav-drawer-li-contexts"
        />
        <v-list-item
          nuxt
          to="/data/individuals"
          router
          title="Human Individuals"
          data-testid="app-nav-drawer-li-individuals"
        />
        <v-list-item
          nuxt
          to="/data/microstratigraphic-units"
          router
          title="Microstratigraphic Units"
          data-testid="app-nav-drawer-li-mus"
        />
        <v-list-item
          nuxt
          to="/data/potteries"
          router
          title="Potteries"
          data-testid="app-nav-drawer-li-potteries"
        />
        <v-list-item
          nuxt
          to="/data/samples"
          router
          title="Samples"
          data-testid="app-nav-drawer-li-samples"
        />
        <v-list-item
          nuxt
          to="/data/sediment-cores"
          router
          title="Sediment Cores"
          data-testid="app-nav-drawer-li-sediment-cores"
        />
        <v-list-item
          nuxt
          to="/data/sites"
          router
          title="Sites"
          data-testid="app-nav-drawer-li-sites"
        />
        <v-list-item
          nuxt
          to="/data/stratigraphic-units"
          router
          title="Stratigraphic Units"
          data-testid="app-nav-drawer-li-sus"
        />
        <v-list-group value="Zoo">
          <template #activator="{ props: zooProps }">
            <v-list-item
              v-bind="zooProps"
              title="Zoo"
              data-testid="app-nav-drawer-li-group-zoo"
            />
          </template>
          <v-list-item
            nuxt
            to="/data/zoo/bones"
            router
            title="Bones"
            data-testid="app-nav-drawer-li-zoo-bones"
          />
          <v-list-item
            nuxt
            to="/data/zoo/teeth"
            router
            title="Teeth"
            data-testid="app-nav-drawer-li-sus"
          />
        </v-list-group>
      </v-list-group>
      <v-list-group v-if="isAuthenticated" value="Media">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="fas fa-file"
            title="Media"
            data-testid="app-nav-drawer-li-media"
          />
        </template>
        <v-list-item
          nuxt
          to="/data/media"
          router
          title="Media"
          data-testid="app-nav-drawer-li-media-media"
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
