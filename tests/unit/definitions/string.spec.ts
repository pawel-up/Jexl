/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from '@japa/runner'
import * as stringFunctions from '../../../src/definitions/string.js'
import * as arrayFunctions from '../../../src/definitions/array.js'
import * as commonFunctions from '../../../src/definitions/common.js'
import { Jexl } from '../../../src/Jexl.js'
import type { FunctionFunction } from '../../../src/grammar.js'

// Helper function to add all functions from a module
function addModule(jexl: Jexl, module: Record<string, FunctionFunction>, prefix = '') {
  Object.keys(module).forEach((key) => {
    const functionName = prefix ? `${prefix}_${key}` : key
    jexl.addFunction(functionName, module[key])
  })
}

// Helper function to evaluate Jexl expressions with string functions
const evalJexl = async <R = unknown>(expression: string, context: any = {}) => {
  const lib = new Jexl()
  addModule(lib, stringFunctions)
  addModule(lib, arrayFunctions)
  addModule(lib, commonFunctions)
  return await lib.eval<R>(expression, context)
}

test.group('String - Basic Functions', () => {
  test('UPPER converts string to uppercase', async ({ assert }) => {
    assert.equal(await evalJexl('UPPER("hello world")'), 'HELLO WORLD')
    assert.equal(await evalJexl('UPPER("MiXeD cAsE")'), 'MIXED CASE')
    assert.equal(await evalJexl('UPPER("")'), '')
    assert.equal(await evalJexl('UPPER(text)', { text: 'test' }), 'TEST')
  })

  test('LOWER converts string to lowercase', async ({ assert }) => {
    assert.equal(await evalJexl('LOWER("HELLO WORLD")'), 'hello world')
    assert.equal(await evalJexl('LOWER("MiXeD cAsE")'), 'mixed case')
    assert.equal(await evalJexl('LOWER("")'), '')
    assert.equal(await evalJexl('LOWER(text)', { text: 'TEST' }), 'test')
  })

  test('SUBSTR extracts substring', async ({ assert }) => {
    assert.equal(await evalJexl('SUBSTR("hello world", 0, 5)'), 'hello')
    assert.equal(await evalJexl('SUBSTR("hello world", 6)'), 'world')
    assert.equal(await evalJexl('SUBSTR("hello world", 6, 10)'), 'worl')
    assert.equal(await evalJexl('SUBSTR("", 0, 5)'), '')
    assert.equal(await evalJexl('SUBSTR(text, 1, 4)', { text: 'testing' }), 'est')
  })

  test('SPLIT splits string into array', async ({ assert }) => {
    assert.deepEqual(await evalJexl('SPLIT("a,b,c", ",")'), ['a', 'b', 'c'])
    assert.deepEqual(await evalJexl('SPLIT("hello world", " ")'), ['hello', 'world'])
    assert.deepEqual(await evalJexl('SPLIT("test", "")'), ['t', 'e', 's', 't'])
    assert.deepEqual(await evalJexl('SPLIT("", ",")'), [''])
    assert.deepEqual(await evalJexl('SPLIT(text, separator)', { text: 'a|b|c', separator: '|' }), ['a', 'b', 'c'])
  })

  test('REPLACE replaces first occurrence', async ({ assert }) => {
    assert.equal(await evalJexl('REPLACE("hello world", "world", "universe")'), 'hello universe')
    assert.equal(await evalJexl('REPLACE("test test", "test", "exam")'), 'exam test')
    assert.equal(await evalJexl('REPLACE("hello", "xyz", "abc")'), 'hello')
    assert.equal(await evalJexl('REPLACE("", "a", "b")'), '')
    assert.equal(
      await evalJexl('REPLACE(text, old, new)', { text: 'hello world', old: 'world', new: 'universe' }),
      'hello universe'
    )
  })

  test('TRIM removes whitespace from both ends', async ({ assert }) => {
    assert.equal(await evalJexl('TRIM("  hello world  ")'), 'hello world')
    assert.equal(await evalJexl('TRIM("\n\t  test  \n\t")'), 'test')
    assert.equal(await evalJexl('TRIM("")'), '')
    assert.equal(await evalJexl('TRIM("   ")'), '')
    assert.equal(await evalJexl('TRIM(text)', { text: '  spaced  ' }), 'spaced')
  })
})

test.group('String - Case Conversion Functions', () => {
  test('CAPITALIZE capitalizes first letter', async ({ assert }) => {
    assert.equal(await evalJexl('CAPITALIZE("hello world")'), 'Hello world')
    assert.equal(await evalJexl('CAPITALIZE("HELLO WORLD")'), 'Hello world')
    assert.equal(await evalJexl('CAPITALIZE("test")'), 'Test')
    assert.equal(await evalJexl('CAPITALIZE("")'), '')
    assert.equal(await evalJexl('CAPITALIZE(text)', { text: 'example' }), 'Example')
  })

  test('TITLE_CASE capitalizes first letter of each word', async ({ assert }) => {
    assert.equal(await evalJexl('TITLE_CASE("hello world")'), 'Hello World')
    assert.equal(await evalJexl('TITLE_CASE("the quick brown fox")'), 'The Quick Brown Fox')
    assert.equal(await evalJexl('TITLE_CASE("TEST")'), 'TEST')
    assert.equal(await evalJexl('TITLE_CASE("")'), '')
    assert.equal(await evalJexl('TITLE_CASE(text)', { text: 'test case' }), 'Test Case')
  })

  test('CAMEL_CASE converts to camelCase', async ({ assert }) => {
    assert.equal(await evalJexl('CAMEL_CASE("hello world")'), 'helloWorld')
    assert.equal(await evalJexl('CAMEL_CASE("the quick brown fox")'), 'theQuickBrownFox')
    assert.equal(await evalJexl('CAMEL_CASE("TEST CASE")'), 'testCase')
    assert.equal(await evalJexl('CAMEL_CASE("hello-world")'), 'helloWorld')
    assert.equal(await evalJexl('CAMEL_CASE(text)', { text: 'test case' }), 'testCase')
  })

  test('PASCAL_CASE converts to PascalCase', async ({ assert }) => {
    assert.equal(await evalJexl('PASCAL_CASE("hello world")'), 'HelloWorld')
    assert.equal(await evalJexl('PASCAL_CASE("the quick brown fox")'), 'TheQuickBrownFox')
    assert.equal(await evalJexl('PASCAL_CASE("TEST CASE")'), 'TestCase')
    assert.equal(await evalJexl('PASCAL_CASE("hello-world")'), 'HelloWorld')
    assert.equal(await evalJexl('PASCAL_CASE(text)', { text: 'test case' }), 'TestCase')
  })

  test('SNAKE_CASE converts to snake_case', async ({ assert }) => {
    assert.equal(await evalJexl('SNAKE_CASE("hello world")'), 'hello_world')
    assert.equal(await evalJexl('SNAKE_CASE("theQuickBrownFox")'), 'the_quick_brown_fox')
    assert.equal(await evalJexl('SNAKE_CASE("TEST CASE")'), 'test_case')
    assert.equal(await evalJexl('SNAKE_CASE("hello-world")'), 'hello_world')
    assert.equal(await evalJexl('SNAKE_CASE(text)', { text: 'TestCase' }), 'test_case')
  })

  test('KEBAB_CASE converts to kebab-case', async ({ assert }) => {
    assert.equal(await evalJexl('KEBAB_CASE("hello world")'), 'hello-world')
    assert.equal(await evalJexl('KEBAB_CASE("theQuickBrownFox")'), 'the-quick-brown-fox')
    assert.equal(await evalJexl('KEBAB_CASE("TEST CASE")'), 'test-case')
    assert.equal(await evalJexl('KEBAB_CASE("hello_world")'), 'hello-world')
    assert.equal(await evalJexl('KEBAB_CASE(text)', { text: 'TestCase' }), 'test-case')
  })
})

test.group('String - Padding and Formatting Functions', () => {
  test('PAD pads string to specified length', async ({ assert }) => {
    assert.equal(await evalJexl('PAD("test", 8)'), '    test')
    assert.equal(await evalJexl('PAD("test", 8, "0")'), '0000test')
    assert.equal(await evalJexl('PAD("test", 6, "ab")'), 'abtest')
    assert.equal(await evalJexl('PAD("test", 3)'), 'test')
    assert.equal(await evalJexl('PAD(text, 10, char)', { text: 'hello', char: '*' }), '*****hello')
  })

  test('PAD_START pads string to the left', async ({ assert }) => {
    assert.equal(await evalJexl('PAD_START("test", 8)'), '    test')
    assert.equal(await evalJexl('PAD_START("test", 8, "0")'), '0000test')
    assert.equal(await evalJexl('PAD_START("test", 6, "ab")'), 'abtest')
    assert.equal(await evalJexl('PAD_START("test", 3)'), 'test')
    assert.equal(await evalJexl('PAD_START(text, 10, char)', { text: 'hello', char: '*' }), '*****hello')
  })

  test('PAD_END pads string to the right', async ({ assert }) => {
    assert.equal(await evalJexl('PAD_END("test", 8)'), 'test    ')
    assert.equal(await evalJexl('PAD_END("test", 8, "0")'), 'test0000')
    assert.equal(await evalJexl('PAD_END("test", 6, "ab")'), 'testab')
    assert.equal(await evalJexl('PAD_END("test", 3)'), 'test')
    assert.equal(await evalJexl('PAD_END(text, 10, char)', { text: 'hello', char: '*' }), 'hello*****')
  })

  test('REPEAT repeats string specified number of times', async ({ assert }) => {
    assert.equal(await evalJexl('REPEAT("abc", 3)'), 'abcabcabc')
    assert.equal(await evalJexl('REPEAT("x", 5)'), 'xxxxx')
    assert.equal(await evalJexl('REPEAT("test", 0)'), '')
    assert.equal(await evalJexl('REPEAT("", 5)'), '')
    assert.equal(await evalJexl('REPEAT(text, count)', { text: 'hi', count: 3 }), 'hihihi')
  })

  test('TRUNCATE truncates string to specified length', async ({ assert }) => {
    assert.equal(await evalJexl('TRUNCATE("hello world", 8)'), 'hello...')
    assert.equal(await evalJexl('TRUNCATE("hello world", 8, "***")'), 'hello***')
    assert.equal(await evalJexl('TRUNCATE("hello", 10)'), 'hello')
    assert.equal(await evalJexl('TRUNCATE("test", 4)'), 'test')
    assert.equal(await evalJexl('TRUNCATE(text, 6, suffix)', { text: 'testing', suffix: '...' }), 'tes...')
  })
})

test.group('String - Search and Check Functions', () => {
  test('STARTS_WITH checks if string starts with substring', async ({ assert }) => {
    assert.isTrue(await evalJexl('STARTS_WITH("hello world", "hello")'))
    assert.isFalse(await evalJexl('STARTS_WITH("hello world", "world")'))
    assert.isTrue(await evalJexl('STARTS_WITH("test", "")'))
    assert.isFalse(await evalJexl('STARTS_WITH("", "test")'))
    assert.isTrue(await evalJexl('STARTS_WITH(text, prefix)', { text: 'example', prefix: 'ex' }))
  })

  test('ENDS_WITH checks if string ends with substring', async ({ assert }) => {
    assert.isTrue(await evalJexl('ENDS_WITH("hello world", "world")'))
    assert.isFalse(await evalJexl('ENDS_WITH("hello world", "hello")'))
    assert.isTrue(await evalJexl('ENDS_WITH("test", "")'))
    assert.isFalse(await evalJexl('ENDS_WITH("", "test")'))
    assert.isTrue(await evalJexl('ENDS_WITH(text, suffix)', { text: 'example', suffix: 'ple' }))
  })

  test('REPLACE_ALL replaces all occurrences', async ({ assert }) => {
    assert.equal(await evalJexl('REPLACE_ALL("hello world world", "world", "universe")'), 'hello universe universe')
    assert.equal(await evalJexl('REPLACE_ALL("test test test", "test", "exam")'), 'exam exam exam')
    assert.equal(await evalJexl('REPLACE_ALL("hello", "xyz", "abc")'), 'hello')
    assert.equal(await evalJexl('REPLACE_ALL("", "a", "b")'), '')
    assert.equal(
      await evalJexl('REPLACE_ALL(text, old, new)', { text: 'abc abc abc', old: 'abc', new: 'xyz' }),
      'xyz xyz xyz'
    )
  })
})

test.group('String - Trim Functions', () => {
  test('TRIM_START removes whitespace from start', async ({ assert }) => {
    assert.equal(await evalJexl('TRIM_START("  hello world  ")'), 'hello world  ')
    assert.equal(await evalJexl('TRIM_START("\n\t  test")'), 'test')
    assert.equal(await evalJexl('TRIM_START("")'), '')
    assert.equal(await evalJexl('TRIM_START("   ")'), '')
    assert.equal(await evalJexl('TRIM_START(text)', { text: '  spaced' }), 'spaced')
  })

  test('TRIM_END removes whitespace from end', async ({ assert }) => {
    assert.equal(await evalJexl('TRIM_END("  hello world  ")'), '  hello world')
    assert.equal(await evalJexl('TRIM_END("test  \n\t")'), 'test')
    assert.equal(await evalJexl('TRIM_END("")'), '')
    assert.equal(await evalJexl('TRIM_END("   ")'), '')
    assert.equal(await evalJexl('TRIM_END(text)', { text: 'spaced  ' }), 'spaced')
  })
})

test.group('String - Utility Functions', () => {
  test('SLUG converts string to URL-friendly format', async ({ assert }) => {
    assert.equal(await evalJexl('SLUG("Hello World!")'), 'hello-world')
    assert.equal(await evalJexl('SLUG("The Quick Brown Fox")'), 'the-quick-brown-fox')
    assert.equal(await evalJexl('SLUG("Test@#$%^&*()123")'), 'test123')
    assert.equal(await evalJexl('SLUG("  spaced  ")'), 'spaced')
    assert.equal(await evalJexl('SLUG(text)', { text: 'Test Title!' }), 'test-title')
  })

  test('ESCAPE_HTML escapes HTML special characters', async ({ assert }) => {
    assert.equal(await evalJexl('ESCAPE_HTML("<div>Hello & World</div>")'), '&lt;div&gt;Hello &amp; World&lt;/div&gt;')
    assert.equal(
      await evalJexl('ESCAPE_HTML("Test \\"quotes\\" & \'apostrophes\'")'),
      'Test &quot;quotes&quot; &amp; &#39;apostrophes&#39;'
    )
    assert.equal(await evalJexl('ESCAPE_HTML("")'), '')
    assert.equal(await evalJexl('ESCAPE_HTML("no special chars")'), 'no special chars')
    assert.equal(
      await evalJexl('ESCAPE_HTML(text)', { text: '<script>alert("xss")</script>' }),
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    )
  })

  test('UNESCAPE_HTML unescapes HTML entities', async ({ assert }) => {
    assert.equal(
      await evalJexl('UNESCAPE_HTML("&lt;div&gt;Hello &amp; World&lt;/div&gt;")'),
      '<div>Hello & World</div>'
    )
    assert.equal(
      await evalJexl('UNESCAPE_HTML("Test &quot;quotes&quot; &amp; &#39;apostrophes&#39;")'),
      'Test "quotes" & \'apostrophes\''
    )
    assert.equal(await evalJexl('UNESCAPE_HTML("")'), '')
    assert.equal(await evalJexl('UNESCAPE_HTML("no entities")'), 'no entities')
    assert.equal(
      await evalJexl('UNESCAPE_HTML(text)', { text: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;' }),
      '<script>alert("xss")</script>'
    )
  })

  test('WORD_COUNT counts words in string', async ({ assert }) => {
    assert.equal(await evalJexl('WORD_COUNT("hello world")'), 2)
    assert.equal(await evalJexl('WORD_COUNT("The quick brown fox jumps")'), 5)
    assert.equal(await evalJexl('WORD_COUNT("")'), 0)
    assert.equal(await evalJexl('WORD_COUNT("   ")'), 0)
    assert.equal(await evalJexl('WORD_COUNT("single")'), 1)
    assert.equal(await evalJexl('WORD_COUNT(text)', { text: 'test case example' }), 3)
  })

  test('CHAR_COUNT counts characters in string', async ({ assert }) => {
    assert.equal(await evalJexl('CHAR_COUNT("hello")'), 5)
    assert.equal(await evalJexl('CHAR_COUNT("hello world")'), 11)
    assert.equal(await evalJexl('CHAR_COUNT("")'), 0)
    assert.equal(await evalJexl('CHAR_COUNT("   ")'), 3)
    assert.equal(await evalJexl('CHAR_COUNT(text)', { text: 'testing' }), 7)
  })

  test('INITIALS extracts initials from string', async ({ assert }) => {
    assert.equal(await evalJexl('INITIALS("John Doe")'), 'JD')
    assert.equal(await evalJexl('INITIALS("Mary Jane Watson")'), 'MJW')
    assert.equal(await evalJexl('INITIALS("single")'), 'S')
    assert.equal(await evalJexl('INITIALS("")'), '')
    assert.equal(await evalJexl('INITIALS("   ")'), '')
    assert.equal(await evalJexl('INITIALS(text)', { text: 'Test Case' }), 'TC')
  })

  test('LINES splits string into array of lines', async ({ assert }) => {
    assert.deepEqual(await evalJexl('LINES("line1\nline2\nline3")'), ['line1', 'line2', 'line3'])
    assert.deepEqual(await evalJexl('LINES("line1\r\nline2\r\nline3")'), ['line1', 'line2', 'line3'])
    assert.deepEqual(await evalJexl('LINES("single line")'), ['single line'])
    assert.deepEqual(await evalJexl('LINES("")'), [''])
    assert.deepEqual(await evalJexl('LINES(text)', { text: 'first\nsecond' }), ['first', 'second'])
  })

  test('NORMALIZE_SPACE removes duplicate consecutive whitespace', async ({ assert }) => {
    assert.equal(await evalJexl('NORMALIZE_SPACE("hello    world")'), 'hello world')
    assert.equal(await evalJexl('NORMALIZE_SPACE("  test   case  ")'), 'test case')
    assert.equal(await evalJexl('NORMALIZE_SPACE("single")'), 'single')
    assert.equal(await evalJexl('NORMALIZE_SPACE("")'), '')
    assert.equal(await evalJexl('NORMALIZE_SPACE("   ")'), '')
    assert.equal(await evalJexl('NORMALIZE_SPACE(text)', { text: 'too    many    spaces' }), 'too many spaces')
  })

  test('MASK masks string with specified character', async ({ assert }) => {
    assert.equal(await evalJexl('MASK("1234567890")'), '**********')
    assert.equal(await evalJexl('MASK("1234567890", "#")'), '##########')
    assert.equal(await evalJexl('MASK("1234567890", "*", 2)'), '12********')
    assert.equal(await evalJexl('MASK("1234567890", "*", 0, 2)'), '********90')
    assert.equal(await evalJexl('MASK("1234567890", "*", 2, 2)'), '12******90')
    assert.equal(await evalJexl('MASK("123", "*", 2, 2)'), '123')
    assert.equal(
      await evalJexl('MASK(text, char, start, end)', { text: 'password', char: 'x', start: 1, end: 1 }),
      'pxxxxxxd'
    )
  })

  test('BETWEEN extracts substring between delimiters', async ({ assert }) => {
    assert.equal(await evalJexl('BETWEEN("Hello [world] test", "[", "]")'), 'world')
    assert.equal(await evalJexl('BETWEEN("start<middle>end", "<", ">")'), 'middle')
    assert.equal(await evalJexl('BETWEEN("no delimiters", "[", "]")'), '')
    assert.equal(await evalJexl('BETWEEN("start[incomplete", "[", "]")'), '')
    assert.equal(await evalJexl('BETWEEN("multiple[first]and[second]", "[", "]")'), 'first')
    assert.equal(await evalJexl('BETWEEN(text, start, end)', { text: 'test{value}end', start: '{', end: '}' }), 'value')
  })
})

test.group('String - Edge Cases', () => {
  test('handles empty strings correctly', async ({ assert }) => {
    assert.equal(await evalJexl('UPPER("")'), '')
    assert.equal(await evalJexl('CAPITALIZE("")'), '')
    assert.equal(await evalJexl('SLUG("")'), '')
    assert.equal(await evalJexl('MASK("")'), '')
    assert.equal(await evalJexl('BETWEEN("", "[", "]")'), '')
  })

  test('handles null and undefined context values', async ({ assert }) => {
    // These should handle gracefully when context values are null/undefined
    assert.equal(await evalJexl('UPPER(text || "default")', { text: null }), 'DEFAULT')
    assert.equal(await evalJexl('LENGTH(text || "")', { text: undefined }), 0)
    assert.equal(await evalJexl('IS_EMPTY(text || "")', { text: null }), true)
  })

  test('handles special characters correctly', async ({ assert }) => {
    assert.equal(await evalJexl('UPPER("émojis 🎉")'), 'ÉMOJIS 🎉')
    assert.equal(await evalJexl('LENGTH("🎉🎊🎈")'), 6) // Each emoji is 2 characters
    assert.equal(await evalJexl('REVERSE("abc🎉")'), '🎉cba')
    assert.deepEqual(await evalJexl('SPLIT("a🎉b🎉c", "🎉")'), ['a', 'b', 'c'])
  })

  test('handles very long strings', async ({ assert }) => {
    const longString = 'a'.repeat(1000)
    assert.equal(await evalJexl('LENGTH(text)', { text: longString }), 1000)
    assert.equal(await evalJexl('TRUNCATE(text, 10)', { text: longString }), 'aaaaaaa...')
    assert.equal(await evalJexl('MASK(text, "*", 5, 5)', { text: longString }), 'aaaaa' + '*'.repeat(990) + 'aaaaa')
  })

  test('handles case conversion edge cases', async ({ assert }) => {
    assert.equal(await evalJexl('CAMEL_CASE("123 test")'), '123Test')
    assert.equal(await evalJexl('SNAKE_CASE("  test  ")'), 'test')
    assert.equal(await evalJexl('KEBAB_CASE("TEST")'), 'test')
    assert.equal(await evalJexl('PASCAL_CASE("  ")'), '')
  })

  test('handles padding edge cases', async ({ assert }) => {
    assert.equal(await evalJexl('PAD("test", 2)'), 'test') // Target length shorter than string
    assert.equal(await evalJexl('PAD_START("", 5, "x")'), 'xxxxx')
    assert.equal(await evalJexl('PAD_END("test", 10, "")'), 'test') // Empty pad string
  })
})

test.group('String - Complex Operations', () => {
  test('chaining string operations', async ({ assert }) => {
    // Chain multiple operations
    const result = await evalJexl('UPPER(TRIM(text))', { text: '  hello world  ' })
    assert.equal(result, 'HELLO WORLD')

    const result2 = await evalJexl('CAPITALIZE(CAMEL_CASE(text))', { text: 'hello world test' })
    assert.equal(result2, 'Helloworldtest')

    const result3 = await evalJexl('SLUG(TRIM(text))', { text: '  Test Title!  ' })
    assert.equal(result3, 'test-title')
  })

  test('working with arrays and strings', async ({ assert }) => {
    const words = ['hello', 'world', 'test']
    const result = await evalJexl('UPPER(JOIN(words, " "))', { words })
    assert.equal(result, 'HELLO WORLD TEST')

    const text = 'apple,banana,cherry'
    const result2 = await evalJexl('LENGTH(SPLIT(text, ","))', { text })
    assert.equal(result2, 3)
  })

  test('text processing pipeline', async ({ assert }) => {
    const rawText = '  Hello World! This is a TEST.  '
    const result = await evalJexl('KEBAB_CASE(NORMALIZE_SPACE(TRIM(text)))', { text: rawText })
    assert.equal(result, 'hello-world-this-is-a-test')

    const emailLike = 'user@example.com'
    const result2 = await evalJexl('BETWEEN(text, "", "@")', { text: emailLike })
    assert.equal(result2, 'user')
  })

  test('formatting and validation', async ({ assert }) => {
    const userInput = '  John Doe  '
    const formatted = await evalJexl('TITLE_CASE(TRIM(text))', { text: userInput })
    assert.equal(formatted, 'John Doe')

    const isEmpty = await evalJexl('IS_EMPTY(TRIM(text))', { text: '   ' })
    assert.isTrue(isEmpty)

    const initials = await evalJexl('INITIALS(TRIM(text))', { text: userInput })
    assert.equal(initials, 'JD')
  })
})
