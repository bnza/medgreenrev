import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/admin/site_user_privileges',
  appPath: '/admin/site-user-privileges',
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
      width: '200',
    },
    {
      key: 'user.email',
      value: 'user.userIdentifier',
      title: 'user',
    },
    {
      key: 'privilege',
      value: 'privilege',
      title: 'privilege',
    },
  ],

  labels: ['sites/users privileges', 'user/site privilege'],
  name: 'siteUserPrivilege',
}

export default config
