import { test } from '@japa/runner'
import {
  arrayLibrarySchema,
  arrayFunctionSchemas,
  getArrayFunctionSchema,
  getAllArrayFunctionNames,
} from '../../../../src/definitions/schemas/array.schema.js'

test.group('Array Schema', () => {
  test('should have correct metadata', ({ assert }) => {
    assert.equal(arrayLibrarySchema.title, 'Array Functions')
    assert.equal(arrayLibrarySchema.description, 'Array utility functions')
    assert.equal(arrayLibrarySchema.version, '1.0.0')
    assert.isTrue(arrayLibrarySchema.$id.includes('array.schema.json'))
  })

  test('should contain all expected functions', ({ assert }) => {
    const expectedFunctions = [
      'FIRST',
      'LAST',
      'AT',
      'SORT',
      'SORT_ASC',
      'SORT_DESC',
      'SLICE',
      'JOIN',
      'CONCAT',
      'UNIQUE',
      'FLATTEN',
      'FLATTEN_DEEP',
      'CHUNK',
      'COMPACT',
      'DIFFERENCE',
      'INTERSECTION',
      'UNION',
      'ZIP',
      'SHUFFLE',
      'SAMPLE',
      'SAMPLE_SIZE',
      'COUNT_BY',
      'SUM',
      'AVERAGE',
      'MIN',
      'MAX',
      'RANGE',
      'FILL',
      'EVERY',
      'SOME',
      'NONE',
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

  test('FIRST function should have correct schema', ({ assert }) => {
    const schema = arrayFunctionSchemas.FIRST

    assert.equal(schema.name, 'FIRST')
    assert.equal(schema.description, 'Gets the first element of an array')
    assert.equal(schema.category, 'array')
    assert.equal(schema.parameters.length, 1)
    assert.equal(schema.parameters[0].name, 'arr')
    assert.equal(schema.parameters[0].schema.type, 'array')
    assert.equal(schema.parameters[0].required, true)
    assert.isTrue(Array.isArray(schema.returns.type))
    assert.isArray(schema.examples)
    assert.isTrue((schema.examples || []).length > 0)
  })

  test('LAST function should have correct schema', ({ assert }) => {
    const schema = arrayFunctionSchemas.LAST

    assert.equal(schema.name, 'LAST')
    assert.equal(schema.description, 'Gets the last element of an array')
    assert.equal(schema.category, 'array')
    assert.equal(schema.parameters.length, 1)
    assert.equal(schema.parameters[0].name, 'arr')
    assert.equal(schema.parameters[0].schema.type, 'array')
    assert.equal(schema.returns.description, 'The last element, or undefined if empty')
  })

  test('SUM function should have variadic parameter', ({ assert }) => {
    const schema = arrayFunctionSchemas.SUM

    assert.equal(schema.name, 'SUM')
    assert.equal(schema.parameters.length, 1)
    assert.equal(schema.parameters[0].name, 'args')
    assert.deepEqual(schema.parameters[0].schema.type, ['array', 'number'])
    assert.equal(schema.parameters[0].variadic, true)
    assert.equal(schema.returns.type, 'number')
  })

  test('SORT function should have optional parameter', ({ assert }) => {
    const schema = arrayFunctionSchemas.SORT

    assert.equal(schema.name, 'SORT')
    assert.equal(schema.parameters.length, 2)
    assert.equal(schema.parameters[0].name, 'arr')
    assert.equal(schema.parameters[0].required, true)
    assert.equal(schema.parameters[1].name, 'compareFn')
    assert.equal(schema.parameters[1].required, false)
    assert.equal(schema.parameters[1].schema.type, 'object')
  })

  test('CHUNK function should have correct parameters', ({ assert }) => {
    const schema = arrayFunctionSchemas.CHUNK

    assert.equal(schema.name, 'CHUNK')
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
    const schema = getArrayFunctionSchema('FIRST')
    assert.isObject(schema)
    assert.equal(schema?.name, 'FIRST')

    const nonExistent = getArrayFunctionSchema('nonexistent')
    assert.isUndefined(nonExistent)
  })

  test('getAllArrayFunctionNames should return all function names', ({ assert }) => {
    const names = getAllArrayFunctionNames()
    assert.isArray(names)
    assert.isTrue(names.length > 0)
    assert.isTrue(names.includes('FIRST'))
    assert.isTrue(names.includes('LAST'))
    assert.isTrue(names.includes('SUM'))
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

  test('SLICE function should have correct parameters', ({ assert }) => {
    const schema = arrayFunctionSchemas.SLICE

    assert.equal(schema.name, 'SLICE')
    assert.equal(schema.description, 'Extracts a slice of an array')
    assert.equal(schema.category, 'array')
    assert.equal(schema.parameters.length, 3)
    assert.equal(schema.parameters[0].name, 'arr')
    assert.equal(schema.parameters[1].name, 'start')
    assert.equal(schema.parameters[2].name, 'end')
    assert.equal(schema.parameters[2].required, false)
  })

  test('JOIN function should have correct parameters', ({ assert }) => {
    const schema = arrayFunctionSchemas.JOIN

    assert.equal(schema.name, 'JOIN')
    assert.equal(schema.description, 'Joins an array into a string with a separator')
    assert.equal(schema.category, 'array')
    assert.equal(schema.parameters.length, 2)
    assert.equal(schema.parameters[0].name, 'arr')
    assert.equal(schema.parameters[1].name, 'separator')
    assert.equal(schema.parameters[1].required, false)
    assert.equal(schema.returns.type, 'string')
  })

  test('CONCAT function should have variadic parameter', ({ assert }) => {
    const schema = arrayFunctionSchemas.CONCAT

    assert.equal(schema.name, 'CONCAT')
    assert.equal(schema.parameters.length, 1)
    assert.equal(schema.parameters[0].name, 'arrays')
    assert.equal(schema.parameters[0].variadic, true)
    assert.equal(schema.returns.type, 'array')
  })

  test('RANGE function should have correct parameters', ({ assert }) => {
    const schema = arrayFunctionSchemas.RANGE

    assert.equal(schema.name, 'RANGE')
    assert.equal(schema.description, 'Creates an array of numbers within a specified range.')
    assert.equal(schema.category, 'array')
    assert.equal(schema.parameters.length, 3)
    assert.equal(schema.parameters[0].name, 'start')
    assert.equal(schema.parameters[1].name, 'end')
    assert.equal(schema.parameters[2].name, 'step')
    assert.equal(schema.parameters[2].required, false)
  })

  test('EVERY function should have correct schema', ({ assert }) => {
    const schema = arrayFunctionSchemas.EVERY

    assert.equal(schema.name, 'EVERY')
    assert.equal(schema.description, 'Checks if all elements in an array are truthy.')
    assert.equal(schema.category, 'array')
    assert.equal(schema.parameters.length, 1)
    assert.equal(schema.returns.type, 'boolean')
  })

  test('SOME function should have correct schema', ({ assert }) => {
    const schema = arrayFunctionSchemas.SOME

    assert.equal(schema.name, 'SOME')
    assert.equal(schema.description, 'Checks if any element in an array is truthy.')
    assert.equal(schema.category, 'array')
    assert.equal(schema.parameters.length, 1)
    assert.equal(schema.returns.type, 'boolean')
  })

  test('NONE function should have correct schema', ({ assert }) => {
    const schema = arrayFunctionSchemas.NONE

    assert.equal(schema.name, 'NONE')
    assert.equal(schema.description, 'Checks if no elements in an array are truthy.')
    assert.equal(schema.category, 'array')
    assert.equal(schema.parameters.length, 1)
    assert.equal(schema.returns.type, 'boolean')
  })
})
