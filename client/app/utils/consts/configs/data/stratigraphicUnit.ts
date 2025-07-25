import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  appPath: '/data/stratigraphic-units',
  apiPath: '/api/stratigraphic_units',
  name: 'stratigraphicUnit',
  labels: ['Stratigraphic Unit', 'Stratigraphic Units'],
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
      width: '80',
    },
    {
      key: 'code',
      value: 'code',
      title: 'code',
      width: '200',
      sortable: false,
    },
    {
      key: 'number',
      value: 'number',
      title: 'number',
    },
    {
      key: 'year',
      value: 'year',
      title: 'year',
    },
    {
      key: 'interpretation',
      value: 'interpretation',
      title: 'interpretation',
      sortable: false,
    },
    {
      key: 'description',
      value: 'description',
      title: 'description',
      sortable: false,
    },
  ],
}

export default config
