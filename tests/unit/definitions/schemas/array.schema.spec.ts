import { test } from '@japa/runner'
import {
  arrayLibrarySchema,
  arrayFunctionSchemas,
  getArrayFunctionSchema,
  getAllArrayFunctionNames,
} from '../../../../src/definitions/schemas/array.schema.js'

test.group('Array Schema', () => {
  test('should have correct metadata', ({ assert }) => {
    assert.equal(arrayLibrarySchema.title, 'Jexl Array Functions')
    assert.equal(arrayLibrarySchema.description, 'Comprehensive array utility functions for Jexl expressions')
    assert.equal(arrayLibrarySchema.version, '1.0.0')
    assert.isTrue(arrayLibrarySchema.$id.includes('array.schema.json'))
  })

  test('should contain all expected functions', ({ assert }) => {
    const expectedFunctions = [
      'length',
      'isEmpty',
      'isNotEmpty',
      'first',
      'last',
      'at',
      'contains',
      'sum',
      'chunk',
      'unique',
      'flatten',
      'reverse',
      'sort',
    ]

    const actualFunctions = Object.keys(arrayLibrarySchema.functions)
    expectedFunctions.forEach((funcName) => {
      assert.isTrue(actualFunctions.includes(funcName), `Missing function: ${funcName}`)
    })
  })

  test('should have all functions with correct category', ({ assert }) => {
    Object.values(arrayLibrarySchema.functions).forEach((func) => {
      assert.equal(func.category, 'array', `Function ${func.name} has incorrect category`)
    })
  })

  test('length function should have correct schema', ({ assert }) => {
    const schema = arrayFunctionSchemas.length

    assert.equal(schema.name, 'length')
    assert.equal(schema.description, 'Gets the length of an array')
    assert.equal(schema.category, 'array')
    assert.equal(schema.parameters.length, 1)
    assert.equal(schema.parameters[0].name, 'arr')
    assert.equal(schema.parameters[0].schema.type, 'array')
    assert.equal(schema.parameters[0].required, true)
    assert.equal(schema.returns.type, 'number')
    assert.isArray(schema.examples)
    assert.isTrue((schema.examples || []).length > 0)
  })

  test('isEmpty function should have correct schema', ({ assert }) => {
    const schema = arrayFunctionSchemas.isEmpty

    assert.equal(schema.name, 'isEmpty')
    assert.equal(schema.description, 'Checks if an array is empty')
    assert.equal(schema.category, 'array')
    assert.equal(schema.parameters.length, 1)
    assert.equal(schema.parameters[0].name, 'arr')
    assert.equal(schema.parameters[0].schema.type, 'array')
    assert.equal(schema.returns.type, 'boolean')
  })

  test('sum function should have variadic parameter', ({ assert }) => {
    const schema = arrayFunctionSchemas.sum

    assert.equal(schema.name, 'sum')
    assert.equal(schema.parameters.length, 1)
    assert.equal(schema.parameters[0].name, 'args')
    assert.deepEqual(schema.parameters[0].schema.type, ['array', 'number'])
    assert.equal(schema.parameters[0].variadic, true)
    assert.equal(schema.returns.type, 'number')
  })

  test('sort function should have optional parameter', ({ assert }) => {
    const schema = arrayFunctionSchemas.sort

    assert.equal(schema.name, 'sort')
    assert.equal(schema.parameters.length, 2)
    assert.equal(schema.parameters[0].name, 'arr')
    assert.equal(schema.parameters[0].required, true)
    assert.equal(schema.parameters[1].name, 'compareFn')
    assert.equal(schema.parameters[1].required, false)
    assert.equal(schema.parameters[1].schema.type, 'object')
  })

  test('chunk function should have correct parameters', ({ assert }) => {
    const schema = arrayFunctionSchemas.chunk

    assert.equal(schema.name, 'chunk')
    assert.equal(schema.parameters.length, 2)
    assert.equal(schema.parameters[0].name, 'arr')
    assert.equal(schema.parameters[0].schema.type, 'array')
    assert.equal(schema.parameters[1].name, 'size')
    assert.equal(schema.parameters[1].schema.type, 'number')
    assert.equal(schema.returns.type, 'array')
  })

  test('all functions should have required fields', ({ assert }) => {
    Object.values(arrayFunctionSchemas).forEach((schema) => {
      assert.isString(schema.name, `Function ${schema.name} should have a name`)
      assert.isString(schema.description, `Function ${schema.name} should have a description`)
      assert.isString(schema.category, `Function ${schema.name} should have a category`)
      assert.isArray(schema.parameters, `Function ${schema.name} should have parameters array`)
      assert.isObject(schema.returns, `Function ${schema.name} should have returns object`)
      assert.isTrue(
        typeof schema.returns.type === 'string' || Array.isArray(schema.returns.type),
        `Function ${schema.name} should have return type`
      )
      assert.isString(schema.returns.description, `Function ${schema.name} should have return description`)
    })
  })

  test('all functions should have examples', ({ assert }) => {
    Object.values(arrayFunctionSchemas).forEach((schema) => {
      assert.isArray(schema.examples, `Function ${schema.name} should have examples`)
      assert.isTrue((schema.examples || []).length > 0, `Function ${schema.name} should have at least one example`)
    })
  })

  test('all parameters should have required fields', ({ assert }) => {
    Object.values(arrayFunctionSchemas).forEach((schema) => {
      schema.parameters.forEach((param, index) => {
        assert.isString(param.name, `Function ${schema.name} parameter ${index} should have a name`)
        assert.isObject(param.schema, `Function ${schema.name} parameter ${index} should have a schema`)
        assert.isString(
          param.schema.description,
          `Function ${schema.name} parameter ${index} should have a description`
        )
        assert.isBoolean(param.required, `Function ${schema.name} parameter ${index} should have required field`)
      })
    })
  })

  test('getArrayFunctionSchema should return correct schema', ({ assert }) => {
    const schema = getArrayFunctionSchema('length')
    assert.isObject(schema)
    assert.equal(schema?.name, 'length')

    const nonExistent = getArrayFunctionSchema('nonexistent')
    assert.isUndefined(nonExistent)
  })

  test('getAllArrayFunctionNames should return all function names', ({ assert }) => {
    const names = getAllArrayFunctionNames()
    assert.isArray(names)
    assert.isTrue(names.length > 0)
    assert.isTrue(names.includes('length'))
    assert.isTrue(names.includes('isEmpty'))
    assert.isTrue(names.includes('sum'))
  })

  test('should have valid JSON schema structure', ({ assert }) => {
    assert.isString(arrayLibrarySchema.$schema)
    assert.isString(arrayLibrarySchema.$id)
    assert.isString(arrayLibrarySchema.title)
    assert.isString(arrayLibrarySchema.description)
    assert.isString(arrayLibrarySchema.version)
    assert.isObject(arrayLibrarySchema.functions)
  })

  test('should be serializable to JSON', ({ assert }) => {
    const json = JSON.stringify(arrayLibrarySchema)
    const parsed = JSON.parse(json)

    assert.deepEqual(parsed, arrayLibrarySchema)
  })

  test('examples should be valid strings', ({ assert }) => {
    Object.values(arrayFunctionSchemas).forEach((schema) => {
      schema.examples?.forEach((example, index) => {
        assert.isString(example, `Function ${schema.name} example ${index} should be a string`)
        assert.isTrue(example.length > 0, `Function ${schema.name} example ${index} should not be empty`)
      })
    })
  })

  test('examples should contain function calls', ({ assert }) => {
    Object.values(arrayFunctionSchemas).forEach((schema) => {
      schema.examples?.forEach((example, index) => {
        assert.isTrue(
          example.includes(schema.name),
          `Function ${schema.name} example ${index} should contain the function name`
        )
      })
    })
  })
})
