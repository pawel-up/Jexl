#!/usr/bin/env node

/**
 * Quick Start Example Runner
 *
 * This script demonstrates the easiest way to get started with Jexl
 * and provides a menu to run different example categories.
 */

import { Jexl } from '../src/Jexl.js'

async function quickStart() {
  console.log('🚀 Welcome to Jexl Examples!')
  console.log('=====================================\n')

  const jexl = new Jexl()

  // Quick demonstration of basic features
  console.log('📚 Basic Jexl Demonstration:')
  console.log('----------------------------')

  const context = {
    user: { name: 'John', age: 30, skills: ['JavaScript', 'Python'] },
    orders: [
      { id: 1, total: 150, status: 'completed' },
      { id: 2, total: 75, status: 'pending' },
    ],
  }

  // Basic evaluation
  console.log('Simple math:', await jexl.eval('2 + 3 * 4'))
  console.log('User name:', await jexl.eval('user.name', context))

  // Add join transform for arrays
  jexl.addTransform('join', (arr: unknown[], separator = ',') => arr.join(separator))
  console.log('User skills:', await jexl.eval('user.skills | join(", ")', context))
  console.log('Completed orders:', await jexl.eval('orders[.status == "completed"]', context))

  // Custom transform
  jexl.addTransform('upper', (val) => val.toUpperCase())
  console.log('Uppercase name:', await jexl.eval('user.name | upper', context))

  // Custom function
  jexl.addFunction('greet', (name) => `Hello, ${name}!`)
  console.log('Greeting:', await jexl.eval('greet(user.name)', context))

  console.log('\n🎯 Available Example Categories:')
  console.log('================================')
  console.log('1. basic-usage.ts      - Fundamental Jexl operations')
  console.log('2. custom-transforms.ts - Creating custom data transforms')
  console.log('3. custom-functions.ts  - Building custom functions')
  console.log('4. custom-operators.ts  - Adding custom operators')
  console.log('5. advanced-features.ts - Advanced Jexl capabilities')
  console.log('6. real-world-use-cases.ts - Practical applications')

  console.log('\n🏃‍♂️  How to run examples:')
  console.log('========================')
  console.log('From the project root:')
  console.log('  npm run example:basic     # Run basic usage examples')
  console.log('  npm run example:all       # Run all examples')
  console.log('')
  console.log('From the examples directory:')
  console.log('  cd examples')
  console.log('  npm run basic            # Run basic usage examples')
  console.log('  npm run all              # Run all examples')
  console.log('')
  console.log('Direct execution:')
  console.log('  node --import ts-node-maintained/register/esm examples/basic-usage.ts')

  console.log('\n💡 Pro Tips:')
  console.log('============')
  console.log('- Start with basic-usage.ts to learn the fundamentals')
  console.log('- Each example builds on concepts from previous ones')
  console.log('- Experiment with the context data in each example')
  console.log('- Check the examples/README.md for detailed explanations')
  console.log('- All examples use TypeScript for better type safety')

  console.log('\n🔗 Next Steps:')
  console.log('==============')
  console.log('1. Run: npm run example:basic')
  console.log('2. Open examples/basic-usage.ts in your editor')
  console.log('3. Modify the context data and expressions')
  console.log('4. Explore other example files')
  console.log('5. Read the main README.md for API documentation')

  console.log('\nHappy coding with Jexl! 🎉')
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  quickStart().catch(console.error)
}

export { quickStart }
