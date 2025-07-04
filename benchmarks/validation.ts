import { Suite, CliReporter, FileReporter, compareSuites } from '@pawel-up/benchmark'
import { store } from './store.js'
import { Jexl, Validator } from '../lib/Jexl.js'

const file = new FileReporter({ outputDir: store.getHistoryPath('validation') })
const last = await store.loadLatestBenchmark('validation')
const cli = new CliReporter({ format: 'short' })
const suite = new Suite('Validation')

// Initialize Jexl instance and validator
const jexl = new Jexl()
const validator = new Validator(jexl.grammar)

// Add custom transforms and functions for testing
jexl.addTransform('upper', (val: string) => val.toUpperCase())
jexl.addTransform('lower', (val: string) => val.toLowerCase())
jexl.addTransform('split', (val: string, delimiter: string) => val.split(delimiter))
jexl.addTransform('trim', (val: string) => val.trim())
jexl.addTransform('multiply', (val: number, factor: number) => val * factor)

jexl.addFunction('max', (...args: number[]) => Math.max(...args))
jexl.addFunction('min', (...args: number[]) => Math.min(...args))
jexl.addFunction('sum', (...args: number[]) => args.reduce((a, b) => a + b, 0))

// Test data for context validation
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
  ],
  settings: {
    theme: 'dark',
    language: 'en',
    notifications: {
      email: true,
      push: false,
    },
  },
  metadata: {
    version: '1.2.3',
    build: 'production',
  },
}

// === BASIC VALIDATION BENCHMARKS ===

suite.add('Valid simple expression', () => {
  validator.validate('name + " is " + age + " years old"')
})

suite.add('Valid complex expression', () => {
  validator.validate('users[.active == true && .age > 25].name | upper')
})

suite.add('Quick validity check', () => {
  validator.isValid('age >= 18 ? "adult" : "minor"')
})

suite.add('Get first error (valid)', () => {
  validator.getFirstError('name | upper | split(" ")')
})

suite.add('Get first error (invalid)', () => {
  validator.getFirstError('name | unknownTransform +')
})

// === SYNTAX ERROR DETECTION ===

suite.add('Syntax error - incomplete expression', () => {
  validator.validate('name +')
})

suite.add('Syntax error - mismatched brackets', () => {
  validator.validate('users[.age > 18')
})

suite.add('Syntax error - consecutive operators', () => {
  validator.validate('age + + 5')
})

suite.add('Syntax error - empty expression', () => {
  validator.validate('')
})

suite.add('Syntax error - whitespace only', () => {
  validator.validate('   ')
})

// === SEMANTIC VALIDATION ===

suite.add('Unknown function error', () => {
  validator.validate('unknownFunc(age, score)')
})

suite.add('Unknown transform error', () => {
  validator.validate('name | unknownTransform')
})

suite.add('Unknown operator error', () => {
  validator.validate('age ~~ 18')
})

suite.add('Valid with custom functions', () => {
  validator.validate('customFunc(123)', {}, { customFunctions: ['customFunc'] })
})

suite.add('Valid with custom transforms', () => {
  validator.validate('value | customTransform', {}, { customTransforms: ['customTransform'] })
})

// === CONTEXT VALIDATION BENCHMARKS ===

suite.add('Context validation - strict mode (valid)', () => {
  validator.validate('name + " is " + age', simpleContext, { allowUndefinedContext: false })
})

suite.add('Context validation - strict mode (missing prop)', () => {
  validator.validate('name + " has " + salary', simpleContext, { allowUndefinedContext: false })
})

suite.add('Context validation - lenient mode', () => {
  validator.validate('future.feature | someTransform', {}, { allowUndefinedContext: true })
})

suite.add('Deep context validation', () => {
  validator.validate('settings.notifications.email && settings.theme == "dark"', complexContext, {
    allowUndefinedContext: false,
  })
})

suite.add('Array context validation', () => {
  validator.validate('users[.department == "Engineering"][.salary > 70000].name', complexContext, {
    allowUndefinedContext: false,
  })
})

// === PERFORMANCE WARNINGS ===

suite.add('Complex expression warning', () => {
  const complexExpr =
    'a + b + c + d + e + f + g + h + i + j + k + l + m + n + o + p + q + r + s + t + u + v + w + x + y + z'
  validator.validate(complexExpr, {}, { includeWarnings: true })
})

suite.add('Deep nesting warning', () => {
  validator.validate('a.b.c.d.e.f.g.h.i.j.k.l.m.n.o', {}, { maxDepth: 10, includeWarnings: true })
})

suite.add('Long expression warning', () => {
  const longExpr = 'value + '.repeat(100) + '1'
  validator.validate(longExpr, {}, { maxLength: 200, includeWarnings: true })
})

// === COMPREHENSIVE VALIDATION WITH ALL OPTIONS ===

suite.add('Full validation - simple expression', () => {
  validator.validate('name | upper | split(" ")[0]', simpleContext, {
    allowUndefinedContext: false,
    includeWarnings: true,
    includeInfo: true,
    maxDepth: 20,
    maxLength: 1000,
    customTransforms: ['upper', 'split'],
  })
})

suite.add('Full validation - complex expression', () => {
  validator.validate(
    'users[.active == true && .department == "Engineering"][.salary > 75000].name | upper',
    complexContext,
    {
      allowUndefinedContext: false,
      includeWarnings: true,
      includeInfo: true,
      maxDepth: 20,
      maxLength: 1000,
      customTransforms: ['upper'],
    }
  )
})

// === EDGE CASES ===

suite.add('Null input validation', () => {
  validator.validate(null as unknown as string)
})

suite.add('Non-string input validation', () => {
  validator.validate(123 as unknown as string)
})

suite.add('Very long valid expression', () => {
  const longValidExpr = Array(50).fill('age').join(' + ')
  validator.validate(longValidExpr)
})

suite.add('Deeply nested valid expression', () => {
  validator.validate('settings.notifications.email ? users[0].name : "unknown"')
})

// === LEXICAL ANALYSIS ===

suite.add('Lexical validation - valid tokens', () => {
  validator.validate('age >= 18 && name | upper')
})

suite.add('Lexical validation - invalid characters', () => {
  validator.validate('age @ 18')
})

suite.add('Lexical validation - string literals', () => {
  validator.validate('"Hello, world!" + " from " + name')
})

suite.add('Lexical validation - number literals', () => {
  validator.validate('3.14159 * radius * radius')
})

// === EXPRESSION TYPES ===

suite.add('Conditional expression validation', () => {
  validator.validate('age >= 18 ? (score >= 80 ? "Excellent" : "Good") : "Too young"')
})

suite.add('Filter expression validation', () => {
  validator.validate('users[.active == true][.age > 25 && .salary > 60000]')
})

suite.add('Object literal validation', () => {
  validator.validate('{ name: name, isAdult: age >= 18, score: score * 1.1 }')
})

suite.add('Array literal validation', () => {
  validator.validate('[name, age, score, active]')
})

suite.add('Function call validation', () => {
  validator.validate('max(age, score, 100)')
})

suite.add('Transform chain validation', () => {
  validator.validate('name | trim | upper | split(" ")[0] | lower')
})

// === WHITESPACE AND FORMATTING ===

suite.add('Expression with extra whitespace', () => {
  validator.validate('  name   +  " is "   +   age  + " years old"   ')
})

suite.add('Expression with newlines', () => {
  validator.validate(
    `
    users[.active == true]
    | [.department == "Engineering"]
    | [.salary > 70000]
    | .name
    | upper
  `.trim()
  )
})

suite.add('Expression with tabs', () => {
  validator.validate('\tname\t|\tupper\t|\tsplit(" ")\t')
})

// === REAL-WORLD SCENARIOS ===

suite.add('User permission check', () => {
  validator.validate(
    'user.role == "admin" || (user.role == "manager" && user.department == currentDepartment)',
    {},
    { allowUndefinedContext: true }
  )
})

suite.add('Data transformation pipeline', () => {
  validator.validate(
    'data.items | [.status == "active"] | .value | sum',
    {},
    {
      allowUndefinedContext: true,
      customTransforms: ['sum'],
    }
  )
})

suite.add('Template expression', () => {
  validator.validate(
    '"Hello " + (user.firstName || "Guest") + ", you have " + notifications.length + " new messages"',
    {},
    { allowUndefinedContext: true }
  )
})

suite.add('Configuration validation', () => {
  validator.validate('config.features.newUI ? "v2" : "v1"', {}, { allowUndefinedContext: true })
})

// === BATCH VALIDATION ===

suite.add('Validate multiple simple expressions', () => {
  const expressions = ['name', 'age > 18', 'score >= 80', 'active == true', 'name | upper']
  expressions.forEach((expr) => validator.validate(expr))
})

suite.add('Validate multiple complex expressions', () => {
  const expressions = [
    'users[.active == true].name | upper',
    'settings.notifications.email ? "enabled" : "disabled"',
    'age >= 18 ? (score >= 80 ? "Excellent" : "Good") : "Too young"',
    '{ user: name, score: score * 1.1, rank: score > 90 ? "A" : "B" }',
    'users | [.department == "Engineering"] | [.salary > 75000] | .name',
  ]
  expressions.forEach((expr) => validator.validate(expr))
})

const result = await suite.addReporter(cli, 'after-each').addReporter(file, 'after-all').run()

if (last) {
  compareSuites(result, last)
}
