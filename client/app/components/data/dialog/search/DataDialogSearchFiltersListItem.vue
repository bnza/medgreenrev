<script setup lang="ts">
import type { ExpandedFilter, OperandComponentsKey } from '~~/types'

const props = defineProps<{
  filter: ExpandedFilter
}>()
defineEmits<{
  delete: []
  update: []
}>()
// Components management
const filterComponentKey = computed(() => props.filter.componentKey)
type ResolvedComponent = ReturnType<typeof resolveComponent>

const operandsComponent = computed(() => {
  if (!filterComponentKey.value) {
    return undefined
  }

  return operandComponentsMap[filterComponentKey.value]
})

const operandComponentsMap: Record<OperandComponentsKey, ResolvedComponent> = {
  Boolean: resolveComponent('DataDialogSearchOperandBoolean'),
  Single: resolveComponent('DataDialogSearchOperandSingle'),
  Numeric: resolveComponent('DataDialogSearchOperandNumeric'),
  NumericRange: resolveComponent('DataDialogSearchOperandNumericRange'),
  Vocabulary: resolveComponent('DataDialogSearchOperandVocabulary'),
} as const
// Components management
</script>

<template>
  <v-list-item data-testid="data-dialog-search-filters-list-item">
    <template #default>
      <v-container class="h-90">
        <v-row align="center" justify="space-evenly" dense>
          <v-col cols="1" justify-end>
            <v-btn-group class="mb-6 mr-0 pr-0">
              <navigation-resource-item-update @update="$emit('update')" />
              <navigation-resource-item-delete @delete="$emit('delete')" />
            </v-btn-group>
          </v-col>
          <v-col cols="3">
            <v-text-field
              readonly
              :model-value="filter.propertyLabel"
              variant="solo-filled"
              label="property"
              flat
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              readonly
              :model-value="filter.operationLabel"
              label="operands"
              variant="solo-filled"
              flat
            />
          </v-col>
          <component
            :is="operandsComponent"
            :model-value="filter.operands"
            :path="
              filter.componentKey === 'Vocabulary' ? filter.path : undefined
            "
            readonly
          />
        </v-row>
      </v-container>
    </template>
  </v-list-item>
</template>
