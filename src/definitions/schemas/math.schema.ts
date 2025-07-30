/**
 * Math function schemas using JSON Schema
 */

import { createParameter, createFunctionSchema, createLibrarySchema } from './utils.js'

// Create math function schemas using the helper utilities
export const mathFunctionSchemas = {
  ABS: createFunctionSchema(
    'ABS',
    'Returns the absolute value of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number to get the absolute value of' })],
    { type: 'number', description: 'The absolute value' },
    {
      examples: ['ABS(-5) // 5', 'ABS(3.14) // 3.14', 'ABS(0) // 0'],
    }
  ),

  CEIL: createFunctionSchema(
    'CEIL',
    'Returns the smallest integer greater than or equal to a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number to ceil' })],
    { type: 'number', description: 'The ceiling value' },
    {
      examples: ['ceil(4.2) // 5', 'ceil(-4.7) // -4', 'ceil(0) // 0'],
    }
  ),

  FLOOR: createFunctionSchema(
    'FLOOR',
    'Returns the largest integer less than or equal to a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number to floor' })],
    { type: 'number', description: 'The floor value' },
    {
      examples: ['FLOOR(4.7) // 4', 'FLOOR(-4.2) // -5', 'FLOOR(0) // 0'],
    }
  ),

  ROUND: createFunctionSchema(
    'ROUND',
    'Returns the value of a number rounded to the nearest integer',
    'math',
    [createParameter('x', { type: 'number', description: 'The number to round' })],
    { type: 'number', description: 'The rounded value' },
    {
      examples: ['ROUND(4.7) // 5', 'ROUND(4.2) // 4', 'ROUND(-4.5) // -4'],
    }
  ),

  RANDOM: createFunctionSchema(
    'RANDOM',
    'Returns a random number between 0 (inclusive) and 1 (exclusive)',
    'math',
    [],
    { type: 'number', description: 'A random number between 0 and 1' },
    {
      examples: ['RANDOM() // 0.123456789', 'RANDOM() // 0.987654321'],
    }
  ),

  MAX: createFunctionSchema(
    'MAX',
    'Returns the largest of the given numbers',
    'math',
    [createParameter('values', { type: 'number', description: 'The numbers to compare' }, true, { variadic: true })],
    { type: 'number', description: 'The maximum value' },
    {
      examples: ['MAX(1, 2, 3) // 3', 'MAX(-1, -2, -3) // -1', 'MAX(5) // 5'],
    }
  ),

  MIN: createFunctionSchema(
    'MIN',
    'Returns the smallest of the given numbers',
    'math',
    [createParameter('values', { type: 'number', description: 'The numbers to compare' }, true, { variadic: true })],
    { type: 'number', description: 'The minimum value' },
    {
      examples: ['MIN(1, 2, 3) // 1', 'MIN(-1, -2, -3) // -3', 'MIN(5) // 5'],
    }
  ),

  SIN: createFunctionSchema(
    'SIN',
    'Returns the sine of a number (in radians)',
    'math',
    [createParameter('x', { type: 'number', description: 'The angle in radians' })],
    { type: 'number', description: 'The sine value' },
    {
      examples: ['SIN(0) // 0', 'SIN(Math.PI / 2) // 1', 'SIN(Math.PI) // 0'],
    }
  ),

  COS: createFunctionSchema(
    'COS',
    'Returns the cosine of a number (in radians)',
    'math',
    [createParameter('x', { type: 'number', description: 'The angle in radians' })],
    { type: 'number', description: 'The cosine value' },
    {
      examples: ['COS(0) // 1', 'COS(Math.PI / 2) // 0', 'COS(Math.PI) // -1'],
    }
  ),

  TAN: createFunctionSchema(
    'TAN',
    'Returns the tangent of a number (in radians)',
    'math',
    [createParameter('x', { type: 'number', description: 'The angle in radians' })],
    { type: 'number', description: 'The tangent value' },
    {
      examples: ['TAN(0) // 0', 'TAN(Math.PI / 4) // 1'],
    }
  ),

  ASIN: createFunctionSchema(
    'ASIN',
    'Returns the arcsine of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number (-1 to 1)' })],
    { type: 'number', description: 'The arcsine in radians' },
    {
      examples: ['ASIN(0) // 0', 'ASIN(1) // Math.PI / 2', 'ASIN(-1) // -Math.PI / 2'],
    }
  ),

  ACOS: createFunctionSchema(
    'ACOS',
    'Returns the arccosine of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number (-1 to 1)' })],
    { type: 'number', description: 'The arccosine in radians' },
    {
      examples: ['ACOS(1) // 0', 'ACOS(0) // Math.PI / 2', 'ACOS(-1) // Math.PI'],
    }
  ),

  ATAN: createFunctionSchema(
    'ATAN',
    'Returns the arctangent of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number' })],
    { type: 'number', description: 'The arctangent in radians' },
    {
      examples: ['ATAN(0) // 0', 'ATAN(1) // Math.PI / 4', 'ATAN(-1) // -Math.PI / 4'],
    }
  ),

  ATAN2: createFunctionSchema(
    'ATAN2',
    'Returns the arctangent of the quotient of its arguments',
    'math',
    [
      createParameter('y', { type: 'number', description: 'The y coordinate' }),
      createParameter('x', { type: 'number', description: 'The x coordinate' }),
    ],
    { type: 'number', description: 'The arctangent in radians' },
    {
      examples: ['ATAN2(1, 1) // Math.PI / 4', 'ATAN2(1, 0) // Math.PI / 2'],
    }
  ),

  SQRT: createFunctionSchema(
    'SQRT',
    'Returns the square root of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number to get the square root of' })],
    { type: 'number', description: 'The square root' },
    {
      examples: ['SQRT(9) // 3', 'SQRT(16) // 4', 'SQRT(2) // 1.4142135623730951'],
    }
  ),

  CBRT: createFunctionSchema(
    'CBRT',
    'Returns the cube root of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number to get the cube root of' })],
    { type: 'number', description: 'The cube root' },
    {
      examples: ['CBRT(8) // 2', 'CBRT(27) // 3', 'CBRT(-8) // -2'],
    }
  ),

  EXP: createFunctionSchema(
    'EXP',
    'Returns e raised to the power of x',
    'math',
    [createParameter('x', { type: 'number', description: 'The exponent' })],
    { type: 'number', description: 'e raised to the power of x' },
    {
      examples: ['EXP(0) // 1', 'EXP(1) // 2.718281828459045', 'EXP(2) // 7.38905609893065'],
    }
  ),

  LOG: createFunctionSchema(
    'LOG',
    'Returns the natural logarithm of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number' })],
    { type: 'number', description: 'The natural logarithm' },
    {
      examples: ['LOG(1) // 0', 'LOG(Math.E) // 1', 'LOG(10) // 2.302585092994046'],
    }
  ),

  LOG10: createFunctionSchema(
    'LOG10',
    'Returns the base-10 logarithm of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number' })],
    { type: 'number', description: 'The base-10 logarithm' },
    {
      examples: ['LOG10(10) // 1', 'LOG10(100) // 2', 'LOG10(1000) // 3'],
    }
  ),

  LOG2: createFunctionSchema(
    'LOG2',
    'Returns the base-2 logarithm of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number' })],
    { type: 'number', description: 'The base-2 logarithm' },
    {
      examples: ['LOG2(2) // 1', 'LOG2(8) // 3', 'LOG2(1024) // 10'],
    }
  ),

  POW: createFunctionSchema(
    'POW',
    'Returns the base raised to the power of the exponent',
    'math',
    [
      createParameter('base', { type: 'number', description: 'The base number' }),
      createParameter('exponent', { type: 'number', description: 'The exponent' }),
    ],
    { type: 'number', description: 'The result of base raised to the power of exponent' },
    {
      examples: ['POW(2, 3) // 8', 'POW(4, 0.5) // 2', 'POW(10, 2) // 100'],
    }
  ),

  SIGN: createFunctionSchema(
    'SIGN',
    'Returns the sign of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number' })],
    { type: 'number', description: '1 if positive, -1 if negative, 0 if zero' },
    {
      examples: ['SIGN(5) // 1', 'SIGN(-5) // -1', 'SIGN(0) // 0'],
    }
  ),

  TRUNC: createFunctionSchema(
    'TRUNC',
    'Returns the integer part of a number by removing fractional digits',
    'math',
    [createParameter('x', { type: 'number', description: 'The number to truncate' })],
    { type: 'number', description: 'The integer part of the number' },
    {
      examples: ['TRUNC(4.9) // 4', 'TRUNC(-4.9) // -4', 'TRUNC(0.123) // 0'],
    }
  ),

  SUM: createFunctionSchema(
    'SUM',
    'Returns the sum of all arguments',
    'math',
    [createParameter('values', { type: 'number', description: 'The numbers to sum' }, true, { variadic: true })],
    { type: 'number', description: 'The sum of all values' },
    {
      examples: ['SUM(1, 2, 3) // 6', 'SUM(10, 20) // 30', 'SUM(1.5, 2.5, 3) // 7'],
    }
  ),

  AVG: createFunctionSchema(
    'AVG',
    'Returns the average of all arguments',
    'math',
    [createParameter('values', { type: 'number', description: 'The numbers to average' }, true, { variadic: true })],
    { type: 'number', description: 'The average of all values' },
    {
      examples: ['AVG(1, 2, 3) // 2', 'AVG(10, 20) // 15', 'AVG(1, 2, 3, 4, 5) // 3'],
    }
  ),

  MEDIAN: createFunctionSchema(
    'MEDIAN',
    'Returns the median of all arguments',
    'math',
    [
      createParameter('values', { type: 'number', description: 'The numbers to find the median of' }, true, {
        variadic: true,
      }),
    ],
    { type: 'number', description: 'The median value' },
    {
      examples: ['MEDIAN(1, 2, 3) // 2', 'MEDIAN(1, 2, 3, 4) // 2.5', 'MEDIAN(5, 1, 3) // 3'],
    }
  ),

  MODE: createFunctionSchema(
    'MODE',
    'Returns the mode (most frequent value) of all arguments',
    'math',
    [
      createParameter('values', { type: 'number', description: 'The numbers to find the mode of' }, true, {
        variadic: true,
      }),
    ],
    { type: 'number', description: 'The mode value' },
    {
      examples: ['MODE(1, 2, 2, 3) // 2', 'MODE(1, 1, 2, 3) // 1', 'MODE(1, 2, 3) // 1 (first occurrence)'],
    }
  ),

  VARIANCE: createFunctionSchema(
    'VARIANCE',
    'Returns the variance of all arguments',
    'math',
    [
      createParameter('values', { type: 'number', description: 'The numbers to calculate variance of' }, true, {
        variadic: true,
      }),
    ],
    { type: 'number', description: 'The variance of the numbers' },
    {
      examples: ['VARIANCE(1, 2, 3) // 0.6666666666666666', 'VARIANCE(1, 1, 1) // 0', 'VARIANCE(1, 2, 3, 4) // 1.25'],
    }
  ),

  STDDEV: createFunctionSchema(
    'STDDEV',
    'Returns the standard deviation of all arguments',
    'math',
    [
      createParameter(
        'values',
        { type: 'number', description: 'The numbers to calculate standard deviation of' },
        true,
        {
          variadic: true,
        }
      ),
    ],
    { type: 'number', description: 'The standard deviation of the numbers' },
    {
      examples: [
        'STDDEV(1, 2, 3) // 0.816496580927726',
        'STDDEV(1, 1, 1) // 0',
        'STDDEV(1, 2, 3, 4) // 1.118033988749895',
      ],
    }
  ),

  CLAMP: createFunctionSchema(
    'CLAMP',
    'Clamps a number between a minimum and maximum value',
    'math',
    [
      createParameter('value', { type: 'number', description: 'The value to clamp' }),
      createParameter('min', { type: 'number', description: 'The minimum value' }),
      createParameter('max', { type: 'number', description: 'The maximum value' }),
    ],
    { type: 'number', description: 'The clamped value' },
    {
      examples: ['CLAMP(5, 0, 10) // 5', 'CLAMP(-5, 0, 10) // 0', 'CLAMP(15, 0, 10) // 10'],
    }
  ),

  LERP: createFunctionSchema(
    'LERP',
    'Linear interpolation between two values',
    'math',
    [
      createParameter('start', { type: 'number', description: 'The start value' }),
      createParameter('end', { type: 'number', description: 'The end value' }),
      createParameter('t', { type: 'number', description: 'The interpolation factor (0-1)' }),
    ],
    { type: 'number', description: 'The interpolated value' },
    {
      examples: ['LERP(0, 10, 0.5) // 5', 'LERP(10, 20, 0.25) // 12.5', 'LERP(-10, 10, 0.8) // 6'],
    }
  ),

  TO_DEGREES: createFunctionSchema(
    'TO_DEGREES',
    'Converts radians to degrees',
    'math',
    [createParameter('radians', { type: 'number', description: 'The angle in radians' })],
    { type: 'number', description: 'The angle in degrees' },
    {
      examples: ['TO_DEGREES(Math.PI) // 180', 'TO_DEGREES(Math.PI / 2) // 90', 'TO_DEGREES(0) // 0'],
    }
  ),

  TO_RADIANS: createFunctionSchema(
    'TO_RADIANS',
    'Converts degrees to radians',
    'math',
    [createParameter('degrees', { type: 'number', description: 'The angle in degrees' })],
    { type: 'number', description: 'The angle in radians' },
    {
      examples: ['TO_RADIANS(180) // Math.PI', 'TO_RADIANS(90) // Math.PI / 2', 'TO_RADIANS(0) // 0'],
    }
  ),

  GCD: createFunctionSchema(
    'GCD',
    'Calculates the greatest common divisor of two numbers',
    'math',
    [
      createParameter('a', { type: 'number', description: 'First number' }),
      createParameter('b', { type: 'number', description: 'Second number' }),
    ],
    { type: 'number', description: 'The greatest common divisor' },
    {
      examples: ['GCD(48, 18) // 6', 'GCD(56, 98) // 14', 'GCD(101, 10) // 1'],
    }
  ),

  LCM: createFunctionSchema(
    'LCM',
    'Calculates the least common multiple of two numbers',
    'math',
    [
      createParameter('a', { type: 'number', description: 'First number' }),
      createParameter('b', { type: 'number', description: 'Second number' }),
    ],
    { type: 'number', description: 'The least common multiple' },
    {
      examples: ['LCM(4, 6) // 12', 'LCM(15, 20) // 60', 'LCM(7, 5) // 35'],
    }
  ),

  FACTORIAL: createFunctionSchema(
    'FACTORIAL',
    'Calculates the factorial of a number',
    'math',
    [createParameter('n', { type: 'number', description: 'The number to calculate factorial of' })],
    { type: 'number', description: 'The factorial of the number' },
    {
      examples: ['FACTORIAL(5) // 120', 'FACTORIAL(0) // 1', 'FACTORIAL(1) // 1', 'FACTORIAL(10) // 3628800'],
    }
  ),

  IS_PRIME: createFunctionSchema(
    'IS_PRIME',
    'Checks if a number is prime',
    'math',
    [createParameter('n', { type: 'number', description: 'The number to check' })],
    { type: 'boolean', description: 'True if the number is prime, false otherwise' },
    {
      examples: ['IS_PRIME(5) // true', 'IS_PRIME(4) // false', 'IS_PRIME(1) // false'],
    }
  ),

  ROUND_TO: createFunctionSchema(
    'ROUND_TO',
    'Rounds a number to a specified number of decimal places',
    'math',
    [
      createParameter('value', { type: 'number', description: 'The number to round' }),
      createParameter('decimals', { type: 'number', description: 'The number of decimal places' }),
    ],
    { type: 'number', description: 'The rounded number' },
    {
      examples: ['ROUND_TO(3.14159, 2) // 3.14', 'ROUND_TO(2.71828, 3) // 2.718', 'ROUND_TO(1.23456, 0) // 1'],
    }
  ),
}

// Create the library schema
export const mathLibrarySchema = createLibrarySchema(mathFunctionSchemas, {
  category: 'math',
  title: 'Jexl Math Functions',
  description: 'Mathematical functions and utilities for Jexl expressions',
  version: '1.0.0',
})

// Export utility functions for easy access
export const getMathFunction = (name: string) => mathLibrarySchema.functions[name]
export const getMathFunctionNames = () => Object.keys(mathLibrarySchema.functions)
export const getMathFunctionCount = () => Object.keys(mathLibrarySchema.functions).length

// Export for integration with editors/tools
export { mathLibrarySchema as schema }
export default mathLibrarySchema
