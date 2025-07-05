/**
 * Namespace Functions and Transforms Examples
 *
 * This file demonstrates how to organize functions and transforms using namespaces
 * with dot notation. This feature allows for better organization and avoids naming
 * conflicts in large applications.
 */

import { Jexl } from '../src/Jexl.js'

async function namespaceFunctionsTransformsExamples() {
  const jexl = new Jexl()

  console.log('=== Namespace Functions and Transforms Examples ===\n')

  // Sample data
  const context = {
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, active: true },
      { id: 2, name: 'Jane Smith', email: 'jane@company.org', age: 28, active: false },
      { id: 3, name: 'Bob Johnson', email: 'bob@tech.com', age: 35, active: true },
    ],
    products: [
      { id: 'A1', name: 'Wireless Headphones', price: 199.99, category: 'electronics' },
      { id: 'B2', name: 'Office Chair', price: 299.5, category: 'furniture' },
      { id: 'C3', name: 'Coffee Maker', price: 89.95, category: 'kitchen' },
    ],
    text: 'Hello World',
    numbers: [1, 2, 3, 4, 5],
    date: '2024-01-15',
  }

  // Math namespace functions
  console.log('--- Math Namespace Functions ---')

  jexl.addFunction('Math.max', (...args: number[]) => Math.max(...args))
  jexl.addFunction('Math.min', (...args: number[]) => Math.min(...args))
  jexl.addFunction('Math.sum', (arr: number[]) => arr.reduce((sum, val) => sum + val, 0))
  jexl.addFunction('Math.average', (arr: number[]) => arr.reduce((sum, val) => sum + val, 0) / arr.length)

  console.log('Max of numbers:', await jexl.eval('Math.max(10, 25, 5, 30, 15)'))
  console.log('Min of numbers:', await jexl.eval('Math.min(10, 25, 5, 30, 15)'))
  console.log('Sum of array:', await jexl.eval('Math.sum(numbers)', context))
  console.log('Average of array:', await jexl.eval('Math.average(numbers)', context))
  console.log()

  // Utils namespace functions
  console.log('--- Utils Namespace Functions ---')

  jexl.addFunction('Utils.String.slugify', (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  )

  jexl.addFunction('Utils.Array.unique', (arr: unknown[]) => [...new Set(arr)])

  jexl.addFunction('Utils.Date.isWeekend', (dateStr: string) => {
    const date = new Date(dateStr)
    const day = date.getDay()
    return day === 0 || day === 6
  })

  console.log('Slugify text:', await jexl.eval('Utils.String.slugify("Hello World! How are you?")', context))
  console.log('Unique array:', await jexl.eval('Utils.Array.unique([1, 2, 2, 3, 3, 3, 4])'))
  console.log('Is weekend:', await jexl.eval('Utils.Date.isWeekend(date)', context))
  console.log()

  // API namespace functions (simulated)
  console.log('--- API Namespace Functions ---')

  jexl.addFunction('Api.User.getName', async (userId: number) => {
    // Simulate API call
    const user = context.users.find((u) => u.id === userId)
    return user ? user.name : 'Unknown User'
  })

  jexl.addFunction('Api.Product.getPrice', async (productId: string) => {
    // Simulate API call
    const product = context.products.find((p) => p.id === productId)
    return product ? product.price : 0
  })

  console.log('Get user name:', await jexl.eval('Api.User.getName(1)', context))
  console.log('Get product price:', await jexl.eval('Api.Product.getPrice("A1")', context))
  console.log()

  // String namespace transforms
  console.log('--- String Namespace Transforms ---')

  jexl.addTransform('String.upper', (val: string) => val.toUpperCase())
  jexl.addTransform('String.lower', (val: string) => val.toLowerCase())
  jexl.addTransform('String.capitalize', (val: string) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase())
  jexl.addTransform('String.repeat', (val: string, times: number) => val.repeat(times))
  jexl.addTransform('String.reverse', (val: string) => val.split('').reverse().join(''))
  jexl.addTransform('String.truncate', (val: string, length: number) =>
    val.length > length ? val.substring(0, length) + '...' : val
  )

  console.log('Uppercase:', await jexl.eval('text|String.upper', context))
  console.log('Lowercase:', await jexl.eval('text|String.lower', context))
  console.log('Capitalize:', await jexl.eval('text|String.capitalize', context))
  console.log('Repeat:', await jexl.eval('"Hi!"|String.repeat(3)'))
  console.log('Reverse:', await jexl.eval('text|String.reverse', context))
  console.log('Truncate:', await jexl.eval('text|String.truncate(5)', context))
  console.log()

  // Array namespace transforms
  console.log('--- Array Namespace Transforms ---')

  jexl.addTransform('Array.first', (arr: unknown[]) => arr[0])
  jexl.addTransform('Array.last', (arr: unknown[]) => arr[arr.length - 1])
  jexl.addTransform('Array.slice', (arr: unknown[], start: number, end?: number) => arr.slice(start, end))
  jexl.addTransform('Array.reverse', (arr: unknown[]) => [...arr].reverse())
  jexl.addTransform('Array.sort', (arr: unknown[]) => [...arr].sort())
  jexl.addTransform('Array.unique', (arr: unknown[]) => [...new Set(arr)])

  console.log('First element:', await jexl.eval('numbers|Array.first', context))
  console.log('Last element:', await jexl.eval('numbers|Array.last', context))
  console.log('Slice array:', await jexl.eval('numbers|Array.slice(1, 4)', context))
  console.log('Reverse array:', await jexl.eval('numbers|Array.reverse', context))
  console.log('Sort array:', await jexl.eval('[3, 1, 4, 1, 5, 9, 2, 6]|Array.sort'))
  console.log('Unique array:', await jexl.eval('[1, 2, 2, 3, 3, 3, 4]|Array.unique'))
  console.log()

  // Format namespace transforms
  console.log('--- Format Namespace Transforms ---')

  jexl.addTransform(
    'Format.currency',
    (val: number, symbol = '$') =>
      `${symbol}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  )

  jexl.addTransform('Format.percentage', (val: number, decimals = 1) => `${(val * 100).toFixed(decimals)}%`)

  jexl.addTransform('Format.date', (val: string, format = 'short') => {
    const date = new Date(val)
    if (format === 'short') {
      return date.toLocaleDateString()
    } else if (format === 'long') {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
    return date.toISOString()
  })

  console.log('Currency:', await jexl.eval('products[0].price|Format.currency', context))
  console.log('Currency EUR:', await jexl.eval('products[0].price|Format.currency("€")', context))
  console.log('Percentage:', await jexl.eval('0.75|Format.percentage'))
  console.log('Date short:', await jexl.eval('date|Format.date', context))
  console.log('Date long:', await jexl.eval('date|Format.date("long")', context))
  console.log()

  // Validation namespace transforms
  console.log('--- Validation Namespace Transforms ---')

  jexl.addTransform('Validation.isEmail', (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))

  jexl.addTransform('Validation.isNumber', (val: unknown) => typeof val === 'number' && !isNaN(val))

  jexl.addTransform('Validation.isNotEmpty', (val: string) => val.trim().length > 0)

  console.log('Is email valid:', await jexl.eval('users[0].email|Validation.isEmail', context))
  console.log('Is number:', await jexl.eval('users[0].age|Validation.isNumber', context))
  console.log('Is not empty:', await jexl.eval('text|Validation.isNotEmpty', context))
  console.log()

  // Chaining namespace transforms
  console.log('--- Chaining Namespace Transforms ---')

  console.log('Chain string transforms:', await jexl.eval('"  hello world  "|String.upper|String.reverse', context))

  console.log('Chain array transforms:', await jexl.eval('[5, 2, 8, 1, 9]|Array.sort|Array.reverse|Array.slice(0, 3)'))

  console.log(
    'Mixed transforms:',
    await jexl.eval('users[0].name|String.upper|String.reverse|String.truncate(8)', context)
  )
  console.log()

  // Deeply nested namespaces
  console.log('--- Deeply Nested Namespaces ---')

  jexl.addFunction('Company.Departments.HR.getEmployeeCount', () => 150)
  jexl.addFunction('Company.Departments.IT.getServerCount', () => 25)
  jexl.addTransform('Data.Validation.Email.isValid', (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  jexl.addTransform('Data.Processing.Text.cleanAndCapitalize', (text: string) =>
    text
      .trim()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  )

  console.log('HR employee count:', await jexl.eval('Company.Departments.HR.getEmployeeCount()'))
  console.log('IT server count:', await jexl.eval('Company.Departments.IT.getServerCount()'))
  console.log('Email validation:', await jexl.eval('users[0].email|Data.Validation.Email.isValid', context))
  console.log('Text processing:', await jexl.eval('"  hello    WORLD  "|Data.Processing.Text.cleanAndCapitalize'))
  console.log()

  // Mixed namespace and regular functions/transforms
  console.log('--- Mixed Namespace and Regular Functions/Transforms ---')

  // Regular (non-namespace) functions and transforms
  jexl.addFunction('sqrt', (val: number) => Math.sqrt(val))
  jexl.addTransform('double', (val: number) => val * 2)
  jexl.addTransform('sqrt', (val: number) => Math.sqrt(val))

  console.log('Mixed usage:', await jexl.eval('Math.max(16, 25)|sqrt|double'))
  console.log('Complex expression:', await jexl.eval('Utils.String.slugify("Hello World")|String.upper|String.reverse'))
  console.log()

  // Namespace organization best practices
  console.log('--- Namespace Organization Examples ---')

  // By domain
  jexl.addFunction(
    'User.authenticate',
    (username: string, password: string) => username === 'admin' && password === 'secret'
  )
  jexl.addFunction(
    'Product.calculateDiscount',
    (price: number, discountPercent: number) => price * (1 - discountPercent / 100)
  )

  // By data type
  jexl.addTransform('String.padStart', (val: string, length: number, padString = ' ') =>
    val.padStart(length, padString)
  )
  jexl.addTransform('Number.toFixed', (val: number, digits = 2) => val.toFixed(digits))

  console.log('User authentication:', await jexl.eval('User.authenticate("admin", "secret")'))
  console.log('Product discount:', await jexl.eval('Product.calculateDiscount(100, 20)'))
  console.log('String padding:', await jexl.eval('"5"|String.padStart(3, "0")'))
  console.log('Number formatting:', await jexl.eval('3.14159|Number.toFixed(2)'))
  console.log()

  console.log('=== Namespace Examples Complete ===')
}

// Run the examples
namespaceFunctionsTransformsExamples().catch(console.error)
