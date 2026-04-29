import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/vocabulary/zoo/taxonomies',
  appPath: '/data/vocabulary/zoo/taxonomies',
  defaultHeaders: [
    {
      key: 'id',
      value: 'id',
      title: 'ID',
      align: 'center',
      width: '200',
      maxWidth: '200',
    },
    {
      key: 'flat.rank',
      value: 'level',
      title: 'rank',
      minWidth: '100',
    },
    {
      key: 'flat.value',
      value: 'flat.value',
      title: 'value',
      minWidth: '100',
    },
    {
      key: 'englishName',
      value: 'englishName',
      title: 'vernacular name',
      minWidth: '100',
    },
    {
      key: 'spanishName',
      value: 'spanishName',
      title: 'spanish name',
      minWidth: '100',
    },
    {
      key: 'flat.class',
      value: 'flat.class',
      title: 'class',
      minWidth: '150',
    },
    {
      key: 'flat.family',
      value: 'flat.family',
      title: 'family',
      minWidth: '150',
    },
    {
      key: 'flat.genus',
      value: 'flat.genus',
      title: 'genus',
      minWidth: '150',
    },
    {
      key: 'flat.species',
      value: 'flat.species',
      title: 'species',
      minWidth: '150',
    },
  ],
  labels: ['taxonomy (plant)', 'taxonomies (plant)'],
  name: 'vocBotanyTaxonomy',
}

export default config
