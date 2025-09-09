<script setup lang="ts">
withDefaults(
  defineProps<{
    iri: string
    readLink?: boolean
  }>(),
  {
    readLink: true,
  },
)

const vocabularyPotteryFunctionalGroupStore = useVocabularyStore(
  '/api/vocabulary/pottery/functional_groups',
)

const vocabularyPotteryFunctionalFormStore = useVocabularyStore(
  '/api/vocabulary/pottery/functional_forms',
)
</script>

<template>
  <data-item-info-box
    v-if="isValidIri(iri)"
    :iri
    path="/api/data/potteries/{id}"
    title="Pottery"
    data-testid="data-item-info-box-pottery"
    :app-path="readLink ? '/data/potteries' : undefined"
  >
    <template #activator="props">
      <slot v-bind="{ props }" />
    </template>
    <template #default="{ item }">
      <v-container v-if="item">
        <data-item-info-box-row
          label="site"
          :text="item.stratigraphicUnit?.site?.name"
        />
        <data-item-info-box-row
          label="SU"
          :text="item.stratigraphicUnit?.code"
        />
        <data-item-info-box-row label="inventory" :text="item.inventory" />
        <data-item-info-box-row
          label="functional group"
          :text="
            vocabularyPotteryFunctionalGroupStore.getValue(item.functionalGroup)
              .value
          "
        />
        <data-item-info-box-row
          label="form"
          :text="
            vocabularyPotteryFunctionalFormStore.getValue(item.functionalForm)
              .value
          "
        />
        <data-item-info-box-row label="notes" :text="item.notes" />
      </v-container>
    </template>
  </data-item-info-box>
</template>
