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
  test('abs returns absolute value', async ({ assert }) => {
    assert.equal(await evalJexl('abs(-5)'), 5)
    assert.equal(await evalJexl('abs(5)'), 5)
    assert.equal(await evalJexl('abs(0)'), 0)
    assert.equal(await evalJexl('abs(-0)'), 0)
    assert.equal(await evalJexl('abs(-3.14)'), 3.14)
  })

  test('ceil returns ceiling value', async ({ assert }) => {
    assert.equal(await evalJexl('ceil(4.3)'), 5)
    assert.equal(await evalJexl('ceil(4.7)'), 5)
    assert.equal(await evalJexl('ceil(4)'), 4)
    assert.equal(await evalJexl('ceil(-4.3)'), -4)
    assert.equal(await evalJexl('ceil(-4.7)'), -4)
  })

  test('floor returns floor value', async ({ assert }) => {
    assert.equal(await evalJexl('floor(4.3)'), 4)
    assert.equal(await evalJexl('floor(4.7)'), 4)
    assert.equal(await evalJexl('floor(4)'), 4)
    assert.equal(await evalJexl('floor(-4.3)'), -5)
    assert.equal(await evalJexl('floor(-4.7)'), -5)
  })

  test('round returns rounded value', async ({ assert }) => {
    assert.equal(await evalJexl('round(4.3)'), 4)
    assert.equal(await evalJexl('round(4.7)'), 5)
    assert.equal(await evalJexl('round(4.5)'), 5)
    assert.equal(await evalJexl('round(-4.3)'), -4)
    assert.equal(await evalJexl('round(-4.7)'), -5)
    assert.equal(await evalJexl('round(-4.5)'), -4)
  })

  test('random returns value between 0 and 1', async ({ assert }) => {
    const result = (await evalJexl('random()')) as number
    assert.isTrue(result >= 0 && result < 1)
  })

  test('max returns maximum value', async ({ assert }) => {
    assert.equal(await evalJexl('max(1, 2, 3)'), 3)
    assert.equal(await evalJexl('max(3, 1, 2)'), 3)
    assert.equal(await evalJexl('max(-1, -2, -3)'), -1)
    assert.equal(await evalJexl('max(0)'), 0)
  })

  test('min returns minimum value', async ({ assert }) => {
    assert.equal(await evalJexl('min(1, 2, 3)'), 1)
    assert.equal(await evalJexl('min(3, 1, 2)'), 1)
    assert.equal(await evalJexl('min(-1, -2, -3)'), -3)
    assert.equal(await evalJexl('min(0)'), 0)
  })

  test('sign returns sign of number', async ({ assert }) => {
    assert.equal(await evalJexl('sign(5)'), 1)
    assert.equal(await evalJexl('sign(-5)'), -1)
    assert.equal(await evalJexl('sign(0)'), 0)
    assert.equal(await evalJexl('sign(-0)'), -0)
  })

  test('trunc returns integer part', async ({ assert }) => {
    assert.equal(await evalJexl('trunc(4.3)'), 4)
    assert.equal(await evalJexl('trunc(4.7)'), 4)
    assert.equal(await evalJexl('trunc(-4.3)'), -4)
    assert.equal(await evalJexl('trunc(-4.7)'), -4)
    assert.equal(await evalJexl('trunc(0)'), 0)
  })
})

test.group('Math - Trigonometric Functions', () => {
  test('sin returns sine value', async ({ assert }) => {
    assert.equal(await evalJexl('sin(0)'), 0)
    assert.closeTo((await evalJexl('sin(3.14159265359 / 2)')) as number, 1, 0.0001)
    assert.closeTo((await evalJexl('sin(3.14159265359)')) as number, 0, 0.0001)
    assert.closeTo((await evalJexl('sin(3 * 3.14159265359 / 2)')) as number, -1, 0.0001)
  })

  test('cos returns cosine value', async ({ assert }) => {
    assert.equal(await evalJexl('cos(0)'), 1)
    assert.closeTo((await evalJexl('cos(3.14159265359 / 2)')) as number, 0, 0.0001)
    assert.equal(await evalJexl('cos(3.14159265359)'), -1)
    assert.closeTo((await evalJexl('cos(3 * 3.14159265359 / 2)')) as number, 0, 0.0001)
  })

  test('tan returns tangent value', async ({ assert }) => {
    assert.equal(await evalJexl('tan(0)'), 0)
    assert.closeTo((await evalJexl('tan(3.14159265359 / 4)')) as number, 1, 0.0001)
    assert.closeTo((await evalJexl('tan(3.14159265359)')) as number, 0, 0.0001)
  })

  test('asin returns arcsine value', async ({ assert }) => {
    assert.equal(await evalJexl('asin(0)'), 0)
    assert.closeTo((await evalJexl('asin(1)')) as number, 3.14159265359 / 2, 0.0001)
    assert.closeTo((await evalJexl('asin(-1)')) as number, -3.14159265359 / 2, 0.0001)
  })

  test('acos returns arccosine value', async ({ assert }) => {
    assert.closeTo((await evalJexl('acos(1)')) as number, 0, 0.0001)
    assert.closeTo((await evalJexl('acos(0)')) as number, 3.14159265359 / 2, 0.0001)
    assert.closeTo((await evalJexl('acos(-1)')) as number, 3.14159265359, 0.0001)
  })

  test('atan returns arctangent value', async ({ assert }) => {
    assert.equal(await evalJexl('atan(0)'), 0)
    assert.closeTo((await evalJexl('atan(1)')) as number, 3.14159265359 / 4, 0.0001)
    assert.closeTo((await evalJexl('atan(-1)')) as number, -3.14159265359 / 4, 0.0001)
  })

  test('atan2 returns arctangent of y/x', async ({ assert }) => {
    assert.equal(await evalJexl('atan2(0, 1)'), 0)
    assert.closeTo((await evalJexl('atan2(1, 1)')) as number, 3.14159265359 / 4, 0.0001)
    assert.closeTo((await evalJexl('atan2(1, 0)')) as number, 3.14159265359 / 2, 0.0001)
    assert.closeTo((await evalJexl('atan2(0, (-1))')) as number, 3.14159265359, 0.0001)
  })

  test('toRadians converts degrees to radians', async ({ assert }) => {
    assert.equal(await evalJexl('toRadians(0)'), 0)
    assert.closeTo((await evalJexl('toRadians(90)')) as number, 3.14159265359 / 2, 0.0001)
    assert.closeTo((await evalJexl('toRadians(180)')) as number, 3.14159265359, 0.0001)
    assert.closeTo((await evalJexl('toRadians(360)')) as number, 2 * 3.14159265359, 0.0001)
  })

  test('toDegrees converts radians to degrees', async ({ assert }) => {
    assert.equal(await evalJexl('toDegrees(0)'), 0)
    assert.closeTo((await evalJexl('toDegrees(3.14159265359 / 2)')) as number, 90, 0.0001)
    assert.closeTo((await evalJexl('toDegrees(3.14159265359)')) as number, 180, 0.0001)
    assert.closeTo((await evalJexl('toDegrees(2 * 3.14159265359)')) as number, 360, 0.0001)
  })
})

test.group('Math - Exponential and Logarithmic Functions', () => {
  test('sqrt returns square root', async ({ assert }) => {
    assert.equal(await evalJexl('sqrt(0)'), 0)
    assert.equal(await evalJexl('sqrt(1)'), 1)
    assert.equal(await evalJexl('sqrt(4)'), 2)
    assert.equal(await evalJexl('sqrt(9)'), 3)
    assert.closeTo((await evalJexl('sqrt(2)')) as number, 1.4142135623730951, 0.0001)
  })

  test('cbrt returns cube root', async ({ assert }) => {
    assert.equal(await evalJexl('cbrt(0)'), 0)
    assert.equal(await evalJexl('cbrt(1)'), 1)
    assert.equal(await evalJexl('cbrt(8)'), 2)
    assert.equal(await evalJexl('cbrt(27)'), 3)
    assert.equal(await evalJexl('cbrt(-8)'), -2)
  })

  test('exp returns e^x', async ({ assert }) => {
    assert.equal(await evalJexl('exp(0)'), 1)
    assert.closeTo((await evalJexl('exp(1)')) as number, 2.718281828459045, 0.0001)
    assert.closeTo((await evalJexl('exp(2)')) as number, 7.38905609893065, 0.0001)
  })

  test('log returns natural logarithm', async ({ assert }) => {
    assert.equal(await evalJexl('log(1)'), 0)
    assert.closeTo((await evalJexl('log(2.718281828459045)')) as number, 1, 0.0001)
    assert.closeTo((await evalJexl('log(7.38905609893065)')) as number, 2, 0.0001)
  })

  test('log10 returns base-10 logarithm', async ({ assert }) => {
    assert.equal(await evalJexl('log10(1)'), 0)
    assert.equal(await evalJexl('log10(10)'), 1)
    assert.equal(await evalJexl('log10(100)'), 2)
    assert.equal(await evalJexl('log10(1000)'), 3)
  })

  test('log2 returns base-2 logarithm', async ({ assert }) => {
    assert.equal(await evalJexl('log2(1)'), 0)
    assert.equal(await evalJexl('log2(2)'), 1)
    assert.equal(await evalJexl('log2(4)'), 2)
    assert.equal(await evalJexl('log2(8)'), 3)
  })

  test('pow returns base^exponent', async ({ assert }) => {
    assert.equal(await evalJexl('pow(2, 0)'), 1)
    assert.equal(await evalJexl('pow(2, 1)'), 2)
    assert.equal(await evalJexl('pow(2, 3)'), 8)
    assert.equal(await evalJexl('pow(3, 2)'), 9)
    assert.equal(await evalJexl('pow(5, (-1))'), 0.2)
  })
})

test.group('Math - Statistical Functions', () => {
  test('sum calculates sum of numbers', async ({ assert }) => {
    assert.equal(await evalJexl('sum(1, 2, 3)'), 6)
    assert.equal(await evalJexl('sum(0)'), 0)
    assert.equal(await evalJexl('sum(-1, -2, -3)'), -6)
    assert.equal(await evalJexl('sum(1.5, 2.5)'), 4)
  })

  test('sum works with arrays', async ({ assert }) => {
    // Test with array variables
    assert.equal(await evalJexl('sum(arr)', { arr: [1, 2, 3] }), 6)
    assert.equal(await evalJexl('sum(arr)', { arr: [] }), 0)
    assert.equal(await evalJexl('sum(arr)', { arr: [-1, -2, -3] }), -6)
    assert.equal(await evalJexl('sum(arr)', { arr: [1.5, 2.5] }), 4)
  })

  test('avg calculates average of numbers', async ({ assert }) => {
    assert.equal(await evalJexl('avg(1, 2, 3)'), 2)
    assert.equal(await evalJexl('avg(0)'), 0)
    assert.equal(await evalJexl('avg(-1, -2, -3)'), -2)
    assert.equal(await evalJexl('avg(1, 3)'), 2)
  })

  test('avg works with arrays', async ({ assert }) => {
    assert.equal(await evalJexl('avg(arr)', { arr: [1, 2, 3] }), 2)
    assert.equal(await evalJexl('avg(arr)', { arr: [] }), 0)
    assert.equal(await evalJexl('avg(arr)', { arr: [-1, -2, -3] }), -2)
    assert.equal(await evalJexl('avg(arr)', { arr: [1, 3] }), 2)
  })

  test('median finds middle value', async ({ assert }) => {
    assert.equal(await evalJexl('median(1, 2, 3)'), 2)
    assert.equal(await evalJexl('median(1, 2, 3, 4)'), 2.5)
    assert.equal(await evalJexl('median(3, 1, 2)'), 2)
    assert.equal(await evalJexl('median(5)'), 5)
    assert.equal(await evalJexl('median()'), 0)
  })

  test('median works with arrays', async ({ assert }) => {
    assert.equal(await evalJexl('median(arr)', { arr: [1, 2, 3] }), 2)
    assert.equal(await evalJexl('median(arr)', { arr: [1, 2, 3, 4] }), 2.5)
    assert.equal(await evalJexl('median(arr)', { arr: [3, 1, 2] }), 2)
    assert.equal(await evalJexl('median(arr)', { arr: [5] }), 5)
    assert.equal(await evalJexl('median(arr)', { arr: [] }), 0)
  })

  test('mode finds most frequent value', async ({ assert }) => {
    assert.equal(await evalJexl('mode(1, 2, 2, 3)'), 2)
    assert.equal(await evalJexl('mode(1, 1, 2, 3, 3, 3)'), 3)
    assert.equal(await evalJexl('mode(5)'), 5)
    assert.equal(await evalJexl('mode(1, 2, 3)'), 1) // First value when no clear mode
  })

  test('mode works with arrays', async ({ assert }) => {
    assert.equal(await evalJexl('mode(arr)', { arr: [1, 2, 2, 3] }), 2)
    assert.equal(await evalJexl('mode(arr)', { arr: [1, 1, 2, 3, 3, 3] }), 3)
    assert.equal(await evalJexl('mode(arr)', { arr: [5] }), 5)
    assert.equal(await evalJexl('mode(arr)', { arr: [] }), 0)
  })

  test('variance calculates variance', async ({ assert }) => {
    assert.closeTo((await evalJexl('variance(1, 2, 3)')) as number, 2 / 3, 0.0001)
    assert.equal(await evalJexl('variance(1, 1, 1)'), 0)
    assert.equal(await evalJexl('variance(0, 2)'), 1)
    assert.equal(await evalJexl('variance()'), 0)
  })

  test('variance works with arrays', async ({ assert }) => {
    assert.closeTo((await evalJexl('variance(arr)', { arr: [1, 2, 3] })) as number, 2 / 3, 0.0001)
    assert.equal(await evalJexl('variance(arr)', { arr: [1, 1, 1] }), 0)
    assert.equal(await evalJexl('variance(arr)', { arr: [0, 2] }), 1)
    assert.equal(await evalJexl('variance(arr)', { arr: [] }), 0)
  })

  test('stddev calculates standard deviation', async ({ assert }) => {
    assert.closeTo((await evalJexl('stddev(1, 2, 3)')) as number, Math.sqrt(2 / 3), 0.0001)
    assert.equal(await evalJexl('stddev(1, 1, 1)'), 0)
    assert.equal(await evalJexl('stddev(0, 2)'), 1)
    assert.equal(await evalJexl('stddev()'), 0)
  })

  test('stddev works with arrays', async ({ assert }) => {
    assert.closeTo((await evalJexl('stddev(arr)', { arr: [1, 2, 3] })) as number, Math.sqrt(2 / 3), 0.0001)
    assert.equal(await evalJexl('stddev(arr)', { arr: [1, 1, 1] }), 0)
    assert.equal(await evalJexl('stddev(arr)', { arr: [0, 2] }), 1)
    assert.equal(await evalJexl('stddev(arr)', { arr: [] }), 0)
  })
})

test.group('Math - Utility Functions', () => {
  test('clamp constrains value between min and max', async ({ assert }) => {
    assert.equal(await evalJexl('clamp(5, 0, 10)'), 5)
    assert.equal(await evalJexl('clamp(-5, 0, 10)'), 0)
    assert.equal(await evalJexl('clamp(15, 0, 10)'), 10)
    assert.equal(await evalJexl('clamp(5, 5, 5)'), 5)
  })

  test('lerp interpolates between values', async ({ assert }) => {
    assert.equal(await evalJexl('lerp(0, 10, 0)'), 0)
    assert.equal(await evalJexl('lerp(0, 10, 1)'), 10)
    assert.equal(await evalJexl('lerp(0, 10, 0.5)'), 5)
    assert.equal(await evalJexl('lerp(10, 20, 0.3)'), 13)
  })

  test('roundTo rounds to specified decimal places', async ({ assert }) => {
    assert.equal(await evalJexl('roundTo(3.14159, 2)'), 3.14)
    assert.equal(await evalJexl('roundTo(3.14159, 0)'), 3)
    assert.equal(await evalJexl('roundTo(3.14159, 4)'), 3.1416)
    assert.equal(await evalJexl('roundTo(1234.5678, (-2))'), 1200)
  })
})

test.group('Math - Number Theory Functions', () => {
  test('gcd calculates greatest common divisor', async ({ assert }) => {
    assert.equal(await evalJexl('gcd(12, 8)'), 4)
    assert.equal(await evalJexl('gcd(48, 18)'), 6)
    assert.equal(await evalJexl('gcd(17, 13)'), 1)
    assert.equal(await evalJexl('gcd(0, 5)'), 5)
    assert.equal(await evalJexl('gcd(5, 0)'), 5)
    assert.equal(await evalJexl('gcd(-12, 8)'), 4)
  })

  test('lcm calculates least common multiple', async ({ assert }) => {
    assert.equal(await evalJexl('lcm(12, 8)'), 24)
    assert.equal(await evalJexl('lcm(4, 6)'), 12)
    assert.equal(await evalJexl('lcm(17, 13)'), 221)
    assert.equal(await evalJexl('lcm(0, 5)'), 0)
    assert.equal(await evalJexl('lcm(5, 0)'), 0)
  })

  test('factorial calculates factorial', async ({ assert }) => {
    assert.equal(await evalJexl('factorial(0)'), 1)
    assert.equal(await evalJexl('factorial(1)'), 1)
    assert.equal(await evalJexl('factorial(2)'), 2)
    assert.equal(await evalJexl('factorial(3)'), 6)
    assert.equal(await evalJexl('factorial(4)'), 24)
    assert.equal(await evalJexl('factorial(5)'), 120)
    assert.isTrue(Number.isNaN((await evalJexl('factorial(-1)')) as number))
  })

  test('factorial handles decimals by flooring', async ({ assert }) => {
    assert.equal(await evalJexl('factorial(3.7)'), 6)
    assert.equal(await evalJexl('factorial(5.2)'), 120)
  })

  test('isPrime checks if number is prime', async ({ assert }) => {
    assert.isFalse((await evalJexl('isPrime(0)')) as boolean)
    assert.isFalse((await evalJexl('isPrime(1)')) as boolean)
    assert.isTrue((await evalJexl('isPrime(2)')) as boolean)
    assert.isTrue((await evalJexl('isPrime(3)')) as boolean)
    assert.isFalse((await evalJexl('isPrime(4)')) as boolean)
    assert.isTrue((await evalJexl('isPrime(5)')) as boolean)
    assert.isFalse((await evalJexl('isPrime(6)')) as boolean)
    assert.isTrue((await evalJexl('isPrime(7)')) as boolean)
    assert.isFalse((await evalJexl('isPrime(8)')) as boolean)
    assert.isFalse((await evalJexl('isPrime(9)')) as boolean)
    assert.isFalse((await evalJexl('isPrime(10)')) as boolean)
    assert.isTrue((await evalJexl('isPrime(11)')) as boolean)
    assert.isTrue((await evalJexl('isPrime(13)')) as boolean)
    assert.isTrue((await evalJexl('isPrime(17)')) as boolean)
    assert.isTrue((await evalJexl('isPrime(19)')) as boolean)
    assert.isFalse((await evalJexl('isPrime(21)')) as boolean)
  })

  test('isPrime handles large primes', async ({ assert }) => {
    assert.isTrue((await evalJexl('isPrime(97)')) as boolean)
    assert.isTrue((await evalJexl('isPrime(101)')) as boolean)
    assert.isFalse((await evalJexl('isPrime(99)')) as boolean)
    assert.isFalse((await evalJexl('isPrime(100)')) as boolean)
  })

  test('isPrime handles negative numbers', async ({ assert }) => {
    assert.isFalse((await evalJexl('isPrime(-2)')) as boolean)
    assert.isFalse((await evalJexl('isPrime(-3)')) as boolean)
    assert.isFalse((await evalJexl('isPrime(-5)')) as boolean)
  })

  test('isPrime handles decimals by flooring', async ({ assert }) => {
    assert.isTrue((await evalJexl('isPrime(7.9)')) as boolean)
    assert.isFalse((await evalJexl('isPrime(8.1)')) as boolean)
  })
})

test.group('Math - Edge Cases and Special Values', () => {
  test('functions handle NaN correctly', async ({ assert }) => {
    const nan = NaN
    assert.isTrue(Number.isNaN((await evalJexl('abs(nan)', { nan })) as number))
    assert.isTrue(Number.isNaN((await evalJexl('ceil(nan)', { nan })) as number))
    assert.isTrue(Number.isNaN((await evalJexl('floor(nan)', { nan })) as number))
    assert.isTrue(Number.isNaN((await evalJexl('round(nan)', { nan })) as number))
    assert.isTrue(Number.isNaN((await evalJexl('sqrt(nan)', { nan })) as number))
  })

  test('functions handle Infinity correctly', async ({ assert }) => {
    const inf = Infinity
    const negInf = -Infinity
    assert.equal(await evalJexl('abs(inf)', { inf }), Infinity)
    assert.equal(await evalJexl('abs(negInf)', { negInf }), Infinity)
    assert.equal(await evalJexl('ceil(inf)', { inf }), Infinity)
    assert.equal(await evalJexl('floor(inf)', { inf }), Infinity)
    assert.equal(await evalJexl('sign(inf)', { inf }), 1)
    assert.equal(await evalJexl('sign(negInf)', { negInf }), -1)
  })

  test('sqrt handles negative numbers', async ({ assert }) => {
    assert.isTrue(Number.isNaN((await evalJexl('sqrt(-1)')) as number))
    assert.isTrue(Number.isNaN((await evalJexl('sqrt(-4)')) as number))
  })

  test('log handles edge cases', async ({ assert }) => {
    assert.isTrue(Number.isNaN((await evalJexl('log(-1)')) as number))
    assert.equal(await evalJexl('log(0)'), -Infinity)
    assert.equal(await evalJexl('log(1)'), 0)
  })

  test('statistical functions handle empty input', async ({ assert }) => {
    assert.equal(await evalJexl('sum()'), 0)
    assert.equal(await evalJexl('avg()'), 0)
    assert.equal(await evalJexl('median()'), 0)
    assert.equal(await evalJexl('mode()'), 0)
    assert.equal(await evalJexl('variance()'), 0)
    assert.equal(await evalJexl('stddev()'), 0)
  })

  test('gcd handles zero inputs', async ({ assert }) => {
    assert.equal(await evalJexl('gcd(0, 0)'), 0)
    assert.equal(await evalJexl('gcd(0, 5)'), 5)
    assert.equal(await evalJexl('gcd(5, 0)'), 5)
  })

  test('lcm handles zero inputs', async ({ assert }) => {
    assert.equal(await evalJexl('lcm(0, 0)'), 0)
    assert.equal(await evalJexl('lcm(0, 5)'), 0)
    assert.equal(await evalJexl('lcm(5, 0)'), 0)
  })
})

test.group('Math - Complex Calculations', () => {
  test('complex statistical calculation', async ({ assert }) => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    assert.equal(await evalJexl('sum(data)', { data }), 55)
    assert.equal(await evalJexl('avg(data)', { data }), 5.5)
    assert.equal(await evalJexl('median(data)', { data }), 5.5)
    assert.closeTo((await evalJexl('stddev(data)', { data })) as number, 2.8722813232690143, 0.0001)
  })

  test('trigonometric identity verification', async ({ assert }) => {
    const angle = 3.14159265359 / 3 // 60 degrees
    const result = await evalJexl('sin(angle) * sin(angle) + cos(angle) * cos(angle)', { angle })

    // sin²(x) + cos²(x) = 1
    assert.closeTo(result as number, 1, 0.0001)
  })

  test('exponential and logarithmic inverse relationship', async ({ assert }) => {
    const value = 5
    assert.closeTo((await evalJexl('exp(log(value))', { value })) as number, value, 0.0001)
    assert.closeTo((await evalJexl('log(exp(value))', { value })) as number, value, 0.0001)
  })

  test('power and root inverse relationship', async ({ assert }) => {
    const base = 3
    const exponent = 4
    const result = await evalJexl('pow(base, exponent)', { base, exponent })
    assert.closeTo((await evalJexl('pow(result, 1 / exponent)', { result, exponent })) as number, base, 0.0001)
  })

  test('complex math expressions', async ({ assert }) => {
    // Test complex mathematical expressions
    assert.closeTo((await evalJexl('sqrt(pow(3, 2) + pow(4, 2))')) as number, 5, 0.0001)
    assert.equal(await evalJexl('gcd(lcm(12, 8), 16)'), 8)
    assert.closeTo((await evalJexl('sin(toRadians(30))')) as number, 0.5, 0.0001)
    assert.closeTo((await evalJexl('roundTo(3.14159 * pow(2, 2), 2)')) as number, 12.57, 0.0001)
  })

  test('nested function calls', async ({ assert }) => {
    // Test nested function calls
    assert.equal(await evalJexl('abs(floor(-3.7))'), 4)
    assert.equal(await evalJexl('ceil(sqrt(16))'), 4)
    assert.equal(await evalJexl('factorial(abs(-5))'), 120)
    assert.closeTo((await evalJexl('log(exp(sqrt(4)))')) as number, 2, 0.0001)
  })
})
