/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Grammar,
  ASTNode,
  ArrayLiteralNode,
  BinaryExpressionNode,
  ConditionalExpressionNode,
  FilterExpressionNode,
  IdentifierNode,
  LiteralNode,
  ObjectLiteralNode,
  FunctionCallNode,
  UnaryExpressionNode,
} from '../grammar.js'

const poolNames = {
  functions: 'Jexl Function',
  transforms: 'Transform',
} as const

/**
 * The Evaluator executes Jexl expression trees (AST) within a given context and returns the computed results.
 *
 * This class is the core execution engine that takes a parsed expression tree from the {@link Parser}
 * and evaluates it against provided data contexts. It handles all Jexl operations including:
 * - Variable resolution and property access
 * - Mathematical and logical operations
 * - Function and transform execution
 * - Array filtering and object manipulation
 * - Conditional expressions (ternary operators)
 *
 * @example Basic usage
 * ```typescript
 * const grammar = getGrammar()
 * const context = { user: { name: 'John', age: 30 }, items: [1, 2, 3] }
 * const evaluator = new Evaluator(grammar, context)
 *
 * // Evaluate a simple expression tree
 * const result = await evaluator.eval(expressionTree)
 * ```
 *
 * @example With transforms and functions
 * ```typescript
 * const grammar = {
 *   ...getGrammar(),
 *   transforms: {
 *     upper: (val: string) => val.toUpperCase(),
 *     multiply: (val: number, factor: number) => val * factor
 *   }
 * }
 * const evaluator = new Evaluator(grammar, { name: 'john', score: 85 })
 * ```
 *
 * @example With relative context for filtering
 * ```typescript
 * const users = [{ name: 'Alice', active: true }, { name: 'Bob', active: false }]
 * // Each user object becomes relative context when filtering
 * const evaluator = new Evaluator(grammar, { users })
 * // Expression: users[.active == true] would use each user as relative context
 * ```
 */
export default class Evaluator {
  /**
   * The grammar object containing operators, functions, and transforms used for evaluation.
   * This defines the language rules and available operations for expressions.
   *
   * @example
   * ```typescript
   * const grammar = {
   *   elements: { '+': { type: 'binaryOp', eval: (a, b) => a + b } },
   *   functions: { max: Math.max },
   *   transforms: { upper: (s: string) => s.toUpperCase() }
   * }
   * ```
   */
  _grammar: Grammar

  /**
   * The main context object containing variables and values accessible in expressions.
   * Non-relative identifiers (like `user.name`) are resolved against this context.
   *
   * @example
   * ```typescript
   * const context = {
   *   user: { name: 'Alice', age: 25 },
   *   settings: { theme: 'dark' },
   *   data: [1, 2, 3, 4, 5]
   * }
   * // Expression "user.name" resolves to "Alice"
   * // Expression "settings.theme" resolves to "dark"
   * ```
   */
  _context: Record<string, unknown>

  /**
   * The relative context used for resolving relative identifiers (those starting with `.`).
   * This is typically used in filter expressions where each array element becomes the relative context.
   *
   * @example
   * ```typescript
   * // When filtering users[.age > 18]:
   * // For each user object like { name: 'Bob', age: 25 }
   * // The relative context becomes that user object
   * // So ".age" resolves to 25 for that iteration
   * const users = [
   *   { name: 'Alice', age: 25 },
   *   { name: 'Bob', age: 17 }
   * ]
   * // During filter evaluation, _relContext = { name: 'Alice', age: 25 } for first user
   * ```
   */
  _relContext: Record<string, unknown>

  /**
   * Creates a new Evaluator instance for executing Jexl expressions.
   *
   * @param grammar - Grammar object containing operators, functions, and transforms
   * @param context - Main variable context for resolving non-relative identifiers
   * @param relativeContext - Context for resolving relative identifiers (defaults to main context)
   *
   * @example Creating an evaluator
   * ```typescript
   * const grammar = getGrammar()
   * const context = {
   *   user: { name: 'John', posts: 5 },
   *   threshold: 10
   * }
   * const evaluator = new Evaluator(grammar, context)
   * ```
   *
   * @example With custom relative context
   * ```typescript
   * const currentUser = { name: 'Admin', role: 'admin' }
   * const evaluator = new Evaluator(grammar, globalContext, currentUser)
   * // Now relative identifiers like ".name" resolve to "Admin"
   * ```
   */
  constructor(grammar: Grammar, context: Record<string, unknown>, relativeContext?: Record<string, unknown>) {
    this._grammar = grammar
    this._context = context || {}
    this._relContext = relativeContext || this._context
  }

  /**
   * Evaluates a Jexl expression tree (AST) and returns the computed result.
   *
   * This is the main entry point for expression evaluation. It processes the AST node
   * based on its type and delegates to the appropriate handler method.
   *
   * @param ast - The expression tree node to evaluate
   * @returns Promise resolving to the evaluation result
   *
   * @example Basic evaluation
   * ```typescript
   * // For expression "user.age + 10"
   * const ast = {
   *   type: 'BinaryExpression',
   *   operator: '+',
   *   left: { type: 'Identifier', value: 'user', from: { type: 'Identifier', value: 'age' } },
   *   right: { type: 'Literal', value: 10 }
   * }
   * const result = await evaluator.eval(ast) // Returns 35 if user.age is 25
   * ```
   *
   * @example Complex evaluation
   * ```typescript
   * // For expression "users[.active].length > 0"
   * const result = await evaluator.eval(complexAst)
   * // Returns true if there are active users, false otherwise
   * ```
   *
   * @throws {Error} When encountering unknown AST node types or evaluation errors
   */
  async eval(ast: ASTNode): Promise<unknown> {
    switch (ast.type) {
      case 'ArrayLiteral':
        return this._handleArrayLiteral(ast)
      case 'BinaryExpression':
        return this._handleBinaryExpression(ast)
      case 'ConditionalExpression':
        return this._handleConditionalExpression(ast)
      case 'FilterExpression':
        return this._handleFilterExpression(ast)
      case 'Identifier':
        return this._handleIdentifier(ast)
      case 'Literal':
        return this._handleLiteral(ast)
      case 'ObjectLiteral':
        return this._handleObjectLiteral(ast)
      case 'FunctionCall':
        return this._handleFunctionCall(ast)
      case 'UnaryExpression':
        return this._handleUnaryExpression(ast)
      default:
        throw new Error(`Unknown AST node type: ${(ast as any).type}`)
    }
  }

  /**
   * Evaluates an array of expression trees in parallel and returns results in the same order.
   *
   * This method is useful for evaluating multiple expressions simultaneously, such as
   * function arguments, array elements, or object property values.
   *
   * @param arr - Array of expression tree nodes to evaluate
   * @returns Promise resolving to array of evaluation results in the same order
   *
   * @example Evaluating function arguments
   * ```typescript
   * // For function call "max(user.score, 100, bonus)"
   * const args = [
   *   { type: 'Identifier', value: 'user', from: { type: 'Identifier', value: 'score' } },
   *   { type: 'Literal', value: 100 },
   *   { type: 'Identifier', value: 'bonus' }
   * ]
   * const results = await evaluator.evalArray(args)
   * // Returns [85, 100, 15] if user.score=85 and bonus=15
   * ```
   *
   * @example Evaluating array literal elements
   * ```typescript
   * // For array literal "[name, age * 2, active]"
   * const elements = [
   *   { type: 'Identifier', value: 'name' },
   *   { type: 'BinaryExpression', operator: '*', left: {...}, right: {...} },
   *   { type: 'Identifier', value: 'active' }
   * ]
   * const results = await evaluator.evalArray(elements)
   * // Returns ['John', 50, true] if name='John', age=25, active=true
   * ```
   */
  evalArray(arr: ASTNode[]): Promise<unknown[]> {
    return Promise.all(arr.map((elem) => this.eval(elem)))
  }

  /**
   * Evaluates a map of expression trees in parallel and returns a map with the same keys.
   *
   * This method is primarily used for evaluating object literal properties where each
   * property value is an expression that needs to be evaluated.
   *
   * @param map - Map from property names to expression tree nodes
   * @returns Promise resolving to map with same keys but evaluated values
   *
   * @example Evaluating object literal
   * ```typescript
   * // For object literal "{ fullName: name + ' ' + surname, isAdult: age >= 18 }"
   * const map = {
   *   fullName: {
   *     type: 'BinaryExpression',
   *     operator: '+',
   *     left: { type: 'Identifier', value: 'name' },
   *     right: { type: 'BinaryExpression', operator: '+', ... }
   *   },
   *   isAdult: {
   *     type: 'BinaryExpression',
   *     operator: '>=',
   *     left: { type: 'Identifier', value: 'age' },
   *     right: { type: 'Literal', value: 18 }
   *   }
   * }
   * const result = await evaluator.evalMap(map)
   * // Returns { fullName: 'John Doe', isAdult: true } if name='John', surname='Doe', age=25
   * ```
   *
   * @throws {Error} When a key in the map has no corresponding AST
   */
  async evalMap(map: Record<string, ASTNode>): Promise<Record<string, unknown>> {
    const keys = Object.keys(map)
    const result: Record<string, unknown> = {}
    const asts = keys.map((key) => {
      const ast = map[key]
      if (!ast) {
        throw new Error(`No AST found for key: ${key}`)
      }
      return this.eval(ast)
    })
    const vals = await Promise.all(asts)
    vals.forEach((val, idx) => {
      const key = keys[idx]
      if (key !== undefined) {
        result[key] = val
      }
    })
    return result
  }

  /**
   * Applies a filter expression with relative identifiers to an array of subjects.
   *
   * This method implements array filtering where each element becomes the relative context
   * for evaluating the filter expression. Elements that produce a truthy result are included
   * in the returned array. This is used for expressions like `users[.active == true]`.
   *
   * @param subject - The value to filter (converted to array if not already)
   * @param expr - Filter expression tree with relative identifiers (starting with '.')
   * @returns Promise resolving to filtered array of elements that passed the test
   *
   * @example Basic array filtering
   * ```typescript
   * const users = [
   *   { name: 'Alice', age: 25, active: true },
   *   { name: 'Bob', age: 17, active: false },
   *   { name: 'Carol', age: 30, active: true }
   * ]
   * // Filter expression: .active == true
   * const filterExpr = {
   *   type: 'BinaryExpression',
   *   operator: '==',
   *   left: { type: 'Identifier', value: 'active', relative: true },
   *   right: { type: 'Literal', value: true }
   * }
   * const result = await evaluator._filterRelative(users, filterExpr)
   * // Returns [{ name: 'Alice', age: 25, active: true }, { name: 'Carol', age: 30, active: true }]
   * ```
   *
   * @example Complex filtering with multiple conditions
   * ```typescript
   * // Filter expression: .age >= 18 && .score > 80
   * const result = await evaluator._filterRelative(students, complexFilterExpr)
   * // Returns only adult students with high scores
   * ```
   *
   * @example Non-array subject
   * ```typescript
   * const singleUser = { name: 'John', active: true }
   * // Gets converted to [singleUser] before filtering
   * const result = await evaluator._filterRelative(singleUser, filterExpr)
   * // Returns [singleUser] if filter passes, [] if it doesn't
   * ```
   *
   * @private
   */
  async _filterRelative(subject: unknown, expr: ASTNode): Promise<unknown[]> {
    const promises: Promise<unknown>[] = []
    let subjectArray: unknown[]
    if (!Array.isArray(subject)) {
      subjectArray = subject === undefined ? [] : [subject]
    } else {
      subjectArray = subject
    }
    subjectArray.forEach((elem) => {
      const evalInst = new Evaluator(this._grammar, this._context, elem as Record<string, unknown>)
      promises.push(evalInst.eval(expr))
    })
    const values = await Promise.all(promises)
    const results: unknown[] = []
    values.forEach((value, idx) => {
      if (value) {
        results.push(subjectArray[idx])
      }
    })
    return results
  }

  /**
   * Applies a static filter expression to access object properties or array elements.
   *
   * This method handles bracket notation access like `obj[key]` or `arr[index]`. If the
   * filter expression evaluates to a boolean, it returns the subject for true or undefined
   * for false. For other values, it uses the result as a property key or array index.
   *
   * @param subject - The object or array to access
   * @param expr - Expression tree that evaluates to a property key, array index, or boolean
   * @returns Promise resolving to the accessed value or undefined
   *
   * @example Object property access
   * ```typescript
   * const user = { name: 'John', email: 'john@example.com' }
   * // Filter expression: "em" + "ail"
   * const keyExpr = {
   *   type: 'BinaryExpression',
   *   operator: '+',
   *   left: { type: 'Literal', value: 'em' },
   *   right: { type: 'Literal', value: 'ail' }
   * }
   * const result = await evaluator._filterStatic(user, keyExpr)
   * // Returns 'john@example.com'
   * ```
   *
   * @example Array index access
   * ```typescript
   * const items = ['apple', 'banana', 'cherry']
   * // Filter expression: 1 + 1
   * const indexExpr = {
   *   type: 'BinaryExpression',
   *   operator: '+',
   *   left: { type: 'Literal', value: 1 },
   *   right: { type: 'Literal', value: 1 }
   * }
   * const result = await evaluator._filterStatic(items, indexExpr)
   * // Returns 'cherry' (items[2])
   * ```
   *
   * @example Boolean filtering
   * ```typescript
   * const data = { value: 42 }
   * // Filter expression: true
   * const boolExpr = { type: 'Literal', value: true }
   * const result = await evaluator._filterStatic(data, boolExpr)
   * // Returns { value: 42 } (the original data)
   * ```
   *
   * @private
   */
  async _filterStatic(subject: unknown, expr: ASTNode): Promise<unknown> {
    const res = await this.eval(expr)
    if (typeof res === 'boolean') {
      return res ? subject : undefined
    }
    // Type guard for indexable types
    if (subject === undefined) {
      return undefined
    }
    if (subject === null) {
      return null
    }
    if (typeof subject === 'object' || Array.isArray(subject)) {
      return (subject as any)[res as string | number]
    }
    return undefined
  }

  // ===== Private Handler Methods =====
  // These methods handle specific AST node types during evaluation

  /**
   * Evaluates an ArrayLiteral node by evaluating each element expression.
   *
   * @param ast - ArrayLiteral node containing array of element expressions
   * @returns Promise resolving to array with evaluated element values
   *
   * @example
   * ```typescript
   * // For array literal [name, age + 1, "static"]
   * const ast = {
   *   type: 'ArrayLiteral',
   *   value: [
   *     { type: 'Identifier', value: 'name' },
   *     { type: 'BinaryExpression', operator: '+', left: {...}, right: {...} },
   *     { type: 'Literal', value: 'static' }
   *   ]
   * }
   * const result = await evaluator._handleArrayLiteral(ast)
   * // Returns ['John', 26, 'static'] if name='John' and age=25
   * ```
   */
  private async _handleArrayLiteral(ast: ArrayLiteralNode): Promise<unknown[]> {
    return this.evalArray(ast.value)
  }

  /**
   * Evaluates a BinaryExpression node by applying the operator to left and right operands.
   *
   * Supports two evaluation modes:
   * - `eval`: Pre-evaluates both operands and passes values to operator function
   * - `evalOnDemand`: Passes wrapped operands that can be evaluated conditionally (for && and ||)
   *
   * @param ast - BinaryExpression node with operator and left/right operands
   * @returns Promise resolving to the operation result
   *
   * @example Arithmetic operation
   * ```typescript
   * // For expression "price * quantity"
   * const ast = {
   *   type: 'BinaryExpression',
   *   operator: '*',
   *   left: { type: 'Identifier', value: 'price' },
   *   right: { type: 'Identifier', value: 'quantity' }
   * }
   * const result = await evaluator._handleBinaryExpression(ast)
   * // Returns 150 if price=15 and quantity=10
   * ```
   *
   * @example Logical operation (evalOnDemand)
   * ```typescript
   * // For expression "user && user.active"
   * // Right side only evaluated if left side is truthy
   * const result = await evaluator._handleBinaryExpression(logicalAst)
   * // Returns user.active value if user exists, otherwise false
   * ```
   *
   * @throws {Error} When operator is unknown or has no eval function
   */
  private async _handleBinaryExpression(ast: BinaryExpressionNode): Promise<unknown> {
    const grammarOp = this._grammar.elements[ast.operator]

    if (!grammarOp) {
      throw new Error(`Unknown binary operator: ${ast.operator}`)
    }

    if ('evalOnDemand' in grammarOp && grammarOp.evalOnDemand) {
      const wrap = (subAst: ASTNode) => ({ eval: () => this.eval(subAst) })
      return grammarOp.evalOnDemand(wrap(ast.left), wrap(ast.right))
    }

    if ('eval' in grammarOp && grammarOp.eval) {
      const [leftVal, rightVal] = await Promise.all([this.eval(ast.left), this.eval(ast.right)])
      return grammarOp.eval(leftVal, rightVal)
    }

    throw new Error(`Binary operator ${ast.operator} has no eval function`)
  }

  /**
   * Evaluates a ConditionalExpression node (ternary operator: test ? consequent : alternate).
   *
   * First evaluates the test expression. If truthy, evaluates and returns the consequent.
   * If falsy, evaluates and returns the alternate. If consequent is missing (Elvis operator),
   * returns the test result itself.
   *
   * @param ast - ConditionalExpression node with test, consequent, and alternate
   * @returns Promise resolving to either consequent or alternate result
   *
   * @example Standard ternary
   * ```typescript
   * // For expression "age >= 18 ? 'adult' : 'minor'"
   * const ast = {
   *   type: 'ConditionalExpression',
   *   test: { type: 'BinaryExpression', operator: '>=', ... },
   *   consequent: { type: 'Literal', value: 'adult' },
   *   alternate: { type: 'Literal', value: 'minor' }
   * }
   * const result = await evaluator._handleConditionalExpression(ast)
   * // Returns 'adult' if age >= 18, 'minor' otherwise
   * ```
   *
   * @example Elvis operator (missing consequent)
   * ```typescript
   * // For expression "user.nickname ?: user.name"
   * // If nickname is truthy, return it; otherwise return name
   * const result = await evaluator._handleConditionalExpression(elvisAst)
   * // Returns nickname if it exists and is truthy, otherwise returns name
   * ```
   */
  private async _handleConditionalExpression(ast: ConditionalExpressionNode): Promise<unknown> {
    const res = await this.eval(ast.test)
    if (res) {
      if (ast.consequent) {
        return this.eval(ast.consequent)
      }
      return res
    }
    return this.eval(ast.alternate)
  }

  /**
   * Evaluates a FilterExpression node for array filtering or property access.
   *
   * Delegates to either relative filtering (for expressions like `users[.active]`) or
   * static filtering (for expressions like `user[key]` or `items[0]`).
   *
   * @param ast - FilterExpression node with subject, filter expression, and relative flag
   * @returns Promise resolving to filtered array or accessed property value
   *
   * @example Relative filtering
   * ```typescript
   * // For expression "users[.age > 21]"
   * const ast = {
   *   type: 'FilterExpression',
   *   subject: { type: 'Identifier', value: 'users' },
   *   expr: { type: 'BinaryExpression', operator: '>', ... },
   *   relative: true
   * }
   * const result = await evaluator._handleFilterExpression(ast)
   * // Returns array of users with age > 21
   * ```
   *
   * @example Static property access
   * ```typescript
   * // For expression "config['api' + 'Key']"
   * const ast = {
   *   type: 'FilterExpression',
   *   subject: { type: 'Identifier', value: 'config' },
   *   expr: { type: 'BinaryExpression', operator: '+', ... },
   *   relative: false
   * }
   * const result = await evaluator._handleFilterExpression(ast)
   * // Returns config.apiKey value
   * ```
   */
  private async _handleFilterExpression(ast: FilterExpressionNode): Promise<unknown> {
    const subject = await this.eval(ast.subject)
    if (ast.relative) {
      return this._filterRelative(subject, ast.expr)
    }
    return this._filterStatic(subject, ast.expr)
  }

  /**
   * Evaluates an Identifier node to resolve variable or property values.
   *
   * Handles multiple scenarios:
   * - Simple identifiers: resolved from main or relative context
   * - Property access: resolves the 'from' object first, then accesses the property
   * - Array indexing: automatically uses first element if accessing property on array
   *
   * @param ast - Identifier node with value, optional 'from' expression, and relative flag
   * @returns Promise resolving to the identifier's value or undefined if not found
   *
   * @example Simple identifier
   * ```typescript
   * // For identifier "username"
   * const ast = {
   *   type: 'Identifier',
   *   value: 'username',
   *   relative: false
   * }
   * const result = await evaluator._handleIdentifier(ast)
   * // Returns context.username value
   * ```
   *
   * @example Property access
   * ```typescript
   * // For expression "user.profile.avatar"
   * const ast = {
   *   type: 'Identifier',
   *   value: 'avatar',
   *   from: {
   *     type: 'Identifier',
   *     value: 'profile',
   *     from: { type: 'Identifier', value: 'user' }
   *   }
   * }
   * const result = await evaluator._handleIdentifier(ast)
   * // Returns user.profile.avatar value
   * ```
   *
   * @example Relative identifier
   * ```typescript
   * // For relative identifier ".status" in filter context
   * const ast = {
   *   type: 'Identifier',
   *   value: 'status',
   *   relative: true
   * }
   * const result = await evaluator._handleIdentifier(ast)
   * // Returns current relative context's status property
   * ```
   *
   * @example Array property access
   * ```typescript
   * // For "users.name" where users is an array
   * // Automatically accesses users[0].name
   * const result = await evaluator._handleIdentifier(arrayPropertyAst)
   * // Returns first user's name
   * ```
   */
  private async _handleIdentifier(ast: IdentifierNode): Promise<unknown> {
    if (!ast.from) {
      return ast.relative ? this._relContext[ast.value] : this._context[ast.value]
    }

    const context = await this.eval(ast.from)
    if (context === undefined) {
      return undefined
    }
    if (context === null) {
      return null
    }

    let targetContext = context
    if (Array.isArray(context)) {
      targetContext = context[0]
    }

    return (targetContext as any)?.[ast.value]
  }

  /**
   * Evaluates a Literal node by returning its stored value.
   *
   * Literals represent constant values like strings, numbers, booleans, null, etc.
   * This is the simplest evaluation case - just return the pre-parsed value.
   *
   * @param ast - Literal node containing the constant value
   * @returns The literal value (string, number, boolean, null, etc.)
   *
   * @example String literal
   * ```typescript
   * const ast = { type: 'Literal', value: 'Hello World' }
   * const result = evaluator._handleLiteral(ast)
   * // Returns 'Hello World'
   * ```
   *
   * @example Number literal
   * ```typescript
   * const ast = { type: 'Literal', value: 42.5 }
   * const result = evaluator._handleLiteral(ast)
   * // Returns 42.5
   * ```
   *
   * @example Boolean literal
   * ```typescript
   * const ast = { type: 'Literal', value: true }
   * const result = evaluator._handleLiteral(ast)
   * // Returns true
   * ```
   */
  private _handleLiteral(ast: LiteralNode): unknown {
    return ast.value
  }

  /**
   * Evaluates an ObjectLiteral node by evaluating each property value expression.
   *
   * Creates a new object with the same property keys but with evaluated values.
   * Each property value is an expression that gets evaluated independently.
   *
   * @param ast - ObjectLiteral node containing map of property names to value expressions
   * @returns Promise resolving to object with same keys but evaluated values
   *
   * @example Simple object literal
   * ```typescript
   * // For object literal "{ name: firstName, age: currentYear - birthYear }"
   * const ast = {
   *   type: 'ObjectLiteral',
   *   value: {
   *     name: { type: 'Identifier', value: 'firstName' },
   *     age: {
   *       type: 'BinaryExpression',
   *       operator: '-',
   *       left: { type: 'Identifier', value: 'currentYear' },
   *       right: { type: 'Identifier', value: 'birthYear' }
   *     }
   *   }
   * }
   * const result = await evaluator._handleObjectLiteral(ast)
   * // Returns { name: 'John', age: 25 } if firstName='John', currentYear=2023, birthYear=1998
   * ```
   *
   * @example Nested object literal
   * ```typescript
   * // For "{ user: { id: userId, active: true }, meta: { created: now() } }"
   * const result = await evaluator._handleObjectLiteral(nestedAst)
   * // Returns fully evaluated nested object structure
   * ```
   */
  private async _handleObjectLiteral(ast: ObjectLiteralNode): Promise<Record<string, unknown>> {
    return this.evalMap(ast.value)
  }

  /**
   * Evaluates a FunctionCall node by calling the function with evaluated arguments.
   *
   * Looks up the function in the appropriate pool (functions or transforms), evaluates
   * all arguments, and calls the function with the results. Transforms receive the
   * subject as the first argument, followed by any additional arguments.
   *
   * @param ast - FunctionCall node with name, arguments, and pool specification
   * @returns Promise resolving to the function's return value
   *
   * @example Regular function call
   * ```typescript
   * // For function call "max(score1, score2, 100)"
   * const ast = {
   *   type: 'FunctionCall',
   *   name: 'max',
   *   pool: 'functions',
   *   args: [
   *     { type: 'Identifier', value: 'score1' },
   *     { type: 'Identifier', value: 'score2' },
   *     { type: 'Literal', value: 100 }
   *   ]
   * }
   * const result = await evaluator._handleFunctionCall(ast)
   * // Returns 100 if score1=85 and score2=92
   * ```
   *
   * @example Transform call
   * ```typescript
   * // For transform "name|upper" (transforms are also FunctionCall nodes)
   * const ast = {
   *   type: 'FunctionCall',
   *   name: 'upper',
   *   pool: 'transforms',
   *   args: [{ type: 'Identifier', value: 'name' }]
   * }
   * const result = await evaluator._handleFunctionCall(ast)
   * // Returns 'JOHN' if name='john' and upper transform converts to uppercase
   * ```
   *
   * @throws {Error} When function pool is invalid or function is not defined
   */
  private async _handleFunctionCall(ast: FunctionCallNode): Promise<unknown> {
    const poolName = poolNames[ast.pool]
    if (!poolName) {
      throw new Error(`Corrupt AST: Pool '${ast.pool}' not found`)
    }

    const pool = this._grammar[ast.pool]
    const func = pool[ast.name]
    if (!func) {
      throw new Error(`${poolName} ${ast.name} is not defined.`)
    }

    const args = await this.evalArray(ast.args || [])
    return (func as any)(...args)
  }

  /**
   * Evaluates a UnaryExpression node by applying the unary operator to its operand.
   *
   * Evaluates the right-side operand first, then applies the unary operator's
   * evaluation function to the result. Common unary operators include negation (!).
   *
   * @param ast - UnaryExpression node with operator and right operand
   * @returns Promise resolving to the operation result
   *
   * @example Logical negation
   * ```typescript
   * // For expression "!user.active"
   * const ast = {
   *   type: 'UnaryExpression',
   *   operator: '!',
   *   right: {
   *     type: 'Identifier',
   *     value: 'active',
   *     from: { type: 'Identifier', value: 'user' }
   *   }
   * }
   * const result = await evaluator._handleUnaryExpression(ast)
   * // Returns false if user.active is true, true if user.active is false
   * ```
   *
   * @example Numeric negation (if supported)
   * ```typescript
   * // For expression "-price"
   * const ast = {
   *   type: 'UnaryExpression',
   *   operator: '-',
   *   right: { type: 'Identifier', value: 'price' }
   * }
   * const result = await evaluator._handleUnaryExpression(ast)
   * // Returns -15.99 if price=15.99
   * ```
   *
   * @throws {Error} When operator is unknown or has no eval function
   */
  private async _handleUnaryExpression(ast: UnaryExpressionNode): Promise<unknown> {
    const right = await this.eval(ast.right)
    const grammarOp = this._grammar.elements[ast.operator]

    if (!grammarOp) {
      throw new Error(`Unknown unary operator: ${ast.operator}`)
    }

    if ('eval' in grammarOp && grammarOp.eval) {
      // Unary operators only take one argument
      return (grammarOp.eval as any)(right)
    }

    throw new Error(`Unary operator ${ast.operator} has no eval function`)
  }
}
