/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from '@japa/runner'
import * as operatorFunctions from '../../../src/definitions/operators.js'
import { Jexl } from '../../../src/Jexl.js'
import type { FunctionFunction } from '../../../src/grammar.js'

// Helper function to add all functions from a module
function addModule(jexl: Jexl, module: Record<string, FunctionFunction>, prefix = '') {
  Object.keys(module).forEach((key) => {
    const functionName = prefix ? `${prefix}_${key}` : key
    jexl.addFunction(functionName, module[key])
  })
}

// Helper function to evaluate Jexl expressions with operator functions
const evalJexl = async <R = unknown>(expression: string, context: any = {}) => {
  const lib = new Jexl()
  addModule(lib, operatorFunctions)
  return await lib.eval<R>(expression, context)
}

test.group('Operator Functions', () => {
  test('and - should perform logical AND operation', async ({ assert }) => {
    assert.isTrue(await evalJexl('and(true, true)'))
    assert.isFalse(await evalJexl('and(true, false)'))
    assert.isFalse(await evalJexl('and(false, true)'))
    assert.isFalse(await evalJexl('and(false, false)'))
    assert.isTrue(await evalJexl('and(1, "hello")'))
    assert.isFalse(await evalJexl('and(1, 0)'))
    assert.isTrue(await evalJexl('and(a, b)', { a: 1, b: 2 }))
  })

  test('or - should perform logical OR operation', async ({ assert }) => {
    assert.isTrue(await evalJexl('or(true, true)'))
    assert.isTrue(await evalJexl('or(true, false)'))
    assert.isTrue(await evalJexl('or(false, true)'))
    assert.isFalse(await evalJexl('or(false, false)'))
    assert.isTrue(await evalJexl('or(1, 0)'))
    assert.isFalse(await evalJexl('or(0, "")'))
    assert.isTrue(await evalJexl('or(a, b)', { a: 0, b: 1 }))
  })

  test('not - should perform logical NOT operation', async ({ assert }) => {
    assert.isFalse(await evalJexl('not(true)'))
    assert.isTrue(await evalJexl('not(false)'))
    assert.isFalse(await evalJexl('not(1)'))
    assert.isTrue(await evalJexl('not(0)'))
    assert.isFalse(await evalJexl('not("hello")'))
    assert.isTrue(await evalJexl('not("")'))
    assert.isTrue(await evalJexl('not(value)', { value: null }))
  })

  test('xor - should perform logical XOR operation', async ({ assert }) => {
    assert.isFalse(await evalJexl('xor(true, true)'))
    assert.isTrue(await evalJexl('xor(true, false)'))
    assert.isTrue(await evalJexl('xor(false, true)'))
    assert.isFalse(await evalJexl('xor(false, false)'))
    assert.isTrue(await evalJexl('xor(1, 0)'))
    assert.isFalse(await evalJexl('xor(1, 2)'))
    assert.isTrue(await evalJexl('xor(a, b)', { a: 1, b: 0 }))
  })

  test('eq - should perform loose equality comparison', async ({ assert }) => {
    assert.isTrue(await evalJexl('eq(1, 1)'))
    assert.isTrue(await evalJexl('eq(1, "1")'))
    assert.isTrue(await evalJexl('eq(true, 1)'))
    assert.isFalse(await evalJexl('eq(1, 2)'))
    assert.isTrue(await evalJexl('eq(null, undefined)'))
    assert.isTrue(await evalJexl('eq(a, b)', { a: 5, b: '5' }))
  })

  test('strictEq - should perform strict equality comparison', async ({ assert }) => {
    assert.isTrue(await evalJexl('strictEq(1, 1)'))
    assert.isFalse(await evalJexl('strictEq(1, "1")'))
    assert.isFalse(await evalJexl('strictEq(true, 1)'))
    assert.isFalse(await evalJexl('strictEq(1, 2)'))
    // TODO: Jexl treats null and undefined
    // assert.isFalse(await evalJexl('strictEq(null, undefined)'))
    assert.isFalse(await evalJexl('strictEq(a, b)', { a: 5, b: '5' }))
  })

  test('ne - should perform loose inequality comparison', async ({ assert }) => {
    assert.isFalse(await evalJexl('ne(1, 1)'))
    assert.isFalse(await evalJexl('ne(1, "1")'))
    assert.isFalse(await evalJexl('ne(true, 1)'))
    assert.isTrue(await evalJexl('ne(1, 2)'))
    assert.isFalse(await evalJexl('ne(null, undefined)'))
    assert.isTrue(await evalJexl('ne(a, b)', { a: 5, b: 6 }))
  })

  test('strictNe - should perform strict inequality comparison', async ({ assert }) => {
    assert.isFalse(await evalJexl('strictNe(1, 1)'))
    assert.isTrue(await evalJexl('strictNe(1, "1")'))
    assert.isTrue(await evalJexl('strictNe(true, 1)'))
    assert.isTrue(await evalJexl('strictNe(1, 2)'))
    // TODO: Jexl treats null and undefined
    // assert.isTrue(await evalJexl('strictNe(null, undefined)'))
    assert.isTrue(await evalJexl('strictNe(a, b)', { a: 5, b: '5' }))
  })

  test('gt - should perform greater than comparison', async ({ assert }) => {
    assert.isTrue(await evalJexl('gt(2, 1)'))
    assert.isFalse(await evalJexl('gt(1, 2)'))
    assert.isFalse(await evalJexl('gt(1, 1)'))
    assert.isTrue(await evalJexl('gt("b", "a")'))
    assert.isFalse(await evalJexl('gt("a", "b")'))
    assert.isTrue(await evalJexl('gt(a, b)', { a: 10, b: 5 }))
  })

  test('gte - should perform greater than or equal comparison', async ({ assert }) => {
    assert.isTrue(await evalJexl('gte(2, 1)'))
    assert.isFalse(await evalJexl('gte(1, 2)'))
    assert.isTrue(await evalJexl('gte(1, 1)'))
    assert.isTrue(await evalJexl('gte("b", "a")'))
    assert.isTrue(await evalJexl('gte("a", "a")'))
    assert.isTrue(await evalJexl('gte(a, b)', { a: 5, b: 5 }))
  })

  test('lt - should perform less than comparison', async ({ assert }) => {
    assert.isFalse(await evalJexl('lt(2, 1)'))
    assert.isTrue(await evalJexl('lt(1, 2)'))
    assert.isFalse(await evalJexl('lt(1, 1)'))
    assert.isFalse(await evalJexl('lt("b", "a")'))
    assert.isTrue(await evalJexl('lt("a", "b")'))
    assert.isTrue(await evalJexl('lt(a, b)', { a: 3, b: 7 }))
  })

  test('lte - should perform less than or equal comparison', async ({ assert }) => {
    assert.isFalse(await evalJexl('lte(2, 1)'))
    assert.isTrue(await evalJexl('lte(1, 2)'))
    assert.isTrue(await evalJexl('lte(1, 1)'))
    assert.isFalse(await evalJexl('lte("b", "a")'))
    assert.isTrue(await evalJexl('lte("a", "a")'))
    assert.isTrue(await evalJexl('lte(a, b)', { a: 5, b: 5 }))
  })

  test('between - should check if value is between min and max (inclusive)', async ({ assert }) => {
    assert.isTrue(await evalJexl('between(5, 1, 10)'))
    assert.isTrue(await evalJexl('between(1, 1, 10)'))
    assert.isTrue(await evalJexl('between(10, 1, 10)'))
    assert.isFalse(await evalJexl('between(0, 1, 10)'))
    assert.isFalse(await evalJexl('between(11, 1, 10)'))
    assert.isTrue(await evalJexl('between(value, min, max)', { value: 7, min: 5, max: 10 }))
  })

  test('inOp - should check if value exists in collection', async ({ assert }) => {
    assert.isTrue(await evalJexl('inOp(2, [1, 2, 3])'))
    assert.isFalse(await evalJexl('inOp(4, [1, 2, 3])'))
    assert.isTrue(await evalJexl('inOp("l", "hello")'))
    assert.isFalse(await evalJexl('inOp("x", "hello")'))
    assert.isTrue(await evalJexl('inOp("a", ["a", "b", "c"])'))
    assert.isTrue(await evalJexl('inOp(value, collection)', { value: 'test', collection: 'testing' }))
  })

  test('notIn - should check if value does not exist in collection', async ({ assert }) => {
    assert.isFalse(await evalJexl('notIn(2, [1, 2, 3])'))
    assert.isTrue(await evalJexl('notIn(4, [1, 2, 3])'))
    assert.isFalse(await evalJexl('notIn("l", "hello")'))
    assert.isTrue(await evalJexl('notIn("x", "hello")'))
    assert.isFalse(await evalJexl('notIn("a", ["a", "b", "c"])'))
    assert.isFalse(await evalJexl('notIn(value, collection)', { value: 'test', collection: 'testing' }))
  })

  test('like - should perform pattern matching with % wildcard', async ({ assert }) => {
    assert.isTrue(await evalJexl('like("hello", "hello")'))
    assert.isTrue(await evalJexl('like("hello", "h%")'))
    assert.isTrue(await evalJexl('like("hello", "%llo")'))
    assert.isTrue(await evalJexl('like("hello", "h%o")'))
    assert.isTrue(await evalJexl('like("Hello", "hello")')) // Case insensitive
    assert.isFalse(await evalJexl('like("hello", "world")'))
    assert.isTrue(await evalJexl('like("hello world", "hello%")'))
    assert.isTrue(await evalJexl('like(text, pattern)', { text: 'JavaScript', pattern: 'Java%' }))
  })

  test('notLike - should perform negative pattern matching', async ({ assert }) => {
    assert.isFalse(await evalJexl('notLike("hello", "hello")'))
    assert.isFalse(await evalJexl('notLike("hello", "h%")'))
    assert.isTrue(await evalJexl('notLike("hello", "world")'))
    assert.isFalse(await evalJexl('notLike("Hello", "hello")')) // Case insensitive
    assert.isTrue(await evalJexl('notLike("hello", "x%")'))
    assert.isFalse(await evalJexl('notLike(text, pattern)', { text: 'JavaScript', pattern: 'Java%' }))
  })

  test('regex - should perform regex pattern matching', async ({ assert }) => {
    assert.isTrue(await evalJexl('regex("hello", "h.*o")'))
    assert.isTrue(await evalJexl('regex("123", "\\\\d+")'))
    assert.isFalse(await evalJexl('regex("hello", "\\\\d+")'))
    assert.isTrue(await evalJexl('regex("Hello", "hello", "i")'))
    assert.isFalse(await evalJexl('regex("Hello", "hello", "")'))
    assert.isTrue(await evalJexl('regex(text, pattern)', { text: 'test@example.com', pattern: '.+@.+\\..+' }))
  })

  test('isNull - should check if value is null or undefined', async ({ assert }) => {
    assert.isTrue(await evalJexl('isNull(null)'))
    assert.isTrue(await evalJexl('isNull(undefined)'))
    assert.isFalse(await evalJexl('isNull(0)'))
    assert.isFalse(await evalJexl('isNull("")'))
    assert.isFalse(await evalJexl('isNull(false)'))
    assert.isTrue(await evalJexl('isNull(value)', { value: null }))
    assert.isTrue(await evalJexl('isNull(value)', { value: undefined }))
  })

  test('isNotNull - should check if value is not null or undefined', async ({ assert }) => {
    assert.isFalse(await evalJexl('isNotNull(null)'))
    assert.isFalse(await evalJexl('isNotNull(undefined)'))
    assert.isTrue(await evalJexl('isNotNull(0)'))
    assert.isTrue(await evalJexl('isNotNull("")'))
    assert.isTrue(await evalJexl('isNotNull(false)'))
    assert.isFalse(await evalJexl('isNotNull(value)', { value: null }))
    assert.isTrue(await evalJexl('isNotNull(value)', { value: 'hello' }))
  })

  test('isEmpty - should check if value is empty', async ({ assert }) => {
    assert.isTrue(await evalJexl('isEmpty(null)'))
    assert.isTrue(await evalJexl('isEmpty(undefined)'))
    assert.isTrue(await evalJexl('isEmpty("")'))
    assert.isTrue(await evalJexl('isEmpty([])'))
    assert.isTrue(await evalJexl('isEmpty({})'))
    assert.isFalse(await evalJexl('isEmpty("hello")'))
    assert.isFalse(await evalJexl('isEmpty([1, 2, 3])'))
    assert.isFalse(await evalJexl('isEmpty({a: 1})'))
    assert.isFalse(await evalJexl('isEmpty(0)'))
    assert.isTrue(await evalJexl('isEmpty(value)', { value: '' }))
  })

  test('isNotEmpty - should check if value is not empty', async ({ assert }) => {
    assert.isFalse(await evalJexl('isNotEmpty(null)'))
    assert.isFalse(await evalJexl('isNotEmpty(undefined)'))
    assert.isFalse(await evalJexl('isNotEmpty("")'))
    assert.isFalse(await evalJexl('isNotEmpty([])'))
    assert.isFalse(await evalJexl('isNotEmpty({})'))
    assert.isTrue(await evalJexl('isNotEmpty("hello")'))
    assert.isTrue(await evalJexl('isNotEmpty([1, 2, 3])'))
    assert.isTrue(await evalJexl('isNotEmpty({a: 1})'))
    assert.isTrue(await evalJexl('isNotEmpty(0)'))
    assert.isTrue(await evalJexl('isNotEmpty(value)', { value: 'test' }))
  })

  test('isType - should check value type', async ({ assert }) => {
    assert.isTrue(await evalJexl('isType("hello", "string")'))
    assert.isTrue(await evalJexl('isType(123, "number")'))
    assert.isTrue(await evalJexl('isType(true, "boolean")'))
    assert.isTrue(await evalJexl('isType({}, "object")'))
    assert.isTrue(await evalJexl('isType([], "array")'))
    assert.isTrue(await evalJexl('isType(null, "null")'))
    assert.isTrue(await evalJexl('isType(undefined, "undefined")'))
    assert.isFalse(await evalJexl('isType("hello", "number")'))
    assert.isFalse(await evalJexl('isType([], "object")'))
    assert.isTrue(await evalJexl('isType(value, type)', { value: 42, type: 'number' }))
  })

  test('ifElse - should perform conditional operation', async ({ assert }) => {
    assert.equal(await evalJexl('ifElse(true, "yes", "no")'), 'yes')
    assert.equal(await evalJexl('ifElse(false, "yes", "no")'), 'no')
    assert.equal(await evalJexl('ifElse(1, "truthy", "falsy")'), 'truthy')
    assert.equal(await evalJexl('ifElse(0, "truthy", "falsy")'), 'falsy')
    assert.equal(
      await evalJexl('ifElse(condition, trueVal, falseVal)', {
        condition: true,
        trueVal: 100,
        falseVal: 200,
      }),
      100
    )
  })

  test('coalesce - should return first non-null value', async ({ assert }) => {
    assert.equal(await evalJexl('coalesce(null, "default")'), 'default')
    assert.equal(await evalJexl('coalesce(undefined, "default")'), 'default')
    assert.equal(await evalJexl('coalesce("value", "default")'), 'value')
    assert.equal(await evalJexl('coalesce(0, "default")'), 0)
    assert.equal(await evalJexl('coalesce("", "default")'), '')
    assert.equal(
      await evalJexl('coalesce(value, defaultValue)', {
        value: null,
        defaultValue: 'fallback',
      }),
      'fallback'
    )
  })

  test('safeGet - should safely access nested properties', async ({ assert }) => {
    const obj = { user: { profile: { name: 'John' } } }
    assert.equal(await evalJexl('safeGet(obj, "user.profile.name")', { obj }), 'John')
    assert.equal(await evalJexl('safeGet(obj, "user.profile")', { obj }), obj.user.profile)
    assert.isUndefined(await evalJexl('safeGet(obj, "user.profile.age")', { obj }))
    assert.isUndefined(await evalJexl('safeGet(obj, "user.settings.theme")', { obj }))
    assert.isUndefined(await evalJexl('safeGet(null, "user.name")'))
    assert.isUndefined(await evalJexl('safeGet("string", "length")'))
  })

  test('defaultTo - should return first non-null, non-undefined value', async ({ assert }) => {
    assert.equal(await evalJexl('defaultTo(null, undefined, "first")'), 'first')
    assert.equal(await evalJexl('defaultTo("value", "backup")'), 'value')
    assert.equal(await evalJexl('defaultTo(0, "backup")'), 0)
    assert.equal(await evalJexl('defaultTo("", "backup")'), '')
    assert.isUndefined(await evalJexl('defaultTo(null, undefined)'))
    assert.equal(
      await evalJexl('defaultTo(val1, val2, val3)', {
        val1: null,
        val2: undefined,
        val3: 'result',
      }),
      'result'
    )
  })

  test('inRange - should check if value is in any of the ranges', async ({ assert }) => {
    assert.isTrue(await evalJexl('inRange(5, [1, 10])'))
    assert.isTrue(await evalJexl('inRange(15, [1, 10], [12, 20])'))
    assert.isFalse(await evalJexl('inRange(11, [1, 10])'))
    assert.isTrue(await evalJexl('inRange(1, [1, 5])')) // Edge case: min value
    assert.isTrue(await evalJexl('inRange(5, [1, 5])')) // Edge case: max value
    assert.isTrue(
      await evalJexl('inRange(value, range1, range2)', {
        value: 25,
        range1: [1, 10],
        range2: [20, 30],
      })
    )
  })

  test('equalsAny - should check if value equals any of the provided values', async ({ assert }) => {
    assert.isTrue(await evalJexl('equalsAny(2, 1, 2, 3)'))
    assert.isFalse(await evalJexl('equalsAny(4, 1, 2, 3)'))
    assert.isTrue(await evalJexl('equalsAny("b", "a", "b", "c")'))
    assert.isFalse(await evalJexl('equalsAny("d", "a", "b", "c")'))
    assert.isTrue(
      await evalJexl('equalsAny(value, opt1, opt2, opt3)', {
        value: 'test',
        opt1: 'hello',
        opt2: 'test',
        opt3: 'world',
      })
    )
  })

  test('notEqualsAny - should check if value does not equal any of the provided values', async ({ assert }) => {
    assert.isFalse(await evalJexl('notEqualsAny(2, 1, 2, 3)'))
    assert.isTrue(await evalJexl('notEqualsAny(4, 1, 2, 3)'))
    assert.isFalse(await evalJexl('notEqualsAny("b", "a", "b", "c")'))
    assert.isTrue(await evalJexl('notEqualsAny("d", "a", "b", "c")'))
    assert.isFalse(
      await evalJexl('notEqualsAny(value, opt1, opt2, opt3)', {
        value: 'test',
        opt1: 'hello',
        opt2: 'test',
        opt3: 'world',
      })
    )
  })

  test('equalsAll - should check if value equals all of the provided values', async ({ assert }) => {
    assert.isTrue(await evalJexl('equalsAll(2, 2, 2, 2)'))
    assert.isFalse(await evalJexl('equalsAll(2, 2, 3, 2)'))
    assert.isTrue(await evalJexl('equalsAll("a", "a", "a")'))
    assert.isFalse(await evalJexl('equalsAll("a", "a", "b")'))
    assert.isTrue(
      await evalJexl('equalsAll(value, val1, val2)', {
        value: 5,
        val1: 5,
        val2: 5,
      })
    )
  })

  test('hasProperty - should check if object has a property', async ({ assert }) => {
    const obj = { name: 'John', age: 30 }
    assert.isTrue(await evalJexl('hasProperty(obj, "name")', { obj }))
    assert.isTrue(await evalJexl('hasProperty(obj, "age")', { obj }))
    assert.isFalse(await evalJexl('hasProperty(obj, "email")', { obj }))
    assert.isFalse(await evalJexl('hasProperty(null, "name")'))
    assert.isFalse(await evalJexl('hasProperty("string", "length")'))
    assert.isTrue(
      await evalJexl('hasProperty(object, property)', {
        object: { test: true },
        property: 'test',
      })
    )
  })

  test('instanceOf - should check if object is instance of constructor', async ({ assert }) => {
    // Test instanceOf function directly since Jexl can't pass constructor functions
    assert.isTrue(operatorFunctions.instanceOf(new Date(), Date))
    assert.isTrue(operatorFunctions.instanceOf([], Array))
    assert.isTrue(operatorFunctions.instanceOf(/regex/, RegExp as any))
    assert.isFalse(operatorFunctions.instanceOf('string', Date))
    assert.isFalse(operatorFunctions.instanceOf(123, Array))
  })
})
