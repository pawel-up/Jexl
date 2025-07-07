/**
 * Math function schemas using JSON Schema
 */

import { createParameter, createFunctionSchema, createLibrarySchema } from './utils.js'

// Create math function schemas using the helper utilities
export const mathFunctionSchemas = {
  abs: createFunctionSchema(
    'abs',
    'Returns the absolute value of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number to get the absolute value of' })],
    { type: 'number', description: 'The absolute value' },
    {
      examples: ['abs(-5) // 5', 'abs(3.14) // 3.14', 'abs(0) // 0'],
    }
  ),

  ceil: createFunctionSchema(
    'ceil',
    'Returns the smallest integer greater than or equal to a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number to ceil' })],
    { type: 'number', description: 'The ceiling value' },
    {
      examples: ['ceil(4.2) // 5', 'ceil(-4.7) // -4', 'ceil(0) // 0'],
    }
  ),

  floor: createFunctionSchema(
    'floor',
    'Returns the largest integer less than or equal to a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number to floor' })],
    { type: 'number', description: 'The floor value' },
    {
      examples: ['floor(4.7) // 4', 'floor(-4.2) // -5', 'floor(0) // 0'],
    }
  ),

  round: createFunctionSchema(
    'round',
    'Returns the value of a number rounded to the nearest integer',
    'math',
    [createParameter('x', { type: 'number', description: 'The number to round' })],
    { type: 'number', description: 'The rounded value' },
    {
      examples: ['round(4.7) // 5', 'round(4.2) // 4', 'round(-4.5) // -4'],
    }
  ),

  random: createFunctionSchema(
    'random',
    'Returns a random number between 0 (inclusive) and 1 (exclusive)',
    'math',
    [],
    { type: 'number', description: 'A random number between 0 and 1' },
    {
      examples: ['random() // 0.123456789', 'random() // 0.987654321'],
    }
  ),

  max: createFunctionSchema(
    'max',
    'Returns the largest of the given numbers',
    'math',
    [createParameter('values', { type: 'number', description: 'The numbers to compare' }, true, { variadic: true })],
    { type: 'number', description: 'The maximum value' },
    {
      examples: ['max(1, 2, 3) // 3', 'max(-1, -2, -3) // -1', 'max(5) // 5'],
    }
  ),

  min: createFunctionSchema(
    'min',
    'Returns the smallest of the given numbers',
    'math',
    [createParameter('values', { type: 'number', description: 'The numbers to compare' }, true, { variadic: true })],
    { type: 'number', description: 'The minimum value' },
    {
      examples: ['min(1, 2, 3) // 1', 'min(-1, -2, -3) // -3', 'min(5) // 5'],
    }
  ),

  sin: createFunctionSchema(
    'sin',
    'Returns the sine of a number (in radians)',
    'math',
    [createParameter('x', { type: 'number', description: 'The angle in radians' })],
    { type: 'number', description: 'The sine value' },
    {
      examples: ['sin(0) // 0', 'sin(Math.PI / 2) // 1', 'sin(Math.PI) // 0'],
    }
  ),

  cos: createFunctionSchema(
    'cos',
    'Returns the cosine of a number (in radians)',
    'math',
    [createParameter('x', { type: 'number', description: 'The angle in radians' })],
    { type: 'number', description: 'The cosine value' },
    {
      examples: ['cos(0) // 1', 'cos(Math.PI / 2) // 0', 'cos(Math.PI) // -1'],
    }
  ),

  tan: createFunctionSchema(
    'tan',
    'Returns the tangent of a number (in radians)',
    'math',
    [createParameter('x', { type: 'number', description: 'The angle in radians' })],
    { type: 'number', description: 'The tangent value' },
    {
      examples: ['tan(0) // 0', 'tan(Math.PI / 4) // 1'],
    }
  ),

  asin: createFunctionSchema(
    'asin',
    'Returns the arcsine of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number (-1 to 1)' })],
    { type: 'number', description: 'The arcsine in radians' },
    {
      examples: ['asin(0) // 0', 'asin(1) // Math.PI / 2', 'asin(-1) // -Math.PI / 2'],
    }
  ),

  acos: createFunctionSchema(
    'acos',
    'Returns the arccosine of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number (-1 to 1)' })],
    { type: 'number', description: 'The arccosine in radians' },
    {
      examples: ['acos(1) // 0', 'acos(0) // Math.PI / 2', 'acos(-1) // Math.PI'],
    }
  ),

  atan: createFunctionSchema(
    'atan',
    'Returns the arctangent of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number' })],
    { type: 'number', description: 'The arctangent in radians' },
    {
      examples: ['atan(0) // 0', 'atan(1) // Math.PI / 4', 'atan(-1) // -Math.PI / 4'],
    }
  ),

  atan2: createFunctionSchema(
    'atan2',
    'Returns the arctangent of the quotient of its arguments',
    'math',
    [
      createParameter('y', { type: 'number', description: 'The y coordinate' }),
      createParameter('x', { type: 'number', description: 'The x coordinate' }),
    ],
    { type: 'number', description: 'The arctangent in radians' },
    {
      examples: ['atan2(1, 1) // Math.PI / 4', 'atan2(1, 0) // Math.PI / 2'],
    }
  ),

  sqrt: createFunctionSchema(
    'sqrt',
    'Returns the square root of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number to get the square root of' })],
    { type: 'number', description: 'The square root' },
    {
      examples: ['sqrt(9) // 3', 'sqrt(16) // 4', 'sqrt(2) // 1.4142135623730951'],
    }
  ),

  pow: createFunctionSchema(
    'pow',
    'Returns the base raised to the power of the exponent',
    'math',
    [
      createParameter('base', { type: 'number', description: 'The base number' }),
      createParameter('exponent', { type: 'number', description: 'The exponent' }),
    ],
    { type: 'number', description: 'The result of base raised to the power of exponent' },
    {
      examples: ['pow(2, 3) // 8', 'pow(4, 0.5) // 2', 'pow(10, 2) // 100'],
    }
  ),

  exp: createFunctionSchema(
    'exp',
    'Returns e raised to the power of x',
    'math',
    [createParameter('x', { type: 'number', description: 'The exponent' })],
    { type: 'number', description: 'e raised to the power of x' },
    {
      examples: ['exp(0) // 1', 'exp(1) // 2.718281828459045', 'exp(2) // 7.38905609893065'],
    }
  ),

  log: createFunctionSchema(
    'log',
    'Returns the natural logarithm of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number' })],
    { type: 'number', description: 'The natural logarithm' },
    {
      examples: ['log(1) // 0', 'log(Math.E) // 1', 'log(10) // 2.302585092994046'],
    }
  ),

  log10: createFunctionSchema(
    'log10',
    'Returns the base-10 logarithm of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number' })],
    { type: 'number', description: 'The base-10 logarithm' },
    {
      examples: ['log10(10) // 1', 'log10(100) // 2', 'log10(1000) // 3'],
    }
  ),

  log2: createFunctionSchema(
    'log2',
    'Returns the base-2 logarithm of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number' })],
    { type: 'number', description: 'The base-2 logarithm' },
    {
      examples: ['log2(2) // 1', 'log2(8) // 3', 'log2(1024) // 10'],
    }
  ),

  sign: createFunctionSchema(
    'sign',
    'Returns the sign of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number' })],
    { type: 'number', description: '1 if positive, -1 if negative, 0 if zero' },
    {
      examples: ['sign(5) // 1', 'sign(-5) // -1', 'sign(0) // 0'],
    }
  ),

  trunc: createFunctionSchema(
    'trunc',
    'Returns the integer part of a number by removing fractional digits',
    'math',
    [createParameter('x', { type: 'number', description: 'The number to truncate' })],
    { type: 'number', description: 'The integer part of the number' },
    {
      examples: ['trunc(4.9) // 4', 'trunc(-4.9) // -4', 'trunc(0.123) // 0'],
    }
  ),

  cbrt: createFunctionSchema(
    'cbrt',
    'Returns the cube root of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number to get the cube root of' })],
    { type: 'number', description: 'The cube root' },
    {
      examples: ['cbrt(8) // 2', 'cbrt(27) // 3', 'cbrt(-8) // -2'],
    }
  ),

  hypot: createFunctionSchema(
    'hypot',
    'Returns the square root of the sum of squares of its arguments',
    'math',
    [
      createParameter('values', { type: 'number', description: 'The numbers to calculate the hypotenuse for' }, true, {
        variadic: true,
      }),
    ],
    { type: 'number', description: 'The hypotenuse value' },
    {
      examples: ['hypot(3, 4) // 5', 'hypot(1, 1) // 1.4142135623730951', 'hypot(3, 4, 5) // 7.0710678118654755'],
    }
  ),

  clz32: createFunctionSchema(
    'clz32',
    'Returns the number of leading zero bits in the 32-bit binary representation',
    'math',
    [createParameter('x', { type: 'number', description: 'The number' })],
    { type: 'number', description: 'The number of leading zero bits' },
    {
      examples: ['clz32(1) // 31', 'clz32(1000) // 22', 'clz32(0) // 32'],
    }
  ),

  fround: createFunctionSchema(
    'fround',
    'Returns the nearest 32-bit single precision float representation of a number',
    'math',
    [createParameter('x', { type: 'number', description: 'The number' })],
    { type: 'number', description: 'The nearest 32-bit float' },
    {
      examples: ['fround(1.5) // 1.5', 'fround(1.337) // 1.3370000123977661'],
    }
  ),

  imul: createFunctionSchema(
    'imul',
    'Returns the result of the 32-bit multiplication of the two parameters',
    'math',
    [
      createParameter('a', { type: 'number', description: 'The first number' }),
      createParameter('b', { type: 'number', description: 'The second number' }),
    ],
    { type: 'number', description: 'The result of the 32-bit multiplication' },
    {
      examples: ['imul(3, 4) // 12', 'imul(-5, 12) // -60'],
    }
  ),

  sum: createFunctionSchema(
    'sum',
    'Returns the sum of all arguments',
    'math',
    [createParameter('values', { type: 'number', description: 'The numbers to sum' }, true, { variadic: true })],
    { type: 'number', description: 'The sum of all values' },
    {
      examples: ['sum(1, 2, 3) // 6', 'sum(10, 20) // 30', 'sum(1.5, 2.5, 3) // 7'],
    }
  ),

  avg: createFunctionSchema(
    'avg',
    'Returns the average of all arguments',
    'math',
    [createParameter('values', { type: 'number', description: 'The numbers to average' }, true, { variadic: true })],
    { type: 'number', description: 'The average of all values' },
    {
      examples: ['avg(1, 2, 3) // 2', 'avg(10, 20) // 15', 'avg(1, 2, 3, 4, 5) // 3'],
    }
  ),

  median: createFunctionSchema(
    'median',
    'Returns the median of all arguments',
    'math',
    [
      createParameter('values', { type: 'number', description: 'The numbers to find the median of' }, true, {
        variadic: true,
      }),
    ],
    { type: 'number', description: 'The median value' },
    {
      examples: ['median(1, 2, 3) // 2', 'median(1, 2, 3, 4) // 2.5', 'median(5, 1, 3) // 3'],
    }
  ),

  clamp: createFunctionSchema(
    'clamp',
    'Clamps a number between a minimum and maximum value',
    'math',
    [
      createParameter('value', { type: 'number', description: 'The value to clamp' }),
      createParameter('min', { type: 'number', description: 'The minimum value' }),
      createParameter('max', { type: 'number', description: 'The maximum value' }),
    ],
    { type: 'number', description: 'The clamped value' },
    {
      examples: ['clamp(5, 0, 10) // 5', 'clamp(-5, 0, 10) // 0', 'clamp(15, 0, 10) // 10'],
    }
  ),

  lerp: createFunctionSchema(
    'lerp',
    'Linear interpolation between two values',
    'math',
    [
      createParameter('start', { type: 'number', description: 'The start value' }),
      createParameter('end', { type: 'number', description: 'The end value' }),
      createParameter('t', { type: 'number', description: 'The interpolation factor (0-1)' }),
    ],
    { type: 'number', description: 'The interpolated value' },
    {
      examples: ['lerp(0, 10, 0.5) // 5', 'lerp(10, 20, 0.25) // 12.5', 'lerp(-10, 10, 0.8) // 6'],
    }
  ),

  degrees: createFunctionSchema(
    'degrees',
    'Converts radians to degrees',
    'math',
    [createParameter('radians', { type: 'number', description: 'The angle in radians' })],
    { type: 'number', description: 'The angle in degrees' },
    {
      examples: ['degrees(Math.PI) // 180', 'degrees(Math.PI / 2) // 90', 'degrees(0) // 0'],
    }
  ),

  radians: createFunctionSchema(
    'radians',
    'Converts degrees to radians',
    'math',
    [createParameter('degrees', { type: 'number', description: 'The angle in degrees' })],
    { type: 'number', description: 'The angle in radians' },
    {
      examples: ['radians(180) // Math.PI', 'radians(90) // Math.PI / 2', 'radians(0) // 0'],
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
