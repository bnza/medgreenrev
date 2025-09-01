<script setup lang="ts">
import { injectStratigraphicUnitsRelationship } from '~/composables/injection/useStratigraphicUnitsRelationship'
import type {
  GetCollectionMemberResponseMap,
  StratigraphicUnitRelationshipKey,
} from '~~/types'
import { STRATIGRAPHIC_UNIT_RELATIONSHIP_MAP } from '~/utils'

const props = defineProps<{
  relationshipKey: StratigraphicUnitRelationshipKey
  items: GetCollectionMemberResponseMap['/api/data/stratigraphic_units/{parentId}/relationships'][]
}>()

const name = STRATIGRAPHIC_UNIT_RELATIONSHIP_MAP[props.relationshipKey]

const { isEditable, creatingRelationshipType } =
  injectStratigraphicUnitsRelationship()

const { items } = toRefs(props)

const relationships = computed(() =>
  items.value
    ? items.value.filter(
        (current) => current.relationship.slice(-1) === props.relationshipKey,
      )
    : [],
)
</script>

<template>
  <v-card
    data-testid="su-relationship-card"
    height="100%"
    min-height="100px"
    class="mx-auto"
    variant="outlined"
    color="grey lighten-1"
  >
    <template #title>
      <v-container fluid class="pa-0 ma-0">
        <v-row align="center" justify="space-between" dense class="pa-0 ma-0">
          <v-col
            cols="11"
            class="text-center text-uppercase text-body-2 pa-0 ma-0"
          >
            {{ name }}
          </v-col>
          <v-col cols="1" class="text-center pa-0 ma-0">
            <v-btn
              v-if="isEditable"
              data-testid="add-relationship-button"
              class="mx-4"
              color="anchor"
              rounded="false"
              variant="text"
              :icon="true"
              size="x-small"
              @click="creatingRelationshipType = relationshipKey"
            >
              <v-icon icon="fas fa-plus" size="x-small" />
              <v-tooltip activator="parent" location="bottom"
                >Add relationship
              </v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <v-card-text>
      <v-chip-group>
        <data-su-relationship-chip
          v-for="item in relationships"
          :key="item['@id']"
          :item="item"
        />
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>
