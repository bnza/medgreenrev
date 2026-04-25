import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  appPath: '/data/stratigraphic-units/sampling',
  apiPath: '/api/data/sampling_stratigraphic_units',
  name: 'stratigraphicUnit',
  labels: ['sampling stratigraphic unit', 'sampling stratigraphic units'],
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
      key: 'codeView.code',
      value: 'code',
      title: 'code',
      width: '100',
    },
    {
      key: 'number',
      value: 'number',
      title: 'number',
    },
    {
      key: 'chronologyLower',
      value: 'chronologyLower',
      title: 'chron.(lower)',
    },
    {
      key: 'chronologyUpper',
      value: 'chronologyUpper',
      title: 'chron.(upper)',
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
