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
await jexl.eval('toUpper("hello")') // "HELLO"
await jexl.eval('toLower("WORLD")') // "world"
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
