/**
 * Utility functions for working with Jexl function schemas
 * These helpers can be used across all function libraries
 */

import type { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import {
  type FunctionSchema,
  type FunctionParameter,
  type LibrarySchema,
  type LibraryConfig,
  JSON_SCHEMA_VERSION,
  DEFAULT_BASE_URL,
} from './types.js'

/**
 * Creates a complete library schema from function schemas and config
 */
export function createLibrarySchema(
  functionSchemas: Record<string, FunctionSchema>,
  config: LibraryConfig
): LibrarySchema {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URL

  return {
    $schema: JSON_SCHEMA_VERSION,
    $id: `${baseUrl}/${config.category}.schema.json`,
    title: config.title,
    description: config.description,
    version: config.version,
    functions: functionSchemas,
  }
}

/**
 * Creates a function parameter definition with JSON Schema
 */
export function createParameter(
  name: string,
  schema: JSONSchema7,
  required = true,
  options: {
    variadic?: boolean
  } = {}
): FunctionParameter {
  return {
    name,
    schema,
    required,
    ...options,
  }
}

/**
 * Creates a function schema with JSON Schema for returns
 */
export function createFunctionSchema(
  name: string,
  description: string,
  category: string,
  parameters: FunctionParameter[],
  returns: JSONSchema7,
  options: {
    examples?: string[]
    since?: string
    deprecated?: boolean | string
    tags?: string[]
  } = {}
): FunctionSchema {
  return {
    name,
    description,
    category,
    parameters,
    returns,
    ...options,
  }
}

/**
 * Gets a specific function schema by name
 */
export function getFunctionSchema(library: LibrarySchema, functionName: string): FunctionSchema | undefined {
  return library.functions[functionName]
}

/**
 * Gets all function names from a library
 */
export function getAllFunctionNames(library: LibrarySchema): string[] {
  return Object.keys(library.functions)
}

/**
 * Gets functions by category
 */
export function getFunctionsByCategory(library: LibrarySchema, category: string): Record<string, FunctionSchema> {
  return Object.fromEntries(Object.entries(library.functions).filter(([, schema]) => schema.category === category))
}

/**
 * Gets functions by tag
 */
export function getFunctionsByTag(library: LibrarySchema, tag: string): Record<string, FunctionSchema> {
  return Object.fromEntries(Object.entries(library.functions).filter(([, schema]) => schema.tags?.includes(tag)))
}

/**
 * Searches functions by name or description
 */
export function searchFunctions(library: LibrarySchema, query: string): Record<string, FunctionSchema> {
  const lowerQuery = query.toLowerCase()
  return Object.fromEntries(
    Object.entries(library.functions).filter(
      ([name, schema]) =>
        name.toLowerCase().includes(lowerQuery) || schema.description.toLowerCase().includes(lowerQuery)
    )
  )
}

/**
 * Converts library schema to JSON string
 */
export function toJSON(library: LibrarySchema, pretty = true): string {
  return JSON.stringify(library, null, pretty ? 2 : 0)
}

/**
 * Merges multiple library schemas into one
 */
export function mergeLibrarySchemas(libraries: LibrarySchema[], config: LibraryConfig): LibrarySchema {
  const mergedFunctions = libraries.reduce((acc, lib) => ({ ...acc, ...lib.functions }), {})

  return createLibrarySchema(mergedFunctions, config)
}

/**
 * Validates that a function schema has all required fields
 */
export function validateFunctionSchema(schema: FunctionSchema): string[] {
  const errors: string[] = []

  if (!schema.name) errors.push('Function name is required')
  if (!schema.description) errors.push('Function description is required')
  if (!schema.category) errors.push('Function category is required')
  if (!schema.parameters) errors.push('Function parameters array is required')
  if (!schema.returns) errors.push('Function returns definition is required')

  // Validate parameters
  schema.parameters?.forEach((param, index) => {
    if (!param.name) errors.push(`Parameter ${index}: name is required`)
    if (!param.schema) {
      errors.push(`Parameter ${index} (${param.name}): schema is required`)
    } else {
      if (getTypeStringFromSchema(param.schema) === 'unknown') {
        errors.push(
          `Parameter ${index} (${param.name}): schema is missing a valid type definition (e.g., type, enum, anyOf)`
        )
      }
      if (!param.schema.description) {
        errors.push(`Parameter ${index}: schema.description is required`)
      }
    }
    if (param.required === undefined) errors.push(`Parameter ${index}: required field is required`)
  })

  // Validate return
  if (schema.returns && getTypeStringFromSchema(schema.returns) === 'unknown') {
    errors.push('Return schema is missing a valid type definition (e.g., type, enum, anyOf)')
  }

  return errors
}

/**
 * Extracts a readable type string from a JSON Schema
 */
export function getTypeStringFromSchema(schema: JSONSchema7Definition): string {
  if (typeof schema === 'boolean') {
    return schema ? 'any' : 'never'
  }
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

/**
 * Generates a function signature string for display
 */
export function generateSignature(schema: FunctionSchema): string {
  const params = schema.parameters
    .map((p) => {
      const optional = p.required ? '' : '?'
      const variadic = p.variadic ? '...' : ''
      const typeStr = getTypeStringFromSchema(p.schema)
      return `${variadic}${p.name}${optional}: ${typeStr}`
    })
    .join(', ')

  const returnType = getTypeStringFromSchema(schema.returns)
  return `${schema.name}(${params}) → ${returnType}`
}

/**
 * Generates markdown documentation for a function
 */
export function generateFunctionMarkdown(schema: FunctionSchema): string {
  const lines: string[] = []

  lines.push(`### ${schema.name}`)
  lines.push('')
  lines.push(schema.description)
  lines.push('')

  if (schema.deprecated) {
    lines.push('> ⚠️ **Deprecated** - This function is deprecated and may be removed in future versions.')
    lines.push('')
  }

  lines.push('**Signature:**')
  lines.push(`\`${generateSignature(schema)}\``)
  lines.push('')

  if (schema.parameters.length > 0) {
    lines.push('**Parameters:**')
    lines.push('')
    schema.parameters.forEach((param) => {
      const required = param.required ? '' : ' (optional)'
      const variadic = param.variadic ? ' (variadic)' : ''
      const typeStr = getTypeStringFromSchema(param.schema)
      lines.push(
        `- \`${param.name}\` (${typeStr}${required}${variadic}) - ${param.schema?.description || 'No description provided'}`
      )
    })
    lines.push('')
  }

  const returnType = getTypeStringFromSchema(schema.returns)
  const returnDescription = schema.returns.description || 'Return value'
  lines.push(`**Returns:** ${returnType} - ${returnDescription}`)
  lines.push('')

  if (schema.examples && schema.examples.length > 0) {
    lines.push('**Examples:**')
    lines.push('')
    schema.examples.forEach((example) => {
      lines.push(`\`\`\`typescript`)
      lines.push(example)
      lines.push(`\`\`\``)
      lines.push('')
    })
  }

  if (schema.since) {
    lines.push(`*Since: ${schema.since}*`)
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Generates complete markdown documentation for a library
 */
export function generateLibraryMarkdown(library: LibrarySchema): string {
  const functions = Object.values(library.functions)
  const lines: string[] = []

  lines.push(`# ${library.title}`)
  lines.push('')
  lines.push(library.description)
  lines.push('')
  lines.push(`**Version:** ${library.version}`)
  lines.push('')
  lines.push(`**Functions:** ${functions.length}`)
  lines.push('')

  // Table of contents
  lines.push('## Table of Contents')
  lines.push('')
  functions.forEach((func) => {
    lines.push(`- [${func.name}](#${func.name.toLowerCase()})`)
  })
  lines.push('')

  // Function documentation
  lines.push('## Functions')
  lines.push('')

  functions.forEach((func) => {
    lines.push(generateFunctionMarkdown(func))
  })

  return lines.join('\n')
}
