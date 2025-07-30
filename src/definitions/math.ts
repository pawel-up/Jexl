/**
 * Returns the absolute value of a number.
 * @param x - The number to get the absolute value of.
 * @returns The absolute value.
 */
export const ABS = Math.abs

/**
 * Returns the smallest integer greater than or equal to a number.
 * @param x - The number to ceil.
 * @returns The ceiling value.
 */
export const CEIL = Math.ceil

/**
 * Returns the largest integer less than or equal to a number.
 * @param x - The number to floor.
 * @returns The floor value.
 */
export const FLOOR = Math.floor

/**
 * Returns the value of a number rounded to the nearest integer.
 * @param x - The number to round.
 * @returns The rounded value.
 */
export const ROUND = Math.round

/**
 * Returns a random number between 0 (inclusive) and 1 (exclusive).
 * @returns A random number.
 */
export const RANDOM = Math.random

/**
 * Returns the largest of the given numbers.
 * @param values - The numbers to compare.
 * @returns The maximum value.
 */
export const MAX = Math.max

/**
 * Returns the smallest of the given numbers.
 * @param values - The numbers to compare.
 * @returns The minimum value.
 */
export const MIN = Math.min

/**
 * Returns the sine of a number (in radians).
 * @param x - The angle in radians.
 * @returns The sine value.
 */
export const SIN = Math.sin

/**
 * Returns the cosine of a number (in radians).
 * @param x - The angle in radians.
 * @returns The cosine value.
 */
export const COS = Math.cos

/**
 * Returns the tangent of a number (in radians).
 * @param x - The angle in radians.
 * @returns The tangent value.
 */
export const TAN = Math.tan

/**
 * Returns the arcsine of a number (in radians).
 * @param x - The number between -1 and 1.
 * @returns The arcsine value in radians.
 */
export const ASIN = Math.asin

/**
 * Returns the arccosine of a number (in radians).
 * @param x - The number between -1 and 1.
 * @returns The arccosine value in radians.
 */
export const ACOS = Math.acos

/**
 * Returns the arctangent of a number (in radians).
 * @param x - The number.
 * @returns The arctangent value in radians.
 */
export const ATAN = Math.atan

/**
 * Returns the arctangent of the quotient of its arguments.
 * @param y - The y coordinate.
 * @param x - The x coordinate.
 * @returns The arctangent of y/x in radians.
 */
export const ATAN2 = Math.atan2

/**
 * Returns the square root of a number.
 * @param x - The number.
 * @returns The square root.
 */
export const SQRT = Math.sqrt

/**
 * Returns the cube root of a number.
 * @param x - The number.
 * @returns The cube root.
 */
export const CBRT = Math.cbrt

/**
 * Returns e raised to the power of a number.
 * @param x - The exponent.
 * @returns e^x.
 */
export const EXP = Math.exp

/**
 * Returns the natural logarithm of a number.
 * @param x - The number.
 * @returns The natural logarithm.
 */
export const LOG = Math.log

/**
 * Returns the base-10 logarithm of a number.
 * @param x - The number.
 * @returns The base-10 logarithm.
 */
export const LOG10 = Math.log10

/**
 * Returns the base-2 logarithm of a number.
 * @param x - The number.
 * @returns The base-2 logarithm.
 */
export const LOG2 = Math.log2

/**
 * Returns the base raised to the exponent power.
 * @param base - The base number.
 * @param exponent - The exponent.
 * @returns base^exponent.
 */
export const POW = Math.pow

/**
 * Returns the sign of a number.
 * @param x - The number.
 * @returns 1 if positive, -1 if negative, 0 if zero.
 */
export const SIGN = Math.sign

/**
 * Returns the integer part of a number by removing any fractional digits.
 * @param x - The number.
 * @returns The integer part.
 */
export const TRUNC = Math.trunc

/**
 * Sums all provided numbers.
 * It also works on arrays. When the first argument is an array,
 * it will sum the elements of that array.
 * @param args - Numbers to sum.
 * @returns The sum of the numbers.
 */
export const SUM = (...args: number[]) => {
  if (Array.isArray(args[0])) {
    return (args[0] as number[]).reduce((a, b) => a + b, 0)
  }
  return args.reduce((a, b) => a + b, 0)
}

/**
 * Calculates the average of all provided numbers.
 * When the first argument is an array, it will calculate the average of that array.
 * @param args - Numbers to average.
 * @returns The average of the numbers.
 */
export const AVG = (...args: number[]) => {
  if (Array.isArray(args[0])) {
    const arr = args[0] as number[]
    if (arr.length === 0) return 0
    return arr.reduce((a, b) => a + b, 0) / arr.length
  }
  if (args.length === 0) return 0
  return args.reduce((a, b) => a + b, 0) / args.length
}

/**
 * Calculates the median of all provided numbers.
 * When the first argument is an array, it will calculate the median of that array.
 * @param args - Numbers to find median of.
 * @returns The median of the numbers.
 */
export const MEDIAN = (...args: number[]) => {
  const arr = Array.isArray(args[0]) ? (args[0] as number[]) : args
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

/**
 * Finds the mode (most frequent value) of all provided numbers.
 * When the first argument is an array, it will find the mode of that array.
 * @param args - Numbers to find mode of.
 * @returns The mode of the numbers.
 */
export const MODE = (...args: number[]) => {
  const arr = Array.isArray(args[0]) ? (args[0] as number[]) : args
  if (arr.length === 0) return 0

  const frequency: Record<number, number> = {}
  let maxFreq = 0
  let modeValue = arr[0]

  for (const num of arr) {
    frequency[num] = (frequency[num] || 0) + 1
    if (frequency[num] > maxFreq) {
      maxFreq = frequency[num]
      modeValue = num
    }
  }

  return modeValue
}

/**
 * Calculates the variance of all provided numbers.
 * When the first argument is an array, it will calculate the variance of that array.
 * @param args - Numbers to calculate variance of.
 * @returns The variance of the numbers.
 */
export const VARIANCE = (...args: number[]) => {
  const arr = Array.isArray(args[0]) ? (args[0] as number[]) : args
  if (arr.length === 0) return 0
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length
  return arr.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / arr.length
}

/**
 * Calculates the standard deviation of all provided numbers.
 * When the first argument is an array, it will calculate the standard deviation of that array.
 * @param args - Numbers to calculate standard deviation of.
 * @returns The standard deviation of the numbers.
 */
export const STDDEV = (...args: number[]) => {
  const arr = Array.isArray(args[0]) ? (args[0] as number[]) : args
  return Math.sqrt(VARIANCE(...arr))
}

/**
 * Clamps a number between a minimum and maximum value.
 * @param value - The number to clamp.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns The clamped value.
 */
export const CLAMP = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

/**
 * Linear interpolation between two values.
 * @param start - The start value.
 * @param end - The end value.
 * @param t - The interpolation factor (0-1).
 * @returns The interpolated value.
 */
export const LERP = (start: number, end: number, t: number) => {
  return start + (end - start) * t
}

/**
 * Converts degrees to radians.
 * @param degrees - The angle in degrees.
 * @returns The angle in radians.
 */
export const TO_RADIANS = (degrees: number) => {
  return degrees * (Math.PI / 180)
}

/**
 * Converts radians to degrees.
 * @param radians - The angle in radians.
 * @returns The angle in degrees.
 */
export const TO_DEGREES = (radians: number) => {
  return radians * (180 / Math.PI)
}

/**
 * Calculates the greatest common divisor of two numbers.
 * @param a - First number.
 * @param b - Second number.
 * @returns The greatest common divisor.
 */
export const GCD = (a: number, b: number): number => {
  a = Math.abs(Math.floor(a))
  b = Math.abs(Math.floor(b))
  return b === 0 ? a : GCD(b, a % b)
}

/**
 * Calculates the least common multiple of two numbers.
 * @param a - First number.
 * @param b - Second number.
 * @returns The least common multiple.
 */
export const LCM = (a: number, b: number) => {
  if (a === 0 || b === 0) return 0
  return Math.abs(a * b) / GCD(a, b)
}

/**
 * Calculates the factorial of a number.
 * @param n - The number to calculate factorial of.
 * @returns The factorial of the number.
 */
export const FACTORIAL = (n: number): number => {
  n = Math.floor(n)
  if (n < 0) return NaN
  if (n === 0 || n === 1) return 1
  return n * FACTORIAL(n - 1)
}

/**
 * Checks if a number is prime.
 * @param n - The number to check.
 * @returns True if the number is prime, false otherwise.
 */
export const IS_PRIME = (n: number): boolean => {
  n = Math.floor(n)
  if (n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false

  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false
  }
  return true
}

/**
 * Rounds a number to a specified number of decimal places.
 * @param value - The number to round.
 * @param decimals - The number of decimal places.
 * @returns The rounded number.
 */
export const ROUND_TO = (value: number, decimals: number) => {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}
