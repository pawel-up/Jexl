/**
 * String function schemas using JSON Schema
 */

import { createParameter, createFunctionSchema, createLibrarySchema } from './utils.js'

// Create common function schemas using the helper utilities
export const commonFunctionSchemas = {
  LENGTH: createFunctionSchema(
    'LENGTH',
    'Returns the length of a string or array',
    'common',
    [createParameter('strOrArr', { type: 'string', description: 'The string or array to measure' })],
    { type: 'number', description: 'The length of the string or array' },
    {
      examples: ['LENGTH("hello") // 5', 'LENGTH([1, 2, 3]) // 3'],
    }
  ),

  IS_EMPTY: createFunctionSchema(
    'IS_EMPTY',
    'Checks if a string or array is empty',
    'common',
    [createParameter('strOrArr', { type: 'string', description: 'The string or array to check' })],
    { type: 'boolean', description: 'True if the string or array is empty, false otherwise' },
    {
      examples: ['IS_EMPTY("") // true', 'IS_EMPTY([1, 2, 3]) // false'],
    }
  ),

  IS_NOT_EMPTY: createFunctionSchema(
    'IS_NOT_EMPTY',
    'Checks if a string or array is not empty',
    'common',
    [createParameter('strOrArr', { type: 'string', description: 'The string or array to check' })],
    { type: 'boolean', description: 'True if the string or array is not empty, false otherwise' },
    {
      examples: ['IS_NOT_EMPTY("hello") // true', 'IS_NOT_EMPTY([]) // false'],
    }
  ),

  CONTAINS: createFunctionSchema(
    'CONTAINS',
    'Checks if a string or array contains a specified substring',
    'common',
    [
      createParameter('strOrArr', { type: 'string', description: 'The string or array to check' }),
      createParameter('substring', { type: 'string', description: 'The substring to check for' }),
    ],
    { type: 'boolean', description: 'True if the string or array contains the substring, false otherwise' },
    {
      examples: ['CONTAINS(["hello", "world"], "lo") // true', 'CONTAINS("hello", "hi") // false'],
    }
  ),

  INDEX_OF: createFunctionSchema(
    'INDEX_OF',
    'Finds the index of the first occurrence of a substring in a string',
    'common',
    [
      createParameter('str', { type: 'string', description: 'The string to search in' }),
      createParameter('substring', { type: 'string', description: 'The substring to find' }),
    ],
    { type: 'number', description: 'The index of the substring, or -1 if not found' },
    {
      examples: ['INDEX_OF("hello", "lo") // 3', 'INDEX_OF("hello", "hi") // -1'],
    }
  ),

  LAST_INDEX_OF: createFunctionSchema(
    'LAST_INDEX_OF',
    'Finds the index of the last occurrence of a substring in a string',
    'common',
    [
      createParameter('str', { type: 'string', description: 'The string to search in' }),
      createParameter('substring', { type: 'string', description: 'The substring to find' }),
    ],
    { type: 'number', description: 'The index of the substring, or -1 if not found' },
    {
      examples: ['LAST_INDEX_OF("hello", "lo") // 3', 'LAST_INDEX_OF("hello", "hi") // -1'],
    }
  ),

  REVERSE: createFunctionSchema(
    'REVERSE',
    'Reverses a string or array',
    'common',
    [createParameter('val', { type: 'string', description: 'The string or array to reverse' })],
    { type: 'string', description: 'The reversed string or array' },
    {
      examples: ['REVERSE("hello") // "olleh"', 'REVERSE([1, 2, 3]) // [3, 2, 1]'],
    }
  ),
}

// Create the library schema
export const commonLibrarySchema = createLibrarySchema(commonFunctionSchemas, {
  category: 'common',
  title: 'Common Functions',
  description: 'Common manipulation and utility functions',
  version: '1.0.0',
})

// Export utility functions for easy access
export const getCommonFunction = (name: string) => commonLibrarySchema.functions[name]
export const getCommonFunctionNames = () => Object.keys(commonLibrarySchema.functions)
export const getCommonFunctionCount = () => Object.keys(commonLibrarySchema.functions).length

// Export for integration with editors/tools
export { commonLibrarySchema as schema }
export default commonLibrarySchema
