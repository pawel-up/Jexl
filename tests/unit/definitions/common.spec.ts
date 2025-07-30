/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from '@japa/runner'
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

// Helper function to evaluate Jexl expressions with array functions
const evalJexl = async <R = unknown>(expression: string, context: any = {}) => {
  const lib = new Jexl()
  addModule(lib, commonFunctions)
  return await lib.eval<R>(expression, context)
}

test.group('Common Functions', () => {
  test('LENGTH - should return the length of an array', async ({ assert }) => {
    assert.equal(await evalJexl('LENGTH([1, 2, 3])'), 3)
    assert.equal(await evalJexl('LENGTH([])'), 0)
    assert.equal(await evalJexl('LENGTH(["a", "b"])'), 2)
    assert.equal(await evalJexl('LENGTH(arr)', { arr: [1, 2, 3, 4, 5] }), 5)
  })

  test('IS_EMPTY - should return true for empty arrays', async ({ assert }) => {
    assert.isTrue(await evalJexl('IS_EMPTY([])'))
    assert.isFalse(await evalJexl('IS_EMPTY([1])'))
    assert.isFalse(await evalJexl('IS_EMPTY([1, 2, 3])'))
    assert.isTrue(await evalJexl('IS_EMPTY(emptyArr)', { emptyArr: [] }))
  })

  test('IS_NOT_EMPTY - should return false for empty arrays', async ({ assert }) => {
    assert.isFalse(await evalJexl('IS_NOT_EMPTY([])'))
    assert.isTrue(await evalJexl('IS_NOT_EMPTY([1])'))
    assert.isTrue(await evalJexl('IS_NOT_EMPTY([1, 2, 3])'))
    assert.isFalse(await evalJexl('IS_NOT_EMPTY(emptyArr)', { emptyArr: [] }))
  })

  test('CONTAINS - should check if array contains a value', async ({ assert }) => {
    assert.isTrue(await evalJexl('CONTAINS([1, 2, 3], 2)'))
    assert.isTrue(await evalJexl('CONTAINS(["a", "b", "c"], "b")'))
    assert.isFalse(await evalJexl('CONTAINS([1, 2, 3], 4)'))
    assert.isFalse(await evalJexl('CONTAINS(["a", "b", "c"], "d")'))
    assert.isTrue(await evalJexl('CONTAINS(arr, value)', { arr: [1, 2, 3], value: 2 }))
  })

  test('INDEX_OF - should return the index of a value', async ({ assert }) => {
    assert.equal(await evalJexl('INDEX_OF([1, 2, 3, 2], 2)'), 1)
    assert.equal(await evalJexl('INDEX_OF(["a", "b", "c"], "c")'), 2)
    assert.equal(await evalJexl('INDEX_OF([1, 2, 3], 4)'), -1)
    assert.equal(await evalJexl('INDEX_OF(["a", "b", "c"], "d")'), -1)
    assert.equal(await evalJexl('INDEX_OF(arr, value)', { arr: [1, 2, 3], value: 2 }), 1)
  })

  test('LAST_INDEX_OF - should return the last index of a value', async ({ assert }) => {
    assert.equal(await evalJexl('LAST_INDEX_OF([1, 2, 3, 2], 2)'), 3)
    assert.equal(await evalJexl('LAST_INDEX_OF(["a", "b", "c", "b"], "b")'), 3)
    assert.equal(await evalJexl('LAST_INDEX_OF([1, 2, 3], 4)'), -1)
    assert.equal(await evalJexl('LAST_INDEX_OF(["a", "b", "c"], "d")'), -1)
    assert.equal(await evalJexl('LAST_INDEX_OF(arr, value)', { arr: [1, 2, 1, 2], value: 2 }), 3)
  })

  test('REVERSE - should return a new reversed array', async ({ assert }) => {
    assert.deepEqual(await evalJexl('REVERSE([1, 2, 3])'), [3, 2, 1])
    assert.deepEqual(await evalJexl('REVERSE([])'), [])
    assert.deepEqual(await evalJexl('REVERSE(["a", "b", "c"])'), ['c', 'b', 'a'])
    assert.deepEqual(await evalJexl('REVERSE(arr)', { arr: [1, 2, 3] }), [3, 2, 1])
  })
})
