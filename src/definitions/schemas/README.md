# Function Schema Integration Examples

This document shows how to use the exported JSON schemas with various tools and editors.

## JSON Schema System

This system uses JSON Schema (JSONSchema7) for standardized type definitions:

- **`types.ts`** - Shared type definitions using JSONSchema7
- **`utils.ts`** - Helper functions for creating and validating schemas with JSON Schema
- **`integrations.ts`** - Integration utilities for various editors and tools
- **`[library].schema.ts`** - Individual library schemas (array, string, math, date)

### Available Schema Files

- `array.schema.ts` - Array function schemas (using JSON Schema)
- `string.schema.ts` - String function schemas
- `math.schema.ts` - Math function schemas
- `date.schema.ts` - Date function schemas

### Creating New Schemas

Use the helper utilities to create new function schemas with JSON Schema:

```typescript
import { createFunctionSchema, createParameter, createLibrarySchema } from '@pawel-up/jexl/schemas/utils.js'

const myFunction = createFunctionSchema(
  'myFunction',
  'Description of my function',
  'category',
  [
    createParameter('param1', 'Description of param1', { type: 'string' }),
    createParameter('param2', 'Description of param2', { type: 'number' }, false),
  ],
  { type: 'boolean', description: 'Description of return value' },
  {
    examples: ['myFunction("test", 42) // true'],
  }
)

const myLibrary = createLibrarySchema(
  { myFunction },
  {
    category: 'custom',
    title: 'My Custom Library',
    description: 'Custom functions for my use case',
    version: '1.0.0',
  }
)
```

## Schema Format

Each function schema follows this structure:

```typescript
interface FunctionSchema {
  name: string
  description: string
  category: string
  parameters: FunctionParameter[]
  returns: FunctionReturn
  examples?: string[]
  since?: string
  deprecated?: boolean
}

interface FunctionParameter {
  name: string
  description: string
  type: string
  required: boolean
  variadic?: boolean
  defaultValue?: unknown
}
```

## Usage Examples

### 1. VS Code Extension Integration

```typescript
import { arrayLibrarySchema } from '@pawel-up/jexl/schemas/schemas/array.schema.js'
import * as vscode from 'vscode'

// Provide autocompletion
export function provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
  const completionItems: vscode.CompletionItem[] = []

  Object.values(arrayLibrarySchema.functions).forEach((func) => {
    const item = new vscode.CompletionItem(func.name, vscode.CompletionItemKind.Function)
    item.detail = func.description
    item.documentation = new vscode.MarkdownString()

    // Add parameters info
    const params = func.parameters.map((p) => `${p.name}: ${p.type}`).join(', ')
    item.documentation.appendMarkdown(`**${func.name}**(${params}) → ${func.returns.type}\n\n`)
    item.documentation.appendMarkdown(`${func.description}\n\n`)

    // Add examples
    if (func.examples) {
      item.documentation.appendMarkdown('**Examples:**\n')
      func.examples.forEach((example) => {
        item.documentation.appendMarkdown(`\`\`\`typescript\n${example}\n\`\`\`\n`)
      })
    }

    completionItems.push(item)
  })

  return completionItems
}
```

### 2. CodeMirror Integration

```typescript
import { arrayLibrarySchema } from '@pawel-up/jexl/schemas/schemas/array.schema.js'
import { CompletionContext, CompletionResult } from '@codemirror/autocomplete'

// CodeMirror autocompletion
export function jexlCompletion(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/\w*/)
  if (!word) return null

  const options = Object.values(arrayLibrarySchema.functions).map((func) => ({
    label: func.name,
    type: 'function',
    info: func.description,
    detail: `${func.name}(${func.parameters.map((p) => p.name).join(', ')}) → ${func.returns.type}`,
    apply: func.name,
  }))

  return {
    from: word.from,
    options,
  }
}
```

### 3. Monaco Editor Integration

```typescript
import * as monaco from 'monaco-editor'
import { arrayLibrarySchema } from '@pawel-up/jexl/schemas/schemas/array.schema.js'

// Monaco Editor autocompletion
export function registerJexlLanguage() {
  monaco.languages.register({ id: 'jexl' })

  monaco.languages.registerCompletionItemProvider('jexl', {
    provideCompletionItems: () => {
      const suggestions = Object.values(arrayLibrarySchema.functions).map((func) => ({
        label: func.name,
        kind: monaco.languages.CompletionItemKind.Function,
        detail: func.description,
        documentation: {
          value: [
            `**${func.name}**(${func.parameters.map((p) => `${p.name}: ${p.type}`).join(', ')}) → ${func.returns.type}`,
            '',
            func.description,
            '',
            ...(func.examples ? ['**Examples:**', ...func.examples.map((ex) => `\`${ex}\``)] : []),
          ].join('\n'),
        },
        insertText: func.name,
      }))

      return { suggestions }
    },
  })
}
```

### 4. Language Server Protocol (LSP)

```typescript
import { arrayLibrarySchema } from '@pawel-up/jexl/schemas/schemas/array.schema.js'
import { CompletionItem, CompletionItemKind } from 'vscode-languageserver'

export function getCompletionItems(): CompletionItem[] {
  return Object.values(arrayLibrarySchema.functions).map((func) => ({
    label: func.name,
    kind: CompletionItemKind.Function,
    detail: func.description,
    documentation: {
      kind: 'markdown',
      value: [
        `**${func.name}**(${func.parameters.map((p) => `${p.name}: ${p.type}`).join(', ')}) → ${func.returns.type}`,
        '',
        func.description,
        '',
        ...(func.examples ? ['**Examples:**', ...func.examples.map((ex) => `\`${ex}\``)] : []),
      ].join('\n'),
    },
  }))
}
```

### 5. JSON Schema for Validation

```typescript
import { arrayLibrarySchema } from '@pawel-up/jexl/schemas/schemas/array.schema.js'
import Ajv from 'ajv'

// Create JSON Schema for function call validation
export function createFunctionCallSchema(functionName: string) {
  const func = arrayLibrarySchema.functions[functionName]
  if (!func) throw new Error(`Function ${functionName} not found`)

  return {
    type: 'object',
    properties: {
      function: { const: functionName },
      arguments: {
        type: 'array',
        items: func.parameters.map((param) => ({
          type: param.type === 'any' ? undefined : param.type,
          description: param.description,
        })),
        minItems: func.parameters.filter((p) => p.required).length,
        maxItems: func.parameters.some((p) => p.variadic) ? undefined : func.parameters.length,
      },
    },
    required: ['function', 'arguments'],
  }
}

// Validate function calls
export function validateFunctionCall(functionName: string, args: unknown[]) {
  const schema = createFunctionCallSchema(functionName)
  const ajv = new Ajv()
  const validate = ajv.compile(schema)

  return validate({ function: functionName, arguments: args })
}
```

### 6. Documentation Generation

```typescript
import { arrayLibrarySchema } from '@pawel-up/jexl/schemas/schemas/array.schema.js'

// Generate markdown documentation
export function generateMarkdownDocs(): string {
  const functions = Object.values(arrayLibrarySchema.functions)

  return [
    `# ${arrayLibrarySchema.title}`,
    '',
    arrayLibrarySchema.description,
    '',
    '## Functions',
    '',
    ...functions
      .map((func) => [
        `### ${func.name}`,
        '',
        func.description,
        '',
        '**Parameters:**',
        '',
        ...func.parameters.map((p) => `- \`${p.name}\` (${p.type}${p.required ? '' : '?'}) - ${p.description}`),
        '',
        `**Returns:** ${func.returns.type} - ${func.returns.description}`,
        '',
        ...(func.examples
          ? ['**Examples:**', '', ...func.examples.map((ex) => `\`\`\`typescript\n${ex}\n\`\`\``), '']
          : []),
      ])
      .flat(),
  ].join('\n')
}
```

### 7. Runtime Function Registration

```typescript
import { arrayLibrarySchema } from '@pawel-up/jexl/schemas/schemas/array.schema.js'
import * as arrayFunctions from './array'

// Dynamically register functions based on schema
export function registerFunctionsFromSchema(jexl: any) {
  Object.entries(arrayLibrarySchema.functions).forEach(([name, schema]) => {
    const func = (arrayFunctions as any)[name]
    if (func) {
      jexl.addFunction(name, func)

      // Add metadata for runtime introspection
      func._schema = schema
      func._category = schema.category
      func._parameters = schema.parameters
      func._returns = schema.returns
    }
  })
}
```

## Schema Export Formats

The schemas are available in multiple formats:

### TypeScript/JavaScript

```typescript
import { arrayLibrarySchema, arrayFunctionSchemas } from '@pawel-up/jexl/schemas/schemas/array.schema.js'
```

### JSON String

```typescript
import { arrayLibrarySchemaJSON } from '@pawel-up/jexl/schemas/schemas/array.schema.js'
const schema = JSON.parse(arrayLibrarySchemaJSON)
```

### Pure JSON File

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://github.com/pawel-up/jexl/schemas/array.schema.json",
  "title": "Jexl Array Functions",
  "functions": {
    "length": {
      "name": "length",
      "description": "Gets the length of an array",
      "parameters": [...]
    }
  }
}
```

This schema-based approach enables:

- **IDE Integration** - Rich autocompletion and type hints
- **Validation** - Runtime validation of function calls
- **Documentation** - Automatic generation of docs
- **Tooling** - Easy integration with various editors and tools
- **Language Servers** - LSP support for any editor
- **Testing** - Schema-based test generation
