import { test } from '@japa/runner'
import {
  createVSCodeCompletionItems,
  createMonacoCompletionItems,
  createCodeMirrorCompletionOptions,
  createLSPCompletionItems,
  createFunctionCallSchema,
  createLibraryValidationSchemas,
  generateFunctionTable,
  generateFunctionCards,
} from '../../../../src/definitions/schemas/integrations.js'
import {
  createLibrarySchema,
  createFunctionSchema,
  createParameter,
} from '../../../../src/definitions/schemas/utils.js'

test.group('Schema Integrations', () => {
  // Create test data
  const testSchema = createFunctionSchema(
    'testFunction',
    'A test function for validation',
    'test',
    [
      createParameter('param1', { type: 'string', description: 'First parameter' }),
      createParameter('param2', { type: 'number', description: 'Second parameter' }, false),
    ],
    { type: 'boolean', description: 'Test result' },
    {
      examples: ['testFunction("hello", 42)', 'testFunction("world")'],
    }
  )

  const testLibrary = createLibrarySchema(
    { testFunction: testSchema },
    {
      category: 'test',
      title: 'Test Library',
      description: 'A test library for integration tests',
      version: '1.0.0',
    }
  )

  test('should create VS Code completion items', ({ assert }) => {
    const completionItems = createVSCodeCompletionItems(testLibrary)

    assert.isArray(completionItems)
    assert.equal(completionItems.length, 1)

    const item = completionItems[0]
    assert.equal(item.label, 'testFunction')
    assert.equal(item.kind, 3) // Function kind
    assert.equal(item.detail, 'A test function for validation')
    assert.equal(item.insertText, 'testFunction')
    assert.equal(item.documentation.kind, 'markdown')
    assert.isString(item.documentation.value)
    assert.isTrue(item.documentation.value.includes('testFunction'))
  })

  test('VS Code documentation should include function signature', ({ assert }) => {
    const completionItems = createVSCodeCompletionItems(testLibrary)
    const documentation = completionItems[0].documentation.value

    assert.isTrue(documentation.includes('param1: string'))
    assert.isTrue(documentation.includes('param2: number'))
    assert.isTrue(documentation.includes('boolean'))
  })

  test('VS Code documentation should include examples', ({ assert }) => {
    const completionItems = createVSCodeCompletionItems(testLibrary)
    const documentation = completionItems[0].documentation.value

    assert.isTrue(documentation.includes('**Examples:**'))
    assert.isTrue(documentation.includes('testFunction("hello", 42)'))
  })

  test('should create Monaco completion items', ({ assert }) => {
    const completionItems = createMonacoCompletionItems(testLibrary)

    assert.isArray(completionItems)
    assert.equal(completionItems.length, 1)

    const item = completionItems[0]
    assert.equal(item.label, 'testFunction')
    assert.equal(item.kind, 1) // Function kind for Monaco
    assert.equal(item.detail, 'A test function for validation')
    assert.equal(item.insertText, 'testFunction')
    assert.isString(item.documentation.value)
  })

  test('Monaco documentation should include function signature', ({ assert }) => {
    const completionItems = createMonacoCompletionItems(testLibrary)
    const documentation = completionItems[0].documentation.value

    assert.isTrue(documentation.includes('param1: string'))
    assert.isTrue(documentation.includes('param2: number'))
    assert.isTrue(documentation.includes('boolean'))
  })

  test('should create CodeMirror completion options', ({ assert }) => {
    const completionOptions = createCodeMirrorCompletionOptions(testLibrary)

    assert.isArray(completionOptions)
    assert.equal(completionOptions.length, 1)

    const option = completionOptions[0]
    assert.equal(option.label, 'testFunction')
    assert.equal(option.type, 'function')
    assert.equal(option.info, 'A test function for validation')
    assert.equal(option.apply, 'testFunction')
    assert.isString(option.detail)
    assert.isTrue(option.detail.includes('testFunction'))
  })

  test('CodeMirror detail should include parameter names', ({ assert }) => {
    const completionOptions = createCodeMirrorCompletionOptions(testLibrary)
    const detail = completionOptions[0].detail

    assert.isTrue(detail.includes('param1, param2'))
    assert.isTrue(detail.includes('boolean'))
  })

  test('should create LSP completion items', ({ assert }) => {
    const completionItems = createLSPCompletionItems(testLibrary)

    assert.isArray(completionItems)
    assert.equal(completionItems.length, 1)

    const item = completionItems[0]
    assert.equal(item.label, 'testFunction')
    assert.equal(item.kind, 3) // Function kind
    assert.equal(item.detail, 'A test function for validation')
    assert.equal(item.documentation.kind, 'markdown')
    assert.isString(item.documentation.value)
  })

  test('LSP documentation should include function signature', ({ assert }) => {
    const completionItems = createLSPCompletionItems(testLibrary)
    const documentation = completionItems[0].documentation.value

    assert.isTrue(documentation.includes('param1: string'))
    assert.isTrue(documentation.includes('param2: number'))
    assert.isTrue(documentation.includes('boolean'))
  })

  test('should create function call schema', ({ assert }) => {
    const schema = createFunctionCallSchema(testSchema)

    assert.isObject(schema)
    assert.equal(schema.type, 'object')
    assert.isObject(schema.properties)

    const properties = schema.properties as Record<string, unknown>
    assert.isObject(properties.function)
    assert.isObject(properties.arguments)
  })

  test('should create library validation schemas', ({ assert }) => {
    const schemas = createLibraryValidationSchemas(testLibrary)

    assert.isObject(schemas)
    assert.isObject(schemas.testFunction)
    assert.equal(Object.keys(schemas).length, 1)
  })

  test('function call schema should have correct structure', ({ assert }) => {
    const schema = createFunctionCallSchema(testSchema)
    const properties = schema.properties as Record<string, unknown>

    // Check function property
    const functionProp = properties.function as Record<string, unknown>
    assert.equal(functionProp.const, 'testFunction')

    // Check arguments property
    const argumentsProp = properties.arguments as Record<string, unknown>
    assert.equal(argumentsProp.type, 'array')
    assert.isArray(argumentsProp.items)
    assert.equal(argumentsProp.minItems, 1) // One required parameter
    assert.equal(argumentsProp.maxItems, 2) // Two total parameters
  })

  test('should generate function table', ({ assert }) => {
    const table = generateFunctionTable(testLibrary)

    assert.isString(table)
    assert.isTrue(table.includes('| Function | Arguments | Description |'))
    assert.isTrue(table.includes('|----------|-----------|-------------|'))
    assert.isTrue(table.includes('testFunction'))
    assert.isTrue(table.includes('A test function for validation'))
  })

  test('should generate function cards', ({ assert }) => {
    const cards = generateFunctionCards(testLibrary)

    assert.isString(cards)
    assert.isTrue(cards.includes('testFunction'))
    assert.isTrue(cards.includes('A test function for validation'))
  })

  test('function table should include all functions', ({ assert }) => {
    const multiSchema = createFunctionSchema(
      'anotherFunction',
      'Another test function',
      'test',
      [createParameter('input', { description: 'Input value' })],
      { type: 'string', description: 'Output value' }
    )

    const multiLibrary = createLibrarySchema(
      { testFunction: testSchema, anotherFunction: multiSchema },
      {
        category: 'test',
        title: 'Multi Test Library',
        description: 'A library with multiple functions',
        version: '1.0.0',
      }
    )

    const table = generateFunctionTable(multiLibrary)

    assert.isTrue(table.includes('testFunction'))
    assert.isTrue(table.includes('anotherFunction'))
  })

  test('should handle empty library', ({ assert }) => {
    const emptyLibrary = createLibrarySchema(
      {},
      {
        category: 'empty',
        title: 'Empty Library',
        description: 'An empty library',
        version: '1.0.0',
      }
    )

    const vsCodeItems = createVSCodeCompletionItems(emptyLibrary)
    const monacoItems = createMonacoCompletionItems(emptyLibrary)
    const codeMirrorOptions = createCodeMirrorCompletionOptions(emptyLibrary)
    const lspItems = createLSPCompletionItems(emptyLibrary)

    assert.deepEqual(vsCodeItems, [])
    assert.deepEqual(monacoItems, [])
    assert.deepEqual(codeMirrorOptions, [])
    assert.deepEqual(lspItems, [])
  })

  test('should handle function without examples', ({ assert }) => {
    const noExamplesSchema = createFunctionSchema('noExamplesFunction', 'A function without examples', 'test', [], {
      type: 'null',
      description: 'Nothing',
    })

    const noExamplesLibrary = createLibrarySchema(
      { noExamplesFunction: noExamplesSchema },
      {
        category: 'test',
        title: 'No Examples Library',
        description: 'A library with functions that have no examples',
        version: '1.0.0',
      }
    )

    const vsCodeItems = createVSCodeCompletionItems(noExamplesLibrary)
    const documentation = vsCodeItems[0].documentation.value

    assert.isFalse(documentation.includes('**Examples:**'))
  })

  test('should handle function with variadic parameters', ({ assert }) => {
    const variadicSchema = createFunctionSchema(
      'variadicFunction',
      'A function with variadic parameters',
      'test',
      [createParameter('args', { description: 'Multiple arguments' }, true, { variadic: true })],
      { description: 'Result' }
    )

    const variadicLibrary = createLibrarySchema(
      { variadicFunction: variadicSchema },
      {
        category: 'test',
        title: 'Variadic Library',
        description: 'A library with variadic functions',
        version: '1.0.0',
      }
    )

    // Use the library to avoid lint error
    assert.isObject(variadicLibrary)

    const schema = createFunctionCallSchema(variadicSchema)
    const properties = schema.properties as Record<string, unknown>
    const argumentsProp = properties.arguments as Record<string, unknown>

    assert.isUndefined(argumentsProp.maxItems) // No max items for variadic
    assert.equal(argumentsProp.minItems, 1) // One required parameter
  })
})
