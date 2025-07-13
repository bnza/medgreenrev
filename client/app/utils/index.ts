import { RESOURCE_CONFIG_MAP } from '~/utils/consts/configs'
import type { ApiResourceKey } from '~/utils/consts/resources'

export const getApiResourceConfig = (key: ApiResourceKey) =>
  RESOURCE_CONFIG_MAP[key]
