/**
 * Custom Operators Examples
 *
 * This file demonstrates how to create and use custom operators in Jexl.
 * You can add both binary operators (working with two operands) and
 * unary operators (working with a single operand).
 */

import { Jexl } from '../src/Jexl.js'

async function customOperatorsExamples() {
  const jexl = new Jexl()

  console.log('=== Custom Operators Examples ===\n')

  // Add transforms that will be used in examples
  jexl.addTransform('map', (arr: Record<string, unknown>[], property: string) => arr.map((item) => item[property]))
  jexl.addTransform('filter', (arr: Record<string, unknown>[], property: string, value: unknown) =>
    arr.filter((item) => item[property] === value)
  )
  jexl.addTransform('length', (arr: unknown[]) => arr.length)
  jexl.addTransform('reduce', (arr: number[], fn: string, initial: number) => {
    // For demo purposes, only supporting sum operation
    if (fn === 'sum') return arr.reduce((a, b) => a + b, initial)
    return arr.reduce((a, b) => a + b, initial)
  })
  jexl.addTransform('words', (text: string) => text.split(/\s+/))

  // Length function
  jexl.addFunction('len', (val: unknown) => {
    if (Array.isArray(val)) return val.length
    if (typeof val === 'string') return val.length
    if (typeof val === 'object' && val !== null) return Object.keys(val).length
    return 0
  })

  // Sample data for testing operators
  const context = {
    users: [
      { name: 'Alice', age: 25, score: 85.5 },
      { name: 'Bob', age: 30, score: 92.0 },
      { name: 'Charlie', age: 35, score: 78.3 },
    ],
    numbers: [1, 2, 3, 4, 5],
    text: 'Hello World',
    coordinates: { x: 10, y: 20 },
    inventory: [
      { item: 'laptop', quantity: 5, price: 1200 },
      { item: 'mouse', quantity: 20, price: 25 },
      { item: 'keyboard', quantity: 8, price: 80 },
    ],
  }

  // Binary Operators
  console.log('--- Custom Binary Operators ---')

  // Power operator (**)
  jexl.addBinaryOp('**', 70, (left: number, right: number) => Math.pow(left, right))
  console.log('Power operation:', await jexl.eval('2 ** 8'))
  console.log('Power with variables:', await jexl.eval('users[0].age ** 2', context))

  // Integer division (//)
  jexl.addBinaryOp('//', 60, (left: number, right: number) => Math.floor(left / right))
  console.log('Integer division:', await jexl.eval('17 // 3'))

  // Case-insensitive string equality (~=)
  jexl.addBinaryOp('~=', 20, (left: string, right: string) => left.toLowerCase() === right.toLowerCase())
  console.log('Case-insensitive comparison:', await jexl.eval('"HELLO" ~= "hello"'))
  console.log('Name search:', await jexl.eval('users[.name ~= "ALICE"]', context))

  // String contains operator (~?)
  jexl.addBinaryOp('~?', 20, (left: string, right: string) => left.toLowerCase().includes(right.toLowerCase()))
  console.log('String contains:', await jexl.eval('"JavaScript" ~? "script"'))
  console.log('Text search:', await jexl.eval('text ~? "world"', context))

  // Array intersection (&)
  jexl.addBinaryOp('&', 25, (left: number[], right: number[]) => left.filter((item) => right.includes(item)))
  console.log('Array intersection:', await jexl.eval('[1, 2, 3, 4] & [3, 4, 5, 6]'))

  // Range operator (..)
  jexl.addBinaryOp('..', 30, (left: number, right: number) => {
    const result: number[] = []
    for (let i = left; i <= right; i++) {
      result.push(i)
    }
    return result
  })
  console.log('Range operator:', await jexl.eval('1..5'))
  console.log('Dynamic range:', await jexl.eval('0 .. len(numbers)', context))

  // Coalescing operator (??)
  jexl.addBinaryOp('??', 5, (left: unknown, right: unknown) => left ?? right)
  console.log('Null coalescing:', await jexl.eval('null ?? "default"'))
  console.log('Undefined coalescing:', await jexl.eval('users[0].nickname ?? "No nickname"', context))

  // Distance operator (<->)
  jexl.addBinaryOp('<->', 30, (left: number[], right: number[]) => {
    if (left.length !== 2 || right.length !== 2) return null
    return Math.sqrt(Math.pow(right[0] - left[0], 2) + Math.pow(right[1] - left[1], 2))
  })
  console.log('Distance between points:', await jexl.eval('[0, 0] <-> [3, 4]'))
  console.log()

  // Unary Operators
  console.log('--- Custom Unary Operators ---')

  // Absolute value (||)
  jexl.addUnaryOp('||', (val: number) => Math.abs(val))
  console.log('Absolute value:', await jexl.eval('||-15'))
  console.log('Abs in expression:', await jexl.eval('||(users[0].age - 50)', context))

  // Square root (√)
  jexl.addUnaryOp('√', (val: number) => Math.sqrt(val))
  console.log('Square root:', await jexl.eval('√25'))
  console.log('Sqrt of score:', await jexl.eval('√users[1].score', context))

  // Increment (++)
  jexl.addUnaryOp('++', (val: number) => val + 1)
  console.log('Increment:', await jexl.eval('++5'))

  // Decrement (--)
  jexl.addUnaryOp('--', (val: number) => val - 1)
  console.log('Decrement:', await jexl.eval('--10'))
  console.log('Length of array:', await jexl.eval('--len(numbers)', context))
  console.log('Length of string:', await jexl.eval('--len(text)', context))
  console.log('Length of object:', await jexl.eval('--len(coordinates)', context))

  // Type operator (@)
  jexl.addUnaryOp('@', (val: unknown) => {
    if (val === null) return 'null'
    if (Array.isArray(val)) return 'array'
    return typeof val
  })
  console.log('Type check number:', await jexl.eval('@42'))
  console.log('Type check array:', await jexl.eval('@numbers', context))
  console.log('Type check object:', await jexl.eval('@users[0]', context))

  // JSON stringify ($$)
  jexl.addUnaryOp('$$', (val: unknown) => JSON.stringify(val))
  console.log('JSON stringify:', await jexl.eval('$$coordinates', context))

  // Unique array elements (~)
  jexl.addUnaryOp('~', (val: unknown[]) => [...new Set(val)])
  console.log('Unique elements:', await jexl.eval('~[1, 2, 2, 3, 3, 3, 4]'))

  // Reverse operator (<<)
  jexl.addUnaryOp('<<', (val: unknown) => {
    if (typeof val === 'string') return val.split('').reverse().join('')
    if (Array.isArray(val)) return [...val].reverse()
    return val
  })
  console.log('Reverse string:', await jexl.eval('<<text', context))
  console.log('Reverse array:', await jexl.eval('<<numbers', context))
  console.log()

  // Complex expressions with custom operators
  console.log('--- Complex Expressions with Custom Operators ---')

  // Add helper function for power comparison
  jexl.addFunction('powerFilter', (users: Record<string, unknown>[]) =>
    users.filter((user) => Math.pow(user.age as number, 2) > 700).map((user) => user.name)
  )
  console.log('Power and comparison:', await jexl.eval('powerFilter(users)', context))

  // Add helper function for range mapping
  jexl.addFunction('rangeSquares', (numbers: number[]) => {
    const range = Array.from({ length: numbers.length }, (_, i) => i + 1)
    return range.map((i) => i * i)
  })
  console.log('Range with length:', await jexl.eval('rangeSquares(numbers)', context))

  console.log('String operations combined:', await jexl.eval('text ~= "HELLO WORLD" && text ?? "World"', context))

  console.log('Mathematical operations:', await jexl.eval('√(users[0].age ** 2 + users[1].age ** 2)', context))

  // Add helper function for item extraction and uniqueness
  jexl.addFunction('uniqueItems', (inventory: Record<string, unknown>[]) => [
    ...new Set(inventory.map((item) => item.item)),
  ])
  console.log('Array operations:', await jexl.eval('uniqueItems(inventory)', context))

  // Add helper function for type filtering
  jexl.addFunction('numberScoreUsers', (users: Record<string, unknown>[]) =>
    users.filter((user) => typeof user.score === 'number').map((user) => user.name)
  )
  console.log('Type checking in filter:', await jexl.eval('numberScoreUsers(users)', context))

  // Add helper function for inventory calculation
  jexl.addFunction('totalInventoryValue', (inventory: Record<string, unknown>[]) =>
    inventory.map((item) => (item.quantity as number) * (item.price as number)).reduce((a, b) => a + b, 0)
  )
  console.log('Complex calculation:', await jexl.eval('totalInventoryValue(inventory)', context))
  console.log()

  // Operator precedence demonstration
  console.log('--- Operator Precedence ---')

  // Show how different precedence affects evaluation
  console.log('High precedence power:', await jexl.eval('2 + 3 ** 2')) // Should be 2 + 9 = 11
  console.log('Low precedence range:', await jexl.eval('1 + 2 .. 5')) // Depends on precedence
  console.log('Mixed precedence:', await jexl.eval('(√16) + 2 ** 3')) // Should be 4 + 8 = 12
  console.log()

  // Practical business logic examples
  console.log('--- Practical Business Examples ---')

  // Inventory value calculation with custom operators
  console.log('Total inventory value:', await jexl.eval('totalInventoryValue(inventory)', context))

  // Score grading with custom operators
  jexl.addFunction('grade', (score: number) => {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  })

  // Add helper function for user grades
  jexl.addFunction('userGrades', (users: Record<string, unknown>[]) =>
    users.map((user) => `${user.name}: ${jexl.grammar.functions.grade(user.score as number)}`)
  )
  console.log('User grades:', await jexl.eval('userGrades(users)', context))

  // Add helper function for age group categorization
  jexl.addFunction('ageGroupNames', (users: Record<string, unknown>[]) =>
    users.map((user) => `${user.name} (Group ${Math.floor((user.age as number) / 10)}0s)`)
  )
  console.log('Age groups (by decade):', await jexl.eval('ageGroupNames(users)', context))

  // Text analysis
  console.log('Text analysis:', await jexl.eval('text | words | length', context))
  console.log()
}

// Run the examples
customOperatorsExamples().catch(console.error)
