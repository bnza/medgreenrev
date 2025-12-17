import type { GetFeatureCollectionPath } from '~~/types'

export const PATH_TYPENAME_MAP = {
  '/api/features/history/locations': 'history_locations',
} as const satisfies Record<GetFeatureCollectionPath, string>

// Now you get exact literal types
type TypeName = (typeof PATH_TYPENAME_MAP)[keyof typeof PATH_TYPENAME_MAP]
