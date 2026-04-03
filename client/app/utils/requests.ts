import type { DataTableComponentOptions } from '~~/types'

export const dataTableOptionsToQsObject = (
  dataTableOptions: DataTableComponentOptions,
) => {
  const options = Object.assign({}, dataTableOptions)

  // Handle itemsPerPage -1 case (show all items)
  if (options.itemsPerPage === -1) {
    delete options.itemsPerPage
  }

  // Create order object from sortBy array
  const order: Record<string, 'asc' | 'desc'> = {}
  options.sortBy?.forEach((sortItem) => {
    order[sortItem.key] = sortItem.order || 'asc'
  })

  return {
    order,
    page: options.page,
    itemsPerPage: options.itemsPerPage,
    ...(options.search && { search: options.search }),
  }
}
