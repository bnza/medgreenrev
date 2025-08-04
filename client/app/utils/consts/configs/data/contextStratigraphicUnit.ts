import type { ResourceConfig } from '~~/types'

export const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data_contexts_stratigraphic_units',
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
  labels: ['context/SU join', 'context/SU joins'],
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
        key: 'context.type.group',
        value: 'context.type.group',
        title: 'group',
      },
      {
        key: 'context.type.value',
        value: 'context.type.value',
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
