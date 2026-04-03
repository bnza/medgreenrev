export default (length = 10) => {
  const shuffleArray = <T>(array: Array<T>): Array<T> => {
    const _array = [...array]
    for (let i = _array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = _array[i]!
      _array[i] = _array[j]!
      _array[j] = temp
    }
    return _array
  }

  function randomIndex(array: CharType): TypeIndex
  function randomIndex(array: string): number

  function randomIndex(array: CharType | string): number {
    return Math.floor(Math.random() * array.length)
  }

  const randomItem = (indexed: CharType | string): string =>
    Array.isArray(indexed)
      ? indexed[randomIndex(indexed)]!
      : indexed.charAt(randomIndex(indexed))

  length = length < 8 ? 8 : length
  const digits = '0123456789'
  const uppercases = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercases = 'abcdefghijklmnopqrstuvwxyz'
  const nonWords = '!@#$%^&*()'

  type CharType = [string, string, string, string]
  type TypeIndex = 0 | 1 | 2 | 3
  const types: CharType = [digits, uppercases, lowercases, nonWords]

  const randomChar = (typeIndex: TypeIndex) => randomItem(types[typeIndex])

  const generateRandomTypeIndexes = () => {
    const typeIndexes: TypeIndex[] = []

    for (let i = 0; i < length - types.length; i++) {
      typeIndexes.push(randomIndex(types))
    }

    for (let i = 0; i < types.length; i++) {
      typeIndexes.push(i as TypeIndex)
    }

    return shuffleArray(typeIndexes)
  }

  return generateRandomTypeIndexes().map(randomChar).join('')
}
