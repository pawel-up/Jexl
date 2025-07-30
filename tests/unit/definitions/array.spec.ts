/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from '@japa/runner'
import * as arrayFunctions from '../../../src/definitions/array.js'
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
  addModule(lib, arrayFunctions)
  return await lib.eval<R>(expression, context)
}

test.group('Array Functions', () => {
  test('FIRST - should return the first element', async ({ assert }) => {
    assert.equal(await evalJexl('FIRST([1, 2, 3])'), 1)
    assert.equal(await evalJexl('FIRST(["a", "b", "c"])'), 'a')
    assert.isUndefined(await evalJexl('FIRST([])'))
    assert.equal(await evalJexl('FIRST(numbers)', { numbers: [10, 20, 30] }), 10)
  })

  test('LAST - should return the last element', async ({ assert }) => {
    assert.equal(await evalJexl('LAST([1, 2, 3])'), 3)
    assert.equal(await evalJexl('LAST(["a", "b", "c"])'), 'c')
    assert.isUndefined(await evalJexl('LAST([])'))
    assert.equal(await evalJexl('LAST(numbers)', { numbers: [10, 20, 30] }), 30)
  })

  test('AT - should return the element at the specified index', async ({ assert }) => {
    assert.equal(await evalJexl('AT([1, 2, 3, 4, 5], 0)'), 1)
    assert.equal(await evalJexl('AT([1, 2, 3, 4, 5], 2)'), 3)
    assert.equal(await evalJexl('AT([1, 2, 3, 4, 5], 4)'), 5)
    assert.isUndefined(await evalJexl('AT([1, 2, 3], 5)'))
    assert.equal(await evalJexl('AT(arr, idx)', { arr: [1, 2, 3], idx: 1 }), 2)
  })

  test('SORT - should sort arrays', async ({ assert }) => {
    assert.deepEqual(await evalJexl('SORT([3, 1, 2])'), [1, 2, 3])
    assert.deepEqual(await evalJexl('SORT(["c", "a", "b"])'), ['a', 'b', 'c'])
    assert.deepEqual(await evalJexl('SORT(arr)', { arr: [3, 1, 2] }), [1, 2, 3])
  })

  test('SORT_ASC - should sort in ascending order', async ({ assert }) => {
    assert.deepEqual(await evalJexl('SORT_ASC([3, 1, 2])'), [1, 2, 3])
    assert.deepEqual(await evalJexl('SORT_ASC(["c", "a", "b"])'), ['a', 'b', 'c'])
    assert.deepEqual(await evalJexl('SORT_ASC(arr)', { arr: [5, 1, 3] }), [1, 3, 5])
  })

  test('SORT_DESC - should sort in descending order', async ({ assert }) => {
    assert.deepEqual(await evalJexl('SORT_DESC([1, 3, 2])'), [3, 2, 1])
    assert.deepEqual(await evalJexl('SORT_DESC(["a", "c", "b"])'), ['c', 'b', 'a'])
    assert.deepEqual(await evalJexl('SORT_DESC(arr)', { arr: [1, 5, 3] }), [5, 3, 1])
  })

  test('SLICE - should return a slice of the array', async ({ assert }) => {
    assert.deepEqual(await evalJexl('SLICE([1, 2, 3, 4, 5], 1, 3)'), [2, 3])
    assert.deepEqual(await evalJexl('SLICE([1, 2, 3, 4, 5], 2)'), [3, 4, 5])
    assert.deepEqual(await evalJexl('SLICE(arr, start, end)', { arr: [1, 2, 3, 4, 5], start: 1, end: 4 }), [2, 3, 4])
  })

  test('JOIN - should join array elements', async ({ assert }) => {
    assert.equal(await evalJexl('JOIN([1, 2, 3])'), '1,2,3')
    assert.equal(await evalJexl('JOIN([1, 2, 3], "-")'), '1-2-3')
    assert.equal(await evalJexl('JOIN(["a", "b", "c"], " | ")'), 'a | b | c')
    assert.equal(await evalJexl('JOIN(arr, sep)', { arr: [1, 2, 3], sep: '-' }), '1-2-3')
  })

  test('CONCAT - should concatenate arrays and values', async ({ assert }) => {
    assert.deepEqual(await evalJexl('CONCAT([1, 2], [3, 4])'), [1, 2, 3, 4])
    assert.deepEqual(await evalJexl('CONCAT([1], [2, 3], [4, 5])'), [1, 2, 3, 4, 5])
    assert.deepEqual(await evalJexl('CONCAT([1, 2], 3, [4, 5])'), [1, 2, 3, 4, 5])
    assert.deepEqual(await evalJexl('CONCAT([], [1, 2])'), [1, 2])
    assert.deepEqual(await evalJexl('CONCAT(arr1, arr2)', { arr1: [1, 2], arr2: [3, 4] }), [1, 2, 3, 4])
  })

  test('UNIQUE - should remove duplicate values', async ({ assert }) => {
    assert.deepEqual(await evalJexl('UNIQUE([1, 2, 2, 3, 3, 3])'), [1, 2, 3])
    assert.deepEqual(await evalJexl('UNIQUE(["a", "b", "a", "c", "b"])'), ['a', 'b', 'c'])
    assert.deepEqual(await evalJexl('UNIQUE([])'), [])
    assert.deepEqual(await evalJexl('UNIQUE(arr)', { arr: [1, 1, 2, 2, 3] }), [1, 2, 3])
  })

  test('FLATTEN - should flatten array by one level', async ({ assert }) => {
    assert.deepEqual(await evalJexl('FLATTEN([1, [2, 3], 4])'), [1, 2, 3, 4])
    assert.deepEqual(await evalJexl('FLATTEN([[1, 2], [3, 4]])'), [1, 2, 3, 4])
    assert.deepEqual(await evalJexl('FLATTEN([1, [2, [3, 4]]])'), [1, 2, [3, 4]])
  })

  test('FLATTEN_DEEP - should flatten array deeply', async ({ assert }) => {
    assert.deepEqual(await evalJexl('FLATTEN_DEEP([1, [2, [3, [4, 5]]]])'), [1, 2, 3, 4, 5])
    assert.deepEqual(await evalJexl('FLATTEN_DEEP([[1, 2], [3, [4, 5]]])'), [1, 2, 3, 4, 5])
  })

  test('CHUNK - should chunk array into specified sizes', async ({ assert }) => {
    assert.deepEqual(await evalJexl('CHUNK([1, 2, 3, 4, 5], 2)'), [[1, 2], [3, 4], [5]])
    assert.deepEqual(await evalJexl('CHUNK([1, 2, 3, 4, 5, 6], 3)'), [
      [1, 2, 3],
      [4, 5, 6],
    ])
    assert.deepEqual(await evalJexl('CHUNK([], 2)'), [])
    assert.deepEqual(await evalJexl('CHUNK(arr, size)', { arr: [1, 2, 3, 4, 5], size: 2 }), [[1, 2], [3, 4], [5]])
  })

  test('COMPACT - should remove falsy values', async ({ assert }) => {
    assert.deepEqual(await evalJexl('COMPACT([1, 0, 2, false, 3, null, 4, undefined, 5, ""])'), [1, 2, 3, 4, 5])
    assert.deepEqual(await evalJexl('COMPACT([1, "hello", true, {}, []])'), [1, 'hello', true, {}, []])
    assert.deepEqual(await evalJexl('COMPACT(arr)', { arr: [1, 0, 2, false, 3] }), [1, 2, 3])
  })

  test('DIFFERENCE - should return difference between arrays', async ({ assert }) => {
    assert.deepEqual(await evalJexl('DIFFERENCE([1, 2, 3], [2, 3, 4])'), [1])
    assert.deepEqual(await evalJexl('DIFFERENCE([1, 2, 3, 4], [2, 4])'), [1, 3])
    assert.deepEqual(await evalJexl('DIFFERENCE([1, 2, 3, 4, 5], [2, 3], [4, 5])'), [1])
    assert.deepEqual(await evalJexl('DIFFERENCE([1, 2, 3])'), [1, 2, 3])
    assert.deepEqual(await evalJexl('DIFFERENCE(arr1, arr2)', { arr1: [1, 2, 3], arr2: [2, 3, 4] }), [1])
  })

  test('INTERSECTION - should return intersection of arrays', async ({ assert }) => {
    assert.deepEqual(await evalJexl('INTERSECTION([1, 2, 3], [2, 3, 4])'), [2, 3])
    assert.deepEqual(await evalJexl('INTERSECTION([1, 2, 3, 4], [2, 4, 6])'), [2, 4])
    assert.deepEqual(await evalJexl('INTERSECTION([1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6])'), [3, 4])
    assert.deepEqual(await evalJexl('INTERSECTION([1, 2, 3])'), [1, 2, 3])
    assert.deepEqual(await evalJexl('INTERSECTION(arr1, arr2)', { arr1: [1, 2, 3], arr2: [2, 3, 4] }), [2, 3])
  })

  test('UNION - should return union of arrays', async ({ assert }) => {
    assert.deepEqual(await evalJexl('UNION([1, 2], [2, 3], [3, 4])'), [1, 2, 3, 4])
    assert.deepEqual(await evalJexl('UNION([1, 1, 2], [2, 2, 3])'), [1, 2, 3])
    assert.deepEqual(await evalJexl('UNION(arr1, arr2)', { arr1: [1, 2], arr2: [2, 3] }), [1, 2, 3])
  })

  test('ZIP - should zip arrays together', async ({ assert }) => {
    assert.deepEqual(await evalJexl('ZIP([1, 2, 3], ["a", "b", "c"])'), [
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ])
    assert.deepEqual(await evalJexl('ZIP([1, 2], ["a", "b", "c"])'), [
      [1, 'a'],
      [2, 'b'],
    ])
    assert.deepEqual(await evalJexl('ZIP()'), [])
    assert.deepEqual(await evalJexl('ZIP([1, 2, 3])'), [[1], [2], [3]])
  })

  test('SHUFFLE - should return a shuffled array', async ({ assert }) => {
    const original = [1, 2, 3, 4, 5]
    const shuffled = await evalJexl<number[]>('SHUFFLE(arr)', { arr: original })
    assert.equal(shuffled.length, 5)
    assert.includeMembers(shuffled, [1, 2, 3, 4, 5])
    assert.deepEqual(await evalJexl('SHUFFLE([])'), [])
  })

  test('SAMPLE - should return a random element', async ({ assert }) => {
    const arr = [1, 2, 3, 4, 5]
    const sample = await evalJexl<number>('SAMPLE(arr)', { arr })
    assert.include(arr, sample)
    assert.isUndefined(await evalJexl('SAMPLE([])'))
  })

  test('SAMPLE_SIZE - should return specified number of random elements', async ({ assert }) => {
    const arr = [1, 2, 3, 4, 5]
    const samples = await evalJexl<number[]>('SAMPLE_SIZE(arr, 3)', { arr })
    assert.equal(samples.length, 3)
    samples.forEach((sample: number) => assert.include(arr, sample))

    const smallSamples = await evalJexl<number[]>('SAMPLE_SIZE([1, 2, 3], 5)')
    assert.equal(smallSamples.length, 3)
  })

  test('COUNT_BY - should count occurrences of each value', async ({ assert }) => {
    assert.deepEqual(await evalJexl('COUNT_BY([1, 2, 2, 3, 3, 3])'), {
      '1': 1,
      '2': 2,
      '3': 3,
    })
    assert.deepEqual(await evalJexl('COUNT_BY(["a", "b", "a", "c", "b", "a"])'), {
      a: 3,
      b: 2,
      c: 1,
    })
  })

  test('SUM - should sum array elements', async ({ assert }) => {
    assert.equal(await evalJexl('SUM([1, 2, 3, 4, 5])'), 15)
    assert.equal(await evalJexl('SUM(1, 2, 3, 4, 5)'), 15)
    assert.equal(await evalJexl('SUM([])'), 0)
    assert.equal(await evalJexl('SUM(arr)', { arr: [10, 20, 30] }), 60)
  })

  test('AVERAGE - should calculate average of array elements', async ({ assert }) => {
    assert.equal(await evalJexl('AVERAGE([1, 2, 3, 4, 5])'), 3)
    assert.equal(await evalJexl('AVERAGE([10, 20, 30])'), 20)
    assert.equal(await evalJexl('AVERAGE(1, 2, 3, 4, 5)'), 3)
    assert.equal(await evalJexl('AVERAGE([])'), 0)
    assert.equal(await evalJexl('AVERAGE(arr)', { arr: [10, 20, 30] }), 20)
  })

  test('MIN - should find minimum value', async ({ assert }) => {
    assert.equal(await evalJexl('MIN([3, 1, 4, 1, 5])'), 1)
    assert.equal(await evalJexl('MIN(3, 1, 4, 1, 5)'), 1)
    assert.equal(await evalJexl('MIN(arr)', { arr: [10, 5, 20] }), 5)
  })

  test('MAX - should find maximum value', async ({ assert }) => {
    assert.equal(await evalJexl('MAX([3, 1, 4, 1, 5])'), 5)
    assert.equal(await evalJexl('MAX(3, 1, 4, 1, 5)'), 5)
    assert.equal(await evalJexl('MAX(arr)', { arr: [10, 5, 20] }), 20)
  })

  test('RANGE - should create range of numbers', async ({ assert }) => {
    assert.deepEqual(await evalJexl('RANGE(1, 5)'), [1, 2, 3, 4])
    assert.deepEqual(await evalJexl('RANGE(0, 3)'), [0, 1, 2])
    assert.deepEqual(await evalJexl('RANGE(0, 10, 2)'), [0, 2, 4, 6, 8])
    assert.deepEqual(await evalJexl('RANGE(1, 10, 3)'), [1, 4, 7])
    assert.deepEqual(await evalJexl('RANGE(start, end, step)', { start: 0, end: 6, step: 2 }), [0, 2, 4])
  })

  test('FILL - should repeat value specified number of times', async ({ assert }) => {
    assert.deepEqual(await evalJexl('FILL("a", 3)'), ['a', 'a', 'a'])
    assert.deepEqual(await evalJexl('FILL(1, 4)'), [1, 1, 1, 1])
    assert.deepEqual(await evalJexl('FILL("a", 0)'), [])
    assert.deepEqual(await evalJexl('FILL(value, count)', { value: 'x', count: 3 }), ['x', 'x', 'x'])
  })

  test('EVERY - should check if all elements are truthy', async ({ assert }) => {
    assert.isTrue(await evalJexl('EVERY([1, 2, 3, "hello", true])'))
    assert.isFalse(await evalJexl('EVERY([1, 2, 0, 3])'))
    assert.isFalse(await evalJexl('EVERY([1, 2, false, 3])'))
    assert.isTrue(await evalJexl('EVERY(arr)', { arr: [1, 2, 3] }))
  })

  test('SOME - should check if any element is truthy', async ({ assert }) => {
    assert.isTrue(await evalJexl('SOME([0, false, 1, null])'))
    assert.isTrue(await evalJexl('SOME([1, 2, 3])'))
    assert.isFalse(await evalJexl('SOME([0, false, null, undefined, ""])'))
    assert.isTrue(await evalJexl('SOME(arr)', { arr: [0, false, 1] }))
  })

  test('NONE - should check if no elements are truthy', async ({ assert }) => {
    assert.isTrue(await evalJexl('NONE([0, false, null, undefined, ""])'))
    assert.isFalse(await evalJexl('NONE([0, false, 1, null])'))
    assert.isFalse(await evalJexl('NONE([1, 2, 3])'))
    assert.isTrue(await evalJexl('NONE(arr)', { arr: [0, false, null] }))
  })
})
