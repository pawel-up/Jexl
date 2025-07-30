/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from '@japa/runner'
import * as mathFunctions from '../../../src/definitions/math.js'
import { Jexl } from '../../../src/Jexl.js'
import type { FunctionFunction } from '../../../src/grammar.js'

// Helper function to add all functions from a module
function addModule(jexl: Jexl, module: Record<string, FunctionFunction>, prefix = '') {
  Object.keys(module).forEach((key) => {
    const functionName = prefix ? `${prefix}_${key}` : key
    jexl.addFunction(functionName, module[key])
  })
}

// Helper function to evaluate Jexl expressions with math functions
const evalJexl = async (expression: string, context: any = {}) => {
  const lib = new Jexl()
  addModule(lib, mathFunctions)
  return await lib.eval(expression, context)
}

test.group('Math - Basic Functions', () => {
  test('ABS returns absolute value', async ({ assert }) => {
    assert.equal(await evalJexl('ABS(-5)'), 5)
    assert.equal(await evalJexl('ABS(5)'), 5)
    assert.equal(await evalJexl('ABS(0)'), 0)
    assert.equal(await evalJexl('ABS(-0)'), 0)
    assert.equal(await evalJexl('ABS(-3.14)'), 3.14)
  })

  test('CEIL returns ceiling value', async ({ assert }) => {
    assert.equal(await evalJexl('CEIL(4.3)'), 5)
    assert.equal(await evalJexl('CEIL(4.7)'), 5)
    assert.equal(await evalJexl('CEIL(4)'), 4)
    assert.equal(await evalJexl('CEIL(-4.3)'), -4)
    assert.equal(await evalJexl('CEIL(-4.7)'), -4)
  })

  test('FLOOR returns floor value', async ({ assert }) => {
    assert.equal(await evalJexl('FLOOR(4.3)'), 4)
    assert.equal(await evalJexl('FLOOR(4.7)'), 4)
    assert.equal(await evalJexl('FLOOR(4)'), 4)
    assert.equal(await evalJexl('FLOOR(-4.3)'), -5)
    assert.equal(await evalJexl('FLOOR(-4.7)'), -5)
  })

  test('ROUND returns rounded value', async ({ assert }) => {
    assert.equal(await evalJexl('ROUND(4.3)'), 4)
    assert.equal(await evalJexl('ROUND(4.7)'), 5)
    assert.equal(await evalJexl('ROUND(4.5)'), 5)
    assert.equal(await evalJexl('ROUND(-4.3)'), -4)
    assert.equal(await evalJexl('ROUND(-4.7)'), -5)
    assert.equal(await evalJexl('ROUND(-4.5)'), -4)
  })

  test('RANDOM returns value between 0 and 1', async ({ assert }) => {
    const result = (await evalJexl('RANDOM()')) as number
    assert.isTrue(result >= 0 && result < 1)
  })

  test('MAX returns maximum value', async ({ assert }) => {
    assert.equal(await evalJexl('MAX(1, 2, 3)'), 3)
    assert.equal(await evalJexl('MAX(3, 1, 2)'), 3)
    assert.equal(await evalJexl('MAX(-1, -2, -3)'), -1)
    assert.equal(await evalJexl('MAX(0)'), 0)
  })

  test('MIN returns minimum value', async ({ assert }) => {
    assert.equal(await evalJexl('MIN(1, 2, 3)'), 1)
    assert.equal(await evalJexl('MIN(3, 1, 2)'), 1)
    assert.equal(await evalJexl('MIN(-1, -2, -3)'), -3)
    assert.equal(await evalJexl('MIN(0)'), 0)
  })

  test('SIGN returns sign of number', async ({ assert }) => {
    assert.equal(await evalJexl('SIGN(5)'), 1)
    assert.equal(await evalJexl('SIGN(-5)'), -1)
    assert.equal(await evalJexl('SIGN(0)'), 0)
    assert.equal(await evalJexl('SIGN(-0)'), -0)
  })

  test('TRUNC returns integer part', async ({ assert }) => {
    assert.equal(await evalJexl('TRUNC(4.3)'), 4)
    assert.equal(await evalJexl('TRUNC(4.7)'), 4)
    assert.equal(await evalJexl('TRUNC(-4.3)'), -4)
    assert.equal(await evalJexl('TRUNC(-4.7)'), -4)
    assert.equal(await evalJexl('TRUNC(0)'), 0)
  })
})

test.group('Math - Trigonometric Functions', () => {
  test('SIN returns sine value', async ({ assert }) => {
    assert.equal(await evalJexl('SIN(0)'), 0)
    assert.closeTo((await evalJexl('SIN(3.14159265359 / 2)')) as number, 1, 0.0001)
    assert.closeTo((await evalJexl('SIN(3.14159265359)')) as number, 0, 0.0001)
    assert.closeTo((await evalJexl('SIN(3 * 3.14159265359 / 2)')) as number, -1, 0.0001)
  })

  test('COS returns cosine value', async ({ assert }) => {
    assert.equal(await evalJexl('COS(0)'), 1)
    assert.closeTo((await evalJexl('COS(3.14159265359 / 2)')) as number, 0, 0.0001)
    assert.equal(await evalJexl('COS(3.14159265359)'), -1)
    assert.closeTo((await evalJexl('COS(3 * 3.14159265359 / 2)')) as number, 0, 0.0001)
  })

  test('TAN returns tangent value', async ({ assert }) => {
    assert.equal(await evalJexl('TAN(0)'), 0)
    assert.closeTo((await evalJexl('TAN(3.14159265359 / 4)')) as number, 1, 0.0001)
    assert.closeTo((await evalJexl('TAN(3.14159265359)')) as number, 0, 0.0001)
  })

  test('ASIN returns arcsine value', async ({ assert }) => {
    assert.equal(await evalJexl('ASIN(0)'), 0)
    assert.closeTo((await evalJexl('ASIN(1)')) as number, 3.14159265359 / 2, 0.0001)
    assert.closeTo((await evalJexl('ASIN(-1)')) as number, -3.14159265359 / 2, 0.0001)
  })

  test('ACOS returns arccosine value', async ({ assert }) => {
    assert.closeTo((await evalJexl('ACOS(1)')) as number, 0, 0.0001)
    assert.closeTo((await evalJexl('ACOS(0)')) as number, 3.14159265359 / 2, 0.0001)
    assert.closeTo((await evalJexl('ACOS(-1)')) as number, 3.14159265359, 0.0001)
  })

  test('ATAN returns arctangent value', async ({ assert }) => {
    assert.equal(await evalJexl('ATAN(0)'), 0)
    assert.closeTo((await evalJexl('ATAN(1)')) as number, 3.14159265359 / 4, 0.0001)
    assert.closeTo((await evalJexl('ATAN(-1)')) as number, -3.14159265359 / 4, 0.0001)
  })

  test('ATAN2 returns arctangent of y/x', async ({ assert }) => {
    assert.equal(await evalJexl('ATAN2(0, 1)'), 0)
    assert.closeTo((await evalJexl('ATAN2(1, 1)')) as number, 3.14159265359 / 4, 0.0001)
    assert.closeTo((await evalJexl('ATAN2(1, 0)')) as number, 3.14159265359 / 2, 0.0001)
    assert.closeTo((await evalJexl('ATAN2(0, (-1))')) as number, 3.14159265359, 0.0001)
  })

  test('TO_RADIANS converts degrees to radians', async ({ assert }) => {
    assert.equal(await evalJexl('TO_RADIANS(0)'), 0)
    assert.closeTo((await evalJexl('TO_RADIANS(90)')) as number, 3.14159265359 / 2, 0.0001)
    assert.closeTo((await evalJexl('TO_RADIANS(180)')) as number, 3.14159265359, 0.0001)
    assert.closeTo((await evalJexl('TO_RADIANS(360)')) as number, 2 * 3.14159265359, 0.0001)
  })

  test('TO_DEGREES converts radians to degrees', async ({ assert }) => {
    assert.equal(await evalJexl('TO_DEGREES(0)'), 0)
    assert.closeTo((await evalJexl('TO_DEGREES(3.14159265359 / 2)')) as number, 90, 0.0001)
    assert.closeTo((await evalJexl('TO_DEGREES(3.14159265359)')) as number, 180, 0.0001)
    assert.closeTo((await evalJexl('TO_DEGREES(2 * 3.14159265359)')) as number, 360, 0.0001)
  })
})

test.group('Math - Exponential and Logarithmic Functions', () => {
  test('SQRT returns square root', async ({ assert }) => {
    assert.equal(await evalJexl('SQRT(0)'), 0)
    assert.equal(await evalJexl('SQRT(1)'), 1)
    assert.equal(await evalJexl('SQRT(4)'), 2)
    assert.equal(await evalJexl('SQRT(9)'), 3)
    assert.closeTo((await evalJexl('SQRT(2)')) as number, 1.4142135623730951, 0.0001)
  })

  test('CBRT returns cube root', async ({ assert }) => {
    assert.equal(await evalJexl('CBRT(0)'), 0)
    assert.equal(await evalJexl('CBRT(1)'), 1)
    assert.equal(await evalJexl('CBRT(8)'), 2)
    assert.equal(await evalJexl('CBRT(27)'), 3)
    assert.equal(await evalJexl('CBRT(-8)'), -2)
  })

  test('EXP returns e^x', async ({ assert }) => {
    assert.equal(await evalJexl('EXP(0)'), 1)
    assert.closeTo((await evalJexl('EXP(1)')) as number, 2.718281828459045, 0.0001)
    assert.closeTo((await evalJexl('EXP(2)')) as number, 7.38905609893065, 0.0001)
  })

  test('LOG returns natural logarithm', async ({ assert }) => {
    assert.equal(await evalJexl('LOG(1)'), 0)
    assert.closeTo((await evalJexl('LOG(2.718281828459045)')) as number, 1, 0.0001)
    assert.closeTo((await evalJexl('LOG(7.38905609893065)')) as number, 2, 0.0001)
  })

  test('LOG10 returns base-10 logarithm', async ({ assert }) => {
    assert.equal(await evalJexl('LOG10(1)'), 0)
    assert.equal(await evalJexl('LOG10(10)'), 1)
    assert.equal(await evalJexl('LOG10(100)'), 2)
    assert.equal(await evalJexl('LOG10(1000)'), 3)
  })

  test('LOG2 returns base-2 logarithm', async ({ assert }) => {
    assert.equal(await evalJexl('LOG2(1)'), 0)
    assert.equal(await evalJexl('LOG2(2)'), 1)
    assert.equal(await evalJexl('LOG2(4)'), 2)
    assert.equal(await evalJexl('LOG2(8)'), 3)
  })

  test('POW returns base^exponent', async ({ assert }) => {
    assert.equal(await evalJexl('POW(2, 0)'), 1)
    assert.equal(await evalJexl('POW(2, 1)'), 2)
    assert.equal(await evalJexl('POW(2, 3)'), 8)
    assert.equal(await evalJexl('POW(3, 2)'), 9)
    assert.equal(await evalJexl('POW(5, (-1))'), 0.2)
  })
})

test.group('Math - Statistical Functions', () => {
  test('SUM calculates sum of numbers', async ({ assert }) => {
    assert.equal(await evalJexl('SUM(1, 2, 3)'), 6)
    assert.equal(await evalJexl('SUM(0)'), 0)
    assert.equal(await evalJexl('SUM(-1, -2, -3)'), -6)
    assert.equal(await evalJexl('SUM(1.5, 2.5)'), 4)
  })

  test('SUM works with arrays', async ({ assert }) => {
    // Test with array variables
    assert.equal(await evalJexl('SUM(arr)', { arr: [1, 2, 3] }), 6)
    assert.equal(await evalJexl('SUM(arr)', { arr: [] }), 0)
    assert.equal(await evalJexl('SUM(arr)', { arr: [-1, -2, -3] }), -6)
    assert.equal(await evalJexl('SUM(arr)', { arr: [1.5, 2.5] }), 4)
  })

  test('AVG calculates average of numbers', async ({ assert }) => {
    assert.equal(await evalJexl('AVG(1, 2, 3)'), 2)
    assert.equal(await evalJexl('AVG(0)'), 0)
    assert.equal(await evalJexl('AVG(-1, -2, -3)'), -2)
    assert.equal(await evalJexl('AVG(1, 3)'), 2)
  })

  test('AVG works with arrays', async ({ assert }) => {
    assert.equal(await evalJexl('AVG(arr)', { arr: [1, 2, 3] }), 2)
    assert.equal(await evalJexl('AVG(arr)', { arr: [] }), 0)
    assert.equal(await evalJexl('AVG(arr)', { arr: [-1, -2, -3] }), -2)
    assert.equal(await evalJexl('AVG(arr)', { arr: [1, 3] }), 2)
  })

  test('MEDIAN finds middle value', async ({ assert }) => {
    assert.equal(await evalJexl('MEDIAN(1, 2, 3)'), 2)
    assert.equal(await evalJexl('MEDIAN(1, 2, 3, 4)'), 2.5)
    assert.equal(await evalJexl('MEDIAN(3, 1, 2)'), 2)
    assert.equal(await evalJexl('MEDIAN(5)'), 5)
    assert.equal(await evalJexl('MEDIAN()'), 0)
  })

  test('MEDIAN works with arrays', async ({ assert }) => {
    assert.equal(await evalJexl('MEDIAN(arr)', { arr: [1, 2, 3] }), 2)
    assert.equal(await evalJexl('MEDIAN(arr)', { arr: [1, 2, 3, 4] }), 2.5)
    assert.equal(await evalJexl('MEDIAN(arr)', { arr: [3, 1, 2] }), 2)
    assert.equal(await evalJexl('MEDIAN(arr)', { arr: [5] }), 5)
    assert.equal(await evalJexl('MEDIAN(arr)', { arr: [] }), 0)
  })

  test('MODE finds most frequent value', async ({ assert }) => {
    assert.equal(await evalJexl('MODE(1, 2, 2, 3)'), 2)
    assert.equal(await evalJexl('MODE(1, 1, 2, 3, 3, 3)'), 3)
    assert.equal(await evalJexl('MODE(5)'), 5)
    assert.equal(await evalJexl('MODE(1, 2, 3)'), 1) // First value when no clear mode
  })

  test('MODE works with arrays', async ({ assert }) => {
    assert.equal(await evalJexl('MODE(arr)', { arr: [1, 2, 2, 3] }), 2)
    assert.equal(await evalJexl('MODE(arr)', { arr: [1, 1, 2, 3, 3, 3] }), 3)
    assert.equal(await evalJexl('MODE(arr)', { arr: [5] }), 5)
    assert.equal(await evalJexl('MODE(arr)', { arr: [] }), 0)
  })

  test('VARIANCE calculates variance', async ({ assert }) => {
    assert.closeTo((await evalJexl('VARIANCE(1, 2, 3)')) as number, 2 / 3, 0.0001)
    assert.equal(await evalJexl('VARIANCE(1, 1, 1)'), 0)
    assert.equal(await evalJexl('VARIANCE(0, 2)'), 1)
    assert.equal(await evalJexl('VARIANCE()'), 0)
  })

  test('VARIANCE works with arrays', async ({ assert }) => {
    assert.closeTo((await evalJexl('VARIANCE(arr)', { arr: [1, 2, 3] })) as number, 2 / 3, 0.0001)
    assert.equal(await evalJexl('VARIANCE(arr)', { arr: [1, 1, 1] }), 0)
    assert.equal(await evalJexl('VARIANCE(arr)', { arr: [0, 2] }), 1)
    assert.equal(await evalJexl('VARIANCE(arr)', { arr: [] }), 0)
  })

  test('STDDEV calculates standard deviation', async ({ assert }) => {
    assert.closeTo((await evalJexl('STDDEV(1, 2, 3)')) as number, Math.sqrt(2 / 3), 0.0001)
    assert.equal(await evalJexl('STDDEV(1, 1, 1)'), 0)
    assert.equal(await evalJexl('STDDEV(0, 2)'), 1)
    assert.equal(await evalJexl('STDDEV()'), 0)
  })

  test('STDDEV works with arrays', async ({ assert }) => {
    assert.closeTo((await evalJexl('STDDEV(arr)', { arr: [1, 2, 3] })) as number, Math.sqrt(2 / 3), 0.0001)
    assert.equal(await evalJexl('STDDEV(arr)', { arr: [1, 1, 1] }), 0)
    assert.equal(await evalJexl('STDDEV(arr)', { arr: [0, 2] }), 1)
    assert.equal(await evalJexl('STDDEV(arr)', { arr: [] }), 0)
  })
})

test.group('Math - Utility Functions', () => {
  test('CLAMP constrains value between min and max', async ({ assert }) => {
    assert.equal(await evalJexl('CLAMP(5, 0, 10)'), 5)
    assert.equal(await evalJexl('CLAMP(-5, 0, 10)'), 0)
    assert.equal(await evalJexl('CLAMP(15, 0, 10)'), 10)
    assert.equal(await evalJexl('CLAMP(5, 5, 5)'), 5)
  })

  test('LERP interpolates between values', async ({ assert }) => {
    assert.equal(await evalJexl('LERP(0, 10, 0)'), 0)
    assert.equal(await evalJexl('LERP(0, 10, 1)'), 10)
    assert.equal(await evalJexl('LERP(0, 10, 0.5)'), 5)
    assert.equal(await evalJexl('LERP(10, 20, 0.3)'), 13)
  })

  test('ROUND_TO rounds to specified decimal places', async ({ assert }) => {
    assert.equal(await evalJexl('ROUND_TO(3.14159, 2)'), 3.14)
    assert.equal(await evalJexl('ROUND_TO(3.14159, 0)'), 3)
    assert.equal(await evalJexl('ROUND_TO(3.14159, 4)'), 3.1416)
    assert.equal(await evalJexl('ROUND_TO(1234.5678, (-2))'), 1200)
  })
})

test.group('Math - Number Theory Functions', () => {
  test('GCD calculates greatest common divisor', async ({ assert }) => {
    assert.equal(await evalJexl('GCD(12, 8)'), 4)
    assert.equal(await evalJexl('GCD(48, 18)'), 6)
    assert.equal(await evalJexl('GCD(17, 13)'), 1)
    assert.equal(await evalJexl('GCD(0, 5)'), 5)
    assert.equal(await evalJexl('GCD(5, 0)'), 5)
    assert.equal(await evalJexl('GCD(-12, 8)'), 4)
  })

  test('LCM calculates least common multiple', async ({ assert }) => {
    assert.equal(await evalJexl('LCM(12, 8)'), 24)
    assert.equal(await evalJexl('LCM(4, 6)'), 12)
    assert.equal(await evalJexl('LCM(17, 13)'), 221)
    assert.equal(await evalJexl('LCM(0, 5)'), 0)
    assert.equal(await evalJexl('LCM(5, 0)'), 0)
  })

  test('FACTORIAL calculates factorial', async ({ assert }) => {
    assert.equal(await evalJexl('FACTORIAL(0)'), 1)
    assert.equal(await evalJexl('FACTORIAL(1)'), 1)
    assert.equal(await evalJexl('FACTORIAL(2)'), 2)
    assert.equal(await evalJexl('FACTORIAL(3)'), 6)
    assert.equal(await evalJexl('FACTORIAL(4)'), 24)
    assert.equal(await evalJexl('FACTORIAL(5)'), 120)
    assert.isTrue(Number.isNaN((await evalJexl('FACTORIAL(-1)')) as number))
  })

  test('FACTORIAL handles decimals by flooring', async ({ assert }) => {
    assert.equal(await evalJexl('FACTORIAL(3.7)'), 6)
    assert.equal(await evalJexl('FACTORIAL(5.2)'), 120)
  })

  test('IS_PRIME checks if number is prime', async ({ assert }) => {
    assert.isFalse((await evalJexl('IS_PRIME(0)')) as boolean)
    assert.isFalse((await evalJexl('IS_PRIME(1)')) as boolean)
    assert.isTrue((await evalJexl('IS_PRIME(2)')) as boolean)
    assert.isTrue((await evalJexl('IS_PRIME(3)')) as boolean)
    assert.isFalse((await evalJexl('IS_PRIME(4)')) as boolean)
    assert.isTrue((await evalJexl('IS_PRIME(5)')) as boolean)
    assert.isFalse((await evalJexl('IS_PRIME(6)')) as boolean)
    assert.isTrue((await evalJexl('IS_PRIME(7)')) as boolean)
    assert.isFalse((await evalJexl('IS_PRIME(8)')) as boolean)
    assert.isFalse((await evalJexl('IS_PRIME(9)')) as boolean)
    assert.isFalse((await evalJexl('IS_PRIME(10)')) as boolean)
    assert.isTrue((await evalJexl('IS_PRIME(11)')) as boolean)
    assert.isTrue((await evalJexl('IS_PRIME(13)')) as boolean)
    assert.isTrue((await evalJexl('IS_PRIME(17)')) as boolean)
    assert.isTrue((await evalJexl('IS_PRIME(19)')) as boolean)
    assert.isFalse((await evalJexl('IS_PRIME(21)')) as boolean)
  })

  test('IS_PRIME handles large primes', async ({ assert }) => {
    assert.isTrue((await evalJexl('IS_PRIME(97)')) as boolean)
    assert.isTrue((await evalJexl('IS_PRIME(101)')) as boolean)
    assert.isFalse((await evalJexl('IS_PRIME(99)')) as boolean)
    assert.isFalse((await evalJexl('IS_PRIME(100)')) as boolean)
  })

  test('IS_PRIME handles negative numbers', async ({ assert }) => {
    assert.isFalse((await evalJexl('IS_PRIME(-2)')) as boolean)
    assert.isFalse((await evalJexl('IS_PRIME(-3)')) as boolean)
    assert.isFalse((await evalJexl('IS_PRIME(-5)')) as boolean)
  })

  test('IS_PRIME handles decimals by flooring', async ({ assert }) => {
    assert.isTrue((await evalJexl('IS_PRIME(7.9)')) as boolean)
    assert.isFalse((await evalJexl('IS_PRIME(8.1)')) as boolean)
  })
})

test.group('Math - Edge Cases and Special Values', () => {
  test('functions handle NaN correctly', async ({ assert }) => {
    const nan = NaN
    assert.isTrue(Number.isNaN((await evalJexl('ABS(nan)', { nan })) as number))
    assert.isTrue(Number.isNaN((await evalJexl('CEIL(nan)', { nan })) as number))
    assert.isTrue(Number.isNaN((await evalJexl('FLOOR(nan)', { nan })) as number))
    assert.isTrue(Number.isNaN((await evalJexl('ROUND(nan)', { nan })) as number))
    assert.isTrue(Number.isNaN((await evalJexl('SQRT(nan)', { nan })) as number))
  })

  test('functions handle Infinity correctly', async ({ assert }) => {
    const inf = Infinity
    const negInf = -Infinity
    assert.equal(await evalJexl('ABS(inf)', { inf }), Infinity)
    assert.equal(await evalJexl('ABS(negInf)', { negInf }), Infinity)
    assert.equal(await evalJexl('CEIL(inf)', { inf }), Infinity)
    assert.equal(await evalJexl('FLOOR(inf)', { inf }), Infinity)
    assert.equal(await evalJexl('SIGN(inf)', { inf }), 1)
    assert.equal(await evalJexl('SIGN(negInf)', { negInf }), -1)
  })

  test('SQRT handles negative numbers', async ({ assert }) => {
    assert.isTrue(Number.isNaN((await evalJexl('SQRT(-1)')) as number))
    assert.isTrue(Number.isNaN((await evalJexl('SQRT(-4)')) as number))
  })

  test('LOG handles edge cases', async ({ assert }) => {
    assert.isTrue(Number.isNaN((await evalJexl('LOG(-1)')) as number))
    assert.equal(await evalJexl('LOG(0)'), -Infinity)
    assert.equal(await evalJexl('LOG(1)'), 0)
  })

  test('statistical functions handle empty input', async ({ assert }) => {
    assert.equal(await evalJexl('SUM()'), 0)
    assert.equal(await evalJexl('AVG()'), 0)
    assert.equal(await evalJexl('MEDIAN()'), 0)
    assert.equal(await evalJexl('MODE()'), 0)
    assert.equal(await evalJexl('VARIANCE()'), 0)
    assert.equal(await evalJexl('STDDEV()'), 0)
  })

  test('GCD handles zero inputs', async ({ assert }) => {
    assert.equal(await evalJexl('GCD(0, 0)'), 0)
    assert.equal(await evalJexl('GCD(0, 5)'), 5)
    assert.equal(await evalJexl('GCD(5, 0)'), 5)
  })

  test('LCM handles zero inputs', async ({ assert }) => {
    assert.equal(await evalJexl('LCM(0, 0)'), 0)
    assert.equal(await evalJexl('LCM(0, 5)'), 0)
    assert.equal(await evalJexl('LCM(5, 0)'), 0)
  })
})

test.group('Math - Complex Calculations', () => {
  test('complex statistical calculation', async ({ assert }) => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    assert.equal(await evalJexl('SUM(data)', { data }), 55)
    assert.equal(await evalJexl('AVG(data)', { data }), 5.5)
    assert.equal(await evalJexl('MEDIAN(data)', { data }), 5.5)
    assert.closeTo((await evalJexl('STDDEV(data)', { data })) as number, 2.8722813232690143, 0.0001)
  })

  test('trigonometric identity verification', async ({ assert }) => {
    const angle = 3.14159265359 / 3 // 60 degrees
    const result = await evalJexl('SIN(angle) * SIN(angle) + COS(angle) * COS(angle)', { angle })

    // sin²(x) + cos²(x) = 1
    assert.closeTo(result as number, 1, 0.0001)
  })

  test('exponential and logarithmic inverse relationship', async ({ assert }) => {
    const value = 5
    assert.closeTo((await evalJexl('EXP(LOG(value))', { value })) as number, value, 0.0001)
    assert.closeTo((await evalJexl('LOG(EXP(value))', { value })) as number, value, 0.0001)
  })

  test('power and root inverse relationship', async ({ assert }) => {
    const base = 3
    const exponent = 4
    const result = await evalJexl('POW(base, exponent)', { base, exponent })
    assert.closeTo((await evalJexl('POW(result, 1 / exponent)', { result, exponent })) as number, base, 0.0001)
  })

  test('complex math expressions', async ({ assert }) => {
    // Test complex mathematical expressions
    assert.closeTo((await evalJexl('SQRT(POW(3, 2) + POW(4, 2))')) as number, 5, 0.0001)
    assert.equal(await evalJexl('GCD(LCM(12, 8), 16)'), 8)
    assert.closeTo((await evalJexl('SIN(TO_RADIANS(30))')) as number, 0.5, 0.0001)
    assert.closeTo((await evalJexl('ROUND_TO(3.14159 * POW(2, 2), 2)')) as number, 12.57, 0.0001)
  })

  test('nested function calls', async ({ assert }) => {
    // Test nested function calls
    assert.equal(await evalJexl('ABS(FLOOR(-3.7))'), 4)
    assert.equal(await evalJexl('CEIL(SQRT(16))'), 4)
    assert.equal(await evalJexl('FACTORIAL(ABS(-5))'), 120)
    assert.closeTo((await evalJexl('LOG(EXP(SQRT(4)))')) as number, 2, 0.0001)
  })
})
