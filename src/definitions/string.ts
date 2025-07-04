/**
 * Converts a string to uppercase.
 * @param val - The string to convert.
 * @returns The uppercase string.
 */
export const toUpper = (val: string) => val.toUpperCase()

/**
 * Converts a string to lowercase.
 * @param val - The string to convert.
 * @returns The lowercase string.
 */
export const toLower = (val: string) => val.toLowerCase()

/**
 * Extracts a substring from a string.
 * @param val - The string to extract from.
 * @param start - The starting index.
 * @param end - The ending index (optional).
 * @returns The extracted substring.
 */
export const substr = (val: string, start: number, end?: number) => val.substring(start, end)

/**
 * Splits a string into an array of substrings.
 * @param val - The string to split.
 * @param separator - The separator to use for splitting.
 * @returns An array of substrings.
 */
export const split = (val: string, separator: string) => val.split(separator)

/**
 * Joins an array of elements into a string.
 * @param val - The array to join.
 * @param separator - The separator to use for joining.
 * @returns The joined string.
 */
export const join = (val: unknown[], separator: string) => val.join(separator)

/**
 * Replaces the first occurrence of a substring with another string.
 * @param val - The string to search in.
 * @param oldStr - The substring to replace.
 * @param newStr - The replacement string.
 * @returns The string with the first occurrence replaced.
 */
export const replace = (val: string, oldStr: string, newStr: string) => val.replace(oldStr, newStr)

/**
 * Removes whitespace from both ends of a string.
 * @param val - The string to trim.
 * @returns The trimmed string.
 */
export const trim = (val: string) => val.trim()

/**
 * Gets the length of a string or array.
 * @param val - The string or array to get the length of.
 * @returns The length of the string or array.
 */
export const len = (val: string | unknown[]) => val.length

/**
 * Capitalizes the first letter of a string.
 * @param val - The string to capitalize.
 * @returns The capitalized string.
 */
export const capitalize = (val: string) => {
  if (!val) return val
  return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
}

/**
 * Capitalizes the first letter of each word in a string.
 * @param val - The string to title case.
 * @returns The title cased string.
 */
export const titleCase = (val: string) => {
  return val.replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * Converts a string to camelCase.
 * @param val - The string to convert.
 * @returns The camelCase string.
 */
export const camelCase = (val: string) => {
  let trimmed = val.trim()
  trimmed = trimmed
    // Convert sequences of uppercase letters to first uppercase, rest lowercase
    .replace(/[A-Z]{2,}/g, (match) => match.charAt(0) + match.slice(1).toLowerCase())
    // Capitalize characters after non-alphanumeric delimiters
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, character) => character.toUpperCase())
    // Remove any remaining non-alphanumeric characters
    .replace(/[^a-zA-Z0-9]/g, '')
  trimmed = trimmed[0].toLowerCase() + trimmed.substring(1)
  return trimmed
}

/**
 * Converts a string to PascalCase.
 * @param val - The string to convert.
 * @returns The PascalCase string.
 */
export const pascalCase = (val: string) => {
  let trimmed = val.trim()
  trimmed = trimmed
    // Convert sequences of uppercase letters to first uppercase, rest lowercase
    .replace(/[A-Z]{2,}/g, (match) => match.charAt(0) + match.slice(1).toLowerCase())
    // Capitalize characters after non-alphanumeric delimiters
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, character) => character.toUpperCase())
    // Remove any remaining non-alphanumeric characters
    .replace(/[^a-zA-Z0-9]/g, '')
  if (!trimmed) {
    return trimmed
  }
  trimmed = trimmed[0].toUpperCase() + trimmed.substring(1)
  return trimmed
}

/**
 * Converts a string to snake_case.
 * @param val - The string to convert.
 * @returns The snake_case string.
 */
export const snakeCase = (val: string) => {
  let trimmed = val.trim()
  trimmed =
    trimmed
      .match(/[A-Z]{2,}(?=[ A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      // Match words based on various patterns
      ?.map((x) => x.toLowerCase()) // Convert each word to lowercase
      .join('_') || '' // Join the words with underscores

  return trimmed
}

/**
 * Converts a string to kebab-case.
 * @param val - The string to convert.
 * @returns The kebab-case string.
 */
export const kebabCase = (val: string) => {
  let trimmed = val.trim()
  trimmed =
    trimmed
      .match(/[A-Z]{2,}(?=[ A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      // Match words based on various patterns
      ?.map((x) => x.toLowerCase()) // Convert each word to lowercase
      .join('-') || '' // Join the words with hyphens

  return trimmed
}

/**
 * Pads a string to a specified length with a pad string.
 * @param val - The string to pad.
 * @param targetLength - The target length.
 * @param padString - The string to pad with (default: ' ').
 * @returns The padded string.
 */
export const pad = (val: string, targetLength: number, padString = ' ') => {
  return val.padStart(targetLength, padString)
}

/**
 * Pads a string to the left.
 * @param val - The string to pad.
 * @param targetLength - The target length.
 * @param padString - The string to pad with (default: ' ').
 * @returns The left-padded string.
 */
export const padLeft = (val: string, targetLength: number, padString = ' ') => {
  return val.padStart(targetLength, padString)
}

/**
 * Pads a string to the right.
 * @param val - The string to pad.
 * @param targetLength - The target length.
 * @param padString - The string to pad with (default: ' ').
 * @returns The right-padded string.
 */
export const padRight = (val: string, targetLength: number, padString = ' ') => {
  return val.padEnd(targetLength, padString)
}

/**
 * Repeats a string a specified number of times.
 * @param val - The string to repeat.
 * @param count - The number of times to repeat.
 * @returns The repeated string.
 */
export const repeat = (val: string, count: number) => {
  return val.repeat(count)
}

/**
 * Reverses a string.
 * @param val - The string to reverse.
 * @returns The reversed string.
 */
export const reverse = (val: string) => {
  return [...(val || '')].reverse().join('')
}

/**
 * Truncates a string to a specified length.
 * @param val - The string to truncate.
 * @param maxLength - The maximum length.
 * @param suffix - The suffix to add if truncated (default: '...').
 * @returns The truncated string.
 */
export const truncate = (val: string, maxLength: number, suffix = '...') => {
  if (val.length <= maxLength) return val
  return val.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Checks if a string starts with a specified substring.
 * @param val - The string to check.
 * @param searchString - The substring to search for.
 * @returns True if the string starts with the substring, false otherwise.
 */
export const startsWith = (val: string, searchString: string) => {
  return val.startsWith(searchString)
}

/**
 * Checks if a string ends with a specified substring.
 * @param val - The string to check.
 * @param searchString - The substring to search for.
 * @returns True if the string ends with the substring, false otherwise.
 */
export const endsWith = (val: string, searchString: string) => {
  return val.endsWith(searchString)
}

/**
 * Checks if a string contains a specified substring.
 * @param val - The string to check.
 * @param searchString - The substring to search for.
 * @returns True if the string contains the substring, false otherwise.
 */
export const contains = (val: string, searchString: string) => {
  return val.includes(searchString)
}

/**
 * Finds the index of a substring in a string.
 * @param val - The string to search in.
 * @param searchString - The substring to search for.
 * @returns The index of the substring, or -1 if not found.
 */
export const indexOf = (val: string, searchString: string) => {
  return val.indexOf(searchString)
}

/**
 * Finds the last index of a substring in a string.
 * @param val - The string to search in.
 * @param searchString - The substring to search for.
 * @returns The last index of the substring, or -1 if not found.
 */
export const lastIndexOf = (val: string, searchString: string) => {
  return val.lastIndexOf(searchString)
}

/**
 * Replaces all occurrences of a substring with another string.
 * @param val - The string to search in.
 * @param searchValue - The value to search for.
 * @param replaceValue - The value to replace with.
 * @returns The string with all occurrences replaced.
 */
export const replaceAll = (val: string, searchValue: string, replaceValue: string) => {
  return val.replaceAll(searchValue, replaceValue)
}

/**
 * Removes whitespace from both ends of a string.
 * @param val - The string to trim.
 * @returns The trimmed string.
 */
export const trimStart = (val: string) => {
  return val.trimStart()
}

/**
 * Removes whitespace from the end of a string.
 * @param val - The string to trim.
 * @returns The trimmed string.
 */
export const trimEnd = (val: string) => {
  return val.trimEnd()
}

/**
 * Checks if a string is empty or contains only whitespace.
 * @param val - The string to check.
 * @returns True if the string is empty or whitespace, false otherwise.
 */
export const isEmpty = (val: string) => {
  return !val || val.trim().length === 0
}

/**
 * Checks if a string is not empty and contains non-whitespace characters.
 * @param val - The string to check.
 * @returns True if the string is not empty, false otherwise.
 */
export const isNotEmpty = (val: string) => {
  return !isEmpty(val)
}

/**
 * Converts a string to a slug (URL-friendly format).
 * @param val - The string to convert.
 * @returns The slug string.
 */
export const slug = (val: string) => {
  return val
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Escapes HTML special characters in a string.
 * @param val - The string to escape.
 * @returns The escaped string.
 */
export const escapeHtml = (val: string) => {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return val.replace(/[&<>"']/g, (match) => htmlEscapes[match])
}

/**
 * Unescapes HTML entities in a string.
 * @param val - The string to unescape.
 * @returns The unescaped string.
 */
export const unescapeHtml = (val: string) => {
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  }
  return val.replace(/&(?:amp|lt|gt|quot|#39);/g, (match) => htmlUnescapes[match])
}

/**
 * Counts the number of words in a string.
 * @param val - The string to count words in.
 * @returns The number of words.
 */
export const wordCount = (val: string) => {
  if (!val || val.trim().length === 0) return 0
  return val
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
}

/**
 * Counts the number of characters in a string.
 * @param val - The string to count characters in.
 * @returns The number of characters.
 */
export const charCount = (val: string) => {
  return val.length
}

/**
 * Extracts initials from a string (typically a name).
 * @param val - The string to extract initials from.
 * @returns The initials string.
 */
export const initials = (val: string) => {
  if (!val || val.trim().length === 0) return ''
  return val
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

/**
 * Converts a string to an array of lines.
 * @param val - The string to split into lines.
 * @returns An array of lines.
 */
export const lines = (val: string) => {
  return val.split(/\r?\n/)
}

/**
 * Removes duplicate consecutive whitespace characters.
 * @param val - The string to normalize.
 * @returns The normalized string.
 */
export const normalizeSpace = (val: string) => {
  return val.replace(/\s+/g, ' ').trim()
}

/**
 * Masks a string by replacing characters with a mask character.
 * @param val - The string to mask.
 * @param maskChar - The character to use for masking (default: '*').
 * @param visibleStart - Number of characters to keep visible at the start (default: 0).
 * @param visibleEnd - Number of characters to keep visible at the end (default: 0).
 * @returns The masked string.
 */
export const mask = (val: string, maskChar = '*', visibleStart = 0, visibleEnd = 0) => {
  if (val.length <= visibleStart + visibleEnd) return val

  const start = val.substring(0, visibleStart)
  const end = val.substring(val.length - visibleEnd)
  const middle = maskChar.repeat(val.length - visibleStart - visibleEnd)

  return start + middle + end
}

/**
 * Extracts a substring between two delimiters.
 * @param val - The string to extract from.
 * @param startDelim - The start delimiter.
 * @param endDelim - The end delimiter.
 * @returns The extracted substring.
 */
export const between = (val: string, startDelim: string, endDelim: string) => {
  const start = val.indexOf(startDelim)
  if (start === -1) return ''

  const end = val.indexOf(endDelim, start + startDelim.length)
  if (end === -1) return ''

  return val.substring(start + startDelim.length, end)
}
