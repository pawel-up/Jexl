/**
 * Custom Transforms Examples
 *
 * This file demonstrates how to create and use custom transforms in Jexl.
 * Transforms are functions that can be applied to values using the pipe (|) operator.
 * They're perfect for data formatting, manipulation, and processing.
 */

import { Jexl } from '../src/Jexl.js'

async function customTransformsExamples() {
  const jexl = new Jexl()

  console.log('=== Custom Transforms Examples ===\n')

  // Add common array transforms that will be used in examples
  jexl.addTransform('map', (arr: Record<string, unknown>[], property: string) => arr.map((item) => item[property]))
  jexl.addTransform('slice', (arr: unknown[], start: number, end?: number) => arr.slice(start, end))

  // Sample data
  const context = {
    users: [
      { name: 'john doe', email: 'JOHN@EXAMPLE.COM', age: 30, salary: 75000 },
      { name: 'jane smith', email: 'jane@company.org', age: 28, salary: 82000 },
      { name: 'bob johnson', email: 'BOB.J@TECH.COM', age: 35, salary: 95000 },
    ],
    products: [
      { name: 'laptop computer', price: 1299.99, category: 'electronics' },
      { name: 'office chair', price: 249.5, category: 'furniture' },
      { name: 'wireless mouse', price: 29.99, category: 'electronics' },
    ],
    text: 'The quick brown fox jumps over the lazy dog',
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    timestamp: '2024-01-15T10:30:00Z',
  }

  // String transforms
  console.log('--- String Transforms ---')

  // Uppercase transform
  jexl.addTransform('upper', (val: string) => val.toUpperCase())
  console.log('Uppercase:', await jexl.eval('"hello world" | upper'))

  // Lowercase transform
  jexl.addTransform('lower', (val: string) => val.toLowerCase())
  console.log('Lowercase:', await jexl.eval('users[0].email | lower', context))

  // Title case transform
  jexl.addTransform('title', (val: string) =>
    val.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
  )
  console.log('Title case:', await jexl.eval('users[0].name | title', context))

  // Reverse string transform
  jexl.addTransform('reverse', (val: string) => val.split('').reverse().join(''))
  console.log('Reverse:', await jexl.eval('"Jexl" | reverse'))

  // Truncate with ellipsis
  jexl.addTransform('truncate', (val: string, length = 10) =>
    val.length > length ? val.substring(0, length) + '...' : val
  )
  console.log('Truncate:', await jexl.eval('text | truncate(20)', context))
  console.log()

  // Number transforms
  console.log('--- Number Transforms ---')

  // Currency formatting
  jexl.addTransform(
    'currency',
    (val: number, symbol = '$') =>
      `${symbol}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  )
  console.log('Currency:', await jexl.eval('users[0].salary | currency', context))
  console.log('Currency EUR:', await jexl.eval('products[0].price | currency("€")', context))

  // Percentage formatting
  jexl.addTransform('percent', (val: number, decimals = 1) => `${(val * 100).toFixed(decimals)}%`)
  console.log('Percentage:', await jexl.eval('0.75 | percent'))
  console.log('Percentage (3 decimals):', await jexl.eval('0.12345 | percent(3)'))

  // Round numbers
  jexl.addTransform(
    'round',
    (val: number, decimals = 0) => Math.round(val * Math.pow(10, decimals)) / Math.pow(10, decimals)
  )
  console.log('Round:', await jexl.eval('3.14159 | round(2)'))

  // Convert to ordinal
  jexl.addTransform('ordinal', (val: number) => {
    const j = val % 10
    const k = val % 100
    if (j === 1 && k !== 11) return val + 'st'
    if (j === 2 && k !== 12) return val + 'nd'
    if (j === 3 && k !== 13) return val + 'rd'
    return val + 'th'
  })
  console.log('Ordinal:', await jexl.eval('users[0].age | ordinal', context))
  console.log()

  // Array transforms
  console.log('--- Array Transforms ---')

  // Sum array elements
  jexl.addTransform('sum', (val: number[]) => val.reduce((acc, curr) => acc + curr, 0))
  console.log('Sum:', await jexl.eval('numbers | sum', context))

  // Average of array
  jexl.addTransform('avg', (val: number[]) => val.reduce((acc, curr) => acc + curr, 0) / val.length)
  console.log('Average:', await jexl.eval('numbers | avg | round(2)', context))

  // Unique elements
  jexl.addTransform('unique', (val: unknown[]) => [...new Set(val)])
  console.log('Unique categories:', await jexl.eval('products | map("category") | unique', context))

  // Sort array
  jexl.addTransform('sort', (val: unknown[]) => [...val].sort())
  console.log('Sorted names:', await jexl.eval('users | map("name") | sort', context))

  // Shuffle array
  jexl.addTransform('shuffle', (val: unknown[]) => {
    const arr = [...val]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  })
  console.log('Shuffled (random):', await jexl.eval('numbers | slice(0, 5) | shuffle', context))
  console.log()

  // Date/Time transforms
  console.log('--- Date/Time Transforms ---')

  // Format date
  jexl.addTransform('dateFormat', (val: string, format = 'yyyy-mm-dd') => {
    const date = new Date(val)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return format.replace('yyyy', year.toString()).replace('mm', month).replace('dd', day)
  })
  console.log('Date format:', await jexl.eval('timestamp | dateFormat', context))
  console.log('Date format custom:', await jexl.eval('timestamp | dateFormat("dd/mm/yyyy")', context))

  // Time ago
  jexl.addTransform('timeAgo', (val: string) => {
    const now = new Date()
    const date = new Date(val)
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  })
  console.log('Time ago:', await jexl.eval('timestamp | timeAgo', context))
  console.log()

  // Async transforms
  console.log('--- Async Transforms ---')

  // Simulate API call
  jexl.addTransform('fetchUserDetails', async (userId: number) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100))
    return {
      id: userId,
      fullName: `User ${userId}`,
      avatar: `https://api.example.com/avatar/${userId}`,
      lastLogin: new Date().toISOString(),
    }
  })
  console.log('Async user details:', await jexl.eval('1 | fetchUserDetails'))

  // Database lookup simulation
  jexl.addTransform('lookupPrice', async (productId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 50))
    const prices: Record<string, number> = {
      ABC123: 29.99,
      DEF456: 59.99,
      GHI789: 99.99,
    }
    return prices[productId] || 0
  })
  console.log('Product price lookup:', await jexl.eval('"ABC123" | lookupPrice'))
  console.log()

  // Chaining transforms
  console.log('--- Chaining Transforms ---')
  console.log('Complex chain:', await jexl.eval('users[0].name | title | reverse | upper', context))

  console.log('Email processing:', await jexl.eval('users[1].email | lower | truncate(15)', context))

  console.log('Salary formatting:', await jexl.eval('users[2].salary | currency | upper', context))

  console.log('Mathematical chain:', await jexl.eval('numbers | sum | currency("$") | reverse', context))
  console.log()

  // Complex transform with object manipulation
  console.log('--- Complex Object Transforms ---')

  // Group by transform
  jexl.addTransform('groupBy', (val: Record<string, unknown>[], key: string) => {
    return val.reduce(
      (groups, item) => {
        const groupKey = String(item[key])
        if (!groups[groupKey]) {
          groups[groupKey] = []
        }
        ;(groups as Record<string, unknown[]>)[groupKey].push(item)
        return groups
      },
      {} as Record<string, unknown[]>
    )
  })

  console.log('Group products by category:', await jexl.eval('products | groupBy("category")', context))
  console.log()
}

// Run the examples
customTransformsExamples().catch(console.error)
