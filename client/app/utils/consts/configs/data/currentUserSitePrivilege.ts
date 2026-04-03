import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/admin/users/me/site_user_privileges',
  appPath: '/settings/me',
  defaultHeaders: [
    {
      key: 'site.code',
      value: 'site.code',
      title: 'site',
      width: '200',
    },
    {
      key: 'privilege',
      value: 'privilege',
      title: 'privilege',
    },
  ],

  labels: ['sites privileges', 'site privilege'],
  name: 'siteUserPrivilege',
}

export default config
