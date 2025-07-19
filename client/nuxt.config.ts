export default defineNuxtConfig({
  app: {
    baseURL: '/app',
    head: {
      link: [
        {
          rel: 'icon',
          href: '/app/favicon.png',
        },
      ],
    },
  },
  build: {
    transpile: ['vue3-openlayers'],
  },
  auth: {
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/token/invalidate' },
        getSession: { path: '/users/me', method: 'get' },
      },
      refresh: {
        isEnabled: true,
        refreshOnlyToken: false,
        endpoint: {
          path: '/token/refresh',
        },
        token: {
          signInResponseRefreshTokenPointer: '/refresh_token',
          refreshRequestTokenPointer: '/refresh_token',
        },
      },
      pages: {
        login: '/login',
      },
      session: {
        dataType: {
          id: 'string',
          email: 'string',
          roles: 'ApiRole[]',
          privileges: 'Record<number,number>[]',
        },
      },
    },
    sessionRefresh: {
      // Whether to refresh the session every time the browser window is refocused.
      enableOnWindowFocus: true,

      // Whether to refresh the session every `X` milliseconds. Set this to `false` to turn it off. The session will only be refreshed if a session already exists.
      enablePeriodically: false,
    },
    disableServerSideAuth: false,
    globalAppMiddleware: false,
    baseURL: process.env.NUXT_PUBLIC_API_BASE_URL
      ? process.env.NUXT_PUBLIC_API_BASE_URL + '/api'
      : 'http://localhost/api',
  },
  compatibilityDate: '2024-04-03',
  css: ['~/assets/styles/index.css'],
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
  },
  imports: {
    dirs: ['stores'],
    presets: [
      {
        from: 'pinia',
        imports: ['defineStore', 'storeToRefs'],
      },
      {
        from: '@pinia/colada',
        imports: [
          'defineMutation',
          'defineQuery',
          'defineQueryOptions',
          'useQuery',
          'useMutation',
          'useQueryCache',
          'QueryPlugin',
          'PiniaColada',
        ],
      },
    ],
  },
  modules: [
    '@nuxt/eslint',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Montserrat: true,
        },
      },
    ],
    '@sidebase/nuxt-auth',
    'vuetify-nuxt-module',
  ],
  router: {
    options: {
      hashMode: true,
    },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost',
    },
  },
  sourcemap: {
    client: true,
    server: true,
  },
  // vite: {
  //   build: {
  //     sourcemap: true,
  //   },
  //   optimizeDeps: {
  //     include: ['ol > geotiff'],
  //   },
  // },
  ssr: false,
})
