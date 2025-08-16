import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/potteries',
  appPath: '/data/potteries',
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
      width: '100',
    },
    {
      key: 'stratigraphicUnit.code',
      value: 'stratigraphicUnit.code',
      title: 'SU',
      width: '200',
      sortable: false,
    },
    {
      key: 'inventory',
      value: 'inventory',
      title: 'inventory',
    },
    {
      key: 'culturalContext.id',
      value: 'culturalContext',
      title: 'cultural context',
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
      key: 'shape.value',
      value: 'shape',
      title: 'shape',
    },
    {
      key: 'functionalGroup.value',
      value: 'functionalGroup',
      title: 'functional group',
    },
    {
      key: 'functionalForm.value',
      value: 'functionalForm',
      title: 'form',
    },
    {
      key: 'notes',
      value: 'notes',
      title: 'notes',
      sortable: false,
    },
  ],
  labels: ['pottery', 'potteries'],
  name: 'pottery',
}

export default config
