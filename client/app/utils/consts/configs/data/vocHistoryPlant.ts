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
  labels: ['plant (historical data)', 'plants (historical data)'],
  name: 'vocHistoryPlant',
}

export default config
