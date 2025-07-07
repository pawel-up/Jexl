/**
 * Integration utilities for consuming Jexl function schemas in various tools
 * These utilities can be used with VS Code, Monaco, CodeMirror, etc.
 */

import type { JSONSchema7 } from 'json-schema'
import type { FunctionFunction } from '../../grammar.js'
import type { Jexl } from '../../Jexl.js'
import type { FunctionSchema, LibrarySchema } from './types.js'

/**
 * Extracts a readable type string from a JSON Schema
 */
function getTypeStringFromSchema(schema: JSONSchema7): string {
  if (schema.type) {
    if (Array.isArray(schema.type)) {
      return schema.type.join(' | ')
    }
    return schema.type
  }

  if (schema.enum) {
    return schema.enum.map((v) => (typeof v === 'string' ? `"${v}"` : String(v))).join(' | ')
  }

  if (schema.anyOf) {
    return schema.anyOf
      .map((s) => (typeof s === 'object' && s !== null && !Array.isArray(s) ? getTypeStringFromSchema(s) : 'unknown'))
      .join(' | ')
  }

  if (schema.oneOf) {
    return schema.oneOf
      .map((s) => (typeof s === 'object' && s !== null && !Array.isArray(s) ? getTypeStringFromSchema(s) : 'unknown'))
      .join(' | ')
  }

  return 'unknown'
}

// VS Code Integration Types and Functions

export interface VSCodeCompletionItem {
  label: string
  kind: number
  detail: string
  documentation: {
    kind: string
    value: string
  }
  insertText: string
}

/**
 * Creates VS Code completion items from library schema
 */
export function createVSCodeCompletionItems(library: LibrarySchema): VSCodeCompletionItem[] {
  return Object.values(library.functions).map((func) => ({
    label: func.name,
    kind: 3, // Function kind
    detail: func.description,
    documentation: {
      kind: 'markdown',
      value: createVSCodeFunctionDocumentation(func),
    },
    insertText: func.name,
  }))
}

/**
 * Creates markdown documentation for VS Code hover/completion
 */
function createVSCodeFunctionDocumentation(func: FunctionSchema): string {
  const params = func.parameters.map((p) => `${p.name}: ${getTypeStringFromSchema(p.schema)}`).join(', ')
  const returnType = getTypeStringFromSchema(func.returns)
  const lines = [`**${func.name}**(${params}) → ${returnType}`, '', func.description, '']

  if (func.examples && func.examples.length > 0) {
    lines.push('**Examples:**')
    func.examples.forEach((example) => {
      lines.push(`\`\`\`typescript\n${example}\n\`\`\``)
    })
  }

  return lines.join('\n')
}

// Monaco Editor Integration Types and Functions

export interface MonacoCompletionItem {
  label: string
  kind: number
  detail: string
  documentation: {
    value: string
  }
  insertText: string
}

/**
 * Creates Monaco completion items from library schema
 */
export function createMonacoCompletionItems(library: LibrarySchema): MonacoCompletionItem[] {
  return Object.values(library.functions).map((func) => ({
    label: func.name,
    kind: 1, // Function kind in Monaco
    detail: func.description,
    documentation: {
      value: createMonacoFunctionDocumentation(func),
    },
    insertText: func.name,
  }))
}

/**
 * Creates documentation for Monaco editor
 */
function createMonacoFunctionDocumentation(func: FunctionSchema): string {
  const params = func.parameters.map((p) => `${p.name}: ${getTypeStringFromSchema(p.schema)}`).join(', ')
  const returnType = getTypeStringFromSchema(func.returns)
  const lines = [`**${func.name}**(${params}) → ${returnType}`, '', func.description, '']

  if (func.examples && func.examples.length > 0) {
    lines.push('**Examples:**')
    func.examples.forEach((example) => {
      lines.push(`\`${example}\``)
    })
  }

  return lines.join('\n')
}

// CodeMirror Integration Types and Functions

export interface CodeMirrorCompletionOption {
  label: string
  type: string
  info: string
  detail: string
  apply: string
}

/**
 * Creates CodeMirror completion options from library schema
 */
export function createCodeMirrorCompletionOptions(library: LibrarySchema): CodeMirrorCompletionOption[] {
  return Object.values(library.functions).map((func) => ({
    label: func.name,
    type: 'function',
    info: func.description,
    detail: createCodeMirrorFunctionDetail(func),
    apply: func.name,
  }))
}

/**
 * Creates function detail string for CodeMirror
 */
function createCodeMirrorFunctionDetail(func: FunctionSchema): string {
  const params = func.parameters.map((p) => p.name).join(', ')
  return `${func.name}(${params}) → ${func.returns.type}`
}

// Language Server Protocol Integration Types and Functions

export interface LSPCompletionItem {
  label: string
  kind: number
  detail: string
  documentation: {
    kind: string
    value: string
  }
}

/**
 * Creates LSP completion items from library schema
 */
export function createLSPCompletionItems(library: LibrarySchema): LSPCompletionItem[] {
  return Object.values(library.functions).map((func) => ({
    label: func.name,
    kind: 3, // Function kind
    detail: func.description,
    documentation: {
      kind: 'markdown',
      value: createLSPFunctionDocumentation(func),
    },
  }))
}

/**
 * Creates markdown documentation for LSP
 */
function createLSPFunctionDocumentation(func: FunctionSchema): string {
  const params = func.parameters.map((p) => `${p.name}: ${getTypeStringFromSchema(p.schema)}`).join(', ')
  const returnType = getTypeStringFromSchema(func.returns)
  const lines = [`**${func.name}**(${params}) → ${returnType}`, '', func.description, '']

  if (func.examples && func.examples.length > 0) {
    lines.push('**Examples:**')
    func.examples.forEach((example) => {
      lines.push(`\`${example}\``)
    })
  }

  return lines.join('\n')
}

// JSON Schema Validation Types and Functions

/**
 * Creates a JSON Schema for validating function calls
 */
export function createFunctionCallSchema(func: FunctionSchema): Record<string, unknown> {
  return {
    type: 'object',
    properties: {
      function: { const: func.name },
      arguments: {
        type: 'array',
        items: func.parameters.map((param) => ({
          ...param.schema,
        })),
        minItems: func.parameters.filter((p) => p.required).length,
        maxItems: func.parameters.some((p) => p.variadic) ? undefined : func.parameters.length,
      },
    },
    required: ['function', 'arguments'],
  }
}

/**
 * Creates validation schemas for all functions in a library
 */
export function createLibraryValidationSchemas(library: LibrarySchema): Record<string, Record<string, unknown>> {
  return Object.fromEntries(
    Object.entries(library.functions).map(([name, func]) => [name, createFunctionCallSchema(func)])
  )
}

// Documentation Generation Types and Functions

/**
 * Generates a simple function reference table
 */
export function generateFunctionTable(library: LibrarySchema): string {
  const functions = Object.values(library.functions)
  const lines = ['| Function | Arguments | Description |', '|----------|-----------|-------------|']

  functions.forEach((func) => {
    const args = func.parameters.map((p) => `${p.name}: ${getTypeStringFromSchema(p.schema)}`).join(', ')
    const description = func.description.replace(/\|/g, '\\|') // Escape pipes for markdown
    lines.push(`| \`${func.name}\` | \`(${args})\` | ${description} |`)
  })

  return lines.join('\n')
}

/**
 * Generates function reference cards
 */
export function generateFunctionCards(library: LibrarySchema): string {
  const functions = Object.values(library.functions)
  const cards = functions.map((func) => {
    const params = func.parameters.map((p) => `${p.name}: ${getTypeStringFromSchema(p.schema)}`).join(', ')
    const examples = func.examples ? func.examples.map((ex) => `  ${ex}`).join('\n') : 'No examples available'

    return [
      `## ${func.name}`,
      '',
      `**Signature:** \`${func.name}(${params}) → ${func.returns.type}\``,
      '',
      `**Description:** ${func.description}`,
      '',
      '**Examples:**',
      '```typescript',
      examples,
      '```',
      '',
    ].join('\n')
  })

  return cards.join('\n---\n\n')
}

// Runtime Registration Types and Functions

// Define types for better type safety
export interface JexlInstance {
  addFunction: (name: string, func: (...args: unknown[]) => unknown) => void
  _functions?: Record<string, unknown>
}

export interface FunctionWithMetadata {
  (...args: unknown[]): unknown
  _schema?: FunctionSchema
  _category?: string
  _parameters?: FunctionSchema['parameters']
  _returns?: FunctionSchema['returns']
}

/**
 * Registers functions with a Jexl instance using schema metadata
 */
export function registerFunctions(
  jexl: Jexl,
  library: LibrarySchema,
  functionModule: Record<string, FunctionFunction>
): void {
  Object.entries(library.functions).forEach(([name, schema]) => {
    const func = functionModule[name]
    if (func) {
      jexl.addFunction(name, func)

      // Add metadata for runtime introspection
      const funcWithMetadata = func as FunctionWithMetadata
      Object.defineProperty(funcWithMetadata, '_schema', { value: schema, enumerable: false })
      Object.defineProperty(funcWithMetadata, '_category', { value: schema.category, enumerable: false })
      Object.defineProperty(funcWithMetadata, '_parameters', { value: schema.parameters, enumerable: false })
      Object.defineProperty(funcWithMetadata, '_returns', { value: schema.returns, enumerable: false })
    }
  })
}

/**
 * Gets runtime function metadata
 */
export function getFunctionMetadata(func: FunctionWithMetadata): FunctionSchema | undefined {
  return func._schema
}

/**
 * Lists all registered functions with their categories
 */
export function listFunctionsByCategory(jexl: JexlInstance): Record<string, string[]> {
  const categorized: Record<string, string[]> = {}

  // Assuming jexl has a way to get all registered functions
  if (jexl._functions) {
    Object.entries(jexl._functions).forEach(([name, func]) => {
      const funcWithMetadata = func as FunctionWithMetadata
      const category = funcWithMetadata._category || 'uncategorised'
      if (!categorized[category]) {
        categorized[category] = []
      }
      categorized[category].push(name)
    })
  }

  return categorized
}
