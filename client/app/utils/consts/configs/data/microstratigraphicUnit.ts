import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/microstratigraphic_units',
  appPath: '/data/microstratigraphic-units',
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
      width: '80',
    },
    {
      key: 'stratigraphicUnit.code',
      value: 'stratigraphicUnit.code',
      title: 'stratigraphic unit',
      minWidth: '100',
      sortable: false,
    },
    {
      key: 'identifier',
      value: 'identifier',
      title: 'identifier',
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
  labels: ['microstratigraphic unit', 'microstratigraphic units'],
  name: 'microstratigraphicUnit',
}

export default config
