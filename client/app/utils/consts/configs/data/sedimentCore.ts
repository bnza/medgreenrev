import type { ResourceConfig } from '~~/types'

const sample: ResourceConfig = {
  apiPath: '/api/data/sediment_cores',
  appPath: '/data/sediment-cores',
  name: 'sedimentCore',
  labels: ['sediment core', 'sediment cores'],
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
      key: 'site.code',
      value: 'site.code',
      title: 'site',
    },
    {
      key: 'code',
      value: 'code',
      title: 'code',
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
