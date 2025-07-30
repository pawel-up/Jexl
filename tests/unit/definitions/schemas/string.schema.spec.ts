import { test } from '@japa/runner'
import {
  stringLibrarySchema,
  stringFunctionSchemas,
  getStringFunction,
  getStringFunctionNames,
  getStringFunctionCount,
} from '../../../../src/definitions/schemas/string.schema.js'

test.group('String Schema', () => {
  test('should have correct metadata', ({ assert }) => {
    assert.equal(stringLibrarySchema.title, 'String Functions')
    assert.equal(stringLibrarySchema.description, 'String manipulation and utility functions')
    assert.equal(stringLibrarySchema.version, '1.0.0')
    assert.isTrue(stringLibrarySchema.$id.includes('string.schema.json'))
  })

  test('should contain all expected functions', ({ assert }) => {
    const expectedFunctions = [
      'UPPER',
      'LOWER',
      'SUBSTR',
      'SPLIT',
      'REPLACE',
      'CAPITALIZE',
      'TITLE_CASE',
      'CAMEL_CASE',
      'PASCAL_CASE',
      'SNAKE_CASE',
      'KEBAB_CASE',
      'PAD',
      'PAD_START',
      'PAD_END',
      'REPEAT',
      'TRUNCATE',
      'STARTS_WITH',
      'ENDS_WITH',
      'REPLACE_ALL',
      'TRIM',
      'TRIM_START',
      'TRIM_END',
      'SLUG',
      'ESCAPE_HTML',
      'UNESCAPE_HTML',
      'WORD_COUNT',
      'CHAR_COUNT',
      'INITIALS',
      'LINES',
      'NORMALIZE_SPACE',
      'MASK',
      'BETWEEN',
    ]

    const actualFunctions = Object.keys(stringLibrarySchema.functions)
    expectedFunctions.forEach((funcName) => {
      assert.isTrue(actualFunctions.includes(funcName), `Missing function: ${funcName}`)
    })

    assert.equal(actualFunctions.length, expectedFunctions.length, 'Unexpected number of functions')
  })

  test('should have all functions with correct category', ({ assert }) => {
    Object.values(stringLibrarySchema.functions).forEach((func) => {
      assert.equal(func.category, 'string', `Function ${func.name} has incorrect category`)
    })
  })

  test('UPPER function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.UPPER

    assert.equal(schema.name, 'UPPER')
    assert.equal(schema.description, 'Converts a string to uppercase')
    assert.equal(schema.category, 'string')
    assert.equal(schema.parameters.length, 1)
    assert.equal(schema.parameters[0].name, 'str')
    assert.equal(schema.parameters[0].schema.description, 'The string to convert')
    assert.deepEqual(schema.parameters[0].schema, { type: 'string', description: 'The string to convert' })
    assert.equal(schema.parameters[0].required, true)
    assert.deepEqual(schema.returns, { type: 'string', description: 'The uppercase string' })
    assert.isArray(schema.examples)
    assert.isTrue((schema.examples?.length || 0) > 0)
  })

  test('LOWER function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.LOWER

    assert.equal(schema.name, 'LOWER')
    assert.equal(schema.description, 'Converts a string to lowercase')
    assert.equal(schema.category, 'string')
    assert.equal(schema.parameters.length, 1)
    assert.equal(schema.parameters[0].name, 'str')
    assert.equal(schema.parameters[0].schema.description, 'The string to convert')
    assert.deepEqual(schema.parameters[0].schema, { type: 'string', description: 'The string to convert' })
    assert.equal(schema.parameters[0].required, true)
    assert.deepEqual(schema.returns, { type: 'string', description: 'The lowercase string' })
  })

  test('SUBSTR function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.SUBSTR

    assert.equal(schema.name, 'SUBSTR')
    assert.equal(schema.description, 'Extracts a substring from a string')
    assert.equal(schema.parameters.length, 3)

    // First parameter
    assert.equal(schema.parameters[0].name, 'str')
    assert.equal(schema.parameters[0].schema.description, 'The string to extract from')
    assert.deepEqual(schema.parameters[0].schema, { type: 'string', description: 'The string to extract from' })
    assert.equal(schema.parameters[0].required, true)

    // Second parameter
    assert.equal(schema.parameters[1].name, 'start')
    assert.equal(schema.parameters[1].schema.description, 'The starting index')
    assert.deepEqual(schema.parameters[1].schema, { type: 'number', description: 'The starting index' })
    assert.equal(schema.parameters[1].required, true)

    // Third parameter (optional)
    assert.equal(schema.parameters[2].name, 'end')
    assert.deepEqual(schema.parameters[2].schema, { type: 'number', description: 'The ending index (optional)' })
    assert.equal(schema.parameters[2].required, false)

    assert.deepEqual(schema.returns, { type: 'string', description: 'The extracted substring' })
  })

  test('SPLIT function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.SPLIT

    assert.equal(schema.name, 'SPLIT')
    assert.equal(schema.description, 'Splits a string into an array of substrings')
    assert.equal(schema.parameters.length, 2)
    assert.deepEqual(schema.returns, { type: 'array', description: 'An array of substrings' })
  })

  test('REPLACE function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.REPLACE

    assert.equal(schema.name, 'REPLACE')
    assert.equal(schema.description, 'Replaces the first occurrence of a substring with another string')
    assert.equal(schema.parameters.length, 3)

    assert.equal(schema.parameters[0].schema.description, 'The string to search in')
    assert.equal(schema.parameters[0].schema.type, 'string')
    assert.isTrue(schema.parameters[0].required)
    assert.equal(schema.parameters[1].schema.description, 'The substring to replace')
    assert.equal(schema.parameters[1].schema.type, 'string')
    assert.isTrue(schema.parameters[1].required)
    assert.equal(schema.parameters[2].schema.description, 'The replacement string')
    assert.equal(schema.parameters[2].schema.type, 'string')
    assert.isTrue(schema.parameters[2].required)

    assert.deepEqual(schema.returns, { type: 'string', description: 'The string with the first occurrence replaced' })
  })

  test('REPLACE_ALL function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.REPLACE_ALL

    assert.equal(schema.name, 'REPLACE_ALL')
    assert.equal(schema.description, 'Replaces all occurrences of a substring with another string')
    assert.equal(schema.parameters.length, 3)
    assert.deepEqual(schema.returns, { type: 'string', description: 'The string with all occurrences replaced' })
  })

  test('trim functions should have correct schemas', ({ assert }) => {
    const trimFunctions = ['TRIM', 'TRIM_START', 'TRIM_END'] as const

    trimFunctions.forEach((funcName) => {
      const schema = stringFunctionSchemas[funcName]
      assert.equal(schema.name, funcName)
      assert.equal(schema.parameters.length, 1)
      assert.equal(schema.parameters[0].name, 'str')
      assert.deepEqual(schema.parameters[0].schema, { type: 'string', description: 'The string to trim' })
      assert.equal(schema.parameters[0].required, true)
      assert.deepEqual(schema.returns, { type: 'string', description: 'The trimmed string' })
    })
  })

  test('pad functions should have correct schemas', ({ assert }) => {
    const padFunctions = ['PAD_START', 'PAD_END'] as const

    padFunctions.forEach((funcName) => {
      const schema = stringFunctionSchemas[funcName]
      assert.equal(schema.name, funcName)
      assert.equal(schema.parameters.length, 3)

      // First parameter: string to pad
      assert.equal(schema.parameters[0].name, 'str')
      assert.deepEqual(schema.parameters[0].schema, { type: 'string', description: 'The string to pad' })
      assert.equal(schema.parameters[0].required, true)

      // Second parameter: target length
      assert.equal(schema.parameters[1].name, 'targetLength')
      assert.deepEqual(schema.parameters[1].schema, { type: 'number', description: 'The target length' })
      assert.equal(schema.parameters[1].required, true)

      // Third parameter: pad string (optional)
      assert.equal(schema.parameters[2].name, 'padString')
      assert.deepEqual(schema.parameters[2].schema, {
        type: 'string',
        description: 'The string to pad with (optional)',
      })
      assert.equal(schema.parameters[2].required, false)

      assert.deepEqual(schema.returns, { type: 'string', description: 'The padded string' })
    })
  })

  test('CAPITALIZE function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.CAPITALIZE

    assert.equal(schema.name, 'CAPITALIZE')
    assert.equal(schema.description, 'Capitalizes the first letter of a string')
    assert.equal(schema.parameters.length, 1)

    // First parameter: string
    assert.equal(schema.parameters[0].name, 'str')
    assert.deepEqual(schema.parameters[0].schema, { type: 'string', description: 'The string to capitalize' })

    assert.deepEqual(schema.returns, { type: 'string', description: 'The capitalized string' })
  })

  test('TITLE_CASE function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.TITLE_CASE

    assert.equal(schema.name, 'TITLE_CASE')
    assert.equal(schema.description, 'Converts a string to title case')
    assert.equal(schema.parameters.length, 1)

    // Should return string
    assert.deepEqual(schema.returns, { type: 'string', description: 'The title-cased string' })
  })

  test('WORD_COUNT function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.WORD_COUNT

    assert.equal(schema.name, 'WORD_COUNT')
    assert.equal(schema.description, 'Counts the number of words in a string')
    assert.equal(schema.parameters.length, 1)

    // Should have string parameter
    assert.equal(schema.parameters[0].name, 'str')
    assert.deepEqual(schema.parameters[0].schema, { type: 'string', description: 'The string to count words in' })
    assert.equal(schema.parameters[0].required, true)

    assert.deepEqual(schema.returns, { type: 'number', description: 'The number of words in the string' })
  })

  test('boolean returning functions should have correct schemas', ({ assert }) => {
    const booleanFunctions = ['STARTS_WITH', 'ENDS_WITH'] as const

    booleanFunctions.forEach((funcName) => {
      const schema = stringFunctionSchemas[funcName]
      assert.equal(schema.name, funcName)
      assert.isTrue(schema.parameters.length >= 2)

      // Should return boolean
      assert.equal(schema.returns.type, 'boolean')
      assert.isString(schema.returns.description)
    })
  })

  test('MASK function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.MASK

    assert.equal(schema.name, 'MASK')
    assert.equal(schema.description, 'Masks a string by replacing characters with a specified character')
    assert.equal(schema.parameters.length, 4)

    // First parameter: string to mask
    assert.equal(schema.parameters[0].name, 'str')
    assert.deepEqual(schema.parameters[0].schema, { type: 'string', description: 'The string to mask' })
    assert.equal(schema.parameters[0].required, true)

    // Should return string
    assert.equal(schema.returns.type, 'string')
    assert.equal(schema.returns.description, 'The masked string')
  })

  test('SLUG function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.SLUG

    assert.equal(schema.name, 'SLUG')
    assert.equal(schema.description, 'Converts a string to a URL-friendly slug')
    assert.equal(schema.parameters.length, 1)

    // Should return string (slug)
    assert.deepEqual(schema.returns, { type: 'string', description: 'The URL-friendly slug' })
  })

  test('REPEAT function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.REPEAT

    assert.equal(schema.name, 'REPEAT')
    assert.equal(schema.description, 'Repeats a string a specified number of times')
    assert.equal(schema.parameters.length, 2)

    // First parameter: string to repeat
    assert.equal(schema.parameters[0].name, 'str')
    assert.deepEqual(schema.parameters[0].schema, { type: 'string', description: 'The string to repeat' })
    assert.equal(schema.parameters[0].required, true)

    // Second parameter: count
    assert.equal(schema.parameters[1].name, 'count')
    assert.deepEqual(schema.parameters[1].schema, {
      type: 'number',
      description: 'The number of times to repeat the string',
    })
    assert.equal(schema.parameters[1].required, true)

    assert.deepEqual(schema.returns, { type: 'string', description: 'The repeated string' })
  })

  test('BETWEEN function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.BETWEEN

    assert.equal(schema.name, 'BETWEEN')
    assert.equal(schema.description, 'Extracts a substring between two delimiters')
    assert.equal(schema.parameters.length, 3)

    // First parameter: string to extract from
    assert.equal(schema.parameters[0].name, 'str')
    assert.deepEqual(schema.parameters[0].schema, { type: 'string', description: 'The string to extract from' })
    assert.equal(schema.parameters[0].required, true)

    // Second parameter: start delimiter
    assert.equal(schema.parameters[1].name, 'start')
    assert.deepEqual(schema.parameters[1].schema, { type: 'string', description: 'The start delimiter' })
    assert.equal(schema.parameters[1].required, true)

    // Third parameter: end delimiter
    assert.equal(schema.parameters[2].name, 'end')
    assert.deepEqual(schema.parameters[2].schema, { type: 'string', description: 'The end delimiter' })
    assert.equal(schema.parameters[2].required, true)

    assert.deepEqual(schema.returns, { type: 'string', description: 'The extracted substring' })
  })

  test('all functions should have required fields', ({ assert }) => {
    Object.values(stringFunctionSchemas).forEach((schema) => {
      // Required fields
      assert.isString(schema.name, `Function ${schema.name} missing name`)
      assert.isString(schema.description, `Function ${schema.name} missing description`)
      assert.equal(schema.category, 'string', `Function ${schema.name} has wrong category`)
      assert.isArray(schema.parameters, `Function ${schema.name} missing parameters array`)
      assert.isObject(schema.returns, `Function ${schema.name} missing returns object`)

      // Returns should have type and description
      assert.isString(schema.returns.type, `Function ${schema.name} returns missing type`)
      assert.isString(schema.returns.description, `Function ${schema.name} returns missing description`)
    })
  })

  test('all functions should have examples', ({ assert }) => {
    Object.values(stringFunctionSchemas).forEach((schema) => {
      assert.isArray(schema.examples, `Function ${schema.name} missing examples`)
      assert.isTrue((schema.examples?.length || 0) > 0, `Function ${schema.name} has no examples`)

      schema.examples?.forEach((example, index) => {
        assert.isString(example, `Function ${schema.name} example ${index} is not a string`)
        assert.isTrue(example.length > 0, `Function ${schema.name} example ${index} is empty`)
      })
    })
  })

  test('all parameters should have required fields', ({ assert }) => {
    Object.values(stringFunctionSchemas).forEach((schema) => {
      schema.parameters.forEach((param, index) => {
        assert.isString(param.name, `Function ${schema.name} parameter ${index} missing name`)
        assert.isObject(param.schema, `Function ${schema.name} parameter ${index} missing schema`)
        assert.isString(param.schema.description, `Function ${schema.name} parameter ${index} missing description`)
        assert.isBoolean(param.required, `Function ${schema.name} parameter ${index} missing required flag`)

        // Schema should have type
        assert.isString(param.schema.type, `Function ${schema.name} parameter ${index} schema missing type`)
      })
    })
  })

  test('getStringFunction should return correct schema', ({ assert }) => {
    const schema = getStringFunction('UPPER')
    assert.isNotNull(schema)
    assert.equal(schema.name, 'UPPER')

    const nonExistent = getStringFunction('nonExistent')
    assert.isUndefined(nonExistent)
  })

  test('getStringFunctionNames should return all function names', ({ assert }) => {
    const names = getStringFunctionNames()
    assert.isArray(names)
    assert.isTrue(names.length > 0)
    assert.isTrue(names.includes('UPPER'))
    assert.isTrue(names.includes('LOWER'))
    assert.isTrue(names.includes('TRIM'))
    assert.isTrue(names.includes('SPLIT'))
  })

  test('getStringFunctionCount should return correct count', ({ assert }) => {
    const count = getStringFunctionCount()
    assert.isNumber(count)
    assert.equal(count, Object.keys(stringFunctionSchemas).length)
    assert.isTrue(count > 30) // We have 32 functions
  })

  test('should have valid JSON schema structure', ({ assert }) => {
    // Test that the schema is valid JSON Schema
    assert.isString(stringLibrarySchema.$schema)
    assert.isString(stringLibrarySchema.$id)
    assert.isString(stringLibrarySchema.title)
    assert.isString(stringLibrarySchema.description)
    assert.isString(stringLibrarySchema.version)
    assert.isObject(stringLibrarySchema.functions)
  })

  test('should be serializable to JSON', ({ assert }) => {
    // Test that the schema can be serialized to JSON without errors
    const jsonString = JSON.stringify(stringLibrarySchema)
    assert.isString(jsonString)
    assert.isTrue(jsonString.length > 0)

    // Test that it can be parsed back
    const parsed = JSON.parse(jsonString)
    assert.isObject(parsed)
    assert.equal(parsed.title, stringLibrarySchema.title)
  })

  test('examples should be valid strings', ({ assert }) => {
    Object.values(stringFunctionSchemas).forEach((schema) => {
      schema.examples?.forEach((example, index) => {
        assert.isString(example, `Function ${schema.name} example ${index} should be a string`)
        assert.isTrue(example.trim().length > 0, `Function ${schema.name} example ${index} should not be empty`)
        assert.isFalse(
          example.includes('undefined'),
          `Function ${schema.name} example ${index} should not contain 'undefined'`
        )
      })
    })
  })

  test('examples should contain function calls', ({ assert }) => {
    Object.values(stringFunctionSchemas).forEach((schema) => {
      schema.examples?.forEach((example, index) => {
        assert.isTrue(
          example.includes(`${schema.name}(`),
          `Function ${schema.name} example ${index} should contain function call: ${example}`
        )
      })
    })
  })

  test('parameter names should be consistent', ({ assert }) => {
    // Test that parameters have meaningful names
    Object.values(stringFunctionSchemas).forEach((schema) => {
      schema.parameters.forEach((param) => {
        if (param.schema.type === 'string') {
          // String parameters should have meaningful names
          assert.isTrue(
            param.name.length > 1,
            `Function ${schema.name} string parameter '${param.name}' should have meaningful name`
          )
        }

        if (param.schema.type === 'number') {
          // Number parameters should have meaningful names
          assert.isTrue(
            param.name.length > 1,
            `Function ${schema.name} number parameter '${param.name}' should have meaningful name`
          )
        }
      })
    })
  })

  test('functions should have consistent naming', ({ assert }) => {
    Object.values(stringFunctionSchemas).forEach((schema) => {
      // Function names should be UPPER_CASE
      assert.isTrue(/^[A-Z][A-Z0-9_]*$/.test(schema.name), `Function ${schema.name} should be UPPER_CASE`)

      // Function names should be descriptive
      assert.isTrue(schema.name.length > 2, `Function ${schema.name} should have a descriptive name`)
    })
  })

  test('return types should be appropriate', ({ assert }) => {
    const validReturnTypes = ['string', 'number', 'boolean', 'array', 'object']

    Object.values(stringFunctionSchemas).forEach((schema) => {
      const returnType = schema.returns.type
      assert.isTrue(
        returnType && validReturnTypes.includes(returnType as string),
        `Function ${schema.name} has invalid return type: ${returnType}`
      )
    })
  })
})
