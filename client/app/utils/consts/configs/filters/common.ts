// import type { AddToQueryObject, FilterOperationConfig } from '~~/types/filters'
//
// export const addToQueryObjectSingle: AddToQueryObject = (
//   queryObject,
//   filter,
// ) => {
//   queryObject[filter.property] = filter.operands[0]
// }
//
// export const addToQueryObjectMultiple: AddToQueryObject = (
//   queryObject,
//   filter,
// ) => {
//   if (!(filter.property in queryObject)) {
//     queryObject[filter.property] = []
//   }
//   queryObject[filter.property].push(filter.operands[0])
// }
//
// export const addToQueryObjectArray: AddToQueryObject = (
//   queryObject,
//   filter,
// ) => {
//   queryObject[filter.property] = filter.operands
// }
//
// const SearchExact: Readonly<Partial<FilterOperationConfig>> = {
//   operandsComponent: 'SearchExact',
// } as const
