import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/vocabulary/history/plants',
  appPath: '/data/vocabulary/history/plants',
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
      key: 'value',
      value: 'value',
      title: 'value',
      minWidth: '100',
    },
    {
      key: 'flat.value',
      value: 'flat.value',
      title: 'taxonomy',
      minWidth: '100',
    },
    {
      key: 'taxonomy.flat.class',
      value: 'taxonomy.flat.class',
      title: 'class',
      minWidth: '150',
    },
    {
      key: 'taxonomy.flat.family',
      value: 'taxonomy.flat.family',
      title: 'family',
      minWidth: '150',
    },
    {
      key: 'taxonomy.flat.genus',
      value: 'taxonomy.flat.genus',
      title: 'genus',
      minWidth: '150',
    },
    {
      key: 'taxonomy.flat.species',
      value: 'taxonomy.flat.species',
      title: 'species',
      minWidth: '200',
    },
    {
      key: 'cf',
      value: 'cf',
      title: 'CF',
      align: 'center',
      width: '80',
      maxWidth: '80',
    },
    {
      key: 'sp',
      value: 'sp',
      title: 'SP',
      align: 'center',
      width: '80',
      maxWidth: '80',
    },
  ],
  labels: ['plant (historical data)', 'plants (historical data)'],
  name: 'vocHistoryPlant',
}

export default config
