/* eslint-disable no-case-declarations */
import type {
  Grammar,
  ASTNode,
  FunctionCallNode,
  BinaryExpressionNode,
  UnaryExpressionNode,
  ConditionalExpressionNode,
  FilterExpressionNode,
  IdentifierNode,
  ArrayLiteralNode,
  ObjectLiteralNode,
} from './grammar.js'
import Lexer from './Lexer.js'
import Parser from './parser/Parser.js'

/**
 * Severity levels for validation issues.
 */
export enum ValidationSeverity {
  /** Critical errors that prevent expression compilation/evaluation */
  ERROR = 'error',
  /** Potential issues that might cause runtime problems */
  WARNING = 'warning',
  /** Informational messages about expression structure */
  INFO = 'info',
}

/**
 * Represents a validation issue found in a Jexl expression.
 */
export interface ValidationIssue {
  /** Severity level of the issue */
  severity: ValidationSeverity
  /** Human-readable description of the issue */
  message: string
  /** Character position where the issue starts (0-based) */
  startPosition?: number
  /** Character position where the issue ends (0-based) */
  endPosition?: number
  /** Line number where the issue occurs (1-based) */
  line?: number
  /** Column number where the issue occurs (1-based) */
  column?: number
  /** The problematic token or text segment */
  token?: string
  /** Error code for programmatic handling */
  code?: string
}

/**
 * Configuration options for expression validation.
 */
export interface ValidationOptions {
  /**
   * If true, assumes context variables are not yet available and treats
   * undefined identifiers as valid. Useful for validating expressions
   * before runtime context is known.
   */
  allowUndefinedContext?: boolean

  /**
   * If true, provides additional informational messages about
   * expression structure and optimization opportunities.
   */
  includeInfo?: boolean

  /**
   * If true, provides warnings about potential runtime issues
   * like accessing properties on possibly undefined values.
   */
  includeWarnings?: boolean

  /**
   * Maximum expression depth to prevent stack overflow.
   * Expressions deeper than this will generate warnings.
   */
  maxDepth?: number

  /**
   * Maximum expression length to prevent performance issues.
   * Expressions longer than this will generate warnings.
   */
  maxLength?: number

  /**
   * Custom functions that should be considered available during validation.
   * Useful when validating expressions that will use runtime-defined functions.
   */
  customFunctions?: string[]

  /**
   * Custom transforms that should be considered available during validation.
   * Useful when validating expressions that will use runtime-defined transforms.
   */
  customTransforms?: string[]
}

/**
 * Result of expression validation containing all found issues.
 */
export interface ValidationResult {
  /** Whether the expression is valid (no errors) */
  valid: boolean
  /** All validation issues found, sorted by position */
  issues: ValidationIssue[]
  /** Only error-level issues */
  errors: ValidationIssue[]
  /** Only warning-level issues */
  warnings: ValidationIssue[]
  /** Only info-level issues */
  info: ValidationIssue[]
  /** The compiled AST if compilation was successful */
  ast?: ASTNode
}

/**
 * Jexl Expression Validator
 *
 * Provides comprehensive validation of Jexl expressions, including syntax checking,
 * semantic analysis, and optional context validation. Can differentiate between
 * critical errors, warnings, and informational messages.
 *
 * The validator can operate in two modes:
 * 1. **Strict mode**: Validates that all identifiers exist in provided context
 * 2. **Lenient mode**: Assumes context will be available at runtime
 *
 * ## Automatic Expression Trimming
 *
 * The validator automatically trims leading and trailing whitespace from expressions
 * before validation. This provides a better user experience since whitespace has no
 * semantic meaning in Jexl expressions.
 *
 * - `"user.name"` and `"  user.name  "` are treated identically
 * - Internal whitespace is preserved: `"a + b"` stays `"a + b"`
 * - Empty or whitespace-only expressions are still detected as invalid
 *
 * @example
 * ```typescript
 * const validator = new Validator(jexl.grammar)
 *
 * // Basic validation
 * const result = validator.validate('user.name | upper')
 * if (!result.valid) {
 *   console.log('Errors:', result.errors)
 * }
 *
 * // Trimming behavior - these are all equivalent
 * validator.validate('user.name')      // valid
 * validator.validate('  user.name  ')  // valid (trimmed)
 * validator.validate('\t user.name\n') // valid (trimmed)
 * validator.validate('   ')            // invalid (empty after trim)
 *
 * // Validation with context checking
 * const strictResult = validator.validate(
 *   'user.age >= 18 ? "adult" : "minor"',
 *   { user: { name: 'John' } }, // missing 'age' property
 *   { allowUndefinedContext: false }
 * )
 *
 * // Lenient validation (useful during development)
 * const lenientResult = validator.validate(
 *   'future.feature | someTransform',
 *   {},
 *   {
 *     allowUndefinedContext: true,
 *     customTransforms: ['someTransform']
 *   }
 * )
 * ```
 *
 * ## Validation Categories
 *
 * ### Errors (prevent execution)
 * - Syntax errors (invalid tokens, mismatched brackets)
 * - Unknown operators, functions, or transforms
 * - Invalid expression structure
 *
 * ### Warnings (potential runtime issues)
 * - Accessing properties on undefined values
 * - Unused context variables
 * - Performance concerns (deep nesting, long expressions)
 *
 * ### Info (optimization opportunities)
 * - Expressions that could be simplified
 * - Suggestions for better performance
 * - Usage statistics
 */
export class Validator {
  private _grammar: Grammar
  private _lexer: Lexer

  /**
   * Creates a new Validator instance.
   *
   * @param grammar The Jexl grammar configuration to use for validation
   *
   * @example
   * ```typescript
   * import { Jexl } from '@pawel-up/jexl'
   * import { Validator } from '@pawel-up/jexl'
   *
   * const jexl = new Jexl()
   * const validator = new Validator(jexl.grammar)
   * ```
   */
  constructor(grammar: Grammar) {
    this._grammar = grammar
    this._lexer = new Lexer(grammar)
  }

  /**
   * Validates a Jexl expression and returns detailed validation results.
   *
   * @param expression The Jexl expression string to validate
   * @param context Optional context object for strict validation
   * @param options Validation configuration options
   * @returns Comprehensive validation results
   *
   * @example
   * ```typescript
   * // Basic syntax validation
   * const result = validator.validate('user.name | upper')
   *
   * // Strict validation with context
   * const strictResult = validator.validate(
   *   'user.profile.email',
   *   { user: { name: 'John' } }, // missing profile
   *   { allowUndefinedContext: false }
   * )
   *
   * // Development mode validation
   * const devResult = validator.validate(
   *   'items | filter("active") | map("name")',
   *   {},
   *   {
   *     allowUndefinedContext: true,
   *     includeInfo: true,
   *     includeWarnings: true
   *   }
   * )
   *
   * // Check results
   * if (!result.valid) {
   *   result.errors.forEach(error => {
   *     console.log(`Error at ${error.line}:${error.column}: ${error.message}`)
   *   })
   * }
   *
   * if (result.warnings.length > 0) {
   *   console.log('Warnings:', result.warnings.map(w => w.message))
   * }
   * ```
   */
  validate(expression: string, context?: Record<string, unknown>, options: ValidationOptions = {}): ValidationResult {
    const issues: ValidationIssue[] = []
    const opts = this._getDefaultOptions(options)

    // Basic input validation
    if (!expression || typeof expression !== 'string') {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: 'Expression must be a non-empty string',
        code: 'INVALID_INPUT',
      })
      return this._createResult(issues)
    }

    // Trim whitespace from the expression since it has no semantic meaning
    const trimmedExpression = expression.trim()

    // Check for empty expressions after trimming
    if (trimmedExpression.length === 0) {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: 'Expression cannot be empty or whitespace only',
        code: 'INVALID_INPUT',
      })
      return this._createResult(issues)
    }

    // Length validation (check original length for user feedback, but use trimmed for processing)
    if (opts.maxLength && expression.length > opts.maxLength) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: `Expression length (${expression.length}) exceeds recommended maximum (${opts.maxLength})`,
        code: 'EXPRESSION_TOO_LONG',
      })
    }

    try {
      // Step 1: Lexical analysis
      this._validateLexical(trimmedExpression, issues)

      if (this._hasErrors(issues)) {
        return this._createResult(issues)
      }

      // Step 2: Syntax analysis
      const ast = this._validateSyntax(trimmedExpression, issues)

      if (this._hasErrors(issues) || !ast) {
        return this._createResult(issues)
      }

      // Step 3: Semantic analysis
      this._validateSemantics(ast, trimmedExpression, issues, opts)

      // Step 4: Context validation (if not in lenient mode)
      if (!opts.allowUndefinedContext && context !== undefined) {
        this._validateContext(ast, context, trimmedExpression, issues, opts)
      }

      // Step 5: Additional analysis
      if (opts.includeWarnings) {
        this._performWarningAnalysis(ast, trimmedExpression, issues)
      }

      if (opts.includeInfo) {
        this._performInfoAnalysis(ast, trimmedExpression, issues)
      }

      return this._createResult(issues, ast)
    } catch (error) {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'VALIDATION_ERROR',
      })
      return this._createResult(issues)
    }
  }

  /**
   * Quick validation check that only returns whether the expression is syntactically valid.
   * Useful for real-time validation in editors where detailed analysis isn't needed.
   *
   * @param expression The expression to validate
   * @returns True if the expression has valid syntax
   *
   * @example
   * ```typescript
   * // Quick syntax check
   * if (validator.isValid('user.name | upper')) {
   *   console.log('Expression syntax is valid')
   * }
   *
   * // Use in form validation
   * const isExpressionValid = validator.isValid(userInput)
   * setFieldError(isExpressionValid ? null : 'Invalid expression syntax')
   * ```
   */
  isValid(expression: string): boolean {
    try {
      const result = this.validate(
        expression,
        {},
        {
          allowUndefinedContext: true,
          includeWarnings: false,
          includeInfo: false,
        }
      )
      return result.valid
    } catch {
      return false
    }
  }

  /**
   * Validates expression syntax and returns the first error found, or null if valid.
   * Useful for providing immediate feedback in development tools.
   *
   * @param expression The expression to validate
   * @returns The first error found, or null if valid
   *
   * @example
   * ```typescript
   * const error = validator.getFirstError('user.name |')
   * if (error) {
   *   console.log(`Syntax error: ${error.message}`)
   *   if (error.line && error.column) {
   *     console.log(`at line ${error.line}, column ${error.column}`)
   *   }
   * }
   * ```
   */
  getFirstError(expression: string): ValidationIssue | null {
    const result = this.validate(
      expression,
      {},
      {
        allowUndefinedContext: true,
        includeWarnings: false,
        includeInfo: false,
      }
    )
    return result.errors[0] || null
  }

  /**
   * Performs lexical validation by tokenizing the expression.
   * @private
   */
  private _validateLexical(expression: string, issues: ValidationIssue[]): void {
    try {
      const tokens = this._lexer.tokenize(expression)

      // Check for invalid token sequences
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        const nextToken = tokens[i + 1]

        // Check for consecutive operators
        if (token.type === 'binaryOp' && nextToken?.type === 'binaryOp') {
          const position = this._findTokenPosition(expression, token.raw)
          issues.push({
            severity: ValidationSeverity.ERROR,
            message: `Consecutive operators: '${token.value}' followed by '${nextToken.value}'`,
            startPosition: position,
            endPosition: position + token.raw.length,
            token: token.raw,
            code: 'CONSECUTIVE_OPERATORS',
            ...this._getLineColumn(expression, position),
          })
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lexical analysis failed'
      const match = message.match(/Invalid expression token: (.+)/)

      if (match) {
        const invalidToken = match[1]
        const position = expression.indexOf(invalidToken)
        issues.push({
          severity: ValidationSeverity.ERROR,
          message: `Invalid token: '${invalidToken}'`,
          startPosition: position >= 0 ? position : undefined,
          endPosition: position >= 0 ? position + invalidToken.length : undefined,
          token: invalidToken,
          code: 'INVALID_TOKEN',
          ...this._getLineColumn(expression, position >= 0 ? position : 0),
        })
      } else {
        issues.push({
          severity: ValidationSeverity.ERROR,
          message,
          code: 'LEXICAL_ERROR',
        })
      }
    }
  }

  /**
   * Performs syntax validation by parsing the expression into an AST.
   * @private
   */
  private _validateSyntax(expression: string, issues: ValidationIssue[]): ASTNode | null {
    try {
      const parser = new Parser(this._grammar)
      const tokens = this._lexer.tokenize(expression)
      parser.addTokens(tokens)
      const ast = parser.complete()
      return ast as ASTNode
    } catch (error) {
      const originalMessage = error instanceof Error ? error.message : 'Parse error'
      const message = `Syntax error: ${originalMessage}`

      // Try to extract position information from parser errors
      let position: number | undefined
      let token: string | undefined

      const unexpectedMatch = message.match(/Unexpected token (.+)/)
      if (unexpectedMatch) {
        token = unexpectedMatch[1]
        position = expression.indexOf(token)
      }

      issues.push({
        severity: ValidationSeverity.ERROR,
        message,
        startPosition: position,
        endPosition: position !== undefined && token ? position + token.length : undefined,
        token,
        code: 'SYNTAX_ERROR',
        ...this._getLineColumn(expression, position || 0),
      })

      return null
    }
  }

  /**
   * Performs semantic validation of the AST.
   * @private
   */
  private _validateSemantics(
    ast: ASTNode,
    expression: string,
    issues: ValidationIssue[],
    options: Required<ValidationOptions>
  ): void {
    this._validateASTNode(ast, expression, issues, options, 0)
  }

  /**
   * Recursively validates an AST node and its children.
   * @private
   */
  private _validateASTNode(
    node: ASTNode,
    expression: string,
    issues: ValidationIssue[],
    options: Required<ValidationOptions>,
    depth: number
  ): void {
    if (!node) return

    // Check depth limits
    if (options.maxDepth && depth > options.maxDepth) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: `Expression depth (${depth}) exceeds recommended maximum (${options.maxDepth})`,
        code: 'EXPRESSION_TOO_DEEP',
      })
      return
    }

    // Validate based on node type
    switch (node.type) {
      case 'FunctionCall':
        this._validateFunction(node as FunctionCallNode, expression, issues, options)
        break
      case 'BinaryExpression':
        this._validateBinaryExpression(node as BinaryExpressionNode, expression, issues)
        break
      case 'UnaryExpression':
        this._validateUnaryExpression(node as UnaryExpressionNode, expression, issues)
        break
    }

    // Recursively validate children based on node type
    switch (node.type) {
      case 'BinaryExpression':
        const binaryNode = node as BinaryExpressionNode
        this._validateASTNode(binaryNode.left, expression, issues, options, depth + 1)
        this._validateASTNode(binaryNode.right, expression, issues, options, depth + 1)
        break

      case 'UnaryExpression':
        const unaryNode = node as UnaryExpressionNode
        this._validateASTNode(unaryNode.right, expression, issues, options, depth + 1)
        break

      case 'ConditionalExpression':
        const conditionalNode = node as ConditionalExpressionNode
        this._validateASTNode(conditionalNode.test, expression, issues, options, depth + 1)
        this._validateASTNode(conditionalNode.consequent, expression, issues, options, depth + 1)
        this._validateASTNode(conditionalNode.alternate, expression, issues, options, depth + 1)
        break

      case 'FilterExpression':
        const filterNode = node as FilterExpressionNode
        this._validateASTNode(filterNode.subject, expression, issues, options, depth + 1)
        this._validateASTNode(filterNode.expr, expression, issues, options, depth + 1)
        break

      case 'Identifier':
        const identifierNode = node as IdentifierNode
        if (identifierNode.from) {
          this._validateASTNode(identifierNode.from, expression, issues, options, depth + 1)
        }
        break

      case 'FunctionCall':
        const functionNode = node as FunctionCallNode
        if (functionNode.args) {
          functionNode.args.forEach((arg) => {
            this._validateASTNode(arg, expression, issues, options, depth + 1)
          })
        }
        break

      case 'ArrayLiteral':
        const arrayNode = node as ArrayLiteralNode
        arrayNode.value.forEach((item) => {
          this._validateASTNode(item, expression, issues, options, depth + 1)
        })
        break

      case 'ObjectLiteral':
        const objectNode = node as ObjectLiteralNode
        Object.values(objectNode.value).forEach((value) => {
          this._validateASTNode(value, expression, issues, options, depth + 1)
        })
        break
    }
  }

  /**
   * Validates function calls.
   * @private
   */
  private _validateFunction(
    node: FunctionCallNode,
    _expression: string,
    issues: ValidationIssue[],
    options: Required<ValidationOptions>
  ): void {
    const funcName = node.name
    if (!funcName) return

    const isBuiltIn = this._grammar.functions[funcName] !== undefined
    const isCustom = options.customFunctions.includes(funcName)

    if (!isBuiltIn && !isCustom && node.pool === 'functions') {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: `Unknown function: '${funcName}'`,
        token: funcName,
        code: 'UNKNOWN_FUNCTION',
      })
    }

    if (!isBuiltIn && !isCustom && node.pool === 'transforms') {
      const isBuiltInTransform = this._grammar.transforms[funcName] !== undefined
      const isCustomTransform = options.customTransforms.includes(funcName)

      if (!isBuiltInTransform && !isCustomTransform) {
        issues.push({
          severity: ValidationSeverity.ERROR,
          message: `Unknown transform: '${funcName}'`,
          token: funcName,
          code: 'UNKNOWN_TRANSFORM',
        })
      }
    }
  }

  /**
   * Validates binary expressions.
   * @private
   */
  private _validateBinaryExpression(node: BinaryExpressionNode, _expression: string, issues: ValidationIssue[]): void {
    const operator = node.operator
    if (!operator) return

    const isBuiltIn = this._grammar.elements[operator] !== undefined
    if (!isBuiltIn) {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: `Unknown binary operator: '${operator}'`,
        token: operator,
        code: 'UNKNOWN_OPERATOR',
      })
    }
  }

  /**
   * Validates unary expressions.
   * @private
   */
  private _validateUnaryExpression(node: UnaryExpressionNode, _expression: string, issues: ValidationIssue[]): void {
    const operator = node.operator
    if (!operator) return

    const isBuiltIn = this._grammar.elements[operator] !== undefined
    if (!isBuiltIn) {
      issues.push({
        severity: ValidationSeverity.ERROR,
        message: `Unknown unary operator: '${operator}'`,
        token: operator,
        code: 'UNKNOWN_OPERATOR',
      })
    }
  }

  private _validateContext(
    ast: ASTNode,
    context: Record<string, unknown>,
    expression: string,
    issues: ValidationIssue[],
    options: Required<ValidationOptions>
  ): void {
    this._validateContextPath(ast, context, context, expression, issues, options)
  }

  /**
   * Recursively validates an AST node's context path.
   * @param node The AST node to validate
   * @param localContext The current context for this node
   * @param globalContext The top-level context
   * @param expression The full expression string
   * @param issues The array of issues to populate
   * @param options Validation options
   * @returns The resolved value from the context if the path is valid and static, otherwise undefined.
   * @private
   */
  private _validateContextPath(
    node: ASTNode,
    localContext: unknown,
    globalContext: unknown,
    expression: string,
    issues: ValidationIssue[],
    options: Required<ValidationOptions>
  ): unknown {
    if (!node) return undefined

    switch (node.type) {
      case 'Identifier':
        const idNode = node as IdentifierNode
        if (idNode.from) {
          const parentContext = this._validateContextPath(
            idNode.from,
            localContext,
            globalContext,
            expression,
            issues,
            options
          )
          if (parentContext === undefined) {
            // Cannot resolve parent, or error already reported.
            return undefined
          }
          if (parentContext === null) {
            issues.push({
              severity: ValidationSeverity.WARNING,
              message: `Cannot access property '${idNode.value}' of null`,
              token: idNode.value,
              code: 'PROPERTY_ACCESS_ON_NULL',
            })
            return undefined
          }
          if (typeof parentContext !== 'object') {
            issues.push({
              severity: ValidationSeverity.WARNING,
              message: `Cannot access property '${idNode.value}' on non-object value of type ${typeof parentContext}`,
              token: idNode.value,
              code: 'PROPERTY_ACCESS_ON_NON_OBJECT',
            })
            return undefined
          }
          if (!(idNode.value in parentContext)) {
            issues.push({
              severity: ValidationSeverity.WARNING,
              message: `Property '${idNode.value}' not found on object`,
              token: idNode.value,
              code: 'UNDEFINED_PROPERTY',
            })
            return undefined
          }
          return (parentContext as Record<string, unknown>)[idNode.value]
        }
        if (idNode.relative) {
          // This is for relative identifiers like '.' or '.foo'
          if (!idNode.value) {
            // This is for '.' which refers to the context element itself
            return localContext
          }
          // This is for '.foo' which is a property on the context element
          const parentContext = localContext
          if (parentContext === null) {
            issues.push({
              severity: ValidationSeverity.WARNING,
              message: `Cannot access property '${idNode.value}' of null`,
              token: idNode.value,
              code: 'PROPERTY_ACCESS_ON_NULL',
            })
            return undefined
          }
          if (typeof parentContext !== 'object') {
            issues.push({
              severity: ValidationSeverity.WARNING,
              message: `Cannot access property '${idNode.value}' on non-object value of type ${typeof parentContext}`,
              token: idNode.value,
              code: 'PROPERTY_ACCESS_ON_NON_OBJECT',
            })
            return undefined
          }
          if (!(idNode.value in parentContext)) {
            issues.push({
              severity: ValidationSeverity.WARNING,
              message: `Property '${idNode.value}' not found on relative context object`,
              token: idNode.value,
              code: 'UNDEFINED_PROPERTY',
            })
            return undefined
          }
          return (parentContext as Record<string, unknown>)[idNode.value]
        }
        if (typeof globalContext === 'object' && globalContext !== null && idNode.value in globalContext) {
          return (globalContext as Record<string, unknown>)[idNode.value]
        }
        issues.push({
          severity: ValidationSeverity.WARNING,
          message: `Identifier '${idNode.value}' not found in context`,
          token: idNode.value,
          code: 'UNDEFINED_IDENTIFIER',
        })
        return undefined

      case 'Literal':
        return node.value

      case 'ArrayLiteral':
        const arrayNode = node as ArrayLiteralNode
        return arrayNode.value.map((item) =>
          this._validateContextPath(item, localContext, globalContext, expression, issues, options)
        )

      case 'ObjectLiteral':
        const objectNode = node as ObjectLiteralNode
        const newObj: Record<string, unknown> = {}
        for (const key in objectNode.value) {
          newObj[key] = this._validateContextPath(
            objectNode.value[key],
            localContext,
            globalContext,
            expression,
            issues,
            options
          )
        }
        return newObj

      case 'BinaryExpression':
        const binaryNode = node as BinaryExpressionNode
        this._validateContextPath(binaryNode.left, localContext, globalContext, expression, issues, options)
        this._validateContextPath(binaryNode.right, localContext, globalContext, expression, issues, options)
        return undefined // Result of binary expression is dynamic

      case 'UnaryExpression':
        const unaryNode = node as UnaryExpressionNode
        this._validateContextPath(unaryNode.right, localContext, globalContext, expression, issues, options)
        return undefined // Result of unary expression is dynamic

      case 'ConditionalExpression':
        const conditionalNode = node as ConditionalExpressionNode
        this._validateContextPath(conditionalNode.test, localContext, globalContext, expression, issues, options)
        this._validateContextPath(conditionalNode.consequent, localContext, globalContext, expression, issues, options)
        this._validateContextPath(conditionalNode.alternate, localContext, globalContext, expression, issues, options)
        return undefined // Result of conditional is dynamic

      case 'FilterExpression':
        const filterNode = node as FilterExpressionNode
        const subjectContext = this._validateContextPath(
          filterNode.subject,
          localContext,
          globalContext,
          expression,
          issues,
          options
        )
        if (subjectContext === undefined) return undefined

        if (filterNode.relative) {
          if (!Array.isArray(subjectContext)) {
            if (subjectContext !== undefined) {
              issues.push({
                severity: ValidationSeverity.WARNING,
                message: 'Relative filter expression used on non-array value',
                code: 'FILTER_ON_NON_ARRAY',
              })
            }
            return undefined
          }
          // For relative filters, the context for the inner expression is an element of the array.
          // We can't know which one, so we use the first element if available, or an empty object as a placeholder.
          const relativeContext = subjectContext.length > 0 ? subjectContext[0] : {}
          this._validateContextPath(filterNode.expr, relativeContext, globalContext, expression, issues, options)
        } else {
          // For static filters, the inner expression is evaluated against the main context.
          this._validateContextPath(filterNode.expr, localContext, globalContext, expression, issues, options)
        }
        return undefined // Result of a filter is dynamic

      case 'FunctionCall':
        const functionNode = node as FunctionCallNode
        if (functionNode.args) {
          functionNode.args.forEach((arg) =>
            this._validateContextPath(arg, localContext, globalContext, expression, issues, options)
          )
        }
        return undefined // Result of a function call is dynamic
    }
    return undefined
  }

  /**
   * Performs additional warning analysis.
   * @private
   */
  private _performWarningAnalysis(ast: ASTNode, _expression: string, issues: ValidationIssue[]): void {
    // Add warnings for complex expressions, potential optimizations, etc.
    const nodeCount = this._countNodes(ast)
    if (nodeCount > 50) {
      issues.push({
        severity: ValidationSeverity.WARNING,
        message: `Complex expression with ${nodeCount} nodes may impact performance`,
        code: 'COMPLEX_EXPRESSION',
      })
    }
  }

  /**
   * Performs informational analysis.
   * @private
   */
  private _performInfoAnalysis(ast: ASTNode, _expression: string, issues: ValidationIssue[]): void {
    const nodeCount = this._countNodes(ast)
    issues.push({
      severity: ValidationSeverity.INFO,
      message: `Expression contains ${nodeCount} nodes`,
      code: 'EXPRESSION_STATS',
    })
  }

  /**
   * Gets default validation options.
   * @private
   */
  private _getDefaultOptions(options: ValidationOptions): Required<ValidationOptions> {
    return {
      allowUndefinedContext: true,
      includeInfo: false,
      includeWarnings: true,
      maxDepth: 20,
      maxLength: 1000,
      customFunctions: [],
      customTransforms: [],
      ...options,
    }
  }

  /**
   * Creates a validation result object.
   * @private
   */
  private _createResult(issues: ValidationIssue[], ast?: ASTNode): ValidationResult {
    const errors = issues.filter((i) => i.severity === ValidationSeverity.ERROR)
    const warnings = issues.filter((i) => i.severity === ValidationSeverity.WARNING)
    const info = issues.filter((i) => i.severity === ValidationSeverity.INFO)

    return {
      valid: errors.length === 0,
      issues: issues.sort((a, b) => (a.startPosition || 0) - (b.startPosition || 0)),
      errors,
      warnings,
      info,
      ast,
    }
  }

  /**
   * Checks if there are any error-level issues.
   * @private
   */
  private _hasErrors(issues: ValidationIssue[]): boolean {
    return issues.some((issue) => issue.severity === ValidationSeverity.ERROR)
  }

  /**
   * Finds the position of a token in the expression.
   * @private
   */
  private _findTokenPosition(expression: string, tokenRaw: string): number {
    // This is a simplified implementation - in practice, you'd want to track
    // positions during tokenization for more accuracy
    return expression.indexOf(tokenRaw.trim())
  }

  /**
   * Gets line and column information for a character position.
   * @private
   */
  private _getLineColumn(expression: string, position: number): { line: number; column: number } {
    const lines = expression.substring(0, position).split('\n')
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
    }
  }

  /**
   * Counts the total number of nodes in an AST.
   * @private
   */
  private _countNodes(node: ASTNode): number {
    if (!node) return 0

    let count = 1

    switch (node.type) {
      case 'BinaryExpression':
        const binaryNode = node as BinaryExpressionNode
        count += this._countNodes(binaryNode.left)
        count += this._countNodes(binaryNode.right)
        break

      case 'UnaryExpression':
        const unaryNode = node as UnaryExpressionNode
        count += this._countNodes(unaryNode.right)
        break

      case 'ConditionalExpression':
        const conditionalNode = node as ConditionalExpressionNode
        count += this._countNodes(conditionalNode.test)
        count += this._countNodes(conditionalNode.consequent)
        count += this._countNodes(conditionalNode.alternate)
        break

      case 'FilterExpression':
        const filterNode = node as FilterExpressionNode
        count += this._countNodes(filterNode.subject)
        count += this._countNodes(filterNode.expr)
        break

      case 'Identifier':
        const identifierNode = node as IdentifierNode
        if (identifierNode.from) {
          count += this._countNodes(identifierNode.from)
        }
        break

      case 'FunctionCall':
        const functionNode = node as FunctionCallNode
        if (functionNode.args) {
          count += functionNode.args.reduce((sum: number, arg: ASTNode) => sum + this._countNodes(arg), 0)
        }
        break

      case 'ArrayLiteral':
        const arrayNode = node as ArrayLiteralNode
        count += arrayNode.value.reduce((sum: number, item: ASTNode) => sum + this._countNodes(item), 0)
        break

      case 'ObjectLiteral':
        const objectNode = node as ObjectLiteralNode
        count += Object.values(objectNode.value).reduce(
          (sum: number, value: ASTNode) => sum + this._countNodes(value),
          0
        )
        break
    }

    return count
  }
}

export default Validator
