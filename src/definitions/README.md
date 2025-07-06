# Jexl Extension Libraries

This directory contains modular libraries of functions and transforms that can be easily added to a Jexl instance. These libraries provide comprehensive functionality for math, string manipulation, date handling, array operations, and custom operators.

## Available Libraries

- **`math.ts`** - Mathematical functions and statistical operations
- **`string.ts`** - String manipulation and formatting functions
- **`date.ts`** - Date and time operations
- **`array.ts`** - Array manipulation and utility functions
- **`operators.ts`** - Common operators as functions for enhanced expressions

## Installation and Usage

To use a library, import it and add it to your Jexl instance via the `addFunction` method.

### Basic Setup

```typescript
import { Jexl } from '@pawel-up/jexl'
import * as math from '@pawel-up/jexl/math.js'
import * as string from '@pawel-up/jexl/string.js'
import * as date from '@pawel-up/jexl/date.js'
import * as array from '@pawel-up/jexl/array.js'
import * as operators from '@pawel-up/jexl/operators.js'

// Helper function to add all functions from a module
function addModule(jexl: Jexl, module: Record<string, Function>, prefix = '') {
  Object.keys(module).forEach((key) => {
    const functionName = prefix ? `${prefix}_${key}` : key
    jexl.addFunction(functionName, module[key])
  })
}

const jexl = new Jexl()
// Add all libraries
addModule(jexl, math)
addModule(jexl, string)
addModule(jexl, date)
addModule(jexl, array)
addModule(jexl, operators)

// Or add with prefixes to avoid naming conflicts
// addModule(jexl, math, 'math');
// addModule(jexl, string, 'str');
```

### Selective Import

You can also import only specific functions:

```typescript
import { round, avg, sum } from '@pawel-up/jexl/math'
import { capitalize, titleCase } from '@pawel-up/jexl/string'
import { now, format } from '@pawel-up/jexl/date'

const jexl = new Jexl.Jexl()

// Add only specific functions
jexl.addFunction('round', round)
jexl.addFunction('avg', avg)
jexl.addFunction('sum', sum)
jexl.addFunction('capitalize', capitalize)
jexl.addFunction('titleCase', titleCase)
jexl.addFunction('now', now)
jexl.addFunction('format', format)
```

## Library Documentation

### Math Functions (`math.ts`)

**Basic Math Operations:**

```typescript
// Basic math functions (direct Math object exports)
await jexl.eval('abs(-5)') // 5
await jexl.eval('round(3.7)') // 4
await jexl.eval('max(1, 5, 3)') // 5
await jexl.eval('sqrt(16)') // 4

// Advanced mathematical functions
await jexl.eval('sum([1, 2, 3, 4])') // 10
await jexl.eval('sum(1, 2, 3, 4)') // 10 (spread arguments)
await jexl.eval('avg([10, 20, 30])') // 20
await jexl.eval('median([1, 3, 2, 5, 4])') // 3
```

**Statistical Functions:**

```typescript
await jexl.eval('variance([1, 2, 3, 4, 5])') // 2
await jexl.eval('stddev([1, 2, 3, 4, 5])') // 1.58...
await jexl.eval('mode([1, 2, 2, 3, 2])') // 2
```

**Utility Functions:**

```typescript
await jexl.eval('clamp(15, 0, 10)') // 10
await jexl.eval('lerp(0, 100, 0.5)') // 50
await jexl.eval('toRadians(180)') // 3.14159...
await jexl.eval('factorial(5)') // 120
await jexl.eval('isPrime(17)') // true
```

### String Functions (`string.ts`)

**Basic String Operations:**

```typescript
await jexl.eval('upper("hello")') // "HELLO"
await jexl.eval('lower("WORLD")') // "world"
await jexl.eval('capitalize("hello world")') // "Hello world"
await jexl.eval('titleCase("hello world")') // "Hello World"
```

**Case Conversion:**

```typescript
await jexl.eval('camelCase("hello world")') // "helloWorld"
await jexl.eval('pascalCase("hello world")') // "HelloWorld"
await jexl.eval('snakeCase("Hello World")') // "hello_world"
await jexl.eval('kebabCase("Hello World")') // "hello-world"
```

**String Manipulation:**

```typescript
await jexl.eval('truncate("long text", 5)') // "lo..."
await jexl.eval('reverse("hello")') // "olleh"
await jexl.eval('mask("password123", "*", 2, 2)') // "pa*******23"
await jexl.eval('slug("Hello World!")') // "hello-world"
```

**String Validation:**

```typescript
await jexl.eval('startsWith("hello", "he")') // true
await jexl.eval('contains("hello world", "wor")') // true
await jexl.eval('isEmpty("")') // true
await jexl.eval('wordCount("hello world")') // 2
```

### Date Functions (`date.ts`)

Note that JavaScript dates are a mess. When creating a date object try to use UTC time zone or otherwise your calculations can be off by the difference between your system and the UTC time zone. This will be eventually fixed when the new Temporal API becomes widely available.

**Date Arithmetic:**

```typescript
await jexl.eval('addDays(now(), 7)') // Date 7 days from now
await jexl.eval('addMonths(now(), 3)') // Date 3 months from now
await jexl.eval('subtractYears(now(), 1)') // Date 1 year ago
await jexl.eval('diffDays(date1, date2)') // Difference in days
```

**Date Utilities:**

```typescript
await jexl.eval('isWeekend(now())') // true/false
await jexl.eval('startOfMonth(now())') // First day of current month
await jexl.eval('endOfYear(now())') // Last day of current year
await jexl.eval('getAge(birthDate)') // Age in years
```

### Array Functions (`array.ts`)

**Basic Array Operations:**

```typescript
await jexl.eval('length([1, 2, 3])') // 3
await jexl.eval('first([1, 2, 3])') // 1
await jexl.eval('last([1, 2, 3])') // 3
await jexl.eval('at([1, 2, 3], 1)') // 2
await jexl.eval('contains([1, 2, 3], 2)') // true
```

**Array Manipulation:**

```typescript
await jexl.eval('reverse([1, 2, 3])') // [3, 2, 1]
await jexl.eval('unique([1, 2, 2, 3])') // [1, 2, 3]
await jexl.eval('flatten([[1, 2], [3, 4]])') // [1, 2, 3, 4]
await jexl.eval('chunk([1, 2, 3, 4], 2)') // [[1, 2], [3, 4]]
```

**Set Operations:**

```typescript
await jexl.eval('concat([1, 2], [3, 4])') // [1, 2, 3, 4]
await jexl.eval('union([1, 2], [2, 3])') // [1, 2, 3]
await jexl.eval('intersection([1, 2, 3], [2, 3, 4])') // [2, 3]
await jexl.eval('difference([1, 2, 3], [2, 4])') // [1, 3]
```

**Statistical Operations:**

```typescript
await jexl.eval('sum([1, 2, 3, 4])') // 10
await jexl.eval('average([1, 2, 3, 4])') // 2.5
await jexl.eval('min([3, 1, 4, 1, 5])') // 1
await jexl.eval('max([3, 1, 4, 1, 5])') // 5
```

### Operators (`operators.ts`)

**Logical Operators:**

```typescript
await jexl.eval('and(true, false)') // false
await jexl.eval('or(true, false)') // true
await jexl.eval('not(true)') // false
await jexl.eval('xor(true, false)') // true (exclusive OR)
```

**Comparison Operators:**

```typescript
// Basic comparisons
await jexl.eval('gt(5, 3)') // true (greater than)
await jexl.eval('gte(5, 5)') // true (greater than or equal)
await jexl.eval('lt(3, 5)') // true (less than)
await jexl.eval('lte(3, 3)') // true (less than or equal)

// Equality (loose and strict)
await jexl.eval('eq("5", 5)') // true (loose equality)
await jexl.eval('strictEq("5", 5)') // false (strict equality)
await jexl.eval('ne("5", 3)') // true (not equal)
await jexl.eval('strictNe("5", 5)') // true (strict not equal)

// Range and pattern matching
await jexl.eval('between(5, 1, 10)') // true (inclusive range)
await jexl.eval('inOp(2, [1, 2, 3])') // true (in array)
await jexl.eval('inOp("ell", "hello")') // true (in string)
await jexl.eval('like("hello", "h%o")') // true (wildcard pattern)
await jexl.eval('regex("test123", "\\d+")') // true (regex match)
```

**Conditional and Null Handling:**

```typescript
// Conditional expressions
await jexl.eval('ifElse(age >= 18, "adult", "minor")')
await jexl.eval('coalesce(null, "default")') // "default"
await jexl.eval('defaultTo(null, undefined, "fallback")') // "fallback"

// Null/undefined checks
await jexl.eval('isNull(null)') // true
await jexl.eval('isNotNull("value")') // true
await jexl.eval('isEmpty("")') // true
await jexl.eval('isNotEmpty("hello")') // true
```

**Type Checking:**

```typescript
await jexl.eval('isType(42, "number")') // true
await jexl.eval('isType("hello", "string")') // true
await jexl.eval('isType([], "array")') // true
await jexl.eval('isType({}, "object")') // true
await jexl.eval('isType(null, "null")') // true
```

**Advanced Operators:**

```typescript
// Multiple comparisons
await jexl.eval('equalsAny(color, "red", "blue", "green")') // true if color matches any
await jexl.eval('notEqualsAny(status, "pending", "error")') // true if status is neither
await jexl.eval('inRange(score, [0, 50], [80, 100])') // true if score is 0-50 or 80-100

// Object utilities
await jexl.eval('hasProperty(user, "email")') // true if user has email property
await jexl.eval('safeGet(user, "profile.preferences.theme")') // safe nested access
```

## Real-World Examples

### User Profile Processing

```typescript
const userContext = {
  user: {
    firstName: 'john',
    lastName: 'doe',
    email: 'john.doe@company.com',
    birthDate: new Date('1990-05-15'),
    roles: ['user', 'contributor'],
    profile: {
      bio: 'Software developer with 5+ years of experience',
      preferences: {
        theme: 'dark',
        notifications: true,
      },
    },
  },
}

// Format user display name
await jexl.eval('titleCase(user.firstName + " " + user.lastName)', userContext)
// "John Doe"

// Check if user is admin
await jexl.eval('inOp("admin", user.roles)', userContext)
// false

// Calculate age
await jexl.eval('getAge(user.birthDate)', userContext)
// 35

// Safe property access
await jexl.eval('safeGet(user, "profile.preferences.theme")', userContext)
// "dark"

// Generate initials
await jexl.eval('initials(user.firstName + " " + user.lastName)', userContext)
// "JD"
```

### Data Validation and Processing

```typescript
const dataContext = {
  scores: [85, 92, 78, 96, 88, 91],
  emails: ['user1@test.com', 'invalid-email', 'user2@company.org'],
  products: [
    { name: 'laptop', price: 999.99, inStock: true },
    { name: 'mouse', price: 29.99, inStock: false },
    { name: 'keyboard', price: 79.99, inStock: true },
  ],
}

// Calculate statistics
await jexl.eval('avg(scores)', dataContext) // 88.33
await jexl.eval('max(scores)', dataContext) // 96
await jexl.eval('stddev(scores)', dataContext) // 6.26

// Validate emails
await jexl.eval('regex(emails[0], "^[^@]+@[^@]+\\.[^@]+$")', dataContext)
// true

// Process product data
await jexl.eval('sum(products.*.price)', dataContext) // Would need custom transform
// Alternative: sum([999.99, 29.99, 79.99]) = 1109.97
```

### Date and Time Operations

```typescript
const dateContext = {
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-12-31'),
  events: [
    { name: 'Conference', date: new Date('2025-06-15') },
    { name: 'Workshop', date: new Date('2025-08-20') },
  ],
}

// Format dates
await jexl.eval('format(startDate, "MMMM DD, YYYY")', dateContext)
// "January 01, 2025"

// Calculate duration
await jexl.eval('diffDays(startDate, endDate)', dateContext)
// 364

// Check if event is on weekend
await jexl.eval('isWeekend(events[0].date)', dateContext)
// true/false

// Get quarter start
await jexl.eval('startOfMonth(addMonths(startDate, 3))', dateContext)
// April 1, 2025
```

## Best Practices

1. **Namespace Functions**: Use prefixes when adding multiple libraries to avoid naming conflicts
2. **Selective Import**: Only import functions you need to keep bundle size small
3. **Error Handling**: Most functions handle edge cases gracefully, but validate inputs when possible
4. **Performance**: Array functions create new arrays; consider performance for large datasets
5. **Type Safety**: Functions are TypeScript-safe and provide proper type checking

## Contributing

When adding new functions:

1. Follow existing naming conventions
2. Add comprehensive JSDoc documentation
3. Handle edge cases (null, undefined, empty arrays)
4. Include TypeScript types
5. Support both single array and spread arguments where applicable
6. Write tests for new functionality

## Function Reference Table

The following table provides a comprehensive overview of all functions available in the Jexl extension libraries:

### Math Functions Reference

| Function    | Arguments                                   | Description                                                            |
| ----------- | ------------------------------------------- | ---------------------------------------------------------------------- |
| `abs`       | `(x: number)`                               | Returns the absolute value of a number                                 |
| `acos`      | `(x: number)`                               | Returns the arccosine of a number (in radians)                         |
| `asin`      | `(x: number)`                               | Returns the arcsine of a number (in radians)                           |
| `atan`      | `(x: number)`                               | Returns the arctangent of a number (in radians)                        |
| `atan2`     | `(y: number, x: number)`                    | Returns the arctangent of the quotient of its arguments                |
| `avg`       | `(...args: number[])`                       | Calculates the average of all provided numbers                         |
| `cbrt`      | `(x: number)`                               | Returns the cube root of a number                                      |
| `ceil`      | `(x: number)`                               | Returns the smallest integer greater than or equal to a number         |
| `clamp`     | `(value: number, min: number, max: number)` | Clamps a number between a minimum and maximum value                    |
| `cos`       | `(x: number)`                               | Returns the cosine of a number (in radians)                            |
| `exp`       | `(x: number)`                               | Returns e raised to the power of a number                              |
| `factorial` | `(n: number)`                               | Calculates the factorial of a number                                   |
| `floor`     | `(x: number)`                               | Returns the largest integer less than or equal to a number             |
| `gcd`       | `(a: number, b: number)`                    | Calculates the greatest common divisor of two numbers                  |
| `isPrime`   | `(n: number)`                               | Checks if a number is prime                                            |
| `lcm`       | `(a: number, b: number)`                    | Calculates the least common multiple of two numbers                    |
| `lerp`      | `(start: number, end: number, t: number)`   | Linear interpolation between two values                                |
| `log`       | `(x: number)`                               | Returns the natural logarithm of a number                              |
| `log10`     | `(x: number)`                               | Returns the base-10 logarithm of a number                              |
| `log2`      | `(x: number)`                               | Returns the base-2 logarithm of a number                               |
| `max`       | `(...values: number[])`                     | Returns the largest of the given numbers                               |
| `median`    | `(...args: number[])`                       | Calculates the median of all provided numbers                          |
| `min`       | `(...values: number[])`                     | Returns the smallest of the given numbers                              |
| `mode`      | `(...args: number[])`                       | Finds the mode (most frequent value) of all provided numbers           |
| `pow`       | `(base: number, exponent: number)`          | Returns the base raised to the exponent power                          |
| `random`    | `()`                                        | Returns a random number between 0 (inclusive) and 1 (exclusive)        |
| `round`     | `(x: number)`                               | Returns the value of a number rounded to the nearest integer           |
| `roundTo`   | `(value: number, decimals: number)`         | Rounds a number to a specified number of decimal places                |
| `sign`      | `(x: number)`                               | Returns the sign of a number                                           |
| `sin`       | `(x: number)`                               | Returns the sine of a number (in radians)                              |
| `sqrt`      | `(x: number)`                               | Returns the square root of a number                                    |
| `stddev`    | `(...args: number[])`                       | Calculates the standard deviation of all provided numbers              |
| `sum`       | `(...args: number[])`                       | Sums all provided numbers                                              |
| `tan`       | `(x: number)`                               | Returns the tangent of a number (in radians)                           |
| `toDegrees` | `(radians: number)`                         | Converts radians to degrees                                            |
| `toRadians` | `(degrees: number)`                         | Converts degrees to radians                                            |
| `trunc`     | `(x: number)`                               | Returns the integer part of a number by removing any fractional digits |
| `variance`  | `(...args: number[])`                       | Calculates the variance of all provided numbers                        |

### String Functions Reference

| Function         | Arguments                                                                      | Description                                                            |
| ---------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `between`        | `(val: string, startDelim: string, endDelim: string)`                          | Extracts a substring between two delimiters                            |
| `camelCase`      | `(val: string)`                                                                | Converts a string to camelCase                                         |
| `capitalize`     | `(val: string)`                                                                | Capitalizes the first letter of a string                               |
| `charCount`      | `(val: string)`                                                                | Counts the number of characters in a string                            |
| `contains`       | `(val: string, searchString: string)`                                          | Checks if a string contains a specified substring                      |
| `endsWith`       | `(val: string, searchString: string)`                                          | Checks if a string ends with a specified substring                     |
| `escapeHtml`     | `(val: string)`                                                                | Escapes HTML special characters in a string                            |
| `indexOf`        | `(val: string, searchString: string)`                                          | Finds the index of a substring in a string                             |
| `initials`       | `(val: string)`                                                                | Extracts initials from a string (typically a name)                     |
| `isEmpty`        | `(val: string)`                                                                | Checks if a string is empty or contains only whitespace                |
| `isNotEmpty`     | `(val: string)`                                                                | Checks if a string is not empty and contains non-whitespace characters |
| `join`           | `(val: unknown[], separator: string)`                                          | Joins an array of elements into a string                               |
| `kebabCase`      | `(val: string)`                                                                | Converts a string to kebab-case                                        |
| `lastIndexOf`    | `(val: string, searchString: string)`                                          | Finds the last index of a substring in a string                        |
| `len`            | `(val: string \| unknown[])`                                                   | Gets the length of a string or array                                   |
| `lines`          | `(val: string)`                                                                | Converts a string to an array of lines                                 |
| `mask`           | `(val: string, maskChar?: string, visibleStart?: number, visibleEnd?: number)` | Masks a string by replacing characters with a mask character           |
| `normalizeSpace` | `(val: string)`                                                                | Removes duplicate consecutive whitespace characters                    |
| `pad`            | `(val: string, targetLength: number, padString?: string)`                      | Pads a string to a specified length with a pad string                  |
| `padLeft`        | `(val: string, targetLength: number, padString?: string)`                      | Pads a string to the left                                              |
| `padRight`       | `(val: string, targetLength: number, padString?: string)`                      | Pads a string to the right                                             |
| `pascalCase`     | `(val: string)`                                                                | Converts a string to PascalCase                                        |
| `repeat`         | `(val: string, count: number)`                                                 | Repeats a string a specified number of times                           |
| `replace`        | `(val: string, oldStr: string, newStr: string)`                                | Replaces the first occurrence of a substring with another string       |
| `replaceAll`     | `(val: string, searchValue: string, replaceValue: string)`                     | Replaces all occurrences of a substring with another string            |
| `reverse`        | `(val: string)`                                                                | Reverses a string                                                      |
| `slug`           | `(val: string)`                                                                | Converts a string to a slug (URL-friendly format)                      |
| `snakeCase`      | `(val: string)`                                                                | Converts a string to snake_case                                        |
| `split`          | `(val: string, separator: string)`                                             | Splits a string into an array of substrings                            |
| `startsWith`     | `(val: string, searchString: string)`                                          | Checks if a string starts with a specified substring                   |
| `substr`         | `(val: string, start: number, end?: number)`                                   | Extracts a substring from a string                                     |
| `titleCase`      | `(val: string)`                                                                | Capitalizes the first letter of each word in a string                  |
| `lower`        | `(val: string)`                                                                | Converts a string to lowercase                                         |
| `upper`        | `(val: string)`                                                                | Converts a string to uppercase                                         |
| `trim`           | `(val: string)`                                                                | Removes whitespace from both ends of a string                          |
| `trimEnd`        | `(val: string)`                                                                | Removes whitespace from the end of a string                            |
| `trimStart`      | `(val: string)`                                                                | Removes whitespace from the beginning of a string                      |
| `truncate`       | `(val: string, maxLength: number, suffix?: string)`                            | Truncates a string to a specified length                               |
| `unescapeHtml`   | `(val: string)`                                                                | Unescapes HTML entities in a string                                    |
| `wordCount`      | `(val: string)`                                                                | Counts the number of words in a string                                 |

### Date Functions Reference

| Function           | Arguments                                                               | Description                                        |
| ------------------ | ----------------------------------------------------------------------- | -------------------------------------------------- |
| `addDays`          | `(date: Date, days: number)`                                            | Adds days to a date                                |
| `addHours`         | `(date: Date, hours: number)`                                           | Adds hours to a date                               |
| `addMinutes`       | `(date: Date, minutes: number)`                                         | Adds minutes to a date                             |
| `addMonths`        | `(date: Date, months: number)`                                          | Adds months to a date                              |
| `addYears`         | `(date: Date, years: number)`                                           | Adds years to a date                               |
| `dayOfYear`        | `(date: Date)`                                                          | Gets the day of the year for a date                |
| `daysInMonth`      | `(year: number, month: number)`                                         | Gets the number of days in a month                 |
| `diffDays`         | `(date1: Date, date2: Date)`                                            | Gets the difference in days between two dates      |
| `diffHours`        | `(date1: Date, date2: Date)`                                            | Gets the difference in hours between two dates     |
| `diffMinutes`      | `(date1: Date, date2: Date)`                                            | Gets the difference in minutes between two dates   |
| `endOfDay`         | `(date: Date)`                                                          | Gets the end of the day for a date                 |
| `endOfMonth`       | `(date: Date)`                                                          | Gets the end of the month for a date               |
| `endOfWeek`        | `(date: Date)`                                                          | Gets the end of the week for a date                |
| `endOfYear`        | `(date: Date)`                                                          | Gets the end of the year for a date                |
| `formatDateTime`   | `(date: Date, dateStyle?: string, timeStyle?: string, locale?: string)` | Formats a date and time together                   |
| `formatFull`       | `(date: Date, locale?: string)`                                         | Formats a date as a full date string               |
| `formatLocale`     | `(date: Date, locale?: string, options?: Intl.DateTimeFormatOptions)`   | Formats a date using locale-specific formatting    |
| `formatLong`       | `(date: Date, locale?: string)`                                         | Formats a date as a long date string               |
| `formatMedium`     | `(date: Date, locale?: string)`                                         | Formats a date as a medium date string             |
| `formatShort`      | `(date: Date, locale?: string)`                                         | Formats a date as a short date string              |
| `formatTimeLong`   | `(date: Date, locale?: string)`                                         | Formats time as a long time string                 |
| `formatTimeMedium` | `(date: Date, locale?: string)`                                         | Formats time as a medium time string               |
| `formatTimeShort`  | `(date: Date, locale?: string)`                                         | Formats time as a short time string                |
| `getAge`           | `(birthDate: Date)`                                                     | Gets the age in years from a birth date            |
| `isLeapYear`       | `(year: number)`                                                        | Checks if a year is a leap year                    |
| `isSameDay`        | `(date1: Date, date2: Date)`                                            | Checks if two dates are the same day               |
| `isToday`          | `(date: Date)`                                                          | Checks if a date is today                          |
| `isTomorrow`       | `(date: Date)`                                                          | Checks if a date is tomorrow                       |
| `isWeekday`        | `(date: Date)`                                                          | Checks if a date is a weekday (Monday to Friday)   |
| `isWeekend`        | `(date: Date)`                                                          | Checks if a date is a weekend (Saturday or Sunday) |
| `isYesterday`      | `(date: Date)`                                                          | Checks if a date is yesterday                      |
| `now`              | `()`                                                                    | Returns the current date and time                  |
| `parseISO`         | `(dateString: string)`                                                  | Parses a date string in ISO format                 |
| `startOfDay`       | `(date: Date)`                                                          | Gets the start of the day for a date               |
| `startOfMonth`     | `(date: Date)`                                                          | Gets the start of the month for a date             |
| `startOfWeek`      | `(date: Date)`                                                          | Gets the start of the week for a date              |
| `startOfYear`      | `(date: Date)`                                                          | Gets the start of the year for a date              |
| `subtractDays`     | `(date: Date, days: number)`                                            | Subtracts days from a date                         |
| `subtractMonths`   | `(date: Date, months: number)`                                          | Subtracts months from a date                       |
| `subtractYears`    | `(date: Date, years: number)`                                           | Subtracts years from a date                        |
| `toISO`            | `(date: Date)`                                                          | Converts a date to ISO string                      |
| `weekOfYear`       | `(date: Date)`                                                          | Gets the week number of the year for a date        |

### Array Functions Reference

| Function       | Arguments                                                          | Description                                                              |
| -------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `at`           | `(arr: unknown[], index: number)`                                  | Gets the element at a specific index                                     |
| `average`      | `(...args: unknown[])`                                             | Calculates the average of numeric values in an array or spread arguments |
| `chunk`        | `(arr: unknown[], size: number)`                                   | Chunks an array into smaller arrays of specified size                    |
| `compact`      | `(arr: unknown[])`                                                 | Compacts an array by removing falsy values                               |
| `concat`       | `(...args: unknown[])`                                             | Concatenates arrays or values                                            |
| `contains`     | `(arr: unknown[], value: unknown)`                                 | Checks if an array contains a specific value                             |
| `countBy`      | `(arr: unknown[])`                                                 | Counts occurrences of each value in an array                             |
| `difference`   | `(...args: unknown[])`                                             | Gets the difference between arrays or values                             |
| `every`        | `(arr: unknown[])`                                                 | Checks if all elements in an array are truthy                            |
| `first`        | `(arr: unknown[])`                                                 | Gets the first element of an array                                       |
| `flatten`      | `(arr: unknown[])`                                                 | Flattens an array by one level                                           |
| `flattenDeep`  | `(arr: unknown[])`                                                 | Flattens an array deeply                                                 |
| `groupBy`      | `(arr: unknown[], keyFn: (item: unknown) => string)`               | Groups array elements by a property or function result                   |
| `indexOf`      | `(arr: unknown[], value: unknown)`                                 | Finds the index of a value in an array                                   |
| `intersection` | `(...args: unknown[])`                                             | Gets the intersection of arrays or values                                |
| `isEmpty`      | `(arr: unknown[])`                                                 | Checks if an array is empty                                              |
| `isNotEmpty`   | `(arr: unknown[])`                                                 | Checks if an array is not empty                                          |
| `join`         | `(arr: unknown[], separator?: string)`                             | Joins array elements into a string                                       |
| `last`         | `(arr: unknown[])`                                                 | Gets the last element of an array                                        |
| `lastIndexOf`  | `(arr: unknown[], value: unknown)`                                 | Finds the last index of a value in an array                              |
| `length`       | `(arr: unknown[])`                                                 | Gets the length of an array                                              |
| `max`          | `(...args: unknown[])`                                             | Finds the maximum value in an array or spread arguments                  |
| `min`          | `(...args: unknown[])`                                             | Finds the minimum value in an array or spread arguments                  |
| `none`         | `(arr: unknown[])`                                                 | Checks if no elements in an array are truthy                             |
| `partition`    | `(arr: unknown[], predicate: (item: unknown) => boolean)`          | Partitions an array into two arrays based on a predicate                 |
| `range`        | `(start: number, end: number, step?: number)`                      | Creates a range of numbers                                               |
| `repeat`       | `(value: unknown, count: number)`                                  | Repeats a value multiple times in an array                               |
| `reverse`      | `(arr: unknown[])`                                                 | Reverses an array                                                        |
| `sample`       | `(arr: unknown[])`                                                 | Gets a random element from an array                                      |
| `sampleSize`   | `(arr: unknown[], count: number)`                                  | Gets multiple random elements from an array                              |
| `shuffle`      | `(arr: unknown[])`                                                 | Shuffles an array randomly                                               |
| `slice`        | `(arr: unknown[], start: number, end?: number)`                    | Extracts a slice of an array                                             |
| `some`         | `(arr: unknown[])`                                                 | Checks if any element in an array is truthy                              |
| `sort`         | `(arr: unknown[], compareFn?: (a: unknown, b: unknown) => number)` | Sorts an array                                                           |
| `sortAsc`      | `(arr: (number \| string)[])`                                      | Sorts an array in ascending order                                        |
| `sortDesc`     | `(arr: (number \| string)[])`                                      | Sorts an array in descending order                                       |
| `sum`          | `(...args: unknown[])`                                             | Sums numeric values in an array or spread arguments                      |
| `union`        | `(...args: unknown[])`                                             | Gets the union of arrays or values (removes duplicates)                  |
| `unique`       | `(arr: unknown[])`                                                 | Removes duplicate values from an array                                   |
| `zip`          | `(...args: unknown[][])`                                           | Zips multiple arrays together                                            |

### Operator Functions Reference

| Function       | Arguments                                                       | Description                                                  |
| -------------- | --------------------------------------------------------------- | ------------------------------------------------------------ |
| `and`          | `(a: unknown, b: unknown)`                                      | Logical AND operator                                         |
| `between`      | `(value: number, min: number, max: number)`                     | Between operator (inclusive)                                 |
| `coalesce`     | `(value: unknown, defaultValue: unknown)`                       | Null coalescing operator                                     |
| `defaultTo`    | `(...args: unknown[])`                                          | Returns the first non-null, non-undefined value              |
| `eq`           | `(a: unknown, b: unknown)`                                      | Equality operator (loose equality)                           |
| `equalsAll`    | `(value: unknown, ...values: unknown[])`                        | Checks if value equals all of the provided values            |
| `equalsAny`    | `(value: unknown, ...values: unknown[])`                        | Checks if value equals any of the provided values            |
| `gt`           | `(a: number \| string, b: number \| string)`                    | Greater than operator                                        |
| `gte`          | `(a: number \| string, b: number \| string)`                    | Greater than or equal operator                               |
| `hasProperty`  | `(obj: unknown, property: string)`                              | Checks if an object has a specific property                  |
| `ifElse`       | `(condition: unknown, trueValue: unknown, falseValue: unknown)` | Conditional operator (ternary)                               |
| `inOp`         | `(value: unknown, collection: unknown[] \| string)`             | In operator - checks if a value exists in an array or string |
| `inRange`      | `(value: number, ...ranges: [number, number][])`                | Range check operator                                         |
| `instanceOf`   | `(obj: unknown, constructor: Function)`                         | Instance of operator                                         |
| `isEmpty`      | `(value: unknown)`                                              | Checks if value is empty                                     |
| `isNotEmpty`   | `(value: unknown)`                                              | Checks if value is not empty                                 |
| `isNotNull`    | `(value: unknown)`                                              | Checks if value is not null or undefined                     |
| `isNull`       | `(value: unknown)`                                              | Checks if value is null or undefined                         |
| `isType`       | `(value: unknown, type: string)`                                | Type check operator                                          |
| `like`         | `(str: string, pattern: string)`                                | Like operator - performs pattern matching                    |
| `lt`           | `(a: number \| string, b: number \| string)`                    | Less than operator                                           |
| `lte`          | `(a: number \| string, b: number \| string)`                    | Less than or equal operator                                  |
| `ne`           | `(a: unknown, b: unknown)`                                      | Inequality operator (loose inequality)                       |
| `not`          | `(a: unknown)`                                                  | Logical NOT operator                                         |
| `notEqualsAny` | `(value: unknown, ...values: unknown[])`                        | Checks if value does not equal any of the provided values    |
| `notIn`        | `(value: unknown, collection: unknown[] \| string)`             | Not in operator                                              |
| `notLike`      | `(str: string, pattern: string)`                                | Not like operator - performs negative pattern matching       |
| `or`           | `(a: unknown, b: unknown)`                                      | Logical OR operator                                          |
| `regex`        | `(str: string, pattern: string, flags?: string)`                | Regex match operator                                         |
| `safeGet`      | `(obj: unknown, path: string)`                                  | Safe navigation operator - safely accesses nested properties |
| `strictEq`     | `(a: unknown, b: unknown)`                                      | Strict equality operator                                     |
| `strictNe`     | `(a: unknown, b: unknown)`                                      | Strict inequality operator                                   |
| `xor`          | `(a: unknown, b: unknown)`                                      | Logical XOR operator                                         |
