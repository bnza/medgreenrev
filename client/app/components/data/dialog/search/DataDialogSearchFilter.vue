<script setup lang="ts">
import type { SearchableGetCollectionPath, Filter, FilterState } from '~~/types'

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
  getFilter,
  syncState,
} = useCollectionQueryFilter(
  props.path,
  computed(() => props.filters),
)

const { operandsComponent } = useFilterOperandComponents(filterComponentKey)

// Filter management
const isRefreshingFilters = ref(false)

const filter = ref<Partial<Filter>>(getFilter(props.filterId))

watch(
  () => props.filterId,
  (value) => {
    isRefreshingFilters.value = Boolean(value)
    filter.value = syncState(value)
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
      isRefreshingFilters.value = false // <--- This by now is the last watch of the update chain. Caution it could change. It's not a robust solution
    }
  }
})
// Filter management

// Submit procedure
const isValidFilter = (value: unknown): value is Filter =>
  isPlainObject(value) &&
  ['key', 'property', 'operands'].every((key) =>
    Object.keys(value).includes(key),
  )

const valid = ref(false)

const isValid = computed(() => isValidFilter(filter.value) && valid.value)

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
            <v-row align="center" justify="space-evenly" flex>
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
              <component
                :is="operandsComponent"
                v-if="filterDefinition"
                v-model="filter.operands"
                v-model:valid="valid"
                :path="
                  filterDefinition.componentKey === 'Vocabulary'
                    ? filterDefinition.path
                    : undefined
                "
              />
              <v-col v-else cols="4" />
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
