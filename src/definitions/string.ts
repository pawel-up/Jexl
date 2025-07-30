/**
 * Converts a string to uppercase.
 * @param val - The string to convert.
 * @returns The uppercase string.
 */
export const UPPER = (val: string) => val.toUpperCase()

/**
 * Converts a string to lowercase.
 * @param val - The string to convert.
 * @returns The lowercase string.
 */
export const LOWER = (val: string) => val.toLowerCase()

/**
 * Extracts a substring from a string.
 * @param val - The string to extract from.
 * @param start - The starting index.
 * @param end - The ending index (optional).
 * @returns The extracted substring.
 */
export const SUBSTR = (val: string, start: number, end?: number) => val.substring(start, end)

/**
 * Splits a string into an array of substrings.
 * @param val - The string to split.
 * @param separator - The separator to use for splitting.
 * @returns An array of substrings.
 */
export const SPLIT = (val: string, separator: string) => val.split(separator)

/**
 * Replaces the first occurrence of a substring with another string.
 * @param val - The string to search in.
 * @param oldStr - The substring to replace.
 * @param newStr - The replacement string.
 * @returns The string with the first occurrence replaced.
 */
export const REPLACE = (val: string, oldStr: string, newStr: string) => val.replace(oldStr, newStr)

/**
 * Capitalizes the first letter of a string.
 * @param val - The string to capitalize.
 * @returns The capitalized string.
 */
export const CAPITALIZE = (val: string) => {
  if (!val) return val
  return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
}

/**
 * Capitalizes the first letter of each word in a string.
 * @param val - The string to title case.
 * @returns The title cased string.
 */
export const TITLE_CASE = (val: string) => {
  return val.replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * Converts a string to camelCase.
 * @param val - The string to convert.
 * @returns The camelCase string.
 */
export const CAMEL_CASE = (val: string) => {
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
export const PASCAL_CASE = (val: string) => {
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
export const SNAKE_CASE = (val: string) => {
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
export const KEBAB_CASE = (val: string) => {
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
export const PAD = (val: string, targetLength: number, padString = ' ') => {
  return val.padStart(targetLength, padString)
}

/**
 * Pads a string to the left.
 * @param val - The string to pad.
 * @param targetLength - The target length.
 * @param padString - The string to pad with (default: ' ').
 * @returns The left-padded string.
 */
export const PAD_START = (val: string, targetLength: number, padString = ' ') => {
  return val.padStart(targetLength, padString)
}

/**
 * Pads a string to the right.
 * @param val - The string to pad.
 * @param targetLength - The target length.
 * @param padString - The string to pad with (default: ' ').
 * @returns The right-padded string.
 */
export const PAD_END = (val: string, targetLength: number, padString = ' ') => {
  return val.padEnd(targetLength, padString)
}

/**
 * Repeats a string a specified number of times.
 * @param val - The string to repeat.
 * @param count - The number of times to repeat.
 * @returns The repeated string.
 */
export const REPEAT = (val: string, count: number) => {
  return val.repeat(count)
}

/**
 * Truncates a string to a specified length.
 * @param val - The string to truncate.
 * @param maxLength - The maximum length.
 * @param suffix - The suffix to add if truncated (default: '...').
 * @returns The truncated string.
 */
export const TRUNCATE = (val: string, maxLength: number, suffix = '...') => {
  if (val.length <= maxLength) return val
  return val.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Checks if a string starts with a specified substring.
 * @param val - The string to check.
 * @param searchString - The substring to search for.
 * @returns True if the string starts with the substring, false otherwise.
 */
export const STARTS_WITH = (val: string, searchString: string) => {
  return val.startsWith(searchString)
}

/**
 * Checks if a string ends with a specified substring.
 * @param val - The string to check.
 * @param searchString - The substring to search for.
 * @returns True if the string ends with the substring, false otherwise.
 */
export const ENDS_WITH = (val: string, searchString: string) => {
  return val.endsWith(searchString)
}

/**
 * Replaces all occurrences of a substring with another string.
 * @param val - The string to search in.
 * @param searchValue - The value to search for.
 * @param replaceValue - The value to replace with.
 * @returns The string with all occurrences replaced.
 */
export const REPLACE_ALL = (val: string, searchValue: string, replaceValue: string) => {
  return val.replaceAll(searchValue, replaceValue)
}

/**
 * Removes whitespace from both ends of a string.
 * @param val - The string to trim.
 * @returns The trimmed string.
 */
export const TRIM = (val: string) => val.trim()

/**
 * Removes whitespace from both ends of a string.
 * @param val - The string to trim.
 * @returns The trimmed string.
 */
export const TRIM_START = (val: string) => {
  return val.trimStart()
}

/**
 * Removes whitespace from the end of a string.
 * @param val - The string to trim.
 * @returns The trimmed string.
 */
export const TRIM_END = (val: string) => {
  return val.trimEnd()
}

/**
 * Converts a string to a slug (URL-friendly format).
 * @param val - The string to convert.
 * @returns The slug string.
 */
export const SLUG = (val: string) => {
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
export const ESCAPE_HTML = (val: string) => {
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
export const UNESCAPE_HTML = (val: string) => {
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
export const WORD_COUNT = (val: string) => {
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
export const CHAR_COUNT = (val: string) => {
  return val.length
}

/**
 * Extracts initials from a string (typically a name).
 * @param val - The string to extract initials from.
 * @returns The initials string.
 */
export const INITIALS = (val: string) => {
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
export const LINES = (val: string) => {
  return val.split(/\r?\n/)
}

/**
 * Removes duplicate consecutive whitespace characters.
 * @param val - The string to normalize.
 * @returns The normalized string.
 */
export const NORMALIZE_SPACE = (val: string) => {
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
export const MASK = (val: string, maskChar = '*', visibleStart = 0, visibleEnd = 0) => {
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
export const BETWEEN = (val: string, startDelim: string, endDelim: string) => {
  const start = val.indexOf(startDelim)
  if (start === -1) return ''

  const end = val.indexOf(endDelim, start + startDelim.length)
  if (end === -1) return ''

  return val.substring(start + startDelim.length, end)
}
