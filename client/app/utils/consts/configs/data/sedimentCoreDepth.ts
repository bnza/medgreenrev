import type { ResourceConfig } from '~~/types'

export const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/sediment_core_depths',
  appPath: '/data/sediment-cores/depths',
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
      key: 'sedimentCore.site.code',
      value: 'sedimentCore.site.code',
      title: 'site',
    },
    {
      key: 'stratigraphicUnit.code',
      value: 'stratigraphicUnit.code',
      title: 'stratigraphic unit',
    },
    {
      key: 'sedimentCore.code',
      value: 'sedimentCore.code',
      title: 'sediment core',
    },
    {
      key: 'depthMin',
      value: 'depthMin',
      title: 'depth (min)',
    },
    {
      key: 'depthMax',
      value: 'depthMax',
      title: 'depth (max)',
    },
    {
      key: 'notes',
      value: 'notes',
      title: 'notes',
      sortable: false,
    },
  ],
  labels: ['sediment core depth', 'sediment core depths'],
  name: 'sedimentCoreDepth',
}

export const sedimentCoreSubResourceConfig: Readonly<ResourceConfig> = {
  ...structuredClone(config),
  ...{
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
        key: 'sedimentCore.site.code',
        value: 'sedimentCore.site.code',
        title: 'code',
        sortable: false,
      },
      {
        key: 'sedimentCore.code',
        value: 'sedimentCore.code',
        title: 'code',
        sortable: false,
      },
      {
        key: 'sedimentCore.year',
        value: 'sedimentCore.year',
        title: 'year',
      },
      {
        key: 'sedimentCore.number',
        value: 'sedimentCore.number',
        title: 'number',
      },
      {
        key: 'sedimentCore.description',
        value: 'sedimentCore.description',
        title: 'description',
        sortable: false,
      },
    ],
  },
}

export const stratigraphicUnitSubResourceConfig: Readonly<ResourceConfig> = {
  ...structuredClone(config),
  ...{
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
        value: 'site.code',
        title: 'site',
        width: '80',
      },
      {
        key: 'stratigraphicUnit.code',
        value: 'stratigraphicUnit.code',
        title: 'code',
        width: '200',
        sortable: false,
      },
      {
        key: 'stratigraphicUnit.number',
        value: 'stratigraphicUnit.number',
        title: 'number',
      },
      {
        key: 'stratigraphicUnit.year',
        value: 'stratigraphicUnit.year',
        title: 'year',
      },
      {
        key: 'stratigraphicUnit.interpretation',
        value: 'stratigraphicUnit.interpretation',
        title: 'interpretation',
        sortable: false,
      },
      {
        key: 'stratigraphicUnit.description',
        value: 'stratigraphicUnit.description',
        title: 'description',
        sortable: false,
      },
    ],
  },
}
