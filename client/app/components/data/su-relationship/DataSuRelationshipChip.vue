<script setup lang="ts">
import type { GetCollectionMemberResponseMap } from '~~/types'
import { injectStratigraphicUnitsRelationship } from '~/composables/injection/useStratigraphicUnitsRelationship'

const props = defineProps<{
  item: GetCollectionMemberResponseMap['/api/data/stratigraphic_units/{parentId}/relationships']
}>()

const { isEditable, deletingRelationshipIri } =
  injectStratigraphicUnitsRelationship()

const codeWithoutSite = computed(() =>
  props.item.rgtStratigraphicUnit.code.replace(/^\w+\./, ''),
)
</script>

<template>
  <data-item-info-box-stratigraphic-unit
    v-slot="{ props }"
    :iri="item.rgtStratigraphicUnit['@id']"
  >
    <v-chip v-bind="props" color="primary" label
      >{{ codeWithoutSite }}
      <template #close>
        <v-icon
          v-if="isEditable"
          data-testid="delete-relationship-button"
          icon="far fa-circle-xmark"
          size="x-small"
          color="error"
          @click.stop="deletingRelationshipIri = item['@id']"
        />
      </template>
    </v-chip>
  </data-item-info-box-stratigraphic-unit>
</template>
