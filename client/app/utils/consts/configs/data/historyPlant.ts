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
      key: 'plant.value',
      value: 'plant.value',
      title: 'plant',
      minWidth: '200',
    },
    {
      key: 'location.value',
      value: 'location.value',
      title: 'location',
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
