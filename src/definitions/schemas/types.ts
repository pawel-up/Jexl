import type { JSONSchema7 } from 'json-schema'

/**
 * Core type definitions for Jexl function schemas.
 * These types are used across all function library schemas.
 */

/**
 * Represents a single function parameter, using JSON Schema for type definition.
 */
export interface FunctionParameter {
  /** The parameter name. */
  name: string
  /**
   * A JSON Schema object that defines the type and constraints of the parameter.
   * @example
   * // For a simple string
   * { "type": "string", "description": "The user's name." }
   * // For a union type
   * { "type": ["string", "number"] }
   * // For an enum
   * { "type": "string", "enum": ["red", "green", "blue"] }
   */
  schema: JSONSchema7
  /** Whether this parameter is required. This aligns with OpenAPI parameter definitions. */
  required: boolean
  /** Whether this parameter accepts multiple values (rest parameter). */
  variadic?: boolean
}

/**
 * Represents a complete function schema, using JSON Schema for parameters and return values.
 */
export interface FunctionSchema {
  /** The function name. */
  name: string
  /** Description of what the function does. */
  description: string
  /** The category this function belongs to (e.g., 'array', 'string', 'math'). */
  category: string
  /** Array of function parameters. */
  parameters: FunctionParameter[]
  /**
   * A JSON Schema object that defines the function's return value.
   * The 'description' property within the schema can be used to describe the return value.
   */
  returns: JSONSchema7
  /** Optional usage examples. */
  examples?: string[]
  /** Version when this function was introduced. */
  since?: string
  /** Whether this function is deprecated. Use a string for a deprecation message. */
  deprecated?: boolean | string
  /** Additional tags for categorization. */
  tags?: string[]
}

/**
 * Represents a complete library schema containing multiple functions
 */
export interface LibrarySchema {
  /** JSON Schema version */
  $schema: string
  /** Unique identifier for this schema */
  $id: string
  /** Human-readable title */
  title: string
  /** Description of the library */
  description: string
  /** Library version */
  version: string
  /** Object containing all function schemas */
  functions: Record<string, FunctionSchema>
}

/**
 * Configuration for creating library schemas
 */
export interface LibraryConfig {
  /** The library category name */
  category: string
  /** The library title */
  title: string
  /** The library description */
  description: string
  /** The library version */
  version: string
  /** Base URL for schema IDs */
  baseUrl?: string
}

/**
 * Standard JSON Schema constants
 */
export const JSON_SCHEMA_VERSION = 'http://json-schema.org/draft-07/schema#'
export const DEFAULT_BASE_URL = 'https://github.com/pawel-up/jexl/schemas'
