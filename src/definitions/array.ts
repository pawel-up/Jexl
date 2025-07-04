/**
 * Jexl array utility functions.
 */

/**
 * Gets the length of an array.
 * @param arr - The array to get the length of.
 * @returns The length of the array.
 */
export const length = (arr: unknown[]) => arr.length

/**
 * Checks if an array is empty.
 * @param arr - The array to check.
 * @returns True if the array is empty, false otherwise.
 */
export const isEmpty = (arr: unknown[]) => arr.length === 0

/**
 * Checks if an array is not empty.
 * @param arr - The array to check.
 * @returns True if the array is not empty, false otherwise.
 */
export const isNotEmpty = (arr: unknown[]) => arr.length > 0

/**
 * Gets the first element of an array.
 * @param arr - The array to get the first element from.
 * @returns The first element, or undefined if empty.
 */
export const first = (arr: unknown[]) => arr[0]

/**
 * Gets the last element of an array.
 * @param arr - The array to get the last element from.
 * @returns The last element, or undefined if empty.
 */
export const last = (arr: unknown[]) => arr[arr.length - 1]

/**
 * Gets the element at a specific index.
 * @param arr - The array to get the element from.
 * @param index - The index to get.
 * @returns The element at the index, or undefined if out of bounds.
 */
export const at = (arr: unknown[], index: number) => arr[index]

/**
 * Checks if an array contains a specific value.
 * @param arr - The array to search in.
 * @param value - The value to search for.
 * @returns True if the array contains the value, false otherwise.
 */
export const contains = (arr: unknown[], value: unknown) => arr.includes(value)

/**
 * Finds the index of a value in an array.
 * @param arr - The array to search in.
 * @param value - The value to search for.
 * @returns The index of the value, or -1 if not found.
 */
export const indexOf = (arr: unknown[], value: unknown) => arr.indexOf(value)

/**
 * Finds the last index of a value in an array.
 * @param arr - The array to search in.
 * @param value - The value to search for.
 * @returns The last index of the value, or -1 if not found.
 */
export const lastIndexOf = (arr: unknown[], value: unknown) => arr.lastIndexOf(value)

/**
 * Reverses an array.
 * @param arr - The array to reverse.
 * @returns A new reversed array.
 */
export const reverse = (arr: unknown[]) => [...arr].reverse()

/**
 * Sorts an array.
 * @param arr - The array to sort.
 * @param compareFn - Optional comparison function.
 * @returns A new sorted array.
 */
export const sort = (arr: unknown[], compareFn?: (a: unknown, b: unknown) => number) => {
  return [...arr].sort(compareFn)
}

/**
 * Sorts an array in ascending order (for numbers/strings).
 * @param arr - The array to sort.
 * @returns A new sorted array.
 */
export const sortAsc = (arr: (number | string)[]) => {
  return [...arr].sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
}

/**
 * Sorts an array in descending order (for numbers/strings).
 * @param arr - The array to sort.
 * @returns A new sorted array.
 */
export const sortDesc = (arr: (number | string)[]) => {
  return [...arr].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))
}

/**
 * Extracts a slice of an array.
 * @param arr - The array to slice.
 * @param start - The start index.
 * @param end - The end index (optional).
 * @returns A new array with the sliced elements.
 */
export const slice = (arr: unknown[], start: number, end?: number) => arr.slice(start, end)

/**
 * Joins array elements into a string.
 * @param arr - The array to join.
 * @param separator - The separator to use (default: ',').
 * @returns The joined string.
 */
export const join = (arr: unknown[], separator = ',') => arr.join(separator)

/**
 * Concatenates arrays or values.
 * Can accept multiple arrays or a mix of arrays and values.
 * @param args - Arrays or values to concatenate.
 * @returns A new concatenated array.
 */
export const concat = (...args: unknown[]) => {
  const result: unknown[] = []
  for (const arg of args) {
    if (Array.isArray(arg)) {
      result.push(...arg)
    } else {
      result.push(arg)
    }
  }
  return result
}

/**
 * Removes duplicate values from an array.
 * @param arr - The array to deduplicate.
 * @returns A new array with unique values.
 */
export const unique = (arr: unknown[]) => [...new Set(arr)]

/**
 * Flattens an array by one level.
 * @param arr - The array to flatten.
 * @returns A new flattened array.
 */
export const flatten = (arr: unknown[]) => arr.flat()

/**
 * Flattens an array deeply.
 * @param arr - The array to flatten.
 * @returns A new deeply flattened array.
 */
export const flattenDeep = (arr: unknown[]) => arr.flat(Infinity)

/**
 * Chunks an array into smaller arrays of specified size.
 * @param arr - The array to chunk.
 * @param size - The size of each chunk.
 * @returns An array of chunks.
 */
export const chunk = (arr: unknown[], size: number) => {
  const chunks: unknown[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

/**
 * Compacts an array by removing falsy values.
 * @param arr - The array to compact.
 * @returns A new array with falsy values removed.
 */
export const compact = (arr: unknown[]) => arr.filter(Boolean)

/**
 * Gets the difference between arrays or values.
 * When the first argument is an array, compares against other arguments.
 * Otherwise, treats all arguments as arrays to compare.
 * @param args - Arrays or values to find differences between.
 * @returns A new array with values from the first array that are not in others.
 */
export const difference = (...args: unknown[]) => {
  if (args.length < 2) return Array.isArray(args[0]) ? [...args[0]] : [args[0]]

  const [first, ...rest] = args
  const firstArr = Array.isArray(first) ? first : [first]
  const otherValues = rest.flat()

  return firstArr.filter((item) => !otherValues.includes(item))
}

/**
 * Gets the intersection of arrays or values.
 * When the first argument is an array, finds intersection with other arguments.
 * Otherwise, treats all arguments as arrays to intersect.
 * @param args - Arrays or values to find intersection of.
 * @returns A new array with values that exist in all arrays.
 */
export const intersection = (...args: unknown[]) => {
  if (args.length < 2) return Array.isArray(args[0]) ? [...args[0]] : [args[0]]

  const [first, ...rest] = args
  const firstArr = Array.isArray(first) ? first : [first]

  return firstArr.filter((item) => {
    return rest.every((arg) => {
      const arr = Array.isArray(arg) ? arg : [arg]
      return arr.includes(item)
    })
  })
}

/**
 * Gets the union of arrays or values (removes duplicates).
 * Combines all arguments into a single array with unique values.
 * @param args - Arrays or values to union.
 * @returns A new array with unique values from all arguments.
 */
export const union = (...args: unknown[]) => {
  return unique(concat(...args))
}

/**
 * Zips multiple arrays together.
 * @param args - The arrays to zip together.
 * @returns An array of tuples containing elements from each array.
 */
export const zip = (...args: unknown[][]) => {
  if (args.length === 0) return []
  if (args.length === 1) return args[0].map((item) => [item])

  const length = Math.min(...args.map((arr) => arr.length))
  const result: unknown[][] = []

  for (let i = 0; i < length; i++) {
    result.push(args.map((arr) => arr[i]))
  }

  return result
}

/**
 * Shuffles an array randomly.
 * @param arr - The array to shuffle.
 * @returns A new shuffled array.
 */
export const shuffle = (arr: unknown[]) => {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Gets a random element from an array.
 * @param arr - The array to get a random element from.
 * @returns A random element from the array.
 */
export const sample = (arr: unknown[]) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Gets multiple random elements from an array.
 * @param arr - The array to sample from.
 * @param count - The number of elements to sample.
 * @returns An array of random elements.
 */
export const sampleSize = (arr: unknown[], count: number) => {
  return shuffle(arr).slice(0, Math.min(count, arr.length))
}

/**
 * Counts occurrences of each value in an array.
 * @param arr - The array to count values in.
 * @returns An object with value counts.
 */
export const countBy = (arr: unknown[]) => {
  const counts: Record<string, number> = {}
  for (const item of arr) {
    const key = String(item)
    counts[key] = (counts[key] || 0) + 1
  }
  return counts
}

/**
 * Groups array elements by a property or function result.
 * @param arr - The array to group.
 * @param keyFn - Function to get the grouping key.
 * @returns An object with grouped arrays.
 */
export const groupBy = (arr: unknown[], keyFn: (item: unknown) => string) => {
  const groups: Record<string, unknown[]> = {}
  for (const item of arr) {
    const key = keyFn(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
  }
  return groups
}

/**
 * Sums numeric values in an array or spread arguments.
 * When the first argument is an array, it will sum the elements of that array.
 * Otherwise, sums all provided arguments.
 * @param args - Array of numbers or individual numbers to sum.
 * @returns The sum of all numbers.
 */
export const sum = (...args: unknown[]) => {
  if (Array.isArray(args[0])) {
    return (args[0] as number[]).reduce((sum, num) => sum + num, 0)
  }
  return (args as number[]).reduce((sum, num) => sum + num, 0)
}

/**
 * Calculates the average of numeric values in an array or spread arguments.
 * When the first argument is an array, it will average the elements of that array.
 * Otherwise, averages all provided arguments.
 * @param args - Array of numbers or individual numbers to average.
 * @returns The average of all numbers.
 */
export const average = (...args: unknown[]) => {
  if (Array.isArray(args[0])) {
    const arr = args[0] as number[]
    if (arr.length === 0) return 0
    return sum(arr) / arr.length
  }
  if (args.length === 0) return 0
  return sum(...(args as number[])) / args.length
}

/**
 * Finds the minimum value in an array or spread arguments.
 * When the first argument is an array, finds minimum in that array.
 * Otherwise, finds minimum among all provided arguments.
 * @param args - Array of numbers or individual numbers.
 * @returns The minimum value.
 */
export const min = (...args: unknown[]) => {
  if (Array.isArray(args[0])) {
    return Math.min(...(args[0] as number[]))
  }
  return Math.min(...(args as number[]))
}

/**
 * Finds the maximum value in an array or spread arguments.
 * When the first argument is an array, finds maximum in that array.
 * Otherwise, finds maximum among all provided arguments.
 * @param args - Array of numbers or individual numbers.
 * @returns The maximum value.
 */
export const max = (...args: unknown[]) => {
  if (Array.isArray(args[0])) {
    return Math.max(...(args[0] as number[]))
  }
  return Math.max(...(args as number[]))
}

/**
 * Creates a range of numbers.
 * @param start - The start number.
 * @param end - The end number.
 * @param step - The step size (default: 1).
 * @returns An array of numbers in the range.
 */
export const range = (start: number, end: number, step = 1) => {
  const result: number[] = []
  for (let i = start; i < end; i += step) {
    result.push(i)
  }
  return result
}

/**
 * Repeats a value multiple times in an array.
 * @param value - The value to repeat.
 * @param count - The number of times to repeat.
 * @returns An array with the repeated value.
 */
export const repeat = (value: unknown, count: number) => {
  return Array(count).fill(value)
}

/**
 * Checks if all elements in an array are truthy.
 * @param arr - The array to check.
 * @returns True if all elements are truthy, false otherwise.
 */
export const every = (arr: unknown[]) => arr.every(Boolean)

/**
 * Checks if any element in an array is truthy.
 * @param arr - The array to check.
 * @returns True if any element is truthy, false otherwise.
 */
export const some = (arr: unknown[]) => arr.some(Boolean)

/**
 * Checks if no elements in an array are truthy.
 * @param arr - The array to check.
 * @returns True if no elements are truthy, false otherwise.
 */
export const none = (arr: unknown[]) => !arr.some(Boolean)

/**
 * Partitions an array into two arrays based on a predicate.
 * @param arr - The array to partition.
 * @param predicate - Function to test each element.
 * @returns An array with two arrays: [truthy, falsy].
 */
export const partition = (arr: unknown[], predicate: (item: unknown) => boolean) => {
  const truthy: unknown[] = []
  const falsy: unknown[] = []
  for (const item of arr) {
    if (predicate(item)) {
      truthy.push(item)
    } else {
      falsy.push(item)
    }
  }
  return [truthy, falsy]
}
