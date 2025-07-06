/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from '@japa/runner'
import * as stringFunctions from '../../../src/definitions/string.js'
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
  return await lib.eval<R>(expression, context)
}

test.group('String - Basic Functions', () => {
  test('upper converts string to uppercase', async ({ assert }) => {
    assert.equal(await evalJexl('upper("hello world")'), 'HELLO WORLD')
    assert.equal(await evalJexl('upper("MiXeD cAsE")'), 'MIXED CASE')
    assert.equal(await evalJexl('upper("")'), '')
    assert.equal(await evalJexl('upper(text)', { text: 'test' }), 'TEST')
  })

  test('lower converts string to lowercase', async ({ assert }) => {
    assert.equal(await evalJexl('lower("HELLO WORLD")'), 'hello world')
    assert.equal(await evalJexl('lower("MiXeD cAsE")'), 'mixed case')
    assert.equal(await evalJexl('lower("")'), '')
    assert.equal(await evalJexl('lower(text)', { text: 'TEST' }), 'test')
  })

  test('substr extracts substring', async ({ assert }) => {
    assert.equal(await evalJexl('substr("hello world", 0, 5)'), 'hello')
    assert.equal(await evalJexl('substr("hello world", 6)'), 'world')
    assert.equal(await evalJexl('substr("hello world", 6, 10)'), 'worl')
    assert.equal(await evalJexl('substr("", 0, 5)'), '')
    assert.equal(await evalJexl('substr(text, 1, 4)', { text: 'testing' }), 'est')
  })

  test('split splits string into array', async ({ assert }) => {
    assert.deepEqual(await evalJexl('split("a,b,c", ",")'), ['a', 'b', 'c'])
    assert.deepEqual(await evalJexl('split("hello world", " ")'), ['hello', 'world'])
    assert.deepEqual(await evalJexl('split("test", "")'), ['t', 'e', 's', 't'])
    assert.deepEqual(await evalJexl('split("", ",")'), [''])
    assert.deepEqual(await evalJexl('split(text, separator)', { text: 'a|b|c', separator: '|' }), ['a', 'b', 'c'])
  })

  test('join joins array into string', async ({ assert }) => {
    assert.equal(await evalJexl('join(["a", "b", "c"], ",")'), 'a,b,c')
    assert.equal(await evalJexl('join(["hello", "world"], " ")'), 'hello world')
    assert.equal(await evalJexl('join([], ",")'), '')
    assert.equal(await evalJexl('join([1, 2, 3], "-")'), '1-2-3')
    assert.equal(await evalJexl('join(arr, separator)', { arr: ['x', 'y', 'z'], separator: '|' }), 'x|y|z')
  })

  test('replace replaces first occurrence', async ({ assert }) => {
    assert.equal(await evalJexl('replace("hello world", "world", "universe")'), 'hello universe')
    assert.equal(await evalJexl('replace("test test", "test", "exam")'), 'exam test')
    assert.equal(await evalJexl('replace("hello", "xyz", "abc")'), 'hello')
    assert.equal(await evalJexl('replace("", "a", "b")'), '')
    assert.equal(
      await evalJexl('replace(text, old, new)', { text: 'hello world', old: 'world', new: 'universe' }),
      'hello universe'
    )
  })

  test('trim removes whitespace from both ends', async ({ assert }) => {
    assert.equal(await evalJexl('trim("  hello world  ")'), 'hello world')
    assert.equal(await evalJexl('trim("\n\t  test  \n\t")'), 'test')
    assert.equal(await evalJexl('trim("")'), '')
    assert.equal(await evalJexl('trim("   ")'), '')
    assert.equal(await evalJexl('trim(text)', { text: '  spaced  ' }), 'spaced')
  })

  test('len returns length of string or array', async ({ assert }) => {
    assert.equal(await evalJexl('len("hello")'), 5)
    assert.equal(await evalJexl('len("")'), 0)
    assert.equal(await evalJexl('len(["a", "b", "c"])'), 3)
    assert.equal(await evalJexl('len([])'), 0)
    assert.equal(await evalJexl('len(text)', { text: 'testing' }), 7)
  })
})

test.group('String - Case Conversion Functions', () => {
  test('capitalize capitalizes first letter', async ({ assert }) => {
    assert.equal(await evalJexl('capitalize("hello world")'), 'Hello world')
    assert.equal(await evalJexl('capitalize("HELLO WORLD")'), 'Hello world')
    assert.equal(await evalJexl('capitalize("test")'), 'Test')
    assert.equal(await evalJexl('capitalize("")'), '')
    assert.equal(await evalJexl('capitalize(text)', { text: 'example' }), 'Example')
  })

  test('titleCase capitalizes first letter of each word', async ({ assert }) => {
    assert.equal(await evalJexl('titleCase("hello world")'), 'Hello World')
    assert.equal(await evalJexl('titleCase("the quick brown fox")'), 'The Quick Brown Fox')
    assert.equal(await evalJexl('titleCase("TEST")'), 'TEST')
    assert.equal(await evalJexl('titleCase("")'), '')
    assert.equal(await evalJexl('titleCase(text)', { text: 'test case' }), 'Test Case')
  })

  test('camelCase converts to camelCase', async ({ assert }) => {
    assert.equal(await evalJexl('camelCase("hello world")'), 'helloWorld')
    assert.equal(await evalJexl('camelCase("the quick brown fox")'), 'theQuickBrownFox')
    assert.equal(await evalJexl('camelCase("TEST CASE")'), 'testCase')
    assert.equal(await evalJexl('camelCase("hello-world")'), 'helloWorld')
    assert.equal(await evalJexl('camelCase(text)', { text: 'test case' }), 'testCase')
  })

  test('pascalCase converts to PascalCase', async ({ assert }) => {
    assert.equal(await evalJexl('pascalCase("hello world")'), 'HelloWorld')
    assert.equal(await evalJexl('pascalCase("the quick brown fox")'), 'TheQuickBrownFox')
    assert.equal(await evalJexl('pascalCase("TEST CASE")'), 'TestCase')
    assert.equal(await evalJexl('pascalCase("hello-world")'), 'HelloWorld')
    assert.equal(await evalJexl('pascalCase(text)', { text: 'test case' }), 'TestCase')
  })

  test('snakeCase converts to snake_case', async ({ assert }) => {
    assert.equal(await evalJexl('snakeCase("hello world")'), 'hello_world')
    assert.equal(await evalJexl('snakeCase("theQuickBrownFox")'), 'the_quick_brown_fox')
    assert.equal(await evalJexl('snakeCase("TEST CASE")'), 'test_case')
    assert.equal(await evalJexl('snakeCase("hello-world")'), 'hello_world')
    assert.equal(await evalJexl('snakeCase(text)', { text: 'TestCase' }), 'test_case')
  })

  test('kebabCase converts to kebab-case', async ({ assert }) => {
    assert.equal(await evalJexl('kebabCase("hello world")'), 'hello-world')
    assert.equal(await evalJexl('kebabCase("theQuickBrownFox")'), 'the-quick-brown-fox')
    assert.equal(await evalJexl('kebabCase("TEST CASE")'), 'test-case')
    assert.equal(await evalJexl('kebabCase("hello_world")'), 'hello-world')
    assert.equal(await evalJexl('kebabCase(text)', { text: 'TestCase' }), 'test-case')
  })
})

test.group('String - Padding and Formatting Functions', () => {
  test('pad pads string to specified length', async ({ assert }) => {
    assert.equal(await evalJexl('pad("test", 8)'), '    test')
    assert.equal(await evalJexl('pad("test", 8, "0")'), '0000test')
    assert.equal(await evalJexl('pad("test", 6, "ab")'), 'abtest')
    assert.equal(await evalJexl('pad("test", 3)'), 'test')
    assert.equal(await evalJexl('pad(text, 10, char)', { text: 'hello', char: '*' }), '*****hello')
  })

  test('padLeft pads string to the left', async ({ assert }) => {
    assert.equal(await evalJexl('padLeft("test", 8)'), '    test')
    assert.equal(await evalJexl('padLeft("test", 8, "0")'), '0000test')
    assert.equal(await evalJexl('padLeft("test", 6, "ab")'), 'abtest')
    assert.equal(await evalJexl('padLeft("test", 3)'), 'test')
    assert.equal(await evalJexl('padLeft(text, 10, char)', { text: 'hello', char: '*' }), '*****hello')
  })

  test('padRight pads string to the right', async ({ assert }) => {
    assert.equal(await evalJexl('padRight("test", 8)'), 'test    ')
    assert.equal(await evalJexl('padRight("test", 8, "0")'), 'test0000')
    assert.equal(await evalJexl('padRight("test", 6, "ab")'), 'testab')
    assert.equal(await evalJexl('padRight("test", 3)'), 'test')
    assert.equal(await evalJexl('padRight(text, 10, char)', { text: 'hello', char: '*' }), 'hello*****')
  })

  test('repeat repeats string specified number of times', async ({ assert }) => {
    assert.equal(await evalJexl('repeat("abc", 3)'), 'abcabcabc')
    assert.equal(await evalJexl('repeat("x", 5)'), 'xxxxx')
    assert.equal(await evalJexl('repeat("test", 0)'), '')
    assert.equal(await evalJexl('repeat("", 5)'), '')
    assert.equal(await evalJexl('repeat(text, count)', { text: 'hi', count: 3 }), 'hihihi')
  })

  test('reverse reverses string', async ({ assert }) => {
    assert.equal(await evalJexl('reverse("hello")'), 'olleh')
    assert.equal(await evalJexl('reverse("abc123")'), '321cba')
    assert.equal(await evalJexl('reverse("")'), '')
    assert.equal(await evalJexl('reverse("a")'), 'a')
    assert.equal(await evalJexl('reverse(text)', { text: 'world' }), 'dlrow')
  })

  test('truncate truncates string to specified length', async ({ assert }) => {
    assert.equal(await evalJexl('truncate("hello world", 8)'), 'hello...')
    assert.equal(await evalJexl('truncate("hello world", 8, "***")'), 'hello***')
    assert.equal(await evalJexl('truncate("hello", 10)'), 'hello')
    assert.equal(await evalJexl('truncate("test", 4)'), 'test')
    assert.equal(await evalJexl('truncate(text, 6, suffix)', { text: 'testing', suffix: '...' }), 'tes...')
  })
})

test.group('String - Search and Check Functions', () => {
  test('startsWith checks if string starts with substring', async ({ assert }) => {
    assert.isTrue(await evalJexl('startsWith("hello world", "hello")'))
    assert.isFalse(await evalJexl('startsWith("hello world", "world")'))
    assert.isTrue(await evalJexl('startsWith("test", "")'))
    assert.isFalse(await evalJexl('startsWith("", "test")'))
    assert.isTrue(await evalJexl('startsWith(text, prefix)', { text: 'example', prefix: 'ex' }))
  })

  test('endsWith checks if string ends with substring', async ({ assert }) => {
    assert.isTrue(await evalJexl('endsWith("hello world", "world")'))
    assert.isFalse(await evalJexl('endsWith("hello world", "hello")'))
    assert.isTrue(await evalJexl('endsWith("test", "")'))
    assert.isFalse(await evalJexl('endsWith("", "test")'))
    assert.isTrue(await evalJexl('endsWith(text, suffix)', { text: 'example', suffix: 'ple' }))
  })

  test('contains checks if string contains substring', async ({ assert }) => {
    assert.isTrue(await evalJexl('contains("hello world", "world")'))
    assert.isTrue(await evalJexl('contains("hello world", "lo wo")'))
    assert.isFalse(await evalJexl('contains("hello world", "xyz")'))
    assert.isTrue(await evalJexl('contains("test", "")'))
    assert.isTrue(await evalJexl('contains(text, search)', { text: 'example', search: 'amp' }))
  })

  test('indexOf finds index of substring', async ({ assert }) => {
    assert.equal(await evalJexl('indexOf("hello world", "world")'), 6)
    assert.equal(await evalJexl('indexOf("hello world", "hello")'), 0)
    assert.equal(await evalJexl('indexOf("hello world", "xyz")'), -1)
    assert.equal(await evalJexl('indexOf("test test", "test")'), 0)
    assert.equal(await evalJexl('indexOf(text, search)', { text: 'example', search: 'amp' }), 2)
  })

  test('lastIndexOf finds last index of substring', async ({ assert }) => {
    assert.equal(await evalJexl('lastIndexOf("hello world", "world")'), 6)
    assert.equal(await evalJexl('lastIndexOf("test test", "test")'), 5)
    assert.equal(await evalJexl('lastIndexOf("hello world", "xyz")'), -1)
    assert.equal(await evalJexl('lastIndexOf("abcabc", "abc")'), 3)
    assert.equal(await evalJexl('lastIndexOf(text, search)', { text: 'example example', search: 'amp' }), 10)
  })

  test('replaceAll replaces all occurrences', async ({ assert }) => {
    assert.equal(await evalJexl('replaceAll("hello world world", "world", "universe")'), 'hello universe universe')
    assert.equal(await evalJexl('replaceAll("test test test", "test", "exam")'), 'exam exam exam')
    assert.equal(await evalJexl('replaceAll("hello", "xyz", "abc")'), 'hello')
    assert.equal(await evalJexl('replaceAll("", "a", "b")'), '')
    assert.equal(
      await evalJexl('replaceAll(text, old, new)', { text: 'abc abc abc', old: 'abc', new: 'xyz' }),
      'xyz xyz xyz'
    )
  })
})

test.group('String - Trim Functions', () => {
  test('trimStart removes whitespace from start', async ({ assert }) => {
    assert.equal(await evalJexl('trimStart("  hello world  ")'), 'hello world  ')
    assert.equal(await evalJexl('trimStart("\n\t  test")'), 'test')
    assert.equal(await evalJexl('trimStart("")'), '')
    assert.equal(await evalJexl('trimStart("   ")'), '')
    assert.equal(await evalJexl('trimStart(text)', { text: '  spaced' }), 'spaced')
  })

  test('trimEnd removes whitespace from end', async ({ assert }) => {
    assert.equal(await evalJexl('trimEnd("  hello world  ")'), '  hello world')
    assert.equal(await evalJexl('trimEnd("test  \n\t")'), 'test')
    assert.equal(await evalJexl('trimEnd("")'), '')
    assert.equal(await evalJexl('trimEnd("   ")'), '')
    assert.equal(await evalJexl('trimEnd(text)', { text: 'spaced  ' }), 'spaced')
  })
})

test.group('String - Validation Functions', () => {
  test('isEmpty checks if string is empty or whitespace', async ({ assert }) => {
    assert.isTrue(await evalJexl('isEmpty("")'))
    assert.isTrue(await evalJexl('isEmpty("   ")'))
    assert.isTrue(await evalJexl('isEmpty("\n\t")'))
    assert.isFalse(await evalJexl('isEmpty("hello")'))
    assert.isFalse(await evalJexl('isEmpty("  hello  ")'))
    assert.isTrue(await evalJexl('isEmpty(text)', { text: '' }))
  })

  test('isNotEmpty checks if string is not empty', async ({ assert }) => {
    assert.isFalse(await evalJexl('isNotEmpty("")'))
    assert.isFalse(await evalJexl('isNotEmpty("   ")'))
    assert.isFalse(await evalJexl('isNotEmpty("\n\t")'))
    assert.isTrue(await evalJexl('isNotEmpty("hello")'))
    assert.isTrue(await evalJexl('isNotEmpty("  hello  ")'))
    assert.isFalse(await evalJexl('isNotEmpty(text)', { text: '' }))
  })
})

test.group('String - Utility Functions', () => {
  test('slug converts string to URL-friendly format', async ({ assert }) => {
    assert.equal(await evalJexl('slug("Hello World!")'), 'hello-world')
    assert.equal(await evalJexl('slug("The Quick Brown Fox")'), 'the-quick-brown-fox')
    assert.equal(await evalJexl('slug("Test@#$%^&*()123")'), 'test123')
    assert.equal(await evalJexl('slug("  spaced  ")'), 'spaced')
    assert.equal(await evalJexl('slug(text)', { text: 'Test Title!' }), 'test-title')
  })

  test('escapeHtml escapes HTML special characters', async ({ assert }) => {
    assert.equal(await evalJexl('escapeHtml("<div>Hello & World</div>")'), '&lt;div&gt;Hello &amp; World&lt;/div&gt;')
    assert.equal(
      await evalJexl('escapeHtml("Test \\"quotes\\" & \'apostrophes\'")'),
      'Test &quot;quotes&quot; &amp; &#39;apostrophes&#39;'
    )
    assert.equal(await evalJexl('escapeHtml("")'), '')
    assert.equal(await evalJexl('escapeHtml("no special chars")'), 'no special chars')
    assert.equal(
      await evalJexl('escapeHtml(text)', { text: '<script>alert("xss")</script>' }),
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    )
  })

  test('unescapeHtml unescapes HTML entities', async ({ assert }) => {
    assert.equal(await evalJexl('unescapeHtml("&lt;div&gt;Hello &amp; World&lt;/div&gt;")'), '<div>Hello & World</div>')
    assert.equal(
      await evalJexl('unescapeHtml("Test &quot;quotes&quot; &amp; &#39;apostrophes&#39;")'),
      'Test "quotes" & \'apostrophes\''
    )
    assert.equal(await evalJexl('unescapeHtml("")'), '')
    assert.equal(await evalJexl('unescapeHtml("no entities")'), 'no entities')
    assert.equal(
      await evalJexl('unescapeHtml(text)', { text: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;' }),
      '<script>alert("xss")</script>'
    )
  })

  test('wordCount counts words in string', async ({ assert }) => {
    assert.equal(await evalJexl('wordCount("hello world")'), 2)
    assert.equal(await evalJexl('wordCount("The quick brown fox jumps")'), 5)
    assert.equal(await evalJexl('wordCount("")'), 0)
    assert.equal(await evalJexl('wordCount("   ")'), 0)
    assert.equal(await evalJexl('wordCount("single")'), 1)
    assert.equal(await evalJexl('wordCount(text)', { text: 'test case example' }), 3)
  })

  test('charCount counts characters in string', async ({ assert }) => {
    assert.equal(await evalJexl('charCount("hello")'), 5)
    assert.equal(await evalJexl('charCount("hello world")'), 11)
    assert.equal(await evalJexl('charCount("")'), 0)
    assert.equal(await evalJexl('charCount("   ")'), 3)
    assert.equal(await evalJexl('charCount(text)', { text: 'testing' }), 7)
  })

  test('initials extracts initials from string', async ({ assert }) => {
    assert.equal(await evalJexl('initials("John Doe")'), 'JD')
    assert.equal(await evalJexl('initials("Mary Jane Watson")'), 'MJW')
    assert.equal(await evalJexl('initials("single")'), 'S')
    assert.equal(await evalJexl('initials("")'), '')
    assert.equal(await evalJexl('initials("   ")'), '')
    assert.equal(await evalJexl('initials(text)', { text: 'Test Case' }), 'TC')
  })

  test('lines splits string into array of lines', async ({ assert }) => {
    assert.deepEqual(await evalJexl('lines("line1\nline2\nline3")'), ['line1', 'line2', 'line3'])
    assert.deepEqual(await evalJexl('lines("line1\r\nline2\r\nline3")'), ['line1', 'line2', 'line3'])
    assert.deepEqual(await evalJexl('lines("single line")'), ['single line'])
    assert.deepEqual(await evalJexl('lines("")'), [''])
    assert.deepEqual(await evalJexl('lines(text)', { text: 'first\nsecond' }), ['first', 'second'])
  })

  test('normalizeSpace removes duplicate consecutive whitespace', async ({ assert }) => {
    assert.equal(await evalJexl('normalizeSpace("hello    world")'), 'hello world')
    assert.equal(await evalJexl('normalizeSpace("  test   case  ")'), 'test case')
    assert.equal(await evalJexl('normalizeSpace("single")'), 'single')
    assert.equal(await evalJexl('normalizeSpace("")'), '')
    assert.equal(await evalJexl('normalizeSpace("   ")'), '')
    assert.equal(await evalJexl('normalizeSpace(text)', { text: 'too    many    spaces' }), 'too many spaces')
  })

  test('mask masks string with specified character', async ({ assert }) => {
    assert.equal(await evalJexl('mask("1234567890")'), '**********')
    assert.equal(await evalJexl('mask("1234567890", "#")'), '##########')
    assert.equal(await evalJexl('mask("1234567890", "*", 2)'), '12********')
    assert.equal(await evalJexl('mask("1234567890", "*", 0, 2)'), '********90')
    assert.equal(await evalJexl('mask("1234567890", "*", 2, 2)'), '12******90')
    assert.equal(await evalJexl('mask("123", "*", 2, 2)'), '123')
    assert.equal(
      await evalJexl('mask(text, char, start, end)', { text: 'password', char: 'x', start: 1, end: 1 }),
      'pxxxxxxd'
    )
  })

  test('between extracts substring between delimiters', async ({ assert }) => {
    assert.equal(await evalJexl('between("Hello [world] test", "[", "]")'), 'world')
    assert.equal(await evalJexl('between("start<middle>end", "<", ">")'), 'middle')
    assert.equal(await evalJexl('between("no delimiters", "[", "]")'), '')
    assert.equal(await evalJexl('between("start[incomplete", "[", "]")'), '')
    assert.equal(await evalJexl('between("multiple[first]and[second]", "[", "]")'), 'first')
    assert.equal(await evalJexl('between(text, start, end)', { text: 'test{value}end', start: '{', end: '}' }), 'value')
  })
})

test.group('String - Edge Cases', () => {
  test('handles empty strings correctly', async ({ assert }) => {
    assert.equal(await evalJexl('upper("")'), '')
    assert.equal(await evalJexl('capitalize("")'), '')
    assert.equal(await evalJexl('slug("")'), '')
    assert.equal(await evalJexl('mask("")'), '')
    assert.equal(await evalJexl('between("", "[", "]")'), '')
  })

  test('handles null and undefined context values', async ({ assert }) => {
    // These should handle gracefully when context values are null/undefined
    assert.equal(await evalJexl('upper(text || "default")', { text: null }), 'DEFAULT')
    assert.equal(await evalJexl('len(text || "")', { text: undefined }), 0)
    assert.equal(await evalJexl('isEmpty(text || "")', { text: null }), true)
  })

  test('handles special characters correctly', async ({ assert }) => {
    assert.equal(await evalJexl('upper("émojis 🎉")'), 'ÉMOJIS 🎉')
    assert.equal(await evalJexl('len("🎉🎊🎈")'), 6) // Each emoji is 2 characters
    assert.equal(await evalJexl('reverse("abc🎉")'), '🎉cba')
    assert.deepEqual(await evalJexl('split("a🎉b🎉c", "🎉")'), ['a', 'b', 'c'])
  })

  test('handles very long strings', async ({ assert }) => {
    const longString = 'a'.repeat(1000)
    assert.equal(await evalJexl('len(text)', { text: longString }), 1000)
    assert.equal(await evalJexl('truncate(text, 10)', { text: longString }), 'aaaaaaa...')
    assert.equal(await evalJexl('mask(text, "*", 5, 5)', { text: longString }), 'aaaaa' + '*'.repeat(990) + 'aaaaa')
  })

  test('handles case conversion edge cases', async ({ assert }) => {
    assert.equal(await evalJexl('camelCase("123 test")'), '123Test')
    assert.equal(await evalJexl('snakeCase("  test  ")'), 'test')
    assert.equal(await evalJexl('kebabCase("TEST")'), 'test')
    assert.equal(await evalJexl('pascalCase("  ")'), '')
  })

  test('handles padding edge cases', async ({ assert }) => {
    assert.equal(await evalJexl('pad("test", 2)'), 'test') // Target length shorter than string
    assert.equal(await evalJexl('padLeft("", 5, "x")'), 'xxxxx')
    assert.equal(await evalJexl('padRight("test", 10, "")'), 'test') // Empty pad string
  })
})

test.group('String - Complex Operations', () => {
  test('chaining string operations', async ({ assert }) => {
    // Chain multiple operations
    const result = await evalJexl('upper(trim(text))', { text: '  hello world  ' })
    assert.equal(result, 'HELLO WORLD')

    const result2 = await evalJexl('capitalize(camelCase(text))', { text: 'hello world test' })
    assert.equal(result2, 'Helloworldtest')

    const result3 = await evalJexl('slug(trim(text))', { text: '  Test Title!  ' })
    assert.equal(result3, 'test-title')
  })

  test('working with arrays and strings', async ({ assert }) => {
    const words = ['hello', 'world', 'test']
    const result = await evalJexl('upper(join(words, " "))', { words })
    assert.equal(result, 'HELLO WORLD TEST')

    const text = 'apple,banana,cherry'
    const result2 = await evalJexl('len(split(text, ","))', { text })
    assert.equal(result2, 3)
  })

  test('text processing pipeline', async ({ assert }) => {
    const rawText = '  Hello World! This is a TEST.  '
    const result = await evalJexl('kebabCase(normalizeSpace(trim(text)))', { text: rawText })
    assert.equal(result, 'hello-world-this-is-a-test')

    const emailLike = 'user@example.com'
    const result2 = await evalJexl('between(text, "", "@")', { text: emailLike })
    assert.equal(result2, 'user')
  })

  test('formatting and validation', async ({ assert }) => {
    const userInput = '  John Doe  '
    const formatted = await evalJexl('titleCase(trim(text))', { text: userInput })
    assert.equal(formatted, 'John Doe')

    const isEmpty = await evalJexl('isEmpty(trim(text))', { text: '   ' })
    assert.isTrue(isEmpty)

    const initials = await evalJexl('initials(trim(text))', { text: userInput })
    assert.equal(initials, 'JD')
  })
})
