<script setup lang="ts">
import type { SearchableGetCollectionPath, Filter } from '~~/types/filters'
import useCollectionQueryStore from '~/stores/collection-query'

const props = defineProps<{
  path: SearchableGetCollectionPath
}>()

const filterId = defineModel<string | undefined>('id', { required: true })
const visible = defineModel<boolean>('visible', { required: true })
const { getAvailableProperties } = useFilterConfig(props.path)
const properties = computed(() => getAvailableProperties())

const { getFilter } = useCollectionQueryStore(props.path)
const filter = ref<Partial<Filter>>(getFilter(filterId.value))
</script>

<template>
  <v-dialog v-model="visible">
    <v-card>
      <v-card-title>Add Filter</v-card-title>
      <v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col>
                <v-select
                  v-model="filter.property"
                  :items="properties"
                  label="property"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
