<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      '/api/stratigraphic_units' | '/api/sites/{parentId}/stratigraphic_units'
    >
  "
>
import type {
  GetCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import useResourceParent from '~/composables/useResourceParent'
import { required, integer, maxValue, minValue } from '@regle/rules'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'site', '/api/sites/{id}'>
}>()

type RequestBody = PostCollectionRequestMap['/api/stratigraphic_units']

const { key: parentKey, iri: parentIri } = useResourceParent(props.parent)

const getEmptyModel = () =>
  ({
    site: parentKey.value === 'site' ? parentIri.value : undefined,
  }) as RequestBody

const model = ref(getEmptyModel())

const uniqueSite = useApiUniqueValidator(
  '/api/validator/unique/stratigraphic_units/{site}/{year}/{number}',
  ['site', 'year', 'number'],
  'Duplicate [site, year, number] combination',
)
const uniqueYear = useApiUniqueValidator(
  '/api/validator/unique/stratigraphic_units/{site}/{year}/{number}',
  ['year', 'site', 'number'],
  'Duplicate [year, site, number] combination',
)
const uniqueNumber = useApiUniqueValidator(
  '/api/validator/unique/stratigraphic_units/{site}/{year}/{number}',
  ['number', 'site', 'year'],
  'Duplicate [number, site, year] combination',
)

const rules = computed(() =>
  inferRules(model, {
    site: {
      required,
      uniqueSite: uniqueSite(
        () => model.value.year || 0,
        () => model.value.number,
      ),
    },
    year: {
      integer,
      uniqueYear: uniqueYear(
        () => model.value.site,
        () => model.value.number,
      ),
      minValue: minValue(2000),
      maxValue: maxValue(new Date().getFullYear()),
    },
    number: {
      required,
      integer,
      minValue: minValue(1),
      uniqueNumber: uniqueNumber(
        () => model.value.site,
        () => model.value.year || 0,
      ),
    },
  }),
)

const { r$ } = useRegle(model, rules)
const onPreSubmit = (item: any) => {
  if ('number' in item) item.number = Number(item.number)
  if ('year' in item) item.year = Number(item.year)
  return item
}
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    title="User"
    :parent
    :path
    :on-pre-submit
    :get-empty-model
  >
    <template #default>
      <data-item-form-edit-stratigraphic-unit
        v-if="r$.$value"
        v-model:item="r$.$value"
        :errors="r$.$errors"
        :parent
        mode="create"
      />
    </template>
  </data-dialog-create>
</template>
