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
      key: 'inventory',
      value: 'inventory',
      title: 'inventory',
      minWidth: '100',
    },
    {
      key: 'culturalContext.id',
      value: 'culturalContext',
      title: 'cultural context',
      minWidth: '150',
    },
    {
      key: 'chronologyLower',
      value: 'chronologyLower',
      title: 'chron.(lower)',
      minWidth: '100',
    },
    {
      key: 'chronologyUpper',
      value: 'chronologyUpper',
      title: 'chron.(upper)',
      minWidth: '100',
    },
    {
      key: 'surfaceTreatment.value',
      value: 'surfaceTreatment',
      title: 'surf. treatment',
      minWidth: '150',
    },
    {
      key: 'innerColor',
      value: 'innerColor',
      title: 'inner color',
      minWidth: '100',
    },
    {
      key: 'outerColor',
      value: 'outerColor',
      title: 'outer color',
      minWidth: '100',
    },
    {
      key: 'decorationMotif',
      value: 'decorationMotif',
      title: 'decoration motif',
      sortable: false,
      minWidth: '150',
    },
    {
      key: 'shape.value',
      value: 'shape',
      title: 'shape',
      minWidth: '150',
    },
    {
      key: 'functionalGroup.value',
      value: 'functionalGroup',
      title: 'functional group',
      minWidth: '150',
    },
    {
      key: 'functionalForm.value',
      value: 'functionalForm',
      title: 'form',
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
  labels: ['pottery', 'potteries'],
  name: 'pottery',
}

export default config
