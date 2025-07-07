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
    assert.equal(stringLibrarySchema.title, 'Jexl String Functions')
    assert.equal(stringLibrarySchema.description, 'String manipulation and utility functions for Jexl expressions')
    assert.equal(stringLibrarySchema.version, '1.0.0')
    assert.isTrue(stringLibrarySchema.$id.includes('string.schema.json'))
  })

  test('should contain all expected functions', ({ assert }) => {
    const expectedFunctions = [
      'upper',
      'lower',
      'substr',
      'split',
      'join',
      'replace',
      'replaceAll',
      'trim',
      'trimStart',
      'trimEnd',
      'padStart',
      'padEnd',
      'charAt',
      'charCodeAt',
      'fromCharCode',
      'indexOf',
      'lastIndexOf',
      'includes',
      'startsWith',
      'endsWith',
      'match',
      'search',
      'repeat',
      'slice',
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

  test('upper function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.upper

    assert.equal(schema.name, 'upper')
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

  test('lower function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.lower

    assert.equal(schema.name, 'lower')
    assert.equal(schema.description, 'Converts a string to lowercase')
    assert.equal(schema.category, 'string')
    assert.equal(schema.parameters.length, 1)
    assert.equal(schema.parameters[0].name, 'str')
    assert.equal(schema.parameters[0].schema.description, 'The string to convert')
    assert.deepEqual(schema.parameters[0].schema, { type: 'string', description: 'The string to convert' })
    assert.equal(schema.parameters[0].required, true)
    assert.deepEqual(schema.returns, { type: 'string', description: 'The lowercase string' })
  })

  test('substr function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.substr

    assert.equal(schema.name, 'substr')
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

  test('split function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.split

    assert.equal(schema.name, 'split')
    assert.equal(schema.description, 'Splits a string into an array of substrings')
    assert.equal(schema.parameters.length, 2)
    assert.deepEqual(schema.returns, { type: 'array', description: 'An array of substrings' })
  })

  test('join function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.join

    assert.equal(schema.name, 'join')
    assert.equal(schema.description, 'Joins an array of elements into a string')
    assert.equal(schema.parameters.length, 2)

    // First parameter should be array
    assert.equal(schema.parameters[0].name, 'arr')
    assert.equal(schema.parameters[0].schema.description, 'The array to join')
    assert.deepEqual(schema.parameters[0].schema, { type: 'array', description: 'The array to join' })

    // Second parameter should be string
    assert.equal(schema.parameters[1].name, 'separator')
    assert.equal(schema.parameters[1].schema.description, 'The separator to use for joining')
    assert.deepEqual(schema.parameters[1].schema, { type: 'string', description: 'The separator to use for joining' })

    assert.deepEqual(schema.returns, { type: 'string', description: 'The joined string' })
  })

  test('replace function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.replace

    assert.equal(schema.name, 'replace')
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

  test('replaceAll function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.replaceAll

    assert.equal(schema.name, 'replaceAll')
    assert.equal(schema.description, 'Replaces all occurrences of a substring with another string')
    assert.equal(schema.parameters.length, 3)
    assert.deepEqual(schema.returns, { type: 'string', description: 'The string with all occurrences replaced' })
  })

  test('trim functions should have correct schemas', ({ assert }) => {
    const trimFunctions = ['trim', 'trimStart', 'trimEnd'] as const

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
    const padFunctions = ['padStart', 'padEnd'] as const

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

  test('charAt function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.charAt

    assert.equal(schema.name, 'charAt')
    assert.equal(schema.description, 'Returns the character at a specified index')
    assert.equal(schema.parameters.length, 2)

    // First parameter: string
    assert.equal(schema.parameters[0].name, 'str')
    assert.deepEqual(schema.parameters[0].schema, { type: 'string', description: 'The string to get character from' })

    // Second parameter: index
    assert.equal(schema.parameters[1].name, 'index')
    assert.deepEqual(schema.parameters[1].schema, { type: 'number', description: 'The index of the character' })

    assert.deepEqual(schema.returns, { type: 'string', description: 'The character at the specified index' })
  })

  test('charCodeAt function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.charCodeAt

    assert.equal(schema.name, 'charCodeAt')
    assert.equal(schema.description, 'Returns the Unicode code point of the character at a specified index')
    assert.equal(schema.parameters.length, 2)

    // Should return number (code point)
    assert.deepEqual(schema.returns, { type: 'number', description: 'The Unicode code point of the character' })
  })

  test('fromCharCode function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.fromCharCode

    assert.equal(schema.name, 'fromCharCode')
    assert.equal(schema.description, 'Creates a string from Unicode code points')
    assert.equal(schema.parameters.length, 1)

    // Should have variadic parameter
    assert.equal(schema.parameters[0].name, 'codes')
    assert.deepEqual(schema.parameters[0].schema, { type: 'number', description: 'Unicode code points' })
    assert.equal(schema.parameters[0].required, true)
    assert.equal(schema.parameters[0].variadic, true)

    assert.deepEqual(schema.returns, { type: 'string', description: 'The string created from the code points' })
  })

  test('indexOf and lastIndexOf functions should have correct schemas', ({ assert }) => {
    const indexFunctions = ['indexOf', 'lastIndexOf'] as const

    indexFunctions.forEach((funcName) => {
      const schema = stringFunctionSchemas[funcName]
      assert.equal(schema.name, funcName)
      assert.equal(schema.parameters.length, 3)

      // First parameter: string to search in
      assert.equal(schema.parameters[0].name, 'str')
      assert.deepEqual(schema.parameters[0].schema, { type: 'string', description: 'The string to search in' })
      assert.equal(schema.parameters[0].required, true)

      // Second parameter: search string
      assert.equal(schema.parameters[1].name, 'searchStr')
      assert.deepEqual(schema.parameters[1].schema, { type: 'string', description: 'The substring to search for' })
      assert.equal(schema.parameters[1].required, true)

      // Third parameter: from index (optional)
      assert.equal(schema.parameters[2].name, 'fromIndex')
      assert.deepEqual(schema.parameters[2].schema, {
        type: 'number',
        description: 'The index to start searching from (optional)',
      })
      assert.equal(schema.parameters[2].required, false)

      // Should return number (index)
      assert.deepEqual(schema.returns, {
        type: 'number',
        description:
          funcName === 'indexOf'
            ? 'The index of the first occurrence, or -1 if not found'
            : 'The index of the last occurrence, or -1 if not found',
      })
    })
  })

  test('boolean returning functions should have correct schemas', ({ assert }) => {
    const booleanFunctions = ['includes', 'startsWith', 'endsWith'] as const

    booleanFunctions.forEach((funcName) => {
      const schema = stringFunctionSchemas[funcName]
      assert.equal(schema.name, funcName)
      assert.isTrue(schema.parameters.length >= 2)

      // Should return boolean
      assert.equal(schema.returns.type, 'boolean')
      assert.isString(schema.returns.description)
    })
  })

  test('match function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.match

    assert.equal(schema.name, 'match')
    assert.equal(schema.description, 'Matches a string against a regular expression')
    assert.equal(schema.parameters.length, 2)

    // First parameter: string to match
    assert.equal(schema.parameters[0].name, 'str')
    assert.deepEqual(schema.parameters[0].schema, { type: 'string', description: 'The string to match' })
    assert.equal(schema.parameters[0].required, true)

    // Second parameter: regex pattern
    assert.equal(schema.parameters[1].name, 'regexp')
    assert.deepEqual(schema.parameters[1].schema, { type: 'string', description: 'The regular expression' })
    assert.equal(schema.parameters[1].required, true)

    // Should return array of strings
    assert.equal(schema.returns.type, 'array')
    assert.deepEqual(schema.returns.items, { type: 'string' })
    assert.equal(schema.returns.description, 'An array of matches, or null if no match')
  })

  test('search function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.search

    assert.equal(schema.name, 'search')
    assert.equal(schema.description, 'Searches for a match against a regular expression')
    assert.equal(schema.parameters.length, 2)

    // Should return number (index)
    assert.deepEqual(schema.returns, { type: 'number', description: 'The index of the first match, or -1 if no match' })
  })

  test('repeat function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.repeat

    assert.equal(schema.name, 'repeat')
    assert.equal(schema.description, 'Repeats a string a specified number of times')
    assert.equal(schema.parameters.length, 2)

    // First parameter: string to repeat
    assert.equal(schema.parameters[0].name, 'str')
    assert.deepEqual(schema.parameters[0].schema, { type: 'string', description: 'The string to repeat' })
    assert.equal(schema.parameters[0].required, true)

    // Second parameter: count
    assert.equal(schema.parameters[1].name, 'count')
    assert.deepEqual(schema.parameters[1].schema, { type: 'number', description: 'The number of times to repeat' })
    assert.equal(schema.parameters[1].required, true)

    assert.deepEqual(schema.returns, { type: 'string', description: 'The repeated string' })
  })

  test('slice function should have correct schema', ({ assert }) => {
    const schema = stringFunctionSchemas.slice

    assert.equal(schema.name, 'slice')
    assert.equal(schema.description, 'Extracts a section of a string')
    assert.equal(schema.parameters.length, 3)

    // First parameter: string to slice
    assert.equal(schema.parameters[0].name, 'str')
    assert.deepEqual(schema.parameters[0].schema, { type: 'string', description: 'The string to slice' })
    assert.equal(schema.parameters[0].required, true)

    // Second parameter: start index
    assert.equal(schema.parameters[1].name, 'start')
    assert.deepEqual(schema.parameters[1].schema, { type: 'number', description: 'The start index' })
    assert.equal(schema.parameters[1].required, true)

    // Third parameter: end index (optional)
    assert.equal(schema.parameters[2].name, 'end')
    assert.deepEqual(schema.parameters[2].schema, { type: 'number', description: 'The end index (optional)' })
    assert.equal(schema.parameters[2].required, false)

    assert.deepEqual(schema.returns, { type: 'string', description: 'The extracted section' })
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
    const schema = getStringFunction('upper')
    assert.isNotNull(schema)
    assert.equal(schema.name, 'upper')

    const nonExistent = getStringFunction('nonExistent')
    assert.isUndefined(nonExistent)
  })

  test('getStringFunctionNames should return all function names', ({ assert }) => {
    const names = getStringFunctionNames()
    assert.isArray(names)
    assert.isTrue(names.length > 0)
    assert.isTrue(names.includes('upper'))
    assert.isTrue(names.includes('lower'))
    assert.isTrue(names.includes('trim'))
    assert.isTrue(names.includes('split'))
    assert.isTrue(names.includes('join'))
  })

  test('getStringFunctionCount should return correct count', ({ assert }) => {
    const count = getStringFunctionCount()
    assert.isNumber(count)
    assert.equal(count, Object.keys(stringFunctionSchemas).length)
    assert.isTrue(count > 20) // We have 24 functions
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
      // Function names should be camelCase
      assert.isTrue(/^[a-z][a-zA-Z0-9]*$/.test(schema.name), `Function ${schema.name} should be camelCase`)

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
