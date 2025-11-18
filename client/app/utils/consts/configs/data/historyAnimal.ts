import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/history/animals',
  appPath: '/data/history/animals',
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
      key: 'animal.value',
      value: 'animal.value',
      title: 'animal',
      minWidth: '200',
    },
    {
      key: 'location.name',
      value: 'location.name',
      title: 'location.name',
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
  labels: ['animal (historical data)', 'animal (historical data)'],
  name: 'historyAnimal',
}

export default config
