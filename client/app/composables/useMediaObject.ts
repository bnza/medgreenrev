import type { GetItemResponseMap } from '~~/types'

const apiBaseUrl = useNuxtApp().$config.public.apiBaseUrl
export const useMediaObject = (
  mediaObject: GetItemResponseMap['/api/data/media_objects/{id}'],
) => {
  const mediaUrl = mediaObject.contentUrl
    ? apiBaseUrl + mediaObject.contentUrl
    : undefined

  const mediaThumbnailUrl = mediaObject.contentThumbnailUrl
    ? apiBaseUrl + mediaObject.contentThumbnailUrl
    : undefined

  const fileName = mediaObject.originalFilename?.replace(/\.(\w+)$/, '')

  const extension = fileName
    ? mediaObject.originalFilename?.slice(fileName.length + 1)
    : undefined

  const icons: Record<string, string> = {
    'application/vnd.oasis.opendocument.spreadsheet': 'far fa-file-excel',
    'application/vnd.ms-excel': 'far fa-file-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      'far fa-file-excel',
  }

  const icon =
    mediaObject.mimeType && mediaObject.mimeType in icons
      ? icons[mediaObject.mimeType]!
      : 'fa fa-file'

  const iconColors: Record<string, string> = {
    'application/vnd.oasis.opendocument.spreadsheet': 'green-darken-3',
    'application/vnd.ms-excel': 'green-darken-3',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      'green-darken-3',
  }

  const iconColor =
    mediaObject.mimeType && mediaObject.mimeType in iconColors
      ? iconColors[mediaObject.mimeType]!
      : 'grey-darken-2'

  return {
    mediaUrl,
    mediaThumbnailUrl,
    fileName,
    extension,
    icon,
    iconColor,
  }
}
