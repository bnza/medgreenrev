import type {ApiResourceKey, JsonLdDocument, paths} from "~~/types";

export const extractApiResourceFromIndex = (index: JsonLdDocument) => Object.fromEntries(
  Object.entries(index)
    .filter(([key]) => !key.startsWith('@'))
)
