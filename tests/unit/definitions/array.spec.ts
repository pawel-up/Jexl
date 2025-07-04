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
  test('length - should return the length of an array', async ({ assert }) => {
    assert.equal(await evalJexl('length([1, 2, 3])'), 3)
    assert.equal(await evalJexl('length([])'), 0)
    assert.equal(await evalJexl('length(["a", "b"])'), 2)
    assert.equal(await evalJexl('length(arr)', { arr: [1, 2, 3, 4, 5] }), 5)
  })

  test('isEmpty - should return true for empty arrays', async ({ assert }) => {
    assert.isTrue(await evalJexl('isEmpty([])'))
    assert.isFalse(await evalJexl('isEmpty([1])'))
    assert.isFalse(await evalJexl('isEmpty([1, 2, 3])'))
    assert.isTrue(await evalJexl('isEmpty(emptyArr)', { emptyArr: [] }))
  })

  test('isNotEmpty - should return false for empty arrays', async ({ assert }) => {
    assert.isFalse(await evalJexl('isNotEmpty([])'))
    assert.isTrue(await evalJexl('isNotEmpty([1])'))
    assert.isTrue(await evalJexl('isNotEmpty([1, 2, 3])'))
    assert.isFalse(await evalJexl('isNotEmpty(emptyArr)', { emptyArr: [] }))
  })

  test('first - should return the first element', async ({ assert }) => {
    assert.equal(await evalJexl('first([1, 2, 3])'), 1)
    assert.equal(await evalJexl('first(["a", "b", "c"])'), 'a')
    assert.isUndefined(await evalJexl('first([])'))
    assert.equal(await evalJexl('first(numbers)', { numbers: [10, 20, 30] }), 10)
  })

  test('last - should return the last element', async ({ assert }) => {
    assert.equal(await evalJexl('last([1, 2, 3])'), 3)
    assert.equal(await evalJexl('last(["a", "b", "c"])'), 'c')
    assert.isUndefined(await evalJexl('last([])'))
    assert.equal(await evalJexl('last(numbers)', { numbers: [10, 20, 30] }), 30)
  })

  test('at - should return the element at the specified index', async ({ assert }) => {
    assert.equal(await evalJexl('at([1, 2, 3, 4, 5], 0)'), 1)
    assert.equal(await evalJexl('at([1, 2, 3, 4, 5], 2)'), 3)
    assert.equal(await evalJexl('at([1, 2, 3, 4, 5], 4)'), 5)
    assert.isUndefined(await evalJexl('at([1, 2, 3], 5)'))
    assert.equal(await evalJexl('at(arr, idx)', { arr: [1, 2, 3], idx: 1 }), 2)
  })

  test('contains - should check if array contains a value', async ({ assert }) => {
    assert.isTrue(await evalJexl('contains([1, 2, 3], 2)'))
    assert.isTrue(await evalJexl('contains(["a", "b", "c"], "b")'))
    assert.isFalse(await evalJexl('contains([1, 2, 3], 4)'))
    assert.isFalse(await evalJexl('contains(["a", "b", "c"], "d")'))
    assert.isTrue(await evalJexl('contains(arr, value)', { arr: [1, 2, 3], value: 2 }))
  })

  test('indexOf - should return the index of a value', async ({ assert }) => {
    assert.equal(await evalJexl('indexOf([1, 2, 3, 2], 2)'), 1)
    assert.equal(await evalJexl('indexOf(["a", "b", "c"], "c")'), 2)
    assert.equal(await evalJexl('indexOf([1, 2, 3], 4)'), -1)
    assert.equal(await evalJexl('indexOf(["a", "b", "c"], "d")'), -1)
    assert.equal(await evalJexl('indexOf(arr, value)', { arr: [1, 2, 3], value: 2 }), 1)
  })

  test('lastIndexOf - should return the last index of a value', async ({ assert }) => {
    assert.equal(await evalJexl('lastIndexOf([1, 2, 3, 2], 2)'), 3)
    assert.equal(await evalJexl('lastIndexOf(["a", "b", "c", "b"], "b")'), 3)
    assert.equal(await evalJexl('lastIndexOf([1, 2, 3], 4)'), -1)
    assert.equal(await evalJexl('lastIndexOf(["a", "b", "c"], "d")'), -1)
    assert.equal(await evalJexl('lastIndexOf(arr, value)', { arr: [1, 2, 1, 2], value: 2 }), 3)
  })

  test('reverse - should return a new reversed array', async ({ assert }) => {
    assert.deepEqual(await evalJexl('reverse([1, 2, 3])'), [3, 2, 1])
    assert.deepEqual(await evalJexl('reverse([])'), [])
    assert.deepEqual(await evalJexl('reverse(["a", "b", "c"])'), ['c', 'b', 'a'])
    assert.deepEqual(await evalJexl('reverse(arr)', { arr: [1, 2, 3] }), [3, 2, 1])
  })

  test('sort - should sort arrays', async ({ assert }) => {
    assert.deepEqual(await evalJexl('sort([3, 1, 2])'), [1, 2, 3])
    assert.deepEqual(await evalJexl('sort(["c", "a", "b"])'), ['a', 'b', 'c'])
    assert.deepEqual(await evalJexl('sort(arr)', { arr: [3, 1, 2] }), [1, 2, 3])
  })

  test('sortAsc - should sort in ascending order', async ({ assert }) => {
    assert.deepEqual(await evalJexl('sortAsc([3, 1, 2])'), [1, 2, 3])
    assert.deepEqual(await evalJexl('sortAsc(["c", "a", "b"])'), ['a', 'b', 'c'])
    assert.deepEqual(await evalJexl('sortAsc(arr)', { arr: [5, 1, 3] }), [1, 3, 5])
  })

  test('sortDesc - should sort in descending order', async ({ assert }) => {
    assert.deepEqual(await evalJexl('sortDesc([1, 3, 2])'), [3, 2, 1])
    assert.deepEqual(await evalJexl('sortDesc(["a", "c", "b"])'), ['c', 'b', 'a'])
    assert.deepEqual(await evalJexl('sortDesc(arr)', { arr: [1, 5, 3] }), [5, 3, 1])
  })

  test('slice - should return a slice of the array', async ({ assert }) => {
    assert.deepEqual(await evalJexl('slice([1, 2, 3, 4, 5], 1, 3)'), [2, 3])
    assert.deepEqual(await evalJexl('slice([1, 2, 3, 4, 5], 2)'), [3, 4, 5])
    assert.deepEqual(await evalJexl('slice(arr, start, end)', { arr: [1, 2, 3, 4, 5], start: 1, end: 4 }), [2, 3, 4])
  })

  test('join - should join array elements', async ({ assert }) => {
    assert.equal(await evalJexl('join([1, 2, 3])'), '1,2,3')
    assert.equal(await evalJexl('join([1, 2, 3], "-")'), '1-2-3')
    assert.equal(await evalJexl('join(["a", "b", "c"], " | ")'), 'a | b | c')
    assert.equal(await evalJexl('join(arr, sep)', { arr: [1, 2, 3], sep: '-' }), '1-2-3')
  })

  test('concat - should concatenate arrays and values', async ({ assert }) => {
    assert.deepEqual(await evalJexl('concat([1, 2], [3, 4])'), [1, 2, 3, 4])
    assert.deepEqual(await evalJexl('concat([1], [2, 3], [4, 5])'), [1, 2, 3, 4, 5])
    assert.deepEqual(await evalJexl('concat([1, 2], 3, [4, 5])'), [1, 2, 3, 4, 5])
    assert.deepEqual(await evalJexl('concat([], [1, 2])'), [1, 2])
    assert.deepEqual(await evalJexl('concat(arr1, arr2)', { arr1: [1, 2], arr2: [3, 4] }), [1, 2, 3, 4])
  })

  test('unique - should remove duplicate values', async ({ assert }) => {
    assert.deepEqual(await evalJexl('unique([1, 2, 2, 3, 3, 3])'), [1, 2, 3])
    assert.deepEqual(await evalJexl('unique(["a", "b", "a", "c", "b"])'), ['a', 'b', 'c'])
    assert.deepEqual(await evalJexl('unique([])'), [])
    assert.deepEqual(await evalJexl('unique(arr)', { arr: [1, 1, 2, 2, 3] }), [1, 2, 3])
  })

  test('flatten - should flatten array by one level', async ({ assert }) => {
    assert.deepEqual(await evalJexl('flatten([1, [2, 3], 4])'), [1, 2, 3, 4])
    assert.deepEqual(await evalJexl('flatten([[1, 2], [3, 4]])'), [1, 2, 3, 4])
    assert.deepEqual(await evalJexl('flatten([1, [2, [3, 4]]])'), [1, 2, [3, 4]])
  })

  test('flattenDeep - should flatten array deeply', async ({ assert }) => {
    assert.deepEqual(await evalJexl('flattenDeep([1, [2, [3, [4, 5]]]])'), [1, 2, 3, 4, 5])
    assert.deepEqual(await evalJexl('flattenDeep([[1, 2], [3, [4, 5]]])'), [1, 2, 3, 4, 5])
  })

  test('chunk - should chunk array into specified sizes', async ({ assert }) => {
    assert.deepEqual(await evalJexl('chunk([1, 2, 3, 4, 5], 2)'), [[1, 2], [3, 4], [5]])
    assert.deepEqual(await evalJexl('chunk([1, 2, 3, 4, 5, 6], 3)'), [
      [1, 2, 3],
      [4, 5, 6],
    ])
    assert.deepEqual(await evalJexl('chunk([], 2)'), [])
    assert.deepEqual(await evalJexl('chunk(arr, size)', { arr: [1, 2, 3, 4, 5], size: 2 }), [[1, 2], [3, 4], [5]])
  })

  test('compact - should remove falsy values', async ({ assert }) => {
    assert.deepEqual(await evalJexl('compact([1, 0, 2, false, 3, null, 4, undefined, 5, ""])'), [1, 2, 3, 4, 5])
    assert.deepEqual(await evalJexl('compact([1, "hello", true, {}, []])'), [1, 'hello', true, {}, []])
    assert.deepEqual(await evalJexl('compact(arr)', { arr: [1, 0, 2, false, 3] }), [1, 2, 3])
  })

  test('difference - should return difference between arrays', async ({ assert }) => {
    assert.deepEqual(await evalJexl('difference([1, 2, 3], [2, 3, 4])'), [1])
    assert.deepEqual(await evalJexl('difference([1, 2, 3, 4], [2, 4])'), [1, 3])
    assert.deepEqual(await evalJexl('difference([1, 2, 3, 4, 5], [2, 3], [4, 5])'), [1])
    assert.deepEqual(await evalJexl('difference([1, 2, 3])'), [1, 2, 3])
    assert.deepEqual(await evalJexl('difference(arr1, arr2)', { arr1: [1, 2, 3], arr2: [2, 3, 4] }), [1])
  })

  test('intersection - should return intersection of arrays', async ({ assert }) => {
    assert.deepEqual(await evalJexl('intersection([1, 2, 3], [2, 3, 4])'), [2, 3])
    assert.deepEqual(await evalJexl('intersection([1, 2, 3, 4], [2, 4, 6])'), [2, 4])
    assert.deepEqual(await evalJexl('intersection([1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6])'), [3, 4])
    assert.deepEqual(await evalJexl('intersection([1, 2, 3])'), [1, 2, 3])
    assert.deepEqual(await evalJexl('intersection(arr1, arr2)', { arr1: [1, 2, 3], arr2: [2, 3, 4] }), [2, 3])
  })

  test('union - should return union of arrays', async ({ assert }) => {
    assert.deepEqual(await evalJexl('union([1, 2], [2, 3], [3, 4])'), [1, 2, 3, 4])
    assert.deepEqual(await evalJexl('union([1, 1, 2], [2, 2, 3])'), [1, 2, 3])
    assert.deepEqual(await evalJexl('union(arr1, arr2)', { arr1: [1, 2], arr2: [2, 3] }), [1, 2, 3])
  })

  test('zip - should zip arrays together', async ({ assert }) => {
    assert.deepEqual(await evalJexl('zip([1, 2, 3], ["a", "b", "c"])'), [
      [1, 'a'],
      [2, 'b'],
      [3, 'c'],
    ])
    assert.deepEqual(await evalJexl('zip([1, 2], ["a", "b", "c"])'), [
      [1, 'a'],
      [2, 'b'],
    ])
    assert.deepEqual(await evalJexl('zip()'), [])
    assert.deepEqual(await evalJexl('zip([1, 2, 3])'), [[1], [2], [3]])
  })

  test('shuffle - should return a shuffled array', async ({ assert }) => {
    const original = [1, 2, 3, 4, 5]
    const shuffled = await evalJexl<number[]>('shuffle(arr)', { arr: original })
    assert.equal(shuffled.length, 5)
    assert.includeMembers(shuffled, [1, 2, 3, 4, 5])
    assert.deepEqual(await evalJexl('shuffle([])'), [])
  })

  test('sample - should return a random element', async ({ assert }) => {
    const arr = [1, 2, 3, 4, 5]
    const sample = await evalJexl<number>('sample(arr)', { arr })
    assert.include(arr, sample)
    assert.isUndefined(await evalJexl('sample([])'))
  })

  test('sampleSize - should return specified number of random elements', async ({ assert }) => {
    const arr = [1, 2, 3, 4, 5]
    const samples = await evalJexl<number[]>('sampleSize(arr, 3)', { arr })
    assert.equal(samples.length, 3)
    samples.forEach((sample: number) => assert.include(arr, sample))

    const smallSamples = await evalJexl<number[]>('sampleSize([1, 2, 3], 5)')
    assert.equal(smallSamples.length, 3)
  })

  test('countBy - should count occurrences of each value', async ({ assert }) => {
    assert.deepEqual(await evalJexl('countBy([1, 2, 2, 3, 3, 3])'), {
      '1': 1,
      '2': 2,
      '3': 3,
    })
    assert.deepEqual(await evalJexl('countBy(["a", "b", "a", "c", "b", "a"])'), {
      a: 3,
      b: 2,
      c: 1,
    })
  })

  test('groupBy - should group elements by key function', async ({ assert }) => {
    const items = [
      { type: 'fruit', name: 'apple' },
      { type: 'fruit', name: 'banana' },
      { type: 'vegetable', name: 'carrot' },
    ]

    // Test groupBy function directly since Jexl can't pass functions as arguments
    const result = arrayFunctions.groupBy(items, (item: any) => item.type)
    assert.deepEqual(result, {
      fruit: [
        { type: 'fruit', name: 'apple' },
        { type: 'fruit', name: 'banana' },
      ],
      vegetable: [{ type: 'vegetable', name: 'carrot' }],
    })
  })

  test('sum - should sum array elements', async ({ assert }) => {
    assert.equal(await evalJexl('sum([1, 2, 3, 4, 5])'), 15)
    assert.equal(await evalJexl('sum(1, 2, 3, 4, 5)'), 15)
    assert.equal(await evalJexl('sum([])'), 0)
    assert.equal(await evalJexl('sum(arr)', { arr: [10, 20, 30] }), 60)
  })

  test('average - should calculate average of array elements', async ({ assert }) => {
    assert.equal(await evalJexl('average([1, 2, 3, 4, 5])'), 3)
    assert.equal(await evalJexl('average([10, 20, 30])'), 20)
    assert.equal(await evalJexl('average(1, 2, 3, 4, 5)'), 3)
    assert.equal(await evalJexl('average([])'), 0)
    assert.equal(await evalJexl('average(arr)', { arr: [10, 20, 30] }), 20)
  })

  test('min - should find minimum value', async ({ assert }) => {
    assert.equal(await evalJexl('min([3, 1, 4, 1, 5])'), 1)
    assert.equal(await evalJexl('min(3, 1, 4, 1, 5)'), 1)
    assert.equal(await evalJexl('min(arr)', { arr: [10, 5, 20] }), 5)
  })

  test('max - should find maximum value', async ({ assert }) => {
    assert.equal(await evalJexl('max([3, 1, 4, 1, 5])'), 5)
    assert.equal(await evalJexl('max(3, 1, 4, 1, 5)'), 5)
    assert.equal(await evalJexl('max(arr)', { arr: [10, 5, 20] }), 20)
  })

  test('range - should create range of numbers', async ({ assert }) => {
    assert.deepEqual(await evalJexl('range(1, 5)'), [1, 2, 3, 4])
    assert.deepEqual(await evalJexl('range(0, 3)'), [0, 1, 2])
    assert.deepEqual(await evalJexl('range(0, 10, 2)'), [0, 2, 4, 6, 8])
    assert.deepEqual(await evalJexl('range(1, 10, 3)'), [1, 4, 7])
    assert.deepEqual(await evalJexl('range(start, end, step)', { start: 0, end: 6, step: 2 }), [0, 2, 4])
  })

  test('repeat - should repeat value specified number of times', async ({ assert }) => {
    assert.deepEqual(await evalJexl('repeat("a", 3)'), ['a', 'a', 'a'])
    assert.deepEqual(await evalJexl('repeat(1, 4)'), [1, 1, 1, 1])
    assert.deepEqual(await evalJexl('repeat("a", 0)'), [])
    assert.deepEqual(await evalJexl('repeat(value, count)', { value: 'x', count: 3 }), ['x', 'x', 'x'])
  })

  test('every - should check if all elements are truthy', async ({ assert }) => {
    assert.isTrue(await evalJexl('every([1, 2, 3, "hello", true])'))
    assert.isFalse(await evalJexl('every([1, 2, 0, 3])'))
    assert.isFalse(await evalJexl('every([1, 2, false, 3])'))
    assert.isTrue(await evalJexl('every(arr)', { arr: [1, 2, 3] }))
  })

  test('some - should check if any element is truthy', async ({ assert }) => {
    assert.isTrue(await evalJexl('some([0, false, 1, null])'))
    assert.isTrue(await evalJexl('some([1, 2, 3])'))
    assert.isFalse(await evalJexl('some([0, false, null, undefined, ""])'))
    assert.isTrue(await evalJexl('some(arr)', { arr: [0, false, 1] }))
  })

  test('none - should check if no elements are truthy', async ({ assert }) => {
    assert.isTrue(await evalJexl('none([0, false, null, undefined, ""])'))
    assert.isFalse(await evalJexl('none([0, false, 1, null])'))
    assert.isFalse(await evalJexl('none([1, 2, 3])'))
    assert.isTrue(await evalJexl('none(arr)', { arr: [0, false, null] }))
  })

  test('partition - should partition array based on predicate', async ({ assert }) => {
    const numbers = [1, 2, 3, 4, 5, 6]

    // Test partition function directly since Jexl can't pass functions as arguments
    const [even, odd] = arrayFunctions.partition(numbers, (x: any) => x % 2 === 0)
    assert.deepEqual(even, [2, 4, 6])
    assert.deepEqual(odd, [1, 3, 5])

    const [truthy, falsy] = arrayFunctions.partition([], () => true)
    assert.deepEqual(truthy, [])
    assert.deepEqual(falsy, [])
  })
})
