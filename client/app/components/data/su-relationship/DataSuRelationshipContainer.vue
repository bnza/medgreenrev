<script setup lang="ts">
import type { GetItemResponseMap, ApiAclResource } from '~~/types'
import {
  stratigraphicUnitsRelationshipInjectionKey,
  useStratigraphicUnitsRelationship,
} from '~/composables/injection/useStratigraphicUnitsRelationship'

const props = defineProps<{
  lftSu: GetItemResponseMap['/api/data/stratigraphic_units/{id}'] &
    ApiAclResource
}>()

const stratigraphicUnitsRelationship = useStratigraphicUnitsRelationship(
  props.lftSu,
)

provide(
  stratigraphicUnitsRelationshipInjectionKey,
  stratigraphicUnitsRelationship,
)

const { canUpdate, isReadonly, items, refetch } = stratigraphicUnitsRelationship

const lockedIcon = computed(() =>
  isReadonly.value ? 'fas fa-lock' : 'fas fa-lock-open',
)
const lockedTooltipText = computed(() =>
  isReadonly.value ? 'Enable editing' : 'Disable editing',
)
const toggleReadonly = () => (isReadonly.value = !isReadonly.value)
</script>

<template>
  <v-container data-testid="su-relationships-container" fluid>
    <data-su-relationship-create-dialog @refresh="refetch()" />
    <data-su-relationship-delete-dialog @refresh="refetch()" />
    <v-row dense justify="end" style="min-height: 48px">
      <v-col cols="1">
        <v-btn
          v-if="canUpdate"
          color="anchor"
          rounded="false"
          variant="text"
          icon
          data-testid="enable-editing-button"
          @click="toggleReadonly"
        >
          <v-icon :icon="lockedIcon" color="primary" />
          <v-tooltip activator="parent" location="bottom">
            {{ lockedTooltipText }}
          </v-tooltip>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <data-su-relationship-card relationship-key="c" :items />
      </v-col>
      <v-col>
        <data-su-relationship-card relationship-key="C" :items />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <data-su-relationship-card relationship-key="x" :items />
      </v-col>
      <v-col>
        <data-su-relationship-card relationship-key="X" :items />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <data-su-relationship-card relationship-key="f" :items />
      </v-col>
      <v-col>
        <data-su-relationship-card relationship-key="F" :items />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <data-su-relationship-card relationship-key="e" :items />
      </v-col>
    </v-row>
  </v-container>
</template>
