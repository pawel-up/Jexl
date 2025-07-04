/**
 * Basic Jexl Usage Examples
 *
 * This file demonstrates the fundamental features of Jexl including:
 * - Basic arithmetic and string operations
 * - Property access and object navigation
 * - Array filtering and manipulation
 * - Conditional expressions
 * - Basic transforms
 */

import { Jexl } from '../src/Jexl.js'

async function basicUsageExamples() {
  const jexl = new Jexl()

  console.log('=== Basic Jexl Usage Examples ===\n')

  // Add common transforms and functions that will be used in examples
  jexl.addTransform('indexOf', (str: string, searchValue: string) => str.indexOf(searchValue))
  jexl.addTransform('join', (arr: unknown[], separator = ',') => arr.join(separator))
  jexl.addTransform('toString', (value: unknown) => String(value))
  jexl.addTransform('map', (arr: Record<string, unknown>[], property: string) => arr.map((item) => item[property]))
  jexl.addTransform('sum', (arr: number[]) => arr.reduce((a, b) => a + b, 0))

  // Sample context data
  const context = {
    user: {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      isActive: true,
      profile: {
        bio: 'Software developer with 5 years of experience',
        skills: ['JavaScript', 'TypeScript', 'Node.js', 'React'],
        location: 'San Francisco',
      },
    },
    orders: [
      { id: 1, total: 150.0, status: 'completed', date: '2024-01-15' },
      { id: 2, total: 89.99, status: 'pending', date: '2024-01-20' },
      { id: 3, total: 234.5, status: 'completed', date: '2024-01-25' },
      { id: 4, total: 45.0, status: 'cancelled', date: '2024-01-30' },
    ],
    settings: {
      theme: 'dark',
      notifications: true,
      currency: 'USD',
    },
  }

  // Basic arithmetic
  console.log('--- Basic Arithmetic ---')
  console.log('2 + 3 * 4:', await jexl.eval('2 + 3 * 4'))
  console.log('(2 + 3) * 4:', await jexl.eval('(2 + 3) * 4'))
  console.log('10 / 2 - 1:', await jexl.eval('10 / 2 - 1'))
  console.log('15 % 4:', await jexl.eval('15 % 4'))
  console.log()

  // String operations
  console.log('--- String Operations ---')
  console.log('String concatenation:', await jexl.eval('"Hello " + "World"'))
  console.log('Template-like concat:', await jexl.eval('"User: " + user.name', context))
  console.log(
    'Complex string building:',
    await jexl.eval('"Email: " + user.email + " (" + user.age + " years old)"', context)
  )
  console.log()

  // Property access
  console.log('--- Property Access ---')
  console.log('Simple property:', await jexl.eval('user.name', context))
  console.log('Nested property:', await jexl.eval('user.profile.location', context))
  console.log('Bracket notation:', await jexl.eval('user["email"]', context))
  console.log('Dynamic property access:', await jexl.eval('user[settings.theme == "dark" ? "name" : "email"]', context))
  console.log()

  // Array operations
  console.log('--- Array Operations ---')
  console.log('Array length:', await jexl.eval('user.profile.skills.length', context))
  console.log('Array access by index:', await jexl.eval('user.profile.skills[0]', context))
  console.log('Last array element:', await jexl.eval('user.profile.skills[user.profile.skills.length - 1]', context))
  console.log('Array contains:', await jexl.eval('"TypeScript" in user.profile.skills', context))
  console.log()

  // Array filtering
  console.log('--- Array Filtering ---')
  console.log('Completed orders:', await jexl.eval('orders[.status == "completed"]', context))
  console.log('Orders over $100:', await jexl.eval('orders[.total > 100]', context))
  console.log('Recent pending orders:', await jexl.eval('orders[.status == "pending" && .total > 50]', context))
  console.log()

  // Comparison operations
  console.log('--- Comparison Operations ---')
  console.log('User is adult:', await jexl.eval('user.age >= 18', context))
  console.log('User is active:', await jexl.eval('user.isActive == true', context))
  console.log('Email domain check:', await jexl.eval('user.email | indexOf("@example.com") > -1', context))
  console.log()

  // Logical operations
  console.log('--- Logical Operations ---')
  console.log('Active adult user:', await jexl.eval('user.isActive && user.age >= 18', context))
  console.log('Has orders or is admin:', await jexl.eval('orders.length > 0 || user.role == "admin"', context))
  console.log('Not cancelled orders:', await jexl.eval('!orders[.status == "cancelled"].length', context))
  console.log()

  // Conditional expressions (ternary)
  console.log('--- Conditional Expressions ---')
  console.log('Age category:', await jexl.eval('user.age < 18 ? "minor" : user.age < 65 ? "adult" : "senior"', context))
  console.log(
    'Status message:',
    await jexl.eval('user.isActive ? "Welcome back!" : "Please activate your account"', context)
  )
  console.log(
    'Order summary:',
    await jexl.eval('orders.length > 0 ? orders.length + " orders found" : "No orders"', context)
  )
  console.log()

  // Built-in functions/properties
  console.log('--- Built-in Functions ---')
  console.log('String length:', await jexl.eval('user.name.length', context))
  console.log()

  // Complex expressions
  console.log('--- Complex Expressions ---')
  console.log(
    'Total of completed orders:',
    await jexl.eval('orders[.status == "completed"] | map("total") | sum', context)
  )

  console.log(
    'User summary:',
    await jexl.eval(
      '"User " + user.name + " has " + orders.length + " orders with total value of $" + (orders | map("total") | sum)',
      context
    )
  )

  console.log(
    'Skills summary:',
    await jexl.eval(
      '"Proficient in " + user.profile.skills.length + " technologies: " + (user.profile.skills | join(", "))',
      context
    )
  )
  console.log()
}

// Run the examples
basicUsageExamples().catch(console.error)
