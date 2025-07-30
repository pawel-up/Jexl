/**
 * String function schemas using JSON Schema
 */

import { createParameter, createFunctionSchema, createLibrarySchema } from './utils.js'

// Create string function schemas using the helper utilities
export const stringFunctionSchemas = {
  UPPER: createFunctionSchema(
    'UPPER',
    'Converts a string to uppercase',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to convert' })],
    { type: 'string', description: 'The uppercase string' },
    {
      examples: ['UPPER("hello") // "HELLO"', 'UPPER("World") // "WORLD"'],
    }
  ),

  LOWER: createFunctionSchema(
    'LOWER',
    'Converts a string to lowercase',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to convert' })],
    { type: 'string', description: 'The lowercase string' },
    {
      examples: ['LOWER("HELLO") // "hello"', 'LOWER("World") // "world"'],
    }
  ),

  SUBSTR: createFunctionSchema(
    'SUBSTR',
    'Extracts a substring from a string',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to extract from' }),
      createParameter('start', { type: 'number', description: 'The starting index' }),
      createParameter('end', { type: 'number', description: 'The ending index (optional)' }, false),
    ],
    { type: 'string', description: 'The extracted substring' },
    {
      examples: ['SUBSTR("hello", 1, 3) // "el"', 'SUBSTR("world", 2) // "rld"'],
    }
  ),

  SPLIT: createFunctionSchema(
    'SPLIT',
    'Splits a string into an array of substrings',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to split' }),
      createParameter('separator', { type: 'string', description: 'The separator to use for splitting' }),
    ],
    { type: 'array', description: 'An array of substrings' },
    {
      examples: ['SPLIT("a,b,c", ",") // ["a", "b", "c"]', 'SPLIT("hello world", " ") // ["hello", "world"]'],
    }
  ),

  REPLACE: createFunctionSchema(
    'REPLACE',
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
        'REPLACE("hello world", "world", "there") // "hello there"',
        'REPLACE("foo bar foo", "foo", "baz") // "baz bar foo"',
      ],
    }
  ),

  CAPITALIZE: createFunctionSchema(
    'CAPITALIZE',
    'Capitalizes the first letter of a string',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to capitalize' })],
    { type: 'string', description: 'The capitalized string' },
    {
      examples: ['CAPITALIZE("hello") // "Hello"', 'CAPITALIZE("world") // "World"'],
    }
  ),

  TITLE_CASE: createFunctionSchema(
    'TITLE_CASE',
    'Converts a string to title case',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to convert' })],
    { type: 'string', description: 'The title-cased string' },
    {
      examples: ['TITLE_CASE("hello world") // "Hello World"', 'TITLE_CASE("this is a test") // "This Is A Test"'],
    }
  ),

  CAMEL_CASE: createFunctionSchema(
    'CAMEL_CASE',
    'Converts a string to camel case',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to convert' })],
    { type: 'string', description: 'The camel-cased string' },
    {
      examples: ['CAMEL_CASE("hello world") // "helloWorld"', 'CAMEL_CASE("this is a test") // "thisIsATest"'],
    }
  ),

  PASCAL_CASE: createFunctionSchema(
    'PASCAL_CASE',
    'Converts a string to Pascal case',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to convert' })],
    { type: 'string', description: 'The Pascal-cased string' },
    {
      examples: ['PASCAL_CASE("hello world") // "HelloWorld"', 'PASCAL_CASE("this is a test") // "ThisIsATest"'],
    }
  ),

  SNAKE_CASE: createFunctionSchema(
    'SNAKE_CASE',
    'Converts a string to snake case',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to convert' })],
    { type: 'string', description: 'The snake-cased string' },
    {
      examples: ['SNAKE_CASE("hello world") // "hello_world"', 'SNAKE_CASE("this is a test") // "this_is_a_test"'],
    }
  ),

  KEBAB_CASE: createFunctionSchema(
    'KEBAB_CASE',
    'Converts a string to kebab case',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to convert' })],
    { type: 'string', description: 'The kebab-cased string' },
    {
      examples: ['KEBAB_CASE("hello world") // "hello-world"', 'KEBAB_CASE("this is a test") // "this-is-a-test"'],
    }
  ),

  PAD: createFunctionSchema(
    'PAD',
    'Pads a string to a specified length with another string',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to pad' }),
      createParameter('targetLength', { type: 'number', description: 'The target length' }),
      createParameter('padString', { type: 'string', description: 'The string to pad with (optional)' }, false),
    ],
    { type: 'string', description: 'The padded string' },
    {
      examples: ['PAD("hello", 10) // "     hello"', 'PAD("5", 3, "0") // "005"'],
    }
  ),

  PAD_START: createFunctionSchema(
    'PAD_START',
    'Pads a string from the start with another string',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to pad' }),
      createParameter('targetLength', { type: 'number', description: 'The target length' }),
      createParameter('padString', { type: 'string', description: 'The string to pad with (optional)' }, false),
    ],
    { type: 'string', description: 'The padded string' },
    {
      examples: ['PAD_START("hello", 10) // "     hello"', 'PAD_START("5", 3, "0") // "005"'],
    }
  ),

  PAD_END: createFunctionSchema(
    'PAD_END',
    'Pads a string from the end with another string',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to pad' }),
      createParameter('targetLength', { type: 'number', description: 'The target length' }),
      createParameter('padString', { type: 'string', description: 'The string to pad with (optional)' }, false),
    ],
    { type: 'string', description: 'The padded string' },
    {
      examples: ['PAD_END("hello", 10) // "hello     "', 'PAD_END("5", 3, "0") // "500"'],
    }
  ),

  REPEAT: createFunctionSchema(
    'REPEAT',
    'Repeats a string a specified number of times',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to repeat' }),
      createParameter('count', { type: 'number', description: 'The number of times to repeat the string' }),
    ],
    { type: 'string', description: 'The repeated string' },
    {
      examples: ['REPEAT("hello", 3) // "hellohellohello"', 'REPEAT("abc", 2) // "abcabc"'],
    }
  ),

  TRUNCATE: createFunctionSchema(
    'TRUNCATE',
    'Truncates a string to a specified length',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to truncate' }),
      createParameter('length', { type: 'number', description: 'The length to truncate to' }),
    ],
    { type: 'string', description: 'The truncated string' },
    {
      examples: ['TRUNCATE("hello world", 5) // "hello"', 'TRUNCATE("abc", 10) // "abc"'],
    }
  ),

  STARTS_WITH: createFunctionSchema(
    'STARTS_WITH',
    'Checks if a string starts with a specified substring',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to check' }),
      createParameter('substring', { type: 'string', description: 'The substring to check for' }),
    ],
    { type: 'boolean', description: 'True if the string starts with the substring, false otherwise' },
    {
      examples: ['STARTS_WITH("hello", "he") // true', 'STARTS_WITH("hello", "hi") // false'],
    }
  ),

  ENDS_WITH: createFunctionSchema(
    'ENDS_WITH',
    'Checks if a string ends with a specified substring',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to check' }),
      createParameter('substring', { type: 'string', description: 'The substring to check for' }),
    ],
    { type: 'boolean', description: 'True if the string ends with the substring, false otherwise' },
    {
      examples: ['ENDS_WITH("hello", "lo") // true', 'ENDS_WITH("hello", "hi") // false'],
    }
  ),

  REPLACE_ALL: createFunctionSchema(
    'REPLACE_ALL',
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
        'REPLACE_ALL("hello world world", "world", "there") // "hello there there"',
        'REPLACE_ALL("foo bar foo", "foo", "baz") // "baz bar baz"',
      ],
    }
  ),

  TRIM: createFunctionSchema(
    'TRIM',
    'Removes whitespace from both ends of a string',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to trim' })],
    { type: 'string', description: 'The trimmed string' },
    {
      examples: ['TRIM("  hello  ") // "hello"', 'TRIM("\\n\\tworld\\n") // "world"'],
    }
  ),

  TRIM_START: createFunctionSchema(
    'TRIM_START',
    'Removes whitespace from the start of a string',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to trim' })],
    { type: 'string', description: 'The trimmed string' },
    {
      examples: ['TRIM_START("  hello  ") // "hello  "', 'TRIM_START("\\n\\tworld") // "world"'],
    }
  ),

  TRIM_END: createFunctionSchema(
    'TRIM_END',
    'Removes whitespace from the end of a string',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to trim' })],
    { type: 'string', description: 'The trimmed string' },
    {
      examples: ['TRIM_END("  hello  ") // "  hello"', 'TRIM_END("world\\n\\t") // "world"'],
    }
  ),

  SLUG: createFunctionSchema(
    'SLUG',
    'Converts a string to a URL-friendly slug',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to convert' })],
    { type: 'string', description: 'The URL-friendly slug' },
    {
      examples: ['SLUG("Hello World!") // "hello-world"', 'SLUG("This is a test") // "this-is-a-test"'],
    }
  ),

  ESCAPE_HTML: createFunctionSchema(
    'ESCAPE_HTML',
    'Escapes HTML special characters in a string',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to escape' })],
    { type: 'string', description: 'The escaped string' },
    {
      examples: [
        'ESCAPE_HTML("<div>hello</div>") // "&lt;div&gt;hello&lt;/div&gt;"',
        'ESCAPE_HTML("5 > 3") // "5 &gt; 3"',
      ],
    }
  ),

  UNESCAPE_HTML: createFunctionSchema(
    'UNESCAPE_HTML',
    'Unescapes HTML special characters in a string',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to unescape' })],
    { type: 'string', description: 'The unescaped string' },
    {
      examples: [
        'UNESCAPE_HTML("&lt;div&gt;hello&lt;/div&gt;") // "<div>hello</div>"',
        'UNESCAPE_HTML("5 &gt; 3") // "5 > 3"',
      ],
    }
  ),

  WORD_COUNT: createFunctionSchema(
    'WORD_COUNT',
    'Counts the number of words in a string',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to count words in' })],
    { type: 'number', description: 'The number of words in the string' },
    {
      examples: ['WORD_COUNT("hello world") // 2', 'WORD_COUNT("This is a test") // 4'],
    }
  ),

  CHAR_COUNT: createFunctionSchema(
    'CHAR_COUNT',
    'Counts the number of characters in a string',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to count characters in' })],
    { type: 'number', description: 'The number of characters in the string' },
    {
      examples: ['CHAR_COUNT("hello") // 5', 'CHAR_COUNT("This is a test") // 14'],
    }
  ),

  INITIALS: createFunctionSchema(
    'INITIALS',
    'Extracts the initials from a string',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to extract initials from' })],
    { type: 'string', description: 'The initials extracted from the string' },
    {
      examples: ['INITIALS("John Doe") // "JD"', 'INITIALS("Jane Smith") // "JS"'],
    }
  ),

  LINES: createFunctionSchema(
    'LINES',
    'Splits a string into an array of lines',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to split into lines' })],
    { type: 'array', description: 'An array of lines' },
    {
      examples: [
        'LINES("line1\\nline2\\nline3") // ["line1", "line2", "line3"]',
        'LINES("single line") // ["single line"]',
      ],
    }
  ),

  NORMALIZE_SPACE: createFunctionSchema(
    'NORMALIZE_SPACE',
    'Removes duplicate consecutive whitespace characters.',
    'string',
    [createParameter('str', { type: 'string', description: 'The string to normalize' })],
    { type: 'string', description: 'The string with normalized whitespace' },
    {
      examples: [
        'NORMALIZE_SPACE("  hello   world  ") // "hello world"',
        'NORMALIZE_SPACE("  multiple   spaces  ") // "multiple spaces"',
      ],
    }
  ),

  MASK: createFunctionSchema(
    'MASK',
    'Masks a string by replacing characters with a specified character',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to mask' }),
      createParameter('maskChar', { type: 'string', description: "The character to use for masking (default: '*')" }),
      createParameter('start', {
        type: 'number',
        description: 'Number of characters to keep visible at the start (default: 0)',
      }),
      createParameter('end', {
        type: 'number',
        description: 'Number of characters to keep visible at the end (default: 0)',
      }),
    ],
    { type: 'string', description: 'The masked string' },
    {
      examples: ['MASK("hello world", "*", 2, 8) // "he******d"', 'MASK("1234567890", "X", 3, 7) // "12XXXX890"'],
    }
  ),

  BETWEEN: createFunctionSchema(
    'BETWEEN',
    'Extracts a substring between two delimiters',
    'string',
    [
      createParameter('str', { type: 'string', description: 'The string to extract from' }),
      createParameter('start', { type: 'string', description: 'The start delimiter' }),
      createParameter('end', { type: 'string', description: 'The end delimiter' }),
    ],
    { type: 'string', description: 'The extracted substring' },
    {
      examples: ['BETWEEN("hello", "h", "o") // "ell"', 'BETWEEN("apple", "banana", "cherry") // ""'],
    }
  ),

  // charCodeAt: createFunctionSchema(
  //   'charCodeAt',
  //   'Returns the Unicode code point of the character at a specified index',
  //   'string',
  //   [
  //     createParameter('str', { type: 'string', description: 'The string to get character code from' }),
  //     createParameter('index', { type: 'number', description: 'The index of the character' }),
  //   ],
  //   { type: 'number', description: 'The Unicode code point of the character' },
  //   {
  //     examples: ['charCodeAt("hello", 0) // 104', 'charCodeAt("A", 0) // 65'],
  //   }
  // ),

  // fromCharCode: createFunctionSchema(
  //   'fromCharCode',
  //   'Creates a string from Unicode code points',
  //   'string',
  //   [createParameter('codes', { type: 'number', description: 'Unicode code points' }, true, { variadic: true })],
  //   { type: 'string', description: 'The string created from the code points' },
  //   {
  //     examples: ['fromCharCode(72, 101, 108, 108, 111) // "Hello"', 'fromCharCode(65, 66, 67) // "ABC"'],
  //   }
  // ),

  // match: createFunctionSchema(
  //   'match',
  //   'Matches a string against a regular expression',
  //   'string',
  //   [
  //     createParameter('str', { type: 'string', description: 'The string to match' }, true),
  //     createParameter('regexp', { type: 'string', description: 'The regular expression' }, true),
  //   ],
  //   {
  //     type: 'array',
  //     items: { type: 'string' },
  //     description: 'An array of matches, or null if no match',
  //   },
  //   {
  //     examples: ['match("hello 123", "\\\\d+") // ["123"]', 'match("abc def", "\\\\w+") // ["abc"]'],
  //   }
  // ),

  // search: createFunctionSchema(
  //   'search',
  //   'Searches for a match against a regular expression',
  //   'string',
  //   [
  //     createParameter('str', { type: 'string', description: 'The string to search' }, true),
  //     createParameter('regexp', { type: 'string', description: 'The regular expression' }, true),
  //   ],
  //   { type: 'number', description: 'The index of the first match, or -1 if no match' },
  //   {
  //     examples: ['search("hello 123", "\\\\d+") // 6', 'search("abc def", "\\\\d+") // -1'],
  //   }
  // ),

  // SLICE: createFunctionSchema(
  //   'slice',
  //   'Extracts a section of a string',
  //   'string',
  //   [
  //     createParameter('str', { type: 'string', description: 'The string to slice' }, true),
  //     createParameter('start', { type: 'number', description: 'The start index' }, true),
  //     createParameter('end', { type: 'number', description: 'The end index (optional)' }, false),
  //   ],
  //   { type: 'string', description: 'The extracted section' },
  //   {
  //     examples: ['slice("hello world", 0, 5) // "hello"', 'slice("hello world", 6) // "world"'],
  //   }
  // ),
}

// Create the library schema
export const stringLibrarySchema = createLibrarySchema(stringFunctionSchemas, {
  category: 'string',
  title: 'String Functions',
  description: 'String manipulation and utility functions',
  version: '1.0.0',
})

// Export utility functions for easy access
export const getStringFunction = (name: string) => stringLibrarySchema.functions[name]
export const getStringFunctionNames = () => Object.keys(stringLibrarySchema.functions)
export const getStringFunctionCount = () => Object.keys(stringLibrarySchema.functions).length

// Export for integration with editors/tools
export { stringLibrarySchema as schema }
export default stringLibrarySchema
