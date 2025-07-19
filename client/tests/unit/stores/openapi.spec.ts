import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOpenApiStore } from '~/stores/openapi'
import openApiFixture from '@fixtures/openapi.response.json'
import type { paths } from '~~/types'

// Mock the dependencies
// vi.mock('~/utils/consts/resources', () => ({
//   API_RESOURCE_MAP: {
//     sites: '/api/sites/{id}',
//     siteUserPrivileges: '/api/site_user_privileges/{id}',
//   },
//   isApiResourcePath: (value: unknown): value is `/api/${string}/{id}` => {
//     return typeof value === 'string' && /^\/api\/[^/]+\/\{id\}$/.test(value)
//   },
// }))

// vi.mock('~/stores/messages', () => ({
//   useMessagesStore: () => ({
//     addError: vi.fn(),
//   }),
// }))
//
// // Mock Nuxt composables
// vi.mock('#app', () => ({
//   useNuxtApp: () => ({
//     $config: {
//       public: {
//         apiBaseUrl: 'http://localhost',
//       },
//     },
//   }),
// }))
//
// // Mock $fetch
// global.$fetch = vi.fn()

describe('useOpenApiStore', () => {
  describe('findApiResourcePath', () => {
    let store: ReturnType<typeof useOpenApiStore>

    beforeEach(() => {
      setActivePinia(createPinia())
      store = useOpenApiStore()

      // Set the fixture data as the internal spec
      store.specInternal = openApiFixture as any
    })

    describe('when target path is already an API resource path', () => {
      it('should return the same path for single resource endpoints', () => {
        const targetPath = '/api/sites' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).toBe('/api/sites')
      })

      it('should return the same path for site user privileges resource', () => {
        const targetPath = '/api/site_user_privileges' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).toBe('/api/site_user_privileges')
      })
    })

    describe('when target path is a collection endpoint', () => {
      it('should find corresponding resource path for sites collection', () => {
        const targetPath = '/api/sites/{id}' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).toBe('/api/sites')
      })

      it('should find corresponding resource path for site user privileges collection', () => {
        const targetPath = '/api/site_user_privileges/{id}' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).toBe('/api/site_user_privileges')
      })

      it('should match endpoints by shared tags', () => {
        const targetPath = '/api/sites/{id}' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        // Verify that both endpoints have the same tag
        const targetTags = openApiFixture.paths[targetPath]?.get?.tags || []
        const resultTags = openApiFixture.paths[result!]?.get?.tags || []

        expect(targetTags).toContain('Site')
        expect(resultTags).toContain('Site')
        expect(result).toBe('/api/sites')
      })
    })

    describe('when target path has no matching resource', () => {
      it('should return undefined for login endpoint with different tag', () => {
        const targetPath = '/api/login' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).toBeUndefined()
      })

      it('should return undefined for non-existent paths', () => {
        const targetPath = '/api/non-existent' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).toBeUndefined()
      })
    })

    describe.skip('when openApi spec conditions are not met', () => {
      it('should return undefined when specInternal is not set', () => {
        store.specInternal = undefined as any
        const targetPath = '/api/sites' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).toBeUndefined()
      })

      it('should return undefined when target path has no GET operation', () => {
        // Mock a spec with no GET operation for the target path
        const mockSpec = {
          ...openApiFixture,
          paths: {
            ...openApiFixture.paths,
            '/api/test-no-get': {
              post: {
                operationId: 'test_post',
                tags: ['Test'],
                responses: {},
              },
            },
          },
        }
        store.specInternal = mockSpec as any

        const targetPath = '/api/test-no-get' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).toBeUndefined()
      })

      it('should return undefined when paths object is missing', () => {
        const specWithoutPaths = {
          ...openApiFixture,
          paths: undefined,
        }
        store.specInternal = specWithoutPaths as any

        const targetPath = '/api/sites' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        expect(result).toBeUndefined()
      })
    })

    describe.skip('tag matching edge cases', () => {
      it('should handle endpoints with no tags', () => {
        const mockSpec = {
          ...openApiFixture,
          paths: {
            '/api/test-no-tags': {
              get: {
                operationId: 'test_get',
                // No tags property
                responses: {},
              },
            },
            '/api/test-no-tags/{id}': {
              get: {
                operationId: 'test_get_item',
                // No tags property
                responses: {},
              },
            },
          },
        }
        store.specInternal = mockSpec as any

        const targetPath = '/api/test-no-tags' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        // Should match since both have empty/undefined tags arrays
        expect(result).toBe('/api/test-no-tags/{id}')
      })

      it('should handle endpoints with empty tags array', () => {
        const mockSpec = {
          ...openApiFixture,
          paths: {
            '/api/test-empty-tags': {
              get: {
                operationId: 'test_get',
                tags: [], // Empty array
                responses: {},
              },
            },
            '/api/test-empty-tags/{id}': {
              get: {
                operationId: 'test_get_item',
                tags: [], // Empty array
                responses: {},
              },
            },
          },
        }
        store.specInternal = mockSpec as any

        const targetPath = '/api/test-empty-tags' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        // Should match since both have empty tags arrays
        expect(result).toBe('/api/test-empty-tags/{id}')
      })

      it('should return first matching resource when multiple resources share tags', () => {
        const mockSpec = {
          ...openApiFixture,
          paths: {
            '/api/sites': openApiFixture.paths['/api/sites'],
            '/api/sites/{id}': openApiFixture.paths['/api/sites/{id}'],
            '/api/sites2/{id}': {
              get: {
                operationId: 'api_sites2_id_get',
                tags: ['Site'], // Same tag as sites
                responses: {
                  '200': {
                    description: 'Site resource',
                    content: {
                      'application/ld+json': {
                        schema: {
                          $ref: '#/components/schemas/Site.jsonld-site.acl.read',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        }
        store.specInternal = mockSpec as any

        const targetPath = '/api/sites' as keyof paths
        const result = store.findApiResourcePath(targetPath)

        // Should return one of the matching resource paths
        expect(result).toMatch(/^\/api\/sites.*\{id\}$/)
      })
    })

    describe('real fixture data validation', () => {
      it('should correctly identify Site tag relationships', () => {
        const resourcePath = '/api/sites' as keyof paths
        const itemPath = '/api/sites/{id}' as keyof paths

        const collectionTags =
          openApiFixture.paths[resourcePath]?.get?.tags || []
        const resourceTags = openApiFixture.paths[itemPath]?.get?.tags || []

        expect(collectionTags).toEqual(['Site'])
        expect(resourceTags).toEqual(['Site'])

        const result = store.findApiResourcePath(itemPath)
        expect(result).toBe(resourcePath)
      })

      it('should correctly identify SiteUserPrivilege tag relationships', () => {
        const collectionPath = '/api/site_user_privileges' as keyof paths
        const itemPath = '/api/site_user_privileges/{id}' as keyof paths

        const collectionTags =
          openApiFixture.paths[collectionPath]?.get?.tags || []
        const resourceTags = openApiFixture.paths[itemPath]?.get?.tags || []

        expect(collectionTags).toEqual(['SiteUserPrivilege'])
        expect(resourceTags).toEqual(['SiteUserPrivilege'])

        const result = store.findApiResourcePath(itemPath)
        expect(result).toBe(collectionPath)
      })

      it('should not match login endpoint due to different tags', () => {
        const loginPath = '/api/login' as keyof paths
        const loginTags = openApiFixture.paths[loginPath]?.post?.tags || []

        expect(loginTags).toEqual(['Login Check'])

        const result = store.findApiResourcePath(loginPath)
        expect(result).toBeUndefined()
      })
    })

    describe('store integration', () => {
      it('should work within the store context with proper reactivity', () => {
        expect(store.ready).toBe(true)

        const result = store.findApiResourcePath(
          '/api/sites/{id}' as keyof paths,
        )
        expect(result).toBe('/api/sites')
      })

      it('should handle store state changes', () => {
        // Initially has spec
        expect(
          store.findApiResourcePath('/api/sites/{id}' as keyof paths),
        ).toBe('/api/sites')

        // Clear spec
        store.specInternal = undefined as any
        expect(store.ready).toBe(false)
        expect(
          store.findApiResourcePath('/api/sites/{id}' as keyof paths),
        ).toBeUndefined()

        // Restore spec
        store.specInternal = openApiFixture as any
        expect(store.ready).toBe(true)
        expect(
          store.findApiResourcePath('/api/sites/{id}' as keyof paths),
        ).toBe('/api/sites')
      })
    })
  })
})
