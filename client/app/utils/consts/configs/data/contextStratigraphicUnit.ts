import type { ResourceConfig } from '~~/types'

export const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/context_stratigraphic_units',
  appPath: '/data/contexts-stratigraphic-units',
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
      key: 'stratigraphicUnit',
      value: 'stratigraphicUnit',
      title: 'stratigraphic unit',
    },
    {
      key: 'context',
      value: 'context',
      title: 'context',
    },
  ],
  labels: ['context/SU association', 'context/SU associations'],
  name: 'contextStratigraphicUnit',
}

export const contextSubResourceConfig = {
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
        key: 'context.site.code',
        value: 'context.site.code',
        title: 'site',
      },
      {
        key: 'context.type',
        value: 'context.type',
        title: 'type',
      },
      {
        key: 'context.name',
        value: 'context.name',
        title: 'name',
      },
      {
        key: 'context.description',
        value: 'context.description',
        title: 'description',
        sortable: false,
      },
    ],
  },
}

export const stratigraphicUnitSubResourceConfig = {
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
        value: 'stratigraphicUnit.site.code',
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
