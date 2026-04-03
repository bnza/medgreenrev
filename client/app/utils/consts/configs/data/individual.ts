import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/individuals',
  appPath: '/data/individuals',
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
      key: 'stratigraphicUnit.site.code',
      value: 'stratigraphicUnit.site.code',
      title: 'site',
      minWidth: '100',
    },
    {
      key: 'stratigraphicUnit.code',
      value: 'stratigraphicUnit.code',
      title: 'SU',
      minWidth: '100',
      sortable: false,
    },
    {
      key: 'identifier',
      value: 'identifier',
      title: 'identifier',
      minWidth: '100',
    },
    {
      key: 'sex',
      value: 'sex',
      title: 'sex',
      minWidth: '150',
    },
    {
      key: 'age.id',
      value: 'age',
      title: 'age',
      minWidth: '150',
    },
    {
      key: 'notes',
      value: 'notes',
      title: 'notes',
      minWidth: '300',
      sortable: false,
    },
  ],
  labels: ['human individual', 'human individuals'],
  name: 'individual',
}

export default config
