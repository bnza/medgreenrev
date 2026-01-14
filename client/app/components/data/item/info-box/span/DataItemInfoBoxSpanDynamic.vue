<script setup lang="ts">
import type { UnwrapRef } from 'vue'
import { API_RESOURCE_MAP, type ApiResourceKey } from '~/utils/consts/resources'
import type { Iri, OperationPathParams, ApiResourceItemPath } from '~~/types'

import {
  DataItemInfoBoxSpanBotanyCharcoal,
  DataItemInfoBoxSpanBotanySeed,
  DataItemInfoBoxSpanContext,
  DataItemInfoBoxSpanIndividual,
  DataItemInfoBoxSpanPottery,
  DataItemInfoBoxSpanSample,
  DataItemInfoBoxSpanSite,
  DataItemInfoBoxSpanZooBone,
  DataItemInfoBoxSpanZooTooth,
} from '#components'

type SubjectApiResourceKey = Extract<
  ApiResourceKey,
  | 'botanyCharcoal'
  | 'botanySeed'
  | 'context'
  | 'individual'
  | 'pottery'
  | 'sample'
  | 'site'
  | 'zooBone'
  | 'zooTooth'
>

const props = defineProps<{
  id: number | string
  resourceKey: ApiResourceKey
}>()

const componentMap: Record<SubjectApiResourceKey, Component> = {
  botanyCharcoal: DataItemInfoBoxSpanBotanyCharcoal,
  botanySeed: DataItemInfoBoxSpanBotanySeed,
  context: DataItemInfoBoxSpanContext,
  individual: DataItemInfoBoxSpanIndividual,
  pottery: DataItemInfoBoxSpanPottery,
  sample: DataItemInfoBoxSpanSample,
  site: DataItemInfoBoxSpanSite,
  zooBone: DataItemInfoBoxSpanZooBone,
  zooTooth: DataItemInfoBoxSpanZooTooth,
}

const isSubject = (value: ApiResourceKey): value is SubjectApiResourceKey => {
  return Object.keys(componentMap).includes(value)
}

const infoBoxComponent = computed<Component | null>(() =>
  isSubject(props.resourceKey) ? componentMap[props.resourceKey] : null,
)

const itemPath = computed<ApiResourceItemPath>(
  () => `${API_RESOURCE_MAP[props.resourceKey]}/{id}` as ApiResourceItemPath,
)

const iri = computed(() => {
  const path = API_RESOURCE_MAP[props.resourceKey]
  return `${path}/${props.id}` as Iri
})

type UnwrapRefItemPath = UnwrapRef<typeof itemPath>

const params = computed<OperationPathParams<UnwrapRefItemPath, 'get'>>(() => ({
  id: String(props.id),
}))

const { data: item, status } = useGetItemQuery(itemPath.value, params)

// @ts-expect-error code is not present on all resource items
const text = computed(() => item.value?.code ?? item.value?.['@id'])
</script>

<template>
  <v-progress-circular
    v-if="status === 'pending'"
    indeterminate
    size="14"
    width="1.5"
    class="ml-2"
  />
  <v-icon
    v-else-if="status === 'error'"
    icon="fa-solid fa-circle-exclamation"
    color="error"
    size="x-small"
    class="ml-1"
  />
  <component :is="infoBoxComponent" v-else-if="infoBoxComponent" :iri :text />
  <span v-else>Unsupported resource key: {{ props.resourceKey }}</span>
</template>
