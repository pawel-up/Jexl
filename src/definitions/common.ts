/**
 * Gets the length of a string or array.
 * @param val - The string or array to get the length of.
 * @returns The length of the string or array.
 */
export const LENGTH = (val: string | unknown[]): number => val.length

/**
 * Checks if a string is empty or contains only whitespace.
 * @param val - The string to check.
 * @returns True if the string is empty or whitespace, false otherwise.
 */
export const IS_EMPTY = (val: string | unknown[]): boolean => {
  return !val || (Array.isArray(val) ? val.length === 0 : val.trim().length === 0)
}

/**
 * Checks if a string is not empty and contains non-whitespace characters.
 * @param val - The string to check.
 * @returns True if the string is not empty, false otherwise.
 */
export const IS_NOT_EMPTY = (val: string | unknown[]): boolean => {
  return !IS_EMPTY(val)
}

/**
 * Checks if a string contains a specified substring.
 * @param val - The string to check.
 * @param searchString - The substring to search for.
 * @returns True if the string contains the substring, false otherwise.
 */
export const CONTAINS = (val: string | unknown[], searchString: string): boolean => {
  if (Array.isArray(val)) {
    return val.includes(searchString)
  }
  return val.includes(searchString)
}

/**
 * Finds the index of a substring in a string or an index of an array item.
 * @param val - The string to search in.
 * @param searchString - The substring to search for.
 * @returns The index of the substring, or -1 if not found.
 */
export const INDEX_OF = (val: string | unknown[], searchString: string) => {
  if (Array.isArray(val)) {
    return val.findIndex((item) => item === searchString)
  }
  return val.indexOf(searchString)
}

/**
 * Finds the last index of a substring in a string or array.
 * @param val - The string to search in.
 * @param searchString - The substring to search for.
 * @returns The last index of the substring, or -1 if not found.
 */
export const LAST_INDEX_OF = (val: string | unknown[], searchString: string) => {
  if (Array.isArray(val)) {
    return val.findLastIndex((item) => item === searchString)
  }
  return val.lastIndexOf(searchString)
}

/**
 * Reverses a string or array.
 * @param val - The string or array to reverse.
 * @returns The reversed string or array.
 */
export const REVERSE = (val: string | unknown[]) => {
  if (Array.isArray(val)) {
    return [...val].reverse()
  }
  return [...(val || '')].reverse().join('')
}
