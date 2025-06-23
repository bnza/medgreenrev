// import type { ApiAction } from '~~/types'

export const COLORS = {
  primary: '#2c549d',
  secondary: '#80bc37',
  anchor: '#FFF',
  accent: '#505',
  error: '#e2626b',
  info: '#9ed5f6',
  success: '#7cb798',
  warning: '#fab758',
  background: '#111',
  surface: '#222',
  'surface-bright': '#282828',
  'surface-light': '#333',
  'surface-variant': '#444',
  'on-surface-variant': '#EEE',
  'primary-darken-1': '#12223f',
  'secondary-darken-1': '#334b16',
} as const

// export const DATA_API_ACTIONS_BAR_COLOR: Readonly<
//   Record<ApiAction, `#${string}`>
// > = Object.freeze({
//   read: COLORS['surface-light'],
//   create: '#284151',
//   update: '#29332e',
//   delete: '#3e2325',
// })
