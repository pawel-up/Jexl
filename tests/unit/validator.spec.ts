/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from '@japa/runner'
import { Jexl, Validator } from '../../src/index.js'

test.group('Basic validation', (group) => {
  let jexl: Jexl
  let validator: Validator

  group.each.setup(() => {
    jexl = new Jexl()
    validator = new Validator(jexl.grammar)
  })

  test('should validate valid expressions', ({ assert }) => {
    const result = validator.validate('user.name')
    assert.isTrue(result.valid)
    assert.lengthOf(result.errors, 0)
  })

  test('should detect syntax errors', ({ assert }) => {
    const result = validator.validate('user.name |')
    assert.isFalse(result.valid)
    assert.isAbove(result.errors.length, 0)
    assert.include(result.errors[0].message, 'Syntax error')
  })

  test('should detect invalid input', ({ assert }) => {
    const result = validator.validate('')
    assert.isFalse(result.valid)
    assert.lengthOf(result.errors, 1)
    assert.equal(result.errors[0].code, 'INVALID_INPUT')
  })

  test('should detect whitespace-only expressions', ({ assert }) => {
    const result = validator.validate('   ')
    assert.isFalse(result.valid)
    assert.lengthOf(result.errors, 1)
    assert.equal(result.errors[0].code, 'INVALID_INPUT')
  })

  test('should automatically trim expressions', ({ assert }) => {
    const result1 = validator.validate('  user.name  ')
    const result2 = validator.validate('user.name')

    // Both should be equally valid
    assert.isTrue(result1.valid)
    assert.isTrue(result2.valid)
    assert.lengthOf(result1.errors, 0)
    assert.lengthOf(result2.errors, 0)
  })

  test('should preserve internal whitespace while trimming edges', ({ assert }) => {
    // Expression with meaningful internal whitespace
    const result = validator.validate('  a +   b  ')
    assert.isTrue(result.valid)
    assert.lengthOf(result.errors, 0)
  })
})

test.group('Context validation', (group) => {
  let jexl: Jexl
  let validator: Validator

  group.each.setup(() => {
    jexl = new Jexl()
    validator = new Validator(jexl.grammar)
  })

  test('should validate context in strict mode', ({ assert }) => {
    const result = validator.validate(
      'user.age >= 18',
      { user: { name: 'John' } }, // missing 'age' property
      { allowUndefinedContext: false }
    )
    assert.isTrue(result.valid) // syntax is valid
    assert.isAbove(result.warnings.length, 0)
    assert.include(result.warnings[0].message, "Property 'age' not found on object")
  })

  test('should allow undefined context in lenient mode', ({ assert }) => {
    const result = validator.validate(
      'future.feature | someTransform',
      {},
      {
        allowUndefinedContext: true,
        customTransforms: ['someTransform'],
      }
    )
    assert.isTrue(result.valid)
  })

  test('should detect unknown functions', ({ assert }) => {
    const result = validator.validate('unknownFunc(123)')
    assert.isFalse(result.valid)
    assert.lengthOf(result.errors, 1)
    assert.equal(result.errors[0].code, 'UNKNOWN_FUNCTION')
  })

  test('should allow custom functions', ({ assert }) => {
    const result = validator.validate('customFunc(123)', {}, { customFunctions: ['customFunc'] })
    assert.isTrue(result.valid)
  })

  test('should detect unknown transforms', ({ assert }) => {
    const result = validator.validate('value | unknownTransform')
    assert.isFalse(result.valid)
    assert.lengthOf(result.errors, 1)
    assert.equal(result.errors[0].code, 'UNKNOWN_TRANSFORM')
  })

  test('should allow custom transforms', ({ assert }) => {
    const result = validator.validate('value | customTransform', {}, { customTransforms: ['customTransform'] })
    assert.isTrue(result.valid)
  })
})

test.group('Nested context validation', (group) => {
  let jexl: Jexl
  let validator: Validator

  group.each.setup(() => {
    jexl = new Jexl()
    validator = new Validator(jexl.grammar)
  })

  test('should validate valid deep property access', ({ assert }) => {
    const context = { user: { profile: { name: 'John' } } }
    const result = validator.validate('user.profile.name', context, { allowUndefinedContext: false })
    assert.isTrue(result.valid)
    assert.lengthOf(result.warnings, 0)
  })

  test('should warn on missing intermediate property', ({ assert }) => {
    const context = { user: { name: 'John' } } // no 'profile'
    const result = validator.validate('user.profile.name', context, { allowUndefinedContext: false })
    assert.isTrue(result.valid) // syntax is valid
    assert.lengthOf(result.warnings, 1)
    assert.equal(result.warnings[0].code, 'UNDEFINED_PROPERTY')
    assert.include(result.warnings[0].message, "Property 'profile' not found on object")
  })

  test('should warn on missing final property', ({ assert }) => {
    const context = { user: { profile: {} } } // 'name' is missing
    const result = validator.validate('user.profile.name', context, { allowUndefinedContext: false })
    assert.isTrue(result.valid)
    assert.lengthOf(result.warnings, 1)
    assert.equal(result.warnings[0].code, 'UNDEFINED_PROPERTY')
    assert.include(result.warnings[0].message, "Property 'name' not found on object")
  })

  test('should warn on property access on non-object', ({ assert }) => {
    const context = { user: { name: 'John' } }
    const result = validator.validate('user.name.first', context, { allowUndefinedContext: false })
    assert.isTrue(result.valid)
    assert.lengthOf(result.warnings, 1)
    assert.equal(result.warnings[0].code, 'PROPERTY_ACCESS_ON_NON_OBJECT')
    assert.include(result.warnings[0].message, "Cannot access property 'first' on non-object value of type string")
  })

  test('should warn on property access on null', ({ assert }) => {
    const context = { user: null }
    const result = validator.validate('user.name', context, { allowUndefinedContext: false })
    assert.isTrue(result.valid)
    assert.lengthOf(result.warnings, 1)
    assert.equal(result.warnings[0].code, 'PROPERTY_ACCESS_ON_NULL')
    assert.include(result.warnings[0].message, "Cannot access property 'name' of null")
  })

  test('should validate relative paths in filters correctly', ({ assert }) => {
    const context = { users: [{ active: true }, { active: false }] }
    const result = validator.validate('users[.active]', context, { allowUndefinedContext: false })
    assert.isTrue(result.valid)
    assert.lengthOf(result.warnings, 0)
  })

  test('should warn on missing property in relative filter path', ({ assert }) => {
    const context = { users: [{ name: 'A' }, { name: 'B' }] } // 'active' is missing
    const result = validator.validate('users[.active]', context, { allowUndefinedContext: false })
    assert.isTrue(result.valid)
    assert.lengthOf(result.warnings, 1)
    assert.equal(result.warnings[0].code, 'UNDEFINED_PROPERTY')
    assert.include(result.warnings[0].message, "Property 'active' not found on relative context object")
  })

  test('should validate non-relative paths in filters against global context', ({ assert }) => {
    const context = { users: [{ id: 1 }, { id: 2 }], threshold: 1 }
    // 'id' is not relative, so it's looked for on the global context, not the user object.
    const result = validator.validate('users[id > threshold]', context, { allowUndefinedContext: false })
    assert.isTrue(result.valid) // syntax is valid
    assert.lengthOf(result.warnings, 1)
    assert.equal(result.warnings[0].code, 'UNDEFINED_IDENTIFIER')
    assert.include(result.warnings[0].message, "Identifier 'id' not found in context")
  })

  test('should handle complex valid expressions with relative and absolute paths', ({ assert }) => {
    const context = { app: { users: [{ settings: { theme: 'dark' } }], config: { defaultTheme: 'dark' } } }
    const result = validator.validate('app.users[.settings.theme == app.config.defaultTheme]', context, {
      allowUndefinedContext: false,
    })
    assert.isTrue(result.valid)
    assert.lengthOf(result.warnings, 0)
  })
})

test.group('Performance warnings', (group) => {
  let jexl: Jexl
  let validator: Validator

  group.each.setup(() => {
    jexl = new Jexl()
    validator = new Validator(jexl.grammar)
  })

  test('should warn about complex expressions', ({ assert }) => {
    const complexExpr =
      'a + b + c + d + e + f + g + h + i + j + k + l + m + n + o + p + q + r + s + t + u + v + w + x + y + z'
    const result = validator.validate(
      complexExpr,
      {},
      {
        includeWarnings: true,
      }
    )
    assert.isTrue(result.valid)
    assert.isAbove(result.warnings.length, 0)
    assert.isTrue(result.warnings.some((w) => w.code === 'COMPLEX_EXPRESSION'))
  })

  test('should provide info about expression structure', ({ assert }) => {
    const result = validator.validate(
      'user.name',
      {},
      {
        includeInfo: true,
      }
    )
    assert.isTrue(result.valid)
    assert.isAbove(result.info.length, 0)
    assert.isTrue(result.info.some((i) => i.code === 'EXPRESSION_STATS'))
  })

  test('should respect maxDepth option', ({ assert }) => {
    const result = validator.validate('a.b.c.d.e.f.g.h.i.j', {}, { maxDepth: 3 })
    assert.isTrue(result.valid) // syntax is still valid
    assert.isAbove(result.warnings.length, 0)
    assert.isTrue(result.warnings.some((w) => w.code === 'EXPRESSION_TOO_DEEP'))
  })

  test('should respect maxLength option', ({ assert }) => {
    // Create a long but valid expression
    const longExpr = 'a + '.repeat(250) + '1' // "a + a + a + ... + 1"
    const result = validator.validate(longExpr, {}, { maxLength: 100 })
    assert.isTrue(result.valid) // should still be valid syntactically
    assert.isAbove(result.warnings.length, 0) // but should have warnings
    assert.isTrue(result.warnings.some((w) => w.code === 'EXPRESSION_TOO_LONG'))
  })
})

test.group('Quick validation methods', (group) => {
  let jexl: Jexl
  let validator: Validator

  group.each.setup(() => {
    jexl = new Jexl()
    validator = new Validator(jexl.grammar)
  })

  test('should provide quick validity check', ({ assert }) => {
    assert.isTrue(validator.isValid('user.name'))
    assert.isFalse(validator.isValid('user.'))
  })

  test('should return first error', ({ assert }) => {
    const error = validator.getFirstError('user.')
    assert.isNotNull(error)
    if (error) {
      assert.equal(error.severity, 'error')
    }
  })

  test('should return null for valid expressions', ({ assert }) => {
    const error = validator.getFirstError('user.name')
    assert.isNull(error)
  })
})

test.group('Error reporting', (group) => {
  let jexl: Jexl
  let validator: Validator

  group.each.setup(() => {
    jexl = new Jexl()
    validator = new Validator(jexl.grammar)
  })

  test('should provide position information when possible', ({ assert }) => {
    const result = validator.validate('user + +')
    assert.isFalse(result.valid)
    const error = result.errors[0]
    assert.isDefined(error.line)
    assert.isDefined(error.column)
  })

  test('should categorize issues correctly', ({ assert }) => {
    const result = validator.validate(
      'unknownFunc() + validExpression',
      {},
      { includeWarnings: true, includeInfo: true }
    )
    assert.isAbove(result.errors.length, 0) // unknown function
    assert.isAbove(result.issues.length, 0) // all issues combined
  })

  test('should sort issues by position', ({ assert }) => {
    const result = validator.validate(
      'first + unknownFunc() + second',
      {},
      { includeWarnings: true, includeInfo: true }
    )
    // Issues should be sorted by position
    if (result.issues.length > 1) {
      for (let i = 1; i < result.issues.length; i++) {
        const prev = result.issues[i - 1].startPosition ?? 0
        const curr = result.issues[i].startPosition ?? 0
        assert.isAtLeast(curr, prev)
      }
    }
  })
})

test.group('Built-in operators and functions', (group) => {
  let jexl: Jexl
  let validator: Validator

  group.each.setup(() => {
    jexl = new Jexl()
    validator = new Validator(jexl.grammar)
  })

  test('should validate arithmetic operators', ({ assert }) => {
    const expressions = ['2 + 3', '5 - 1', '4 * 2', '8 / 2', '10 % 3', '2 ^ 3']

    expressions.forEach((expr) => {
      const result = validator.validate(expr)
      assert.isTrue(result.valid, `Expression "${expr}" should be valid`)
    })
  })

  test('should validate comparison operators', ({ assert }) => {
    const expressions = ['a > b', 'a < b', 'a >= b', 'a <= b', 'a == b', 'a != b']

    expressions.forEach((expr) => {
      const result = validator.validate(expr)
      assert.isTrue(result.valid, `Expression "${expr}" should be valid`)
    })
  })

  test('should validate logical operators', ({ assert }) => {
    const expressions = ['a && b', 'a || b', '!a']

    expressions.forEach((expr) => {
      const result = validator.validate(expr)
      assert.isTrue(result.valid, `Expression "${expr}" should be valid`)
    })
  })

  test('should detect unknown operators', ({ assert }) => {
    const result = validator.validate('a @@ b') // @@ is not a valid operator
    assert.isFalse(result.valid)
    assert.isAbove(result.errors.length, 0)
  })
})

test.group('Complex expressions', (group) => {
  let jexl: Jexl
  let validator: Validator

  group.each.setup(() => {
    jexl = new Jexl()
    validator = new Validator(jexl.grammar)
  })

  test('should validate conditional expressions', ({ assert }) => {
    const result = validator.validate('age >= 18 ? "adult" : "minor"')
    assert.isTrue(result.valid)
  })

  test('should validate filter expressions', ({ assert }) => {
    const result = validator.validate('users[age > 18]')
    assert.isTrue(result.valid)
  })

  test('should validate nested filters', ({ assert }) => {
    const result = validator.validate('users[active == true][age > 18]')
    assert.isTrue(result.valid)
  })

  test('should validate array literals', ({ assert }) => {
    const result = validator.validate('[1, 2, 3, "hello"]')
    assert.isTrue(result.valid)
  })

  test('should validate object literals', ({ assert }) => {
    const result = validator.validate('{ name: "John", age: 30 }')
    assert.isTrue(result.valid)
  })

  test('should validate property access', ({ assert }) => {
    const result = validator.validate('user.profile.email')
    assert.isTrue(result.valid)
  })

  test('should validate transform chains', ({ assert }) => {
    // Add some transforms to avoid unknown transform errors
    jexl.addTransform('upper', (val: string) => val.toUpperCase())
    jexl.addTransform('trim', (val: string) => val.trim())

    const result = validator.validate('name | trim | upper')
    assert.isTrue(result.valid)
  })
})

test.group('Edge cases', (group) => {
  let jexl: Jexl
  let validator: Validator

  group.each.setup(() => {
    jexl = new Jexl()
    validator = new Validator(jexl.grammar)
  })

  test('should handle null input', ({ assert }) => {
    const result = validator.validate(null as any)
    assert.isFalse(result.valid)
    assert.equal(result.errors[0].code, 'INVALID_INPUT')
  })

  test('should handle non-string input', ({ assert }) => {
    const result = validator.validate(123 as any)
    assert.isFalse(result.valid)
    assert.equal(result.errors[0].code, 'INVALID_INPUT')
  })

  test('should handle very simple expressions', ({ assert }) => {
    const result = validator.validate('42')
    assert.isTrue(result.valid)
  })

  test('should handle identifier expressions', ({ assert }) => {
    const result = validator.validate('userName')
    assert.isTrue(result.valid)
  })

  test('should validate expressions with parentheses', ({ assert }) => {
    const result = validator.validate('(a + b) * c')
    assert.isTrue(result.valid)
  })
})
