import { Suite, CliReporter, FileReporter, compareSuites } from '@pawel-up/benchmark'
import { store } from './store.js'
import { Jexl } from '../lib/Jexl.js'

const file = new FileReporter({ outputDir: store.getHistoryPath('expressions') })
const last = await store.loadLatestBenchmark('expressions')
const cli = new CliReporter({ format: 'short' })
const suite = new Suite('Expressions')

// Initialize Jexl instance
const jexl = new Jexl()

// Add custom transforms for benchmarks
jexl.addTransform('upper', (val: string) => val.toUpperCase())
jexl.addTransform('lower', (val: string) => val.toLowerCase())
jexl.addTransform('multiply', (val: number, factor: number) => val * factor)
jexl.addTransform('split', (val: string, delimiter: string) => val.split(delimiter))

// Add custom functions for benchmarks
jexl.addFunction('max', (...args: number[]) => Math.max(...args))
jexl.addFunction('min', (...args: number[]) => Math.min(...args))
jexl.addFunction('random', () => Math.random())

// Test data for benchmarks
const simpleContext = {
  name: 'John Doe',
  age: 30,
  active: true,
  score: 85.5,
}

const complexContext = {
  users: [
    { name: 'Alice', age: 25, active: true, department: 'Engineering', salary: 75000 },
    { name: 'Bob', age: 30, active: false, department: 'Marketing', salary: 65000 },
    { name: 'Charlie', age: 35, active: true, department: 'Engineering', salary: 85000 },
    { name: 'Diana', age: 28, active: true, department: 'Sales', salary: 70000 },
    { name: 'Eve', age: 32, active: false, department: 'Engineering', salary: 80000 },
  ],
  settings: {
    theme: 'dark',
    language: 'en',
    notifications: {
      email: true,
      push: false,
      sms: true,
    },
  },
  metadata: {
    version: '1.2.3',
    build: 'production',
    timestamp: Date.now(),
  },
}

// === SIMPLE EXPRESSIONS ===

suite.add('Simple literal', async () => {
  await jexl.eval('"Hello World"')
})

suite.add('Simple identifier', async () => {
  await jexl.eval('name', simpleContext)
})

suite.add('Simple arithmetic', async () => {
  await jexl.eval('age + 10', simpleContext)
})

suite.add('Simple comparison', async () => {
  await jexl.eval('age > 25', simpleContext)
})

suite.add('Simple property access', async () => {
  await jexl.eval('settings.theme', complexContext)
})

// === COMPILATION BENCHMARKS ===

suite.add('Compile simple expression', () => {
  jexl.compile('name + " is " + age + " years old"')
})

suite.add('Compile complex expression', () => {
  jexl.compile('users[.active == true && .age > 30].name | upper')
})

suite.add('Compile nested expression', () => {
  jexl.compile('settings.notifications.email ? "enabled" : "disabled"')
})

// === EVALUATION BENCHMARKS ===

suite.add('Evaluate pre-compiled simple', async () => {
  const expr = jexl.compile('name + " - " + age')
  await expr.eval(simpleContext)
})

suite.add('Evaluate pre-compiled complex', async () => {
  const expr = jexl.compile('users[.department == "Engineering" && .salary > 70000]')
  await expr.eval(complexContext)
})

// === OPERATOR BENCHMARKS ===

suite.add('Binary operations', async () => {
  await jexl.eval('age * 2 + score / 10 - 5', simpleContext)
})

suite.add('Logical operations', async () => {
  await jexl.eval('active && age > 18 && score >= 80', simpleContext)
})

suite.add('String concatenation', async () => {
  await jexl.eval('name + " (" + age + " years old)"', simpleContext)
})

suite.add('Comparison chain', async () => {
  await jexl.eval('age >= 18 && age <= 65 && score > 50', simpleContext)
})

// === TRANSFORM BENCHMARKS ===

suite.add('Single transform', async () => {
  await jexl.eval('name | upper', simpleContext)
})

suite.add('Transform chain', async () => {
  await jexl.eval('name | upper | split(" ")', simpleContext)
})

suite.add('Transform with arguments', async () => {
  await jexl.eval('score | multiply(1.1)', simpleContext)
})

// === FILTER BENCHMARKS ===

suite.add('Simple array filter', async () => {
  await jexl.eval('users[.active == true]', complexContext)
})

suite.add('Complex array filter', async () => {
  await jexl.eval('users[.age > 25 && .department == "Engineering"]', complexContext)
})

suite.add('Nested filter with transform', async () => {
  await jexl.eval('users[.salary > 70000].name | upper', complexContext)
})

suite.add('Multiple condition filter', async () => {
  await jexl.eval('users[.active == true && .age >= 30 && .salary > 75000]', complexContext)
})

// === NESTED ACCESS BENCHMARKS ===

suite.add('Deep property access', async () => {
  await jexl.eval('settings.notifications.email', complexContext)
})

suite.add('Array index access', async () => {
  await jexl.eval('users[0].name', complexContext)
})

suite.add('Dynamic property access', async () => {
  await jexl.eval('settings["th" + "eme"]', complexContext)
})

// === CONDITIONAL BENCHMARKS ===

suite.add('Ternary operator', async () => {
  await jexl.eval('active ? "Yes" : "No"', simpleContext)
})

suite.add('Complex conditional', async () => {
  await jexl.eval('age >= 18 ? (score >= 80 ? "Excellent" : "Good") : "Too young"', simpleContext)
})

suite.add('Elvis operator', async () => {
  await jexl.eval('name ?: "Unknown"', simpleContext)
})

// === FUNCTION BENCHMARKS ===

suite.add('Function call', async () => {
  await jexl.eval('max(10, 20, 30)')
})

suite.add('Function with context', async () => {
  await jexl.eval('max(age, score)', simpleContext)
})

suite.add('Nested function calls', async () => {
  await jexl.eval('max(min(age, 100), 18)', simpleContext)
})

// === OBJECT/ARRAY LITERAL BENCHMARKS ===

suite.add('Object literal', async () => {
  await jexl.eval('{ name: name, isAdult: age >= 18 }', simpleContext)
})

suite.add('Array literal', async () => {
  await jexl.eval('[name, age, score]', simpleContext)
})

suite.add('Complex literal', async () => {
  await jexl.eval('{ user: { name: name, age: age }, scores: [score, score * 1.1] }', simpleContext)
})

// === PERFORMANCE STRESS TESTS ===

suite.add('Long expression chain', async () => {
  await jexl.eval('name | upper | split(" ")[0] | lower', simpleContext)
})

suite.add('Multiple filter operations', async () => {
  await jexl.eval('users[.active == true][.age > 25][.salary > 60000]', complexContext)
})

suite.add('Complex nested expression', async () => {
  await jexl.eval(
    `
    users[.department == "Engineering" && .active == true][.salary > 75000].name
    | upper
  `.trim(),
    complexContext
  )
})

// === END-TO-END BENCHMARKS ===

suite.add('E2E: Parse + Eval simple', async () => {
  await jexl.eval('name + " is " + (age >= 18 ? "adult" : "minor")', simpleContext)
})

suite.add('E2E: Parse + Eval complex', async () => {
  await jexl.eval(
    `
    users[.active == true && .department == "Engineering"][.salary > (80000 * 0.9)].name
    | upper
  `.trim(),
    complexContext
  )
})

suite.add('E2E: Real world scenario', async () => {
  const expr = `
    settings.notifications.email == true ?
      "Email notifications enabled for " + users[.active == true].length + " active users" :
      "Email notifications disabled"
  `.trim()
  await jexl.eval(expr, complexContext)
})

const result = await suite.addReporter(cli, 'after-each').addReporter(file, 'after-all').run()

if (last) {
  compareSuites(result, last)
}
