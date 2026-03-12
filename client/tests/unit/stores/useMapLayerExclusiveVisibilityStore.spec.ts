import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMapLayerExclusiveVisibilityStore } from '~/stores/useMapLayerExclusiveVisibilityStore'

describe('useMapLayerExclusiveVisibilityStore', () => {
  let store: ReturnType<typeof useMapLayerExclusiveVisibilityStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useMapLayerExclusiveVisibilityStore()
  })

  describe('default state', () => {
    it('should have archaeological sites base layer active by default', () => {
      expect(
        store.isActive(
          'archaeologicalSite',
          '/api/features/archaeological_sites',
        ),
      ).toBe(true)
    })

    it('should have history locations base layer active by default', () => {
      expect(
        store.isActive('vocHistoryLocation', '/api/features/history/locations'),
      ).toBe(true)
    })

    it('should have sampling sites base layer active by default', () => {
      expect(
        store.isActive('samplingSite', '/api/features/sampling_sites'),
      ).toBe(true)
    })
  })

  describe('activation', () => {
    it('should deactivate previous layer when activating a new one in the same group', () => {
      store.setActive('archaeologicalSite', '/api/features/botany/charcoals')

      expect(
        store.isActive('archaeologicalSite', '/api/features/botany/charcoals'),
      ).toBe(true)
      expect(
        store.isActive(
          'archaeologicalSite',
          '/api/features/archaeological_sites',
        ),
      ).toBe(false)
    })
  })

  describe('deactivation (toggle off)', () => {
    it('should set group to null when toggling the already-active layer', () => {
      store.setActive(
        'archaeologicalSite',
        '/api/features/archaeological_sites',
      )

      expect(
        store.isActive(
          'archaeologicalSite',
          '/api/features/archaeological_sites',
        ),
      ).toBe(false)
      expect(store.activeLayers.get('archaeologicalSite')).toBeNull()
    })
  })

  describe('cross-group independence', () => {
    it('should not affect other groups when changing active layer in one group', () => {
      store.setActive('archaeologicalSite', '/api/features/botany/charcoals')

      expect(
        store.isActive('vocHistoryLocation', '/api/features/history/locations'),
      ).toBe(true)
      expect(
        store.isActive('samplingSite', '/api/features/sampling_sites'),
      ).toBe(true)
    })

    it('should not affect other groups when toggling off a layer', () => {
      store.setActive('samplingSite', '/api/features/sampling_sites')

      expect(store.activeLayers.get('samplingSite')).toBeNull()
      expect(
        store.isActive(
          'archaeologicalSite',
          '/api/features/archaeological_sites',
        ),
      ).toBe(true)
      expect(
        store.isActive('vocHistoryLocation', '/api/features/history/locations'),
      ).toBe(true)
    })
  })

  describe('isActive correctness', () => {
    it('should return false for a non-active layer in a group', () => {
      expect(
        store.isActive('archaeologicalSite', '/api/features/botany/charcoals'),
      ).toBe(false)
    })

    it('should return false for any layer when group is set to null', () => {
      store.setActive(
        'archaeologicalSite',
        '/api/features/archaeological_sites',
      )

      expect(
        store.isActive(
          'archaeologicalSite',
          '/api/features/archaeological_sites',
        ),
      ).toBe(false)
      expect(
        store.isActive('archaeologicalSite', '/api/features/botany/charcoals'),
      ).toBe(false)
    })
  })
})
