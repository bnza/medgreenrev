import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/vocabulary/history/animals',
  appPath: '/data/vocabulary/history/animals',
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
      key: 'taxonomy.value',
      value: 'taxonomy.value',
      title: 'taxonomy',
      minWidth: '100',
    },
    {
      key: 'taxonomy.vernacularName',
      value: 'taxonomy.vernacularName',
      title: 'vernacular name',
      minWidth: '200',
    },
    {
      key: 'taxonomy.class',
      value: 'taxonomy.class',
      title: 'class',
      minWidth: '150',
    },
    {
      key: 'taxonomy.family',
      value: 'taxonomy.family',
      title: 'family',
      minWidth: 'taxonomy.150',
    },
  ],
  labels: ['animal (historical data)', 'animals (historical data)'],
  name: 'vocHistoryAnimal',
}

export default config
