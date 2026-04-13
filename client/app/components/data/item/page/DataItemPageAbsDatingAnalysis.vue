<script
  setup
  lang="ts"
  generic="RK extends AbsDatingAnalysisSubjectResourceKey"
>
import type { AbsDatingAnalysisSubjectResourceKey } from '~~/types'
import { API_RESOURCE_MAP } from '~/utils/consts/resources'

const props = withDefaults(
  defineProps<{ resourceKey: RK; showBackButton?: boolean }>(),
  { showBackButton: true },
)
const resourcePath = API_RESOURCE_MAP[props.resourceKey]

const path = `${resourcePath}/{id}` as const
</script>

<template>
  <data-item-page :path identifier-prop="id" :show-back-button>
    <template #default="{ item }">
      <lazy-data-item-form-info-abs-dating-analysis :item />
    </template>
    <template #error>
      <resource-not-found
        title="No data"
        error="No associated absolute dating information for this subject"
      />
    </template>
  </data-item-page>
</template>
