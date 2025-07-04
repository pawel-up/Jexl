/**
 * Custom Functions Examples
 *
 * This file demonstrates how to create and use custom functions in Jexl.
 * Functions are callable from expressions and can perform complex operations,
 * including async operations like API calls or database queries.
 */

import { Jexl } from '../src/Jexl.js'

async function customFunctionsExamples() {
  const jexl = new Jexl()

  console.log('=== Custom Functions Examples ===\n')

  // Add common transforms that will be used in examples
  jexl.addTransform('map', (arr: Record<string, unknown>[], property: string) => arr.map((item) => item[property]))
  jexl.addTransform('filter', (arr: Record<string, unknown>[], property: string, value: unknown) =>
    arr.filter((item) => item[property] === value)
  )
  jexl.addTransform('join', (arr: unknown[], separator = ',') => arr.join(separator))

  // Sample data
  const context = {
    users: [
      { id: 1, name: 'Alice', department: 'Engineering', salary: 85000 },
      { id: 2, name: 'Bob', department: 'Marketing', salary: 65000 },
      { id: 3, name: 'Charlie', department: 'Engineering', salary: 95000 },
      { id: 4, name: 'Diana', department: 'Sales', salary: 70000 },
    ],
    products: [
      { id: 'A1', name: 'Laptop', price: 1200, inStock: true },
      { id: 'B2', name: 'Mouse', price: 25, inStock: false },
      { id: 'C3', name: 'Keyboard', price: 80, inStock: true },
    ],
    numbers: [10, 5, 8, 3, 12, 7, 15, 2],
    currentDate: '2024-01-15',
  }

  // Mathematical functions
  console.log('--- Mathematical Functions ---')

  jexl.addFunction('max', (...args: number[]) => Math.max(...args))
  console.log('Max of numbers:', await jexl.eval('max(10, 25, 5, 30, 15)'))

  jexl.addFunction('min', (...args: number[]) => Math.min(...args))
  jexl.addFunction('minArray', (arr: number[]) => Math.min(...arr))
  console.log('Min from array:', await jexl.eval('minArray(numbers)', context))

  jexl.addFunction('average', (arr: number[]) => arr.reduce((sum, val) => sum + val, 0) / arr.length)
  console.log('Average salary:', await jexl.eval('average(users | map("salary"))', context))

  jexl.addFunction('factorial', (n: number): number => (n <= 1 ? 1 : n * jexl.grammar.functions.factorial(n - 1)))
  console.log('Factorial of 5:', await jexl.eval('factorial(5)'))

  jexl.addFunction('fibonacci', (n: number): number => {
    if (n <= 1) return n
    let a = 0,
      b = 1
    for (let i = 2; i <= n; i++) {
      ;[a, b] = [b, a + b]
    }
    return b
  })
  console.log('10th Fibonacci number:', await jexl.eval('fibonacci(10)'))
  console.log()

  // String manipulation functions
  console.log('--- String Functions ---')

  jexl.addFunction('slugify', (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  )

  console.log('Slugify:', await jexl.eval('slugify("Hello World! This is a Test.")'))

  jexl.addFunction(
    'wordCount',
    (str: string) =>
      str
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length
  )
  console.log('Word count:', await jexl.eval('wordCount("The quick brown fox jumps")'))

  jexl.addFunction('initials', (name: string) =>
    name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
  )
  jexl.addFunction('mapInitials', (users: Record<string, unknown>[]) =>
    users.map((user) => jexl.grammar.functions.initials(user.name as string))
  )
  console.log('User initials:', await jexl.eval('mapInitials(users)', context))

  jexl.addFunction('randomString', (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  })
  console.log('Random string:', await jexl.eval('randomString(12)'))
  console.log()

  // Array manipulation functions
  console.log('--- Array Functions ---')

  jexl.addFunction('shuffle', (arr: unknown[]) => {
    const shuffled = [...arr]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  })
  console.log('Shuffled numbers:', await jexl.eval('shuffle(numbers)', context))

  jexl.addFunction('chunk', (arr: unknown[], size: number) => {
    const chunks: unknown[][] = []
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size))
    }
    return chunks
  })
  console.log('Chunked array:', await jexl.eval('chunk(numbers, 3)', context))

  jexl.addFunction('flatten', (arr: unknown[][]) => arr.flat())
  console.log('Flatten:', await jexl.eval('flatten([[1, 2], [3, 4], [5]])'))

  jexl.addFunction('groupBy', (arr: Record<string, unknown>[], key: string) => {
    return arr.reduce(
      (groups, item) => {
        const groupKey = String(item[key])
        if (!groups[groupKey]) {
          groups[groupKey] = []
        }
        ;(groups as Record<string, Record<string, unknown>[]>)[groupKey].push(item)
        return groups
      },
      {} as Record<string, Record<string, unknown[]>>
    )
  })
  console.log('Group users by department:', await jexl.eval('groupBy(users, "department")', context))
  console.log()

  // Date/Time functions
  console.log('--- Date/Time Functions ---')

  jexl.addFunction('now', () => new Date().toISOString())
  console.log('Current timestamp:', await jexl.eval('now()'))

  jexl.addFunction('addDays', (dateStr: string, days: number) => {
    const date = new Date(dateStr)
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  })
  console.log('Add 7 days:', await jexl.eval('addDays(currentDate, 7)', context))

  jexl.addFunction('daysBetween', (date1: string, date2: string) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = Math.abs(d2.getTime() - d1.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  })
  console.log('Days between:', await jexl.eval('daysBetween("2024-01-01", "2024-01-15")'))

  jexl.addFunction('formatDate', (dateStr: string, format = 'MM/DD/YYYY') => {
    const date = new Date(dateStr)
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const yyyy = date.getFullYear()

    return format.replace('MM', mm).replace('DD', dd).replace('YYYY', yyyy.toString())
  })
  console.log('Format date:', await jexl.eval('formatDate(currentDate, "DD/MM/YYYY")', context))
  console.log()

  // Validation functions
  console.log('--- Validation Functions ---')

  jexl.addFunction('isEmail', (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  })
  console.log('Valid email:', await jexl.eval('isEmail("user@example.com")'))
  console.log('Invalid email:', await jexl.eval('isEmail("invalid-email")'))

  jexl.addFunction('isUrl', (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  })
  console.log('Valid URL:', await jexl.eval('isUrl("https://example.com")'))

  jexl.addFunction('isInRange', (value: number, min: number, max: number) => value >= min && value <= max)
  console.log('In range:', await jexl.eval('isInRange(50, 1, 100)'))

  jexl.addFunction('hasProperty', (obj: Record<string, unknown>, prop: string) =>
    Object.prototype.hasOwnProperty.call(obj, prop)
  )
  console.log('Has property:', await jexl.eval('hasProperty(users[0], "salary")', context))
  console.log()

  // Async functions
  console.log('--- Async Functions ---')

  jexl.addFunction('fetchUser', async (userId: number) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 100))
    return {
      id: userId,
      name: `User ${userId}`,
      email: `user${userId}@example.com`,
      active: true,
    }
  })
  console.log('Fetch user:', await jexl.eval('fetchUser(123)'))

  jexl.addFunction('lookupPrice', async (productId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 50))
    const priceDatabase: Record<string, number> = {
      A1: 1200,
      B2: 25,
      C3: 80,
      D4: 150,
    }
    return priceDatabase[productId] || null
  })
  console.log('Lookup price:', await jexl.eval('lookupPrice("A1")'))

  jexl.addFunction('batchProcess', async (items: unknown[], processor: string) => {
    // Simulate batch processing
    await new Promise((resolve) => setTimeout(resolve, 200))
    return {
      processed: items.length,
      processor,
      timestamp: new Date().toISOString(),
      results: items.map((item, index) => ({ id: index, item, status: 'processed' })),
    }
  })
  console.log('Batch process:', await jexl.eval('batchProcess([1, 2, 3], "data-processor")'))
  console.log()

  // Higher-order functions
  console.log('--- Higher-Order Functions ---')

  jexl.addFunction('pipe', (value: unknown, ...functions: string[]) => {
    // This would need careful implementation in a real scenario
    // For demo purposes, showing the concept
    return `Piped ${value} through: ${functions.join(' -> ')}`
  })
  console.log('Pipe concept:', await jexl.eval('pipe("data", "upper", "reverse", "truncate")'))

  // Memoization function for caching expensive operations
  jexl.addFunction(
    'memoize',
    (() => {
      const cache = new Map()
      return (key: string, value: number) => {
        if (cache.has(key)) {
          console.log(`Cache hit for key: ${key}`)
          return cache.get(key)
        }
        console.log(`Cache miss for key: ${key}, computing...`)
        // Simulate expensive operation
        const result = value * value * value + Math.sqrt(value)
        cache.set(key, result)
        return result
      }
    })()
  )

  console.log('Memoized calculation (first call):', await jexl.eval('memoize("calc1", 10)'))
  console.log('Memoized calculation (cached):', await jexl.eval('memoize("calc1", 10)'))
  console.log('Memoized calculation (new key):', await jexl.eval('memoize("calc2", 5)'))
  console.log()

  // Complex business logic functions
  console.log('--- Business Logic Functions ---')

  jexl.addFunction('calculateTax', (amount: number, rate = 0.08) => Math.round(amount * rate * 100) / 100)
  console.log('Calculate tax:', await jexl.eval('calculateTax(1000, 0.085)'))

  jexl.addFunction('applyDiscount', (price: number, discountPercent: number) => price * (1 - discountPercent / 100))
  console.log('Apply 15% discount:', await jexl.eval('applyDiscount(100, 15)'))

  jexl.addFunction('calculateShipping', (weight: number, distance: number) => {
    const baseRate = 5.0
    const weightRate = 0.5
    const distanceRate = 0.1
    return baseRate + weight * weightRate + distance * distanceRate
  })
  console.log('Shipping cost:', await jexl.eval('calculateShipping(2.5, 150)'))

  jexl.addFunction('generateInvoiceNumber', () => {
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')
    return `INV-${year}${month}-${random}`
  })
  console.log('Invoice number:', await jexl.eval('generateInvoiceNumber()'))
  console.log()

  // Complex expressions using multiple functions
  console.log('--- Complex Function Combinations ---')

  console.log(
    'Complex calculation:',
    await jexl.eval('calculateTax(applyDiscount(products[0].price, 10), 0.08)', context)
  )

  console.log('User summary:', await jexl.eval('mapInitials(users) | join(", ")', context))

  jexl.addFunction('filterByDept', (users: Record<string, unknown>[], dept: string) =>
    users.filter((u) => u.department === dept).map((u) => u.salary as number)
  )
  console.log('Engineering team average:', await jexl.eval('average(filterByDept(users, "Engineering"))', context))

  jexl.addFunction('getAvailableProducts', (products: Record<string, unknown>[]) =>
    products.filter((p) => p.inStock).map((p) => p.name as string)
  )
  console.log('Product availability:', await jexl.eval('getAvailableProducts(products) | join(", ")', context))
  console.log()
}

// Run the examples
customFunctionsExamples().catch(console.error)
