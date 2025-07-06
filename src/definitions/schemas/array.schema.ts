/**
 * Array function schemas using the modular schema system
 * This demonstrates how to use the reusable schema utilities
 */

import { createLibrarySchema, createFunctionSchema, createParameter } from './utils.js'
import type { LibrarySchema } from './types.js'

// Create array function schemas using the utility functions
const arrayFunctions = {
  length: createFunctionSchema(
    'length',
    'Gets the length of an array',
    'array',
    [createParameter('arr', 'The array to get the length of', { type: 'array' })],
    { type: 'number', description: 'The length of the array' },
    { examples: ['length([1, 2, 3]) // 3', "length(['a', 'b']) // 2"] }
  ),

  isEmpty: createFunctionSchema(
    'isEmpty',
    'Checks if an array is empty',
    'array',
    [createParameter('arr', 'The array to check', { type: 'array' })],
    { type: 'boolean', description: 'True if the array is empty, false otherwise' },
    { examples: ['isEmpty([]) // true', 'isEmpty([1, 2, 3]) // false'] }
  ),

  isNotEmpty: createFunctionSchema(
    'isNotEmpty',
    'Checks if an array is not empty',
    'array',
    [createParameter('arr', 'The array to check', { type: 'array' })],
    { type: 'boolean', description: 'True if the array is not empty, false otherwise' },
    { examples: ['isNotEmpty([1, 2, 3]) // true', 'isNotEmpty([]) // false'] }
  ),

  first: createFunctionSchema(
    'first',
    'Gets the first element of an array',
    'array',
    [createParameter('arr', 'The array to get the first element from', { type: 'array' })],
    {
      type: ['string', 'number', 'boolean', 'object', 'array'],
      description: 'The first element, or undefined if empty',
    },
    { examples: ['first([1, 2, 3]) // 1', "first(['a', 'b', 'c']) // 'a'"] }
  ),

  last: createFunctionSchema(
    'last',
    'Gets the last element of an array',
    'array',
    [createParameter('arr', 'The array to get the last element from', { type: 'array' })],
    {
      type: ['string', 'number', 'boolean', 'object', 'array'],
      description: 'The last element, or undefined if empty',
    },
    { examples: ['last([1, 2, 3]) // 3', "last(['a', 'b', 'c']) // 'c'"] }
  ),

  at: createFunctionSchema(
    'at',
    'Gets the element at a specific index',
    'array',
    [
      createParameter('arr', 'The array to get the element from', { type: 'array' }),
      createParameter('index', 'The index to get', { type: 'number' }),
    ],
    {
      type: ['string', 'number', 'boolean', 'object', 'array'],
      description: 'The element at the index, or undefined if out of bounds',
    },
    { examples: ['at([1, 2, 3], 1) // 2', "at(['a', 'b', 'c'], 0) // 'a'"] }
  ),

  contains: createFunctionSchema(
    'contains',
    'Checks if an array contains a specific value',
    'array',
    [
      createParameter('arr', 'The array to search in', { type: 'array' }),
      createParameter('value', 'The value to search for', {}),
    ],
    { type: 'boolean', description: 'True if the array contains the value, false otherwise' },
    { examples: ['contains([1, 2, 3], 2) // true', "contains(['a', 'b', 'c'], 'd') // false"] }
  ),

  sum: createFunctionSchema(
    'sum',
    'Sums numeric values in an array or spread arguments',
    'array',
    [
      createParameter('args', 'Array of numbers or individual numbers to sum', { type: ['array', 'number'] }, true, {
        variadic: true,
      }),
    ],
    { type: 'number', description: 'The sum of all numbers' },
    { examples: ['sum([1, 2, 3, 4]) // 10', 'sum(1, 2, 3, 4) // 10'] }
  ),

  chunk: createFunctionSchema(
    'chunk',
    'Chunks an array into smaller arrays of specified size',
    'array',
    [
      createParameter('arr', 'The array to chunk', { type: 'array' }),
      createParameter('size', 'The size of each chunk', { type: 'number' }),
    ],
    { type: 'array', description: 'An array of chunks' },
    {
      examples: [
        'chunk([1, 2, 3, 4, 5, 6], 2) // [[1, 2], [3, 4], [5, 6]]',
        "chunk(['a', 'b', 'c', 'd'], 3) // [['a', 'b', 'c'], ['d']]",
      ],
    }
  ),

  unique: createFunctionSchema(
    'unique',
    'Removes duplicate values from an array',
    'array',
    [createParameter('arr', 'The array to deduplicate', { type: 'array' })],
    { type: 'array', description: 'A new array with unique values' },
    { examples: ['unique([1, 2, 2, 3, 3, 3]) // [1, 2, 3]', "unique(['a', 'b', 'a', 'c']) // ['a', 'b', 'c']"] }
  ),

  flatten: createFunctionSchema(
    'flatten',
    'Flattens an array by one level',
    'array',
    [createParameter('arr', 'The array to flatten', { type: 'array' })],
    { type: 'array', description: 'A new flattened array' },
    {
      examples: [
        'flatten([[1, 2], [3, 4]]) // [1, 2, 3, 4]',
        "flatten([['a', 'b'], ['c', 'd']]) // ['a', 'b', 'c', 'd']",
      ],
    }
  ),

  reverse: createFunctionSchema(
    'reverse',
    'Reverses an array',
    'array',
    [createParameter('arr', 'The array to reverse', { type: 'array' })],
    { type: 'array', description: 'A new reversed array' },
    { examples: ['reverse([1, 2, 3]) // [3, 2, 1]', "reverse(['a', 'b', 'c']) // ['c', 'b', 'a']"] }
  ),

  sort: createFunctionSchema(
    'sort',
    'Sorts an array',
    'array',
    [
      createParameter('arr', 'The array to sort', { type: 'array' }),
      createParameter(
        'compareFn',
        'Optional comparison function',
        { type: 'object', description: 'A comparison function' },
        false
      ),
    ],
    { type: 'array', description: 'A new sorted array' },
    { examples: ['sort([3, 1, 4, 1, 5]) // [1, 1, 3, 4, 5]', "sort(['c', 'a', 'b']) // ['a', 'b', 'c']"] }
  ),
}

// Create the complete library schema
export const arrayLibrarySchema: LibrarySchema = createLibrarySchema(arrayFunctions, {
  category: 'array',
  title: 'Jexl Array Functions',
  description: 'Comprehensive array utility functions for Jexl expressions',
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
