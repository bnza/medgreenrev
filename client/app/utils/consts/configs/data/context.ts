import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/contexts',
  appPath: '/data/contexts',
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
      key: 'type',
      value: 'type',
      title: 'type',
    },
    {
      key: 'name',
      value: 'name',
      title: 'name',
    },
    {
      key: 'description',
      value: 'description',
      title: 'description',
      sortable: false,
    },
  ],
  labels: ['context', 'contexts'],
  name: 'context',
}

export default config
