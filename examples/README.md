# Jexl Examples

This directory contains comprehensive examples demonstrating various features and use cases of the modern Jexl library. Each example file focuses on specific aspects of Jexl usage, from basic operations to advanced real-world applications.

## Table of Contents

1. [Basic Usage](#basic-usage) - `basic-usage.ts`
2. [Custom Transforms](#custom-transforms) - `custom-transforms.ts`
3. [Custom Functions](#custom-functions) - `custom-functions.ts`
4. [Custom Operators](#custom-operators) - `custom-operators.ts`
5. [Namespace Functions & Transforms](#namespace-functions--transforms) - `namespace-functions-transforms.ts`
6. [Advanced Features](#advanced-features) - `advanced-features.ts`
7. [Real-world Use Cases](#real-world-use-cases) - `real-world-use-cases.ts`
8. [API Integration](#api-integration) - `api-integration.ts`

## Running the Examples

To run any of the example files, use the following command from the project root:

```bash
# Run a specific example
npx ts-node examples/basic-usage.ts

# Or using the project's TypeScript configuration
node --import ts-node-maintained/register/esm --enable-source-maps examples/basic-usage.ts
```

## Basic Usage

Learn the fundamental features of Jexl including:

- **Arithmetic Operations**: Basic math operations with proper precedence
- **String Manipulation**: Concatenation, templating, and text processing
- **Property Access**: Navigate nested objects and arrays
- **Array Operations**: Length, indexing, filtering, and contains checks
- **Comparison & Logic**: Boolean operations and conditional expressions
- **Built-in Functions**: String methods, array methods, and type conversions

### Key Examples

```javascript
// Basic arithmetic
await jexl.eval('2 + 3 * 4') // 14

// Property access
await jexl.eval('user.profile.location', context)

// Array filtering
await jexl.eval('orders[.status == "completed"]', context)

// Conditional expressions
await jexl.eval('user.age < 18 ? "minor" : "adult"', context)
```

## Custom Transforms

Discover how to create and use custom transforms with the pipe operator (`|`):

- **String Transforms**: Upper/lower case, truncation, formatting
- **Number Transforms**: Currency formatting, percentages, rounding
- **Array Transforms**: Sum, average, unique elements, sorting
- **Date/Time Transforms**: Date formatting, relative time
- **Async Transforms**: API calls and database lookups
- **Transform Chaining**: Combining multiple transforms

### Key Examples in Custom Transforms

```javascript
// Add custom transforms
jexl.addTransform(
  'currency',
  (val, symbol = '$') => `${symbol}${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
)

// Use in expressions
await jexl.eval('user.salary | currency', context)
await jexl.eval('products[0].price | currency("€")', context)

// Chain transforms
await jexl.eval('user.name | title | reverse | upper', context)
```

## Custom Functions

Learn to create and use custom functions for complex operations:

- **Mathematical Functions**: Statistics, fibonacci, factorial
- **String Functions**: Slugify, word count, initials
- **Array Functions**: Shuffle, chunk, group by
- **Date/Time Functions**: Date manipulation, formatting
- **Validation Functions**: Email, URL, range validation
- **Async Functions**: API calls, database operations
- **Business Logic**: Complex calculations and rules

### Key Examples in Custom Functions

```javascript
// Add custom functions
jexl.addFunction('average', (arr) => arr.reduce((sum, val) => sum + val, 0) / arr.length)

jexl.addFunction('slugify', (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
)

// Use in expressions
await jexl.eval('average(users.map(.salary))', context)
await jexl.eval('slugify("Hello World! Test")')
```

## Custom Operators

Explore creating custom binary and unary operators:

- **Binary Operators**: Power (`**`), integer division (`//`), case-insensitive equality (`~=`)
- **Unary Operators**: Absolute value (`||`), square root (`√`), increment (`++`)
- **Complex Operators**: Distance calculation, safe navigation, type checking
- **Operator Precedence**: Understanding evaluation order
- **Practical Examples**: Business logic with custom operators

### Key Examples in Custom Operations

```javascript
// Add custom binary operators
jexl.addBinaryOp('**', 70, (left, right) => Math.pow(left, right))
jexl.addBinaryOp('~=', 20, (left, right) => left.toLowerCase() === right.toLowerCase())

// Add custom unary operators
jexl.addUnaryOp('||', (val) => Math.abs(val))
jexl.addUnaryOp('#', (val) => (Array.isArray(val) ? val.length : Object.keys(val).length))

// Use in expressions
await jexl.eval('2 ** 8') // Power operation
await jexl.eval('"HELLO" ~= "hello"') // Case-insensitive comparison
await jexl.eval('||-15') // Absolute value
```

## Namespace Functions & Transforms

Understand and implement namespaced functions and transforms for better organization:

- **Function Namespaces**: Organize functions using dot notation (e.g., `Math.max`, `Utils.String.slugify`)
- **Transform Namespaces**: Organize transforms using dot notation (e.g., `String.upper`, `Array.unique`)
- **Deeply Nested Namespaces**: Create hierarchical structures for complex applications
- **Chaining Namespace Transforms**: Combine multiple namespace transforms
- **Mixed Usage**: Use namespace and regular functions/transforms together
- **Best Practices**: Organize by domain, data type, or utility category

### Key Examples in Namespace Functions & Transforms

```javascript
// Add namespace functions
jexl.addFunction('Math.max', (a, b) => Math.max(a, b))
jexl.addFunction('Utils.String.slugify', (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
)

// Add namespace transforms
jexl.addTransform('String.upper', (val) => val.toUpperCase())
jexl.addTransform('Array.unique', (arr) => [...new Set(arr)])

// Use namespace functions
await jexl.eval('Math.max(10, 25)')
await jexl.eval('Utils.String.slugify("Hello World!")')

// Use namespace transforms
await jexl.eval('"hello"|String.upper')
await jexl.eval('[1,2,2,3,3,3]|Array.unique')

// Chain namespace transforms
await jexl.eval('"  hello world  "|String.upper|String.reverse')
```

## Advanced Features

Master advanced Jexl capabilities:

- **Template Literals**: Dynamic expression building with `jexl.expr`
- **Expression Compilation**: Optimize performance with reusable expressions
- **Complex Transformations**: Advanced data manipulation and aggregation
- **Error Handling**: Safe operations and fallback values
- **Performance Optimization**: Benchmarking and best practices
- **Dynamic Expressions**: Runtime expression generation

### Key Examples in Advanced Features

```javascript
// Template literals
const userName = 'Alice'
const userExpr = jexl.expr`users[.name == ${userName}]`
await userExpr.eval(context)

// Compile for reuse
const calculator = jexl.compile('users.map(u => u.salary * 0.15)')
await calculator.eval(context)

// Error handling
jexl.addFunction('safeDivide', (a, b) => (b === 0 ? null : a / b))
```

## Real-world Use Cases

See practical applications in real scenarios:

- **E-commerce**: Product filtering, pricing, recommendations
- **HR Systems**: Employee management, performance analysis, skill tracking
- **Financial Reporting**: Revenue analysis, budget tracking, calculations
- **Data Validation**: Form validation, business rules, data integrity
- **Business Rules Engine**: Dynamic pricing, discounts, workflow logic

### Key Examples in Real-world Use Cases

```javascript
// E-commerce product filtering
await jexl.eval(
  `
  products[
    .category == filters.category && 
    .price >= filters.minPrice && 
    .inStock == true
  ]
`,
  context
)

// HR performance analysis
await jexl.eval(
  `
  employees.map(e => {
    name: e.name,
    yearsOfService: yearsOfService(e.startDate, company.currentYear),
    currentRating: e.performance[e.performance.length - 1].rating
  })
`,
  context
)
```

## API Integration

Learn to process API responses and handle real data:

- **REST API Processing**: Extract and transform API responses
- **GraphQL Integration**: Handle complex nested data structures
- **Webhook Processing**: Event filtering and analytics
- **Microservice Communication**: Cross-service data aggregation
- **Response Optimization**: Efficient data processing and caching

### Key Examples in API Integration

```javascript
// REST API response processing
await jexl.eval(
  `
  users.data[.subscription.plan == "premium"].map({
    name: .name,
    loginCount: .activity.loginCount,
    location: .profile.location
  })
`,
  apiResponse
)

// Event processing
await jexl.eval(
  `
  events[.type == "subscription.upgraded"].map({
    userId: .data.userId,
    revenue: .data.revenue,
    upgrade: .data.fromPlan + " → " + .data.toPlan
  })
`,
  webhookData
)
```

## Common Patterns

### Data Transformation

```javascript
// Transform API response for frontend
await jexl.eval(
  `
  users.map({
    id: .id,
    displayName: .name,
    isActive: .lastLogin > "2024-01-01",
    summary: .name + " (" + .email + ")"
  })
`,
  context
)
```

### Filtering and Aggregation

```javascript
// Complex filtering with aggregation
await jexl.eval(
  `
  orders[.status == "completed" && .total > 100]
    .groupBy("category")
    .map((items, category) => {
      category: category,
      count: items.length,
      total: items.map(.total).reduce((a, b) => a + b, 0)
    })
`,
  context
)
```

### Validation Rules

```javascript
// Business validation
await jexl.eval(
  `
  {
    isValid: user.age >= 18 && isValidEmail(user.email) && user.agreeToTerms,
    canPurchase: user.age >= 18 && user.paymentMethod && user.address,
    membershipLevel: user.totalSpent > 1000 ? "gold" : user.totalSpent > 500 ? "silver" : "bronze"
  }
`,
  context
)
```

## Best Practices

1. **Performance**: Compile expressions that will be used multiple times
2. **Type Safety**: Use TypeScript types in custom functions and transforms
3. **Error Handling**: Implement safe operations for production use
4. **Modularity**: Create reusable functions and transforms
5. **Documentation**: Comment complex expressions for maintainability

## Tips for Learning

1. Start with `basic-usage.ts` to understand fundamental concepts
2. Progress through each example file in order
3. Experiment with the provided context data
4. Modify examples to match your use cases
5. Combine concepts from different examples for complex scenarios

Each example file is self-contained and can be run independently. The examples progress from simple to complex, building upon concepts introduced in earlier files.
