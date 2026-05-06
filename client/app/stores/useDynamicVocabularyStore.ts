import { useQueryCache } from '@pinia/colada'
import { GetCollectionOperation } from '~/api/operations/GetCollectionOperation'
import type { DynamicVocabularyPath } from '~~/types'

const CHUNK_SIZE = 100
const STALE_TIME = 10 * 60 * 1000
const GC_TIME = 10 * 60 * 1000

export type VocabItem = Record<string, any> & { '@id'?: string }

export const useDynamicVocabularyStore = <P extends DynamicVocabularyPath>(
  path: P,
) =>
  defineStore(`dynamicVocabulary:${path}`, () => {
    const op = new GetCollectionOperation(path)
    const queryCache = useQueryCache()

    const items = ref(new Map<string, VocabItem>())
    const pending = ref(new Set<string>())

    const project = (member: VocabItem[] = []) => {
      for (const it of member) {
        if (!it?.['@id']) continue
        items.value.set(it['@id'], it)
        pending.value.delete(it['@id'])
      }
    }

    // ── batched id-lookup queue ───────────────────────────────────
    let queue = new Set<string>()
    let scheduled = false

    const idFromIri = (iri: string) => iri.split('/').pop()!

    const enqueue = (iri: string) => {
      if (items.value.has(iri) || queue.has(iri)) return
      queue.add(iri)
      pending.value.add(iri)
      if (!scheduled) {
        scheduled = true
        queueMicrotask(flush)
      }
    }

    async function flush() {
      scheduled = false
      const all = [...queue]
      queue = new Set()
      const slice = all.slice(0, CHUNK_SIZE)
      for (const leftover of all.slice(CHUNK_SIZE)) queue.add(leftover)

      const ids = slice.map(idFromIri).sort()
      try {
        const entry = queryCache.ensure<{ member?: VocabItem[] }>({
          key: [path, 'byIds', ids],
          query: () =>
            op.request({
              query: { id: ids } as unknown as Record<string, string>,
            }) as unknown as Promise<{ member?: VocabItem[] }>,
          staleTime: STALE_TIME,
          gcTime: GC_TIME,
        })
        const state = await queryCache.fetch(entry)
        project(state.data?.member)
      } finally {
        // Anything still pending in `slice` was not returned (e.g. deleted)
        // → drop from pending so cells stop showing the spinner.
        for (const iri of slice) pending.value.delete(iri)
      }
      if (queue.size && !scheduled) {
        scheduled = true
        queueMicrotask(flush)
      }
    }

    const fetchPage = (
      page: number,
      opts?: { search?: string; order?: 'value' | 'id' },
    ) => {
      const order = opts?.order ?? 'id'
      const search = opts?.search ?? ''
      const entry = queryCache.ensure<{
        member?: VocabItem[]
        totalItems?: number
      }>({
        key: [path, 'page', page, search, order],
        query: () =>
          op.request({
            query: {
              page: String(page),
              itemsPerPage: String(CHUNK_SIZE),
              [`order[${order}]`]: 'asc',
              ...(search ? { search } : {}),
            },
          }) as unknown as Promise<{
            member?: VocabItem[]
            totalItems?: number
          }>,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
      })
      return queryCache.fetch(entry).then((state) => {
        project(state.data?.member)
        return state.data
      })
    }

    const get = (iri?: string) =>
      computed(() => {
        if (!iri) return undefined
        if (!items.value.has(iri)) enqueue(iri)
        return items.value.get(iri)
      })

    const getValue = (iri?: string | null, prop = 'value') =>
      computed(() => {
        if (!iri) return undefined
        if (!items.value.has(iri)) {
          enqueue(iri)
          return undefined
        }
        return getNestedValue(items.value.get(iri), prop)
      })

    const getValuesText = (
      refs: { '@id'?: string }[] | undefined,
      prop = 'value',
      separator = ', ',
    ) =>
      computed(() =>
        (refs ?? [])
          .map((r) => r['@id'])
          .filter((iri): iri is string => !!iri)
          .map((iri) => {
            if (!items.value.has(iri)) {
              enqueue(iri)
              return undefined
            }
            return getNestedValue(items.value.get(iri), prop)
          })
          .filter(Boolean)
          .join(separator),
      )

    const isPending = (iri?: string | null) =>
      computed(() => !!iri && pending.value.has(iri))

    // ── mutations (write-through + Colada invalidation) ───────────
    const upsert = (item: VocabItem | undefined | null) => {
      if (!item?.['@id']) return
      project([item])
      queryCache.invalidateQueries({ key: [path, 'page'] })
    }

    const remove = (iri: string) => {
      items.value.delete(iri)
      pending.value.delete(iri)
      queryCache.invalidateQueries({ key: [path] })
    }

    const invalidateAll = () => {
      items.value.clear()
      pending.value.clear()
      queue.clear()
      queryCache.invalidateQueries({ key: [path] })
    }

    return {
      // read
      get,
      getValue,
      getValuesText,
      isPending,
      // write-through (pickers + CRUD success handlers)
      upsert,
      remove,
      invalidateAll,
      // pagewalk (list/picker UIs)
      fetchPage,
      // introspection
      items: computed(() => items.value),
      pending: computed(() => pending.value),
    }
  })()
