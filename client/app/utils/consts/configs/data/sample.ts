import type { ResourceConfig } from '~~/types'

const sample: ResourceConfig = {
  apiPath: '/api/data/samples',
  appPath: '/data/samples',
  name: 'sample',
  labels: ['sample', 'samples'],
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
      key: 'code',
      value: 'code',
      title: 'code',
    },
    {
      key: 'type.value',
      value: 'type.value',
      title: 'type',
    },
    {
      key: 'year',
      value: 'year',
      title: 'year',
    },
    {
      key: 'number',
      value: 'number',
      title: 'number',
    },
    {
      key: 'description',
      title: 'description',
      sortable: false,
    },
  ] as const,
}

export default sample
