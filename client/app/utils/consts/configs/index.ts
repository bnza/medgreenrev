import site from './data/site'
import siteUserPrivilege from './data/siteUserPrivilege'
import user from './data/user'
import type {ApiDataResourceKey, ResourceConfig} from "~~/types";

export const RESOURCE_CONFIG_MAP: Readonly<Record<ApiDataResourceKey, ResourceConfig>> = {
  site,
  siteUserPrivilege,
  user,
} as const;

