import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/history/plants',
  appPath: '/data/history/plants',
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
      key: 'plant',
      value: 'plant',
      title: 'plant',
      minWidth: '200',
    },
    {
      key: 'taxonomy.englishName',
      value: 'taxonomy.englishName',
      title: 'taxonomy (english name)',
      minWidth: '200',
    },
    {
      key: 'taxonomy.flat.value',
      value: 'taxonomy.flat.value',
      title: 'taxonomy',
      minWidth: '200',
    },
    {
      key: 'cf',
      value: 'cf',
      title: 'cf',
      align: 'center',
      width: '80',
    },
    {
      key: 'sp',
      value: 'sp',
      title: 'sp',
      align: 'center',
      width: '80',
    },
    {
      key: 'language.value',
      value: 'language.value',
      title: 'language',
      minWidth: '200',
    },
    {
      key: 'location.value',
      value: 'location.value',
      title: 'location',
      minWidth: '100',
    },
    {
      key: 'location.region.value',
      value: 'location.region.value',
      title: 'region',
      minWidth: '100',
    },
    {
      key: 'chronologyLower',
      value: 'chronologyLower',
      title: 'chronology (lower)',
      minWidth: '100',
    },
    {
      key: 'chronologyUpper',
      value: 'chronologyUpper',
      title: 'chronology (upper)',
      minWidth: '100',
    },
    {
      key: 'reference',
      value: 'reference',
      title: 'reference',
      minWidth: '200',
    },
    {
      key: 'notes',
      value: 'notes',
      title: 'notes',
      minWidth: '300',
      sortable: false,
    },
  ],
  labels: ['plant (historical data)', 'plants (historical data)'],
  name: 'historyPlant',
}

export default config
