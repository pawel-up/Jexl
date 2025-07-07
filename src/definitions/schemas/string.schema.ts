/**
 * String function schemas using JSON Schema
 */

import { createParameter, createFunctionSchema, createLibrarySchema } from './utils.js'

// Create string function schemas using the helper utilities
export const stringFunctionSchemas = {
  upper: createFunctionSchema(
    'upper',
    'Converts a string to uppercase',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to convert' })],
    { type: 'string', description: 'The uppercase string' },
    {
      examples: ['upper("hello") // "HELLO"', 'upper("World") // "WORLD"'],
    }
  ),

  lower: createFunctionSchema(
    'lower',
    'Converts a string to lowercase',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to convert' })],
    { type: 'string', description: 'The lowercase string' },
    {
      examples: ['lower("HELLO") // "hello"', 'lower("World") // "world"'],
    }
  ),

  substr: createFunctionSchema(
    'substr',
    'Extracts a substring from a string',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to extract from' }),
      createParameter('start', { type: 'number', description: 'The starting index' }),
      createParameter('end', { type: 'number', description: 'The ending index (optional)' }, false),
    ],
    { type: 'string', description: 'The extracted substring' },
    {
      examples: ['substr("hello", 1, 3) // "el"', 'substr("world", 2) // "rld"'],
    }
  ),

  split: createFunctionSchema(
    'split',
    'Splits a string into an array of substrings',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to split' }),
      createParameter('separator', { type: 'string', description: 'The separator to use for splitting' }),
    ],
    { type: 'array', description: 'An array of substrings' },
    {
      examples: ['split("a,b,c", ",") // ["a", "b", "c"]', 'split("hello world", " ") // ["hello", "world"]'],
    }
  ),

  join: createFunctionSchema(
    'join',
    'Joins an array of elements into a string',
    'string',
    [
      createParameter('arr', { type: 'array', description: 'The array to join' }),
      createParameter('separator', { type: 'string', description: 'The separator to use for joining' }),
    ],
    { type: 'string', description: 'The joined string' },
    {
      examples: ['join(["a", "b", "c"], ",") // "a,b,c"', 'join(["hello", "world"], " ") // "hello world"'],
    }
  ),

  replace: createFunctionSchema(
    'replace',
    'Replaces the first occurrence of a substring with another string',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to search in' }),
      createParameter('oldStr', { type: 'string', description: 'The substring to replace' }),
      createParameter('newStr', { type: 'string', description: 'The replacement string' }),
    ],
    { type: 'string', description: 'The string with the first occurrence replaced' },
    {
      examples: [
        'replace("hello world", "world", "there") // "hello there"',
        'replace("foo bar foo", "foo", "baz") // "baz bar foo"',
      ],
    }
  ),

  replaceAll: createFunctionSchema(
    'replaceAll',
    'Replaces all occurrences of a substring with another string',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to search in' }),
      createParameter('oldStr', { type: 'string', description: 'The substring to replace' }),
      createParameter('newStr', { type: 'string', description: 'The replacement string' }),
    ],
    { type: 'string', description: 'The string with all occurrences replaced' },
    {
      examples: [
        'replaceAll("hello world world", "world", "there") // "hello there there"',
        'replaceAll("foo bar foo", "foo", "baz") // "baz bar baz"',
      ],
    }
  ),

  trim: createFunctionSchema(
    'trim',
    'Removes whitespace from both ends of a string',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to trim' })],
    { type: 'string', description: 'The trimmed string' },
    {
      examples: ['trim("  hello  ") // "hello"', 'trim("\\n\\tworld\\n") // "world"'],
    }
  ),

  trimStart: createFunctionSchema(
    'trimStart',
    'Removes whitespace from the start of a string',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to trim' })],
    { type: 'string', description: 'The trimmed string' },
    {
      examples: ['trimStart("  hello  ") // "hello  "', 'trimStart("\\n\\tworld") // "world"'],
    }
  ),

  trimEnd: createFunctionSchema(
    'trimEnd',
    'Removes whitespace from the end of a string',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to trim' })],
    { type: 'string', description: 'The trimmed string' },
    {
      examples: ['trimEnd("  hello  ") // "  hello"', 'trimEnd("world\\n\\t") // "world"'],
    }
  ),

  padStart: createFunctionSchema(
    'padStart',
    'Pads a string from the start with another string',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to pad' }),
      createParameter('targetLength', { type: 'number', description: 'The target length' }),
      createParameter('padString', { type: 'string', description: 'The string to pad with (optional)' }, false),
    ],
    { type: 'string', description: 'The padded string' },
    {
      examples: ['padStart("hello", 10) // "     hello"', 'padStart("5", 3, "0") // "005"'],
    }
  ),

  padEnd: createFunctionSchema(
    'padEnd',
    'Pads a string from the end with another string',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to pad' }),
      createParameter('targetLength', { type: 'number', description: 'The target length' }),
      createParameter('padString', { type: 'string', description: 'The string to pad with (optional)' }, false),
    ],
    { type: 'string', description: 'The padded string' },
    {
      examples: ['padEnd("hello", 10) // "hello     "', 'padEnd("5", 3, "0") // "500"'],
    }
  ),

  charAt: createFunctionSchema(
    'charAt',
    'Returns the character at a specified index',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to get character from' }),
      createParameter('index', { type: 'number', description: 'The index of the character' }),
    ],
    { type: 'string', description: 'The character at the specified index' },
    {
      examples: ['charAt("hello", 0) // "h"', 'charAt("world", 4) // "d"'],
    }
  ),

  charCodeAt: createFunctionSchema(
    'charCodeAt',
    'Returns the Unicode code point of the character at a specified index',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to get character code from' }),
      createParameter('index', { type: 'number', description: 'The index of the character' }),
    ],
    { type: 'number', description: 'The Unicode code point of the character' },
    {
      examples: ['charCodeAt("hello", 0) // 104', 'charCodeAt("A", 0) // 65'],
    }
  ),

  fromCharCode: createFunctionSchema(
    'fromCharCode',
    'Creates a string from Unicode code points',
    'string',
    [createParameter('codes', { type: 'number', description: 'Unicode code points' }, true, { variadic: true })],
    { type: 'string', description: 'The string created from the code points' },
    {
      examples: ['fromCharCode(72, 101, 108, 108, 111) // "Hello"', 'fromCharCode(65, 66, 67) // "ABC"'],
    }
  ),

  indexOf: createFunctionSchema(
    'indexOf',
    'Returns the index of the first occurrence of a substring',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to search in' }, true),
      createParameter('searchStr', { type: 'string', description: 'The substring to search for' }, true),
      createParameter(
        'fromIndex',
        { type: 'number', description: 'The index to start searching from (optional)' },
        false
      ),
    ],
    { type: 'number', description: 'The index of the first occurrence, or -1 if not found' },
    {
      examples: [
        'indexOf("hello world", "world") // 6',
        'indexOf("hello world", "o") // 4',
        'indexOf("hello world", "o", 5) // 7',
      ],
    }
  ),

  lastIndexOf: createFunctionSchema(
    'lastIndexOf',
    'Returns the index of the last occurrence of a substring',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to search in' }, true),
      createParameter('searchStr', { type: 'string', description: 'The substring to search for' }, true),
      createParameter(
        'fromIndex',
        { type: 'number', description: 'The index to start searching from (optional)' },
        false
      ),
    ],
    { type: 'number', description: 'The index of the last occurrence, or -1 if not found' },
    {
      examples: ['lastIndexOf("hello world", "o") // 7', 'lastIndexOf("hello world", "l") // 9'],
    }
  ),

  includes: createFunctionSchema(
    'includes',
    'Determines whether a string contains a substring',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to search in' }, true),
      createParameter('searchStr', { type: 'string', description: 'The substring to search for' }, true),
      createParameter(
        'fromIndex',
        { type: 'number', description: 'The index to start searching from (optional)' },
        false
      ),
    ],
    { type: 'boolean', description: 'True if the substring is found, false otherwise' },
    {
      examples: ['includes("hello world", "world") // true', 'includes("hello world", "foo") // false'],
    }
  ),

  startsWith: createFunctionSchema(
    'startsWith',
    'Determines whether a string starts with a substring',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to check' }, true),
      createParameter('searchStr', { type: 'string', description: 'The substring to search for' }, true),
      createParameter(
        'position',
        { type: 'number', description: 'The position to start checking from (optional)' },
        false
      ),
    ],
    { type: 'boolean', description: 'True if the string starts with the substring, false otherwise' },
    {
      examples: ['startsWith("hello world", "hello") // true', 'startsWith("hello world", "world") // false'],
    }
  ),

  endsWith: createFunctionSchema(
    'endsWith',
    'Determines whether a string ends with a substring',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to check' }, true),
      createParameter('searchStr', { type: 'string', description: 'The substring to search for' }, true),
      createParameter(
        'length',
        { type: 'number', description: 'The length of the string to consider (optional)' },
        false
      ),
    ],
    { type: 'boolean', description: 'True if the string ends with the substring, false otherwise' },
    {
      examples: ['endsWith("hello world", "world") // true', 'endsWith("hello world", "hello") // false'],
    }
  ),

  match: createFunctionSchema(
    'match',
    'Matches a string against a regular expression',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to match' }, true),
      createParameter('regexp', { type: 'string', description: 'The regular expression' }, true),
    ],
    {
      type: 'array',
      items: { type: 'string' },
      description: 'An array of matches, or null if no match',
    },
    {
      examples: ['match("hello 123", "\\\\d+") // ["123"]', 'match("abc def", "\\\\w+") // ["abc"]'],
    }
  ),

  search: createFunctionSchema(
    'search',
    'Searches for a match against a regular expression',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to search' }, true),
      createParameter('regexp', { type: 'string', description: 'The regular expression' }, true),
    ],
    { type: 'number', description: 'The index of the first match, or -1 if no match' },
    {
      examples: ['search("hello 123", "\\\\d+") // 6', 'search("abc def", "\\\\d+") // -1'],
    }
  ),

  repeat: createFunctionSchema(
    'repeat',
    'Repeats a string a specified number of times',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to repeat' }, true),
      createParameter('count', { type: 'number', description: 'The number of times to repeat' }, true),
    ],
    { type: 'string', description: 'The repeated string' },
    {
      examples: ['repeat("hello", 3) // "hellohellohello"', 'repeat("a", 5) // "aaaaa"'],
    }
  ),

  slice: createFunctionSchema(
    'slice',
    'Extracts a section of a string',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to slice' }, true),
      createParameter('start', { type: 'number', description: 'The start index' }, true),
      createParameter('end', { type: 'number', description: 'The end index (optional)' }, false),
    ],
    { type: 'string', description: 'The extracted section' },
    {
      examples: ['slice("hello world", 0, 5) // "hello"', 'slice("hello world", 6) // "world"'],
    }
  ),
}

// Create the library schema
export const stringLibrarySchema = createLibrarySchema(stringFunctionSchemas, {
  category: 'string',
  title: 'Jexl String Functions',
  description: 'String manipulation and utility functions for Jexl expressions',
  version: '1.0.0',
})

// Export utility functions for easy access
export const getStringFunction = (name: string) => stringLibrarySchema.functions[name]
export const getStringFunctionNames = () => Object.keys(stringLibrarySchema.functions)
export const getStringFunctionCount = () => Object.keys(stringLibrarySchema.functions).length

// Export for integration with editors/tools
export { stringLibrarySchema as schema }
export default stringLibrarySchema
