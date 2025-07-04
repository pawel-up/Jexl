/**
 * Jexl common operators as functions.
 * These functions provide additional operators that can be used in Jexl expressions.
 */

/**
 * Logical AND operator.
 * @param a - First value.
 * @param b - Second value.
 * @returns True if both values are truthy, false otherwise.
 */
export const and = (a: unknown, b: unknown) => Boolean(a) && Boolean(b)

/**
 * Logical OR operator.
 * @param a - First value.
 * @param b - Second value.
 * @returns True if either value is truthy, false otherwise.
 */
export const or = (a: unknown, b: unknown) => Boolean(a) || Boolean(b)

/**
 * Logical NOT operator.
 * @param a - The value to negate.
 * @returns True if the value is falsy, false otherwise.
 */
export const not = (a: unknown) => !a

/**
 * Logical XOR operator.
 * @param a - First value.
 * @param b - Second value.
 * @returns True if exactly one value is truthy, false otherwise.
 */
export const xor = (a: unknown, b: unknown) => Boolean(a) !== Boolean(b)

/**
 * Equality operator (loose equality).
 * @param a - First value.
 * @param b - Second value.
 * @returns True if values are equal, false otherwise.
 */
export const eq = (a: unknown, b: unknown) => a == b

/**
 * Strict equality operator.
 * @param a - First value.
 * @param b - Second value.
 * @returns True if values are strictly equal, false otherwise.
 */
export const strictEq = (a: unknown, b: unknown) => a === b

/**
 * Inequality operator (loose inequality).
 * @param a - First value.
 * @param b - Second value.
 * @returns True if values are not equal, false otherwise.
 */
export const ne = (a: unknown, b: unknown) => a != b

/**
 * Strict inequality operator.
 * @param a - First value.
 * @param b - Second value.
 * @returns True if values are not strictly equal, false otherwise.
 */
export const strictNe = (a: unknown, b: unknown) => a !== b

/**
 * Greater than operator.
 * @param a - First value.
 * @param b - Second value.
 * @returns True if a is greater than b, false otherwise.
 */
export const gt = (a: number | string, b: number | string) => a > b

/**
 * Greater than or equal operator.
 * @param a - First value.
 * @param b - Second value.
 * @returns True if a is greater than or equal to b, false otherwise.
 */
export const gte = (a: number | string, b: number | string) => a >= b

/**
 * Less than operator.
 * @param a - First value.
 * @param b - Second value.
 * @returns True if a is less than b, false otherwise.
 */
export const lt = (a: number | string, b: number | string) => a < b

/**
 * Less than or equal operator.
 * @param a - First value.
 * @param b - Second value.
 * @returns True if a is less than or equal to b, false otherwise.
 */
export const lte = (a: number | string, b: number | string) => a <= b

/**
 * Between operator (inclusive).
 * @param value - The value to check.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns True if value is between min and max (inclusive), false otherwise.
 */
export const between = (value: number, min: number, max: number) => value >= min && value <= max

/**
 * In operator - checks if a value exists in an array or string.
 * @param value - The value to search for.
 * @param collection - The array or string to search in.
 * @returns True if the value exists in the collection, false otherwise.
 */
export const inOp = (value: unknown, collection: unknown[] | string) => {
  if (typeof collection === 'string') {
    return collection.includes(String(value))
  }
  return Array.isArray(collection) && collection.includes(value)
}

/**
 * Not in operator - checks if a value does not exist in an array or string.
 * @param value - The value to search for.
 * @param collection - The array or string to search in.
 * @returns True if the value does not exist in the collection, false otherwise.
 */
export const notIn = (value: unknown, collection: unknown[] | string) => {
  return !inOp(value, collection)
}

/**
 * Like operator - performs pattern matching (case-insensitive).
 * @param str - The string to test.
 * @param pattern - The pattern to match (supports % as wildcard).
 * @returns True if the string matches the pattern, false otherwise.
 */
export const like = (str: string, pattern: string) => {
  const regexPattern = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape regex special chars
    .replace(/%/g, '.*') // Replace % with .*
  const regex = new RegExp(`^${regexPattern}$`, 'i')
  return regex.test(str)
}

/**
 * Not like operator - performs negative pattern matching.
 * @param str - The string to test.
 * @param pattern - The pattern to match (supports % as wildcard).
 * @returns True if the string does not match the pattern, false otherwise.
 */
export const notLike = (str: string, pattern: string) => {
  return !like(str, pattern)
}

/**
 * Regex match operator.
 * @param str - The string to test.
 * @param pattern - The regex pattern.
 * @param flags - Optional regex flags (default: 'g').
 * @returns True if the string matches the regex, false otherwise.
 */
export const regex = (str: string, pattern: string, flags = 'g') => {
  const regex = new RegExp(pattern, flags)
  return regex.test(str)
}

/**
 * Is null or undefined operator.
 * @param value - The value to check.
 * @returns True if the value is null or undefined, false otherwise.
 */
export const isNull = (value: unknown) => value === null || value === undefined

/**
 * Is not null or undefined operator.
 * @param value - The value to check.
 * @returns True if the value is not null or undefined, false otherwise.
 */
export const isNotNull = (value: unknown) => value !== null && value !== undefined

/**
 * Is empty operator - checks if value is empty (null, undefined, empty string, empty array, empty object).
 * @param value - The value to check.
 * @returns True if the value is empty, false otherwise.
 */
export const isEmpty = (value: unknown) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Is not empty operator.
 * @param value - The value to check.
 * @returns True if the value is not empty, false otherwise.
 */
export const isNotEmpty = (value: unknown) => !isEmpty(value)

/**
 * Type check operator.
 * @param value - The value to check.
 * @param type - The expected type ('string', 'number', 'boolean', 'object', 'array', 'function').
 * @returns True if the value is of the specified type, false otherwise.
 */
export const isType = (value: unknown, type: string) => {
  switch (type.toLowerCase()) {
    case 'string':
      return typeof value === 'string'
    case 'number':
      return typeof value === 'number' && !isNaN(value)
    case 'boolean':
      return typeof value === 'boolean'
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value)
    case 'array':
      return Array.isArray(value)
    case 'function':
      return typeof value === 'function'
    case 'null':
      return value === null || value === undefined
    case 'undefined':
      return value === undefined
    default:
      return false
  }
}

/**
 * Conditional operator (ternary).
 * @param condition - The condition to evaluate.
 * @param trueValue - Value to return if condition is truthy.
 * @param falseValue - Value to return if condition is falsy.
 * @returns The appropriate value based on the condition.
 */
export const ifElse = (condition: unknown, trueValue: unknown, falseValue: unknown) => {
  return condition ? trueValue : falseValue
}

/**
 * Null coalescing operator.
 * @param value - The value to check.
 * @param defaultValue - The default value to return if value is null/undefined.
 * @returns The value if not null/undefined, otherwise the default value.
 */
export const coalesce = (value: unknown, defaultValue: unknown) => {
  return value !== null && value !== undefined ? value : defaultValue
}

/**
 * Safe navigation operator - safely accesses nested properties.
 * @param obj - The object to navigate.
 * @param path - The property path (e.g., 'user.profile.name').
 * @returns The value at the path, or undefined if any part is null/undefined.
 */
export const safeGet = (obj: unknown, path: string) => {
  if (!obj || typeof obj !== 'object') return undefined

  const keys = path.split('.')
  let current: Record<string, unknown> = obj as Record<string, unknown>

  for (const key of keys) {
    if (current === null || current === undefined) return undefined
    current = current[key] as Record<string, unknown>
  }

  return current
}

/**
 * Default operator - returns the first non-null, non-undefined value.
 * @param args - Values to check.
 * @returns The first non-null, non-undefined value, or undefined if all are null/undefined.
 */
export const defaultTo = (...args: unknown[]) => {
  for (const arg of args) {
    if (arg !== null && arg !== undefined) return arg
  }
  return undefined
}

/**
 * Range check operator.
 * @param value - The value to check.
 * @param ranges - Array of [min, max] ranges.
 * @returns True if the value falls within any of the ranges, false otherwise.
 */
export const inRange = (value: number, ...ranges: [number, number][]) => {
  return ranges.some(([min, max]) => value >= min && value <= max)
}

/**
 * Multiple equality operator - checks if value equals any of the provided values.
 * @param value - The value to check.
 * @param values - Values to compare against.
 * @returns True if value equals any of the provided values, false otherwise.
 */
export const equalsAny = (value: unknown, ...values: unknown[]) => {
  return values.includes(value)
}

/**
 * Multiple inequality operator - checks if value does not equal any of the provided values.
 * @param value - The value to check.
 * @param values - Values to compare against.
 * @returns True if value does not equal any of the provided values, false otherwise.
 */
export const notEqualsAny = (value: unknown, ...values: unknown[]) => {
  return !values.includes(value)
}

/**
 * All equality operator - checks if value equals all of the provided values.
 * @param value - The value to check.
 * @param values - Values to compare against.
 * @returns True if value equals all of the provided values, false otherwise.
 */
export const equalsAll = (value: unknown, ...values: unknown[]) => {
  return values.every((v) => v === value)
}

/**
 * Has property operator - checks if an object has a specific property.
 * @param obj - The object to check.
 * @param property - The property name to check for.
 * @returns True if the object has the property, false otherwise.
 */
export const hasProperty = (obj: unknown, property: string) => {
  return typeof obj === 'object' && obj !== null && property in obj
}

/**
 * Instance of operator - checks if an object is an instance of a constructor.
 * @param obj - The object to check.
 * @param constructor - The constructor function.
 * @returns True if the object is an instance of the constructor, false otherwise.
 */
export const instanceOf = (obj: unknown, constructor: new (...args: unknown[]) => unknown) => {
  return obj instanceof constructor
}
