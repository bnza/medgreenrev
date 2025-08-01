<script setup lang="ts">
import type {
  SearchableGetCollectionPath,
  Filter,
  OperandComponentsKey,
  FilterState,
} from '~~/types'

const props = defineProps<{
  path: SearchableGetCollectionPath
  visible: boolean
  filters: FilterState
  filterId?: string
}>()

const {
  availableProperties,
  availableOperations,
  propertyLabel,
  operationLabel,
  filterComponentKey,
  filterDefinitionKey,
  filterDefinition,
  resourceFiltersDefinition,
} = useFilterConfig(props.path)

// Components management
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
} as const
// Components management

// Filter management
const isRefreshingFilters = ref(false)
const getFilter = (key?: string) => {
  if (key) {
    const filterDefinition = props.filters[key]
    return structuredClone(
      toRaw(filterDefinition) || ({ operands: [] } as Partial<Filter>),
    )
  }
  return { operands: [] } as Partial<Filter>
}

const filter = ref<Partial<Filter>>(getFilter(props.filterId))

watch(operationLabel, () => {
  console.log('operationLabel', operationLabel.value)
})

watch(
  () => props.filterId,
  (value) => {
    filter.value = getFilter(value)
    if (value) {
      isRefreshingFilters.value = true
      const filterDefinition =
        filter.value.property && filter.value.key
          ? resourceFiltersDefinition[filter.value.property]?.[filter.value.key]
          : undefined
      propertyLabel.value = filterDefinition?.propertyLabel
      operationLabel.value = filterDefinition?.operationLabel
    }
  },
)

watch(propertyLabel, () => {
  if (!isRefreshingFilters.value) {
    operationLabel.value = undefined
    filter.value = getFilter()
  }
})

watch(filterDefinitionKey, (value) => {
  if (value) {
    if (!isRefreshingFilters.value) {
      filter.value.key = value
      filter.value.property = filterDefinition.value?.property
      filter.value.operands = []
    } else {
      isRefreshingFilters.value = false
    }
  }
})
// Filter management

// Submit procedure
const isValidFilter = (value: unknown): value is Filter =>
  isPlainObject(value) &&
  ['key', 'property', 'operands'].every((key) =>
    Object.keys(value).includes(key),
  ) &&
  Array.isArray(filter.value.operands)

const isValid = computed(() => isValidFilter(filter.value))

const { addError } = useMessagesStore()
const { increment } = useGlobalSequenceStore()

const emit = defineEmits<{
  update: [id: string, filter: Filter]
  close: []
}>()
const close = () => {
  filter.value = getFilter()
  propertyLabel.value = undefined
  emit('close')
}

const submit = () => {
  if (!isValidFilter(filter.value)) {
    addError('Invalid filter')
    return
  }
  const filterId = props.filterId || String(increment())
  emit('update', filterId, filter.value)
  close()
}
// Submit procedure
</script>

<template>
  <v-dialog
    :model-value="visible"
    persistent
    data-testid="data-dialog-search-filter"
  >
    <v-card>
      <v-card-title>Add Filter</v-card-title>
      <v-card-text>
        <v-form>
          <v-container>
            <v-row align="center" flex>
              <v-col cols="3">
                <v-select
                  v-model="propertyLabel"
                  :items="availableProperties"
                  :disabled="Boolean(filterId)"
                  label="property"
                />
              </v-col>
              <v-col cols="3">
                <v-select
                  v-if="availableOperations.length > 0"
                  v-model="operationLabel"
                  :items="availableOperations"
                  :disabled="Boolean(filterId)"
                  label="operator"
                />
              </v-col>
              <v-col cols="4">
                <component
                  :is="operandsComponent"
                  v-if="operationLabel"
                  v-model="filter.operands"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <layout-action-two-buttons>
          <template #left>
            <v-btn color="white" @click="close">close</v-btn>
          </template>
          <template #default>
            <v-btn :disabled="!isValid" @click="submit">submit</v-btn>
          </template>
        </layout-action-two-buttons>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
