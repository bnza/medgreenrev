import useAppQuerySite from "~/composables/queries/useAppQuerySite";
import useAppQueryUser from "~/composables/queries/useAppQueryUser";
import type {GetCollectionPath, GetItemPath} from "~~/types";
import {mapGetPathToRepositoryPath} from "~/utils/api";

export default function useRepositoryQuery(path: GetItemPath | GetCollectionPath) {

  const repositoryPath = mapGetPathToRepositoryPath(path)
  // Map of repository paths to their corresponding composables
  const queryComposableMap = {
    '/api/sites': useAppQuerySite,
    '/api/users': useAppQueryUser,
    // Add other repository paths as needed
  } as const;

  // Get the appropriate composable based on repository path
  const composable = queryComposableMap[repositoryPath as keyof typeof queryComposableMap];

  if (!composable) {
    throw new Error(`No query composable found for repository path: ${repositoryPath}`);
  }

  return composable(repositoryPath);
}
