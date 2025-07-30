/**
 * Array function schemas using the modular schema system
 * This demonstrates how to use the reusable schema utilities
 */

import { createLibrarySchema, createFunctionSchema, createParameter } from './utils.js'
import type { LibrarySchema } from './types.js'

// Create array function schemas using the utility functions
const arrayFunctions = {
  FIRST: createFunctionSchema(
    'FIRST',
    'Gets the first element of an array',
    'array',
    [createParameter('arr', { type: 'array', description: 'The array to get the first element from' })],
    {
      type: ['string', 'number', 'boolean', 'object', 'array'],
      description: 'The first element, or undefined if empty',
    },
    { examples: ['FIRST([1, 2, 3]) // 1', "FIRST(['a', 'b', 'c']) // 'a'"] }
  ),

  LAST: createFunctionSchema(
    'LAST',
    'Gets the last element of an array',
    'array',
    [createParameter('arr', { type: 'array', description: 'The array to get the last element from' })],
    {
      type: ['string', 'number', 'boolean', 'object', 'array'],
      description: 'The last element, or undefined if empty',
    },
    { examples: ['LAST([1, 2, 3]) // 3', "LAST(['a', 'b', 'c']) // 'c'"] }
  ),

  AT: createFunctionSchema(
    'AT',
    'Gets the element at a specific index',
    'array',
    [
      createParameter('arr', { type: 'array', description: 'The array to get the element from' }),
      createParameter('index', { type: 'number', description: 'The index to get' }),
    ],
    {
      type: ['string', 'number', 'boolean', 'object', 'array'],
      description: 'The element at the index, or undefined if out of bounds',
    },
    { examples: ['AT([1, 2, 3], 1) // 2', "AT(['a', 'b', 'c'], 0) // 'a'"] }
  ),

  SORT: createFunctionSchema(
    'SORT',
    'Sorts an array',
    'array',
    [
      createParameter('arr', { type: 'array', description: 'The array to sort' }),
      createParameter('compareFn', { type: 'object', description: 'Optional comparison function' }, false),
    ],
    { type: 'array', description: 'A new sorted array' },
    { examples: ['SORT([3, 1, 4, 1, 5]) // [1, 1, 3, 4, 5]', "SORT(['c', 'a', 'b']) // ['a', 'b', 'c']"] }
  ),

  SORT_ASC: createFunctionSchema(
    'SORT_ASC',
    'Sorts an array in ascending order',
    'array',
    [createParameter('arr', { type: 'array', description: 'The array to sort' })],
    { type: 'array', description: 'A new sorted array in ascending order' },
    { examples: ['SORT_ASC([3, 1, 4, 1, 5]) // [1, 1, 3, 4, 5]', "SORT_ASC(['c', 'a', 'b']) // ['a', 'b', 'c']"] }
  ),

  SORT_DESC: createFunctionSchema(
    'SORT_DESC',
    'Sorts an array in descending order',
    'array',
    [createParameter('arr', { type: 'array', description: 'The array to sort' })],
    { type: 'array', description: 'A new sorted array in descending order' },
    { examples: ['SORT_DESC([3, 1, 4, 1, 5]) // [5, 4, 3, 1, 1]', "SORT_DESC(['c', 'a', 'b']) // ['c', 'b', 'a']"] }
  ),

  SLICE: createFunctionSchema(
    'SLICE',
    'Extracts a slice of an array',
    'array',
    [
      createParameter('arr', { type: 'array', description: 'The array to slice' }),
      createParameter('start', { type: 'number', description: 'The start index' }),
      createParameter('end', { type: 'number', description: 'The end index (optional)' }, false),
    ],
    { type: 'array', description: 'A new sliced array' },
    {
      examples: ['SLICE([1, 2, 3, 4, 5], 1, 3) // [2, 3]', "SLICE(['a', 'b', 'c', 'd'], 1) // ['b', 'c', 'd']"],
    }
  ),

  JOIN: createFunctionSchema(
    'JOIN',
    'Joins an array into a string with a separator',
    'array',
    [
      createParameter('arr', { type: 'array', description: 'The array to join' }),
      createParameter('separator', { type: 'string', description: 'The separator to use (default: ",")' }, false),
    ],
    { type: 'string', description: 'The joined string' },
    {
      examples: ['JOIN([1, 2, 3], ", ") // "1, 2, 3"', 'JOIN(["a", "b", "c"], "-") // "a-b-c"'],
    }
  ),

  CONCAT: createFunctionSchema(
    'CONCAT',
    'Concatenates arrays or values. Can accept multiple arrays or a mix of arrays and values.',
    'array',
    [createParameter('arrays', { type: 'array', description: 'Arrays to concatenate' }, true, { variadic: true })],
    { type: 'array', description: 'A new concatenated array' },
    {
      examples: [
        'CONCAT([1, 2], [3, 4]) // [1, 2, 3, 4]',
        'CONCAT([1, 2], [3, 4], [5]) // [1, 2, 3, 4, 5]',
        "CONCAT(['a', 'b'], ['c']) // ['a', 'b', 'c']",
      ],
    }
  ),

  UNIQUE: createFunctionSchema(
    'UNIQUE',
    'Removes duplicate values from an array',
    'array',
    [createParameter('arr', { type: 'array', description: 'The array to deduplicate' })],
    { type: 'array', description: 'A new array with unique values' },
    { examples: ['UNIQUE([1, 2, 2, 3, 3, 3]) // [1, 2, 3]', "UNIQUE(['a', 'b', 'a', 'c']) // ['a', 'b', 'c']"] }
  ),

  FLATTEN: createFunctionSchema(
    'FLATTEN',
    'Flattens an array by one level',
    'array',
    [createParameter('arr', { type: 'array', description: 'The array to flatten' })],
    { type: 'array', description: 'A new flattened array' },
    {
      examples: [
        'FLATTEN([[1, 2], [3, 4]]) // [1, 2, 3, 4]',
        "FLATTEN([['a', 'b'], ['c', 'd']]) // ['a', 'b', 'c', 'd']",
      ],
    }
  ),

  FLATTEN_DEEP: createFunctionSchema(
    'FLATTEN_DEEP',
    'Flattens an array recursively',
    'array',
    [createParameter('arr', { type: 'array', description: 'The array to flatten' })],
    { type: 'array', description: 'A new deeply flattened array' },
    {
      examples: [
        'FLATTEN_DEEP([[1, [2]], [3, 4]]) // [1, 2, 3, 4]',
        "FLATTEN_DEEP([['a', ['b']], ['c', 'd']]) // ['a', 'b', 'c', 'd']",
      ],
    }
  ),

  CHUNK: createFunctionSchema(
    'CHUNK',
    'Chunks an array into smaller arrays of specified size',
    'array',
    [
      createParameter('arr', { type: 'array', description: 'The array to chunk' }),
      createParameter('size', { type: 'number', description: 'The size of each chunk' }),
    ],
    { type: 'array', description: 'An array of chunks' },
    {
      examples: [
        'CHUNK([1, 2, 3, 4, 5, 6], 2) // [[1, 2], [3, 4], [5, 6]]',
        "CHUNK(['a', 'b', 'c', 'd'], 3) // [['a', 'b', 'c'], ['d']]",
      ],
    }
  ),

  COMPACT: createFunctionSchema(
    'COMPACT',
    'Removes falsy values from an array',
    'array',
    [createParameter('arr', { type: 'array', description: 'The array to compact' })],
    { type: 'array', description: 'A new array with falsy values removed' },
    { examples: ['COMPACT([0, 1, false, 2, "", 3]) // [1, 2, 3]', "COMPACT(['a', '', 'b', null]) // ['a', 'b']"] }
  ),

  DIFFERENCE: createFunctionSchema(
    'DIFFERENCE',
    'Gets the difference between arrays or values. When the first argument is an array, ' +
      'compares against other arguments. Otherwise, treats all arguments as arrays to compare.',
    'array',
    [
      createParameter('arrays', { type: 'array', description: 'Arrays or values to find differences between.' }, true, {
        variadic: true,
      }),
    ],
    { type: 'array', description: 'A new array with values from the first array that are not in others.' },
    {
      examples: ['DIFFERENCE([1, 2, 3], [2, 3]) // [1]', "DIFFERENCE(['a', 'b', 'c'], ['b', 'c']) // ['a']"],
    }
  ),

  INTERSECTION: createFunctionSchema(
    'INTERSECTION',
    'Gets the intersection of arrays or values. When the first argument is an array, ' +
      'compares against other arguments. Otherwise, treats all arguments as arrays to compare.',
    'array',
    [
      createParameter(
        'arrays',
        { type: 'array', description: 'Arrays or values to find intersections between.' },
        true,
        {
          variadic: true,
        }
      ),
    ],
    { type: 'array', description: 'A new array with values that are present in all arrays.' },
    {
      examples: [
        'INTERSECTION([1, 2, 3], [2, 3]) // [2, 3]',
        "INTERSECTION(['a', 'b', 'c'], ['b', 'c']) // ['b', 'c']",
      ],
    }
  ),

  UNION: createFunctionSchema(
    'UNION',
    'Gets the union of arrays or values (removes duplicates). ' +
      'Combines all arguments into a single array with unique values.',
    'array',
    [
      createParameter('arrays', { type: 'array', description: 'Arrays or values to find unions between.' }, true, {
        variadic: true,
      }),
    ],
    { type: 'array', description: 'A new array with unique values from all arrays.' },
    {
      examples: ['UNION([1, 2], [2, 3]) // [1, 2, 3]', "UNION(['a', 'b'], ['b', 'c']) // ['a', 'b', 'c']"],
    }
  ),

  ZIP: createFunctionSchema(
    'ZIP',
    'Zips multiple arrays together.',
    'array',
    [
      createParameter('arrays', { type: 'array', description: 'Arrays to zip together' }, true, {
        variadic: true,
      }),
    ],
    { type: 'array', description: 'An array of tuples combining elements from each array' },
    {
      examples: ['ZIP([1, 2], [3, 4]) // [[1, 3], [2, 4]]', "ZIP(['a', 'b'], ['c', 'd']) // [['a', 'c'], ['b', 'd']]"],
    }
  ),

  SHUFFLE: createFunctionSchema(
    'SHUFFLE',
    'Shuffles an array randomly',
    'array',
    [createParameter('arr', { type: 'array', description: 'The array to shuffle' })],
    { type: 'array', description: 'A new shuffled array' },
    { examples: ['SHUFFLE([1, 2, 3]) // [2, 1, 3]', "SHUFFLE(['a', 'b', 'c']) // ['c', 'a', 'b']"] }
  ),

  SAMPLE: createFunctionSchema(
    'SAMPLE',
    'Gets a random element from an array',
    'array',
    [createParameter('arr', { type: 'array', description: 'The array to get a random element from' })],
    {
      type: ['string', 'number', 'boolean', 'object', 'array'],
      description: 'A random element from the array, or undefined if empty',
    },
    { examples: ['SAMPLE([1, 2, 3]) // 2', "SAMPLE(['a', 'b', 'c']) // 'b'"] }
  ),

  SAMPLE_SIZE: createFunctionSchema(
    'SAMPLE_SIZE',
    'Gets multiple random elements from an array.',
    'array',
    [
      createParameter('arr', { type: 'array', description: 'The array to sample from' }),
      createParameter('size', { type: 'number', description: 'Number of elements to sample' }),
    ],
    { type: 'array', description: 'An array of random elements' },
    {
      examples: ['SAMPLE_SIZE([1, 2, 3, 4], 2) // [2, 4]', "SAMPLE_SIZE(['a', 'b', 'c', 'd'], 3) // ['b', 'd', 'a']"],
    }
  ),

  COUNT_BY: createFunctionSchema(
    'COUNT_BY',
    'Counts occurrences of each value in an array.',
    'array',
    [createParameter('arr', { type: 'array', description: 'The array to count values in' })],
    { type: 'object', description: 'An object with counts for each value' },
    {
      examples: [
        "COUNT_BY([1, 2, 2, 3]) // { '1': 1, '2': 2, '3': 1 }",
        "COUNT_BY(['a', 'b', 'a']) // { 'a': 2, 'b': 1 }",
      ],
    }
  ),

  SUM: createFunctionSchema(
    'SUM',
    'Sums numeric values in an array or spread arguments. ' +
      'When the first argument is an array, it will sum the elements of that array. ' +
      'Otherwise, it will sum all provided arguments.',
    'array',
    [
      createParameter(
        'args',
        { type: ['array', 'number'], description: 'Array of numbers or individual numbers to sum' },
        true,
        {
          variadic: true,
        }
      ),
    ],
    { type: 'number', description: 'The sum of all numbers' },
    { examples: ['SUM([1, 2, 3, 4]) // 10', 'SUM(1, 2, 3, 4) // 10'] }
  ),

  AVERAGE: createFunctionSchema(
    'AVERAGE',
    'Calculates the average of numeric values in an array or spread arguments. ' +
      'When the first argument is an array, it will calculate the average of that array. ' +
      'Otherwise, it will calculate the average of all provided arguments.',
    'array',
    [
      createParameter(
        'args',
        { type: ['array', 'number'], description: 'Array of numbers or individual numbers to average' },
        true,
        {
          variadic: true,
        }
      ),
    ],
    { type: 'number', description: 'The average of all numbers' },
    {
      examples: ['AVERAGE([1, 2, 3, 4]) // 2.5', 'AVERAGE(1, 2, 3, 4) // 2.5'],
    }
  ),

  MIN: createFunctionSchema(
    'MIN',
    'Finds the minimum value in an array or spread arguments. ' +
      'When the first argument is an array, it will find the minimum of that array. ' +
      'Otherwise, it will find the minimum of all provided arguments.',
    'array',
    [
      createParameter(
        'args',
        { type: ['array', 'number'], description: 'Array of numbers or individual numbers to find the minimum of' },
        true,
        {
          variadic: true,
        }
      ),
    ],
    { type: 'number', description: 'The minimum value' },
    { examples: ['MIN([1, 2, 3, 4]) // 1', 'MIN(1, 2, 3, 4) // 1'] }
  ),

  MAX: createFunctionSchema(
    'MAX',
    'Finds the maximum value in an array or spread arguments. ' +
      'When the first argument is an array, it will find the maximum of that array. ' +
      'Otherwise, it will find the maximum of all provided arguments.',
    'array',
    [
      createParameter(
        'args',
        { type: ['array', 'number'], description: 'Array of numbers or individual numbers to find the maximum of' },
        true,
        {
          variadic: true,
        }
      ),
    ],
    { type: 'number', description: 'The maximum value' },
    { examples: ['MAX([1, 2, 3, 4]) // 4', 'MAX(1, 2, 3, 4) // 4'] }
  ),

  RANGE: createFunctionSchema(
    'RANGE',
    'Creates an array of numbers within a specified range.',
    'array',
    [
      createParameter('start', { type: 'number', description: 'The start of the range' }),
      createParameter('end', { type: 'number', description: 'The end of the range' }),
      createParameter('step', { type: 'number', description: 'The step size (default: 1)' }, false),
    ],
    { type: 'array', description: 'An array of numbers in the specified range' },
    {
      examples: [
        'RANGE(1, 5) // [1, 2, 3, 4, 5]',
        'RANGE(1, 10, 2) // [1, 3, 5, 7, 9]',
        'RANGE(5, 1, -1) // [5, 4, 3, 2, 1]',
      ],
    }
  ),

  FILL: createFunctionSchema(
    'FILL',
    'Creates an array filled with a specified value.',
    'array',
    [
      createParameter('value', { type: 'string', description: 'The value to fill the array with' }),
      createParameter('length', { type: 'number', description: 'The length of the array to create' }),
    ],
    { type: 'array', description: 'An array filled with the specified value' },
    {
      examples: [
        'FILL(0, 5) // [0, 0, 0, 0, 0]',
        'FILL("x", 3) // ["x", "x", "x"]',
        'FILL(true, 4) // [true, true, true, true]',
      ],
    }
  ),

  EVERY: createFunctionSchema(
    'EVERY',
    'Checks if all elements in an array are truthy.',
    'array',
    [createParameter('arr', { type: 'array', description: 'The array to check' })],
    { type: 'boolean', description: 'True if all elements are truthy, false otherwise' },
    { examples: ['EVERY([1, 2, 3]) // true', 'EVERY([1, 0, 3]) // false', 'EVERY([]) // true'] }
  ),

  SOME: createFunctionSchema(
    'SOME',
    'Checks if any element in an array is truthy.',
    'array',
    [createParameter('arr', { type: 'array', description: 'The array to check' })],
    { type: 'boolean', description: 'True if any element is truthy, false otherwise' },
    { examples: ['SOME([0, 1, 2]) // true', 'SOME([0, false, null]) // false', 'SOME([]) // false'] }
  ),

  NONE: createFunctionSchema(
    'NONE',
    'Checks if no elements in an array are truthy.',
    'array',
    [createParameter('arr', { type: 'array', description: 'The array to check' })],
    { type: 'boolean', description: 'True if no elements are truthy, false otherwise' },
    { examples: ['NONE([0, null, false]) // true', 'NONE([1, 2, 3]) // false', 'NONE([]) // true'] }
  ),
}

// Create the complete library schema
export const arrayLibrarySchema: LibrarySchema = createLibrarySchema(arrayFunctions, {
  category: 'array',
  title: 'Array Functions',
  description: 'Array utility functions',
  version: '1.0.0',
})

// Export individual function schemas for direct access
export const arrayFunctionSchemas = arrayFunctions

// Utility functions for this specific library
export function getArrayFunctionSchema(functionName: string) {
  return arrayLibrarySchema.functions[functionName]
}

export function getAllArrayFunctionNames(): string[] {
  return Object.keys(arrayLibrarySchema.functions)
}

// Export for CommonJS compatibility
export default arrayLibrarySchema
