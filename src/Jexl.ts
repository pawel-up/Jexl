import Expression, { type Context } from './Expression.js'
import {
  type BinaryOpFunction,
  type FunctionFunction,
  getGrammar,
  type UnaryOpFunction,
  type Grammar,
  type TransformFunction,
  GrammarElement,
  BinaryElement,
  UnaryElement,
} from './grammar.js'

/**
 * Jexl is the JavaScript Expression Language, capable of parsing and evaluating
 * basic to complex expression strings, combined with advanced xpath-like drill
 * down into native JavaScript objects.
 *
 * This is the main entry point for the Jexl library. It provides methods for:
 * - Parsing and evaluating expressions with context data
 * - Adding custom operators, functions, and transforms
 * - Compiling expressions for repeated evaluation
 * - Creating template literal expressions
 *
 * @example
 * ```typescript
 * import { Jexl } from '@pawel-up/jexl'
 *
 * const jexl = new Jexl()
 *
 * // Basic evaluation
 * const result = await jexl.eval('user.name | upper', {
 *   user: { name: 'John' }
 * })
 * console.log(result) // 'JOHN'
 *
 * // Add custom transform
 * jexl.addTransform('double', (val: number) => val * 2)
 * await jexl.eval('5 | double') // 10
 *
 * // Template literal syntax
 * const name = 'World'
 * const expr = jexl.expr`"Hello, ${name}!"`
 * await expr.eval() // 'Hello, World!'
 *
 * // Compile for reuse
 * const compiled = jexl.compile('items[type == "urgent"] | length')
 * await compiled.eval({ items: [...] })
 * ```
 *
 * ## Core Features
 *
 * - **Type-safe**: Written in TypeScript with comprehensive type definitions
 * - **Extensible**: Add custom operators, functions, and transforms
 * - **Performance**: Compile expressions once, evaluate many times
 * - **Context-aware**: Access nested object properties and array elements
 * - **Async-friendly**: All evaluations return promises for consistent API
 *
 * ## Expression Syntax
 *
 * Jexl supports a rich expression syntax including:
 * - Property access: `user.profile.name`
 * - Array filtering: `items[category == "books"]`
 * - Transforms: `title | upper | truncate(50)`
 * - Functions: `max(scores) + average(grades)`
 * - Ternary operators: `age >= 18 ? "adult" : "minor"`
 * - Boolean logic: `active && verified || admin`
 */
export class Jexl {
  /**
   * The grammar used by this Jexl instance.
   */
  grammar: Grammar

  constructor() {
    // Allow expr to be called outside of the jexl context
    this.expr = this.expr.bind(this)
    this.grammar = getGrammar()
  }

  /**
   * Adds a custom binary operator to Jexl at the specified precedence level.
   * Binary operators work between two operands (left and right values).
   *
   * The precedence determines the order of operations - higher precedence operators
   * are evaluated first. For reference, multiplication (*) has higher precedence
   * than addition (+), so `2 + 3 * 4` evaluates as `2 + (3 * 4) = 14`.
   *
   * ## Precedence Guidelines
   * - **Arithmetic**: `*` (60), `/` (60), `%` (60), `+` (40), `-` (40)
   * - **Comparison**: `<` (30), `>` (30), `<=` (30), `>=` (30), `==` (20), `!=` (20)
   * - **Logical**: `&&` (10), `||` (5)
   *
   * @param operator The operator string (e.g., '**', '%%', '<>')
   * @param precedence The operator's precedence (higher = evaluated first)
   * @param fn Function to calculate the result, receives (left, right) operands
   * @param manualEval If true, operands are wrapped with eval() for conditional evaluation
   *
   * @example
   * ```typescript
   * // Add exponentiation operator
   * jexl.addBinaryOp('**', 70, (left: number, right: number) => Math.pow(left, right))
   * await jexl.eval('2 ** 3') // 8
   *
   * // Add string concatenation with custom operator
   * jexl.addBinaryOp('~', 45, (left: string, right: string) => left + right)
   * await jexl.eval('"Hello" ~ " World"') // "Hello World"
   *
   * // Manual evaluation for short-circuiting (like && operator)
   * jexl.addBinaryOp('??', 8, async (left, right) => {
   *   const leftVal = await left.eval()
   *   return leftVal != null ? leftVal : await right.eval()
   * }, true)
   * await jexl.eval('null ?? "default"') // "default"
   * ```
   */
  addBinaryOp(operator: string, precedence: number, fn: BinaryOpFunction, manualEval?: boolean): void {
    const element: BinaryElement = {
      type: 'binaryOp',
      precedence: precedence,
    }
    if (manualEval) {
      element.evalOnDemand = fn
    } else {
      element.eval = fn
    }
    this._addGrammarElement(operator, element)
  }

  /**
   * Adds or replaces a custom function that can be called within Jexl expressions.
   * Functions can accept multiple arguments and perform complex operations.
   *
   * Unlike transforms (which operate on piped values), functions are called explicitly
   * with parentheses and can be used anywhere in an expression.
   *
   * @param name The function name as it will appear in expressions
   * @param fn The JavaScript function to execute, receives all expression arguments
   *
   * @example
   * ```typescript
   * // Math functions
   * jexl.addFunction('max', (...args: number[]) => Math.max(...args))
   * jexl.addFunction('min', (...args: number[]) => Math.min(...args))
   * await jexl.eval('max(1, 5, 3)') // 5
   *
   * // String utilities
   * jexl.addFunction('concat', (...strings: string[]) => strings.join(''))
   * await jexl.eval('concat("Hello", " ", "World")') // "Hello World"
   *
   * // Array operations
   * jexl.addFunction('sum', (arr: number[]) => arr.reduce((a, b) => a + b, 0))
   * await jexl.eval('sum([1, 2, 3, 4])') // 10
   *
   * // Complex logic with context access
   * jexl.addFunction('formatName', (first: string, last: string) => {
   *   return `${last}, ${first}`
   * })
   * await jexl.eval('formatName(user.firstName, user.lastName)', {
   *   user: { firstName: 'John', lastName: 'Doe' }
   * }) // "Doe, John"
   * ```
   */
  addFunction(name: string, fn: FunctionFunction) {
    this.grammar.functions[name] = fn
  }

  /**
   * Convenience method for adding multiple functions at once.
   * Equivalent to calling `addFunction()` for each key-value pair in the map.
   *
   * @param map Object mapping function names to their implementations
   *
   * @example
   * ```typescript
   * jexl.addFunctions({
   *   // Math utilities
   *   square: (n: number) => n * n,
   *   cube: (n: number) => n * n * n,
   *
   *   // String utilities
   *   reverse: (str: string) => str.split('').reverse().join(''),
   *   titleCase: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
   *
   *   // Array utilities
   *   first: (arr: unknown[]) => arr[0],
   *   last: (arr: unknown[]) => arr[arr.length - 1],
   *   length: (arr: unknown[]) => arr.length
   * })
   *
   * // Usage examples
   * await jexl.eval('square(5)') // 25
   * await jexl.eval('titleCase("hello world")') // "Hello world"
   * await jexl.eval('first([1, 2, 3])') // 1
   * ```
   */
  addFunctions(map: Record<string, FunctionFunction>) {
    for (const key in map) {
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        const fn = map[key]
        if (fn) {
          this.grammar.functions[key] = fn
        }
      }
    }
  }

  /**
   * Adds a custom unary operator to Jexl. Unary operators work on a single operand
   * and are currently only supported as prefix operators (before the value).
   *
   * All unary operators have infinite weight, meaning they are evaluated before
   * any binary operators in the expression.
   *
   * @param operator The operator string (e.g., '!', '~', '++')
   * @param fn Function to calculate the result, receives the operand value
   *
   * @example
   * ```typescript
   * // Add bitwise NOT operator
   * jexl.addUnaryOp('~', (val: number) => ~val)
   * await jexl.eval('~5') // -6
   *
   * // Add absolute value operator
   * jexl.addUnaryOp('abs', (val: number) => Math.abs(val))
   * await jexl.eval('abs(-42)') // 42
   *
   * // Add string length operator
   * jexl.addUnaryOp('#', (val: string) => val.length)
   * await jexl.eval('#"hello"') // 5
   *
   * // Works with expressions
   * await jexl.eval('~(3 + 2)') // ~5 = -6
   * await jexl.eval('#user.name', { user: { name: 'John' } }) // 4
   * ```
   */
  addUnaryOp(operator: string, fn: UnaryOpFunction) {
    const element: UnaryElement = {
      type: 'unaryOp',
      weight: Infinity,
      eval: fn,
    }
    this._addGrammarElement(operator, element)
  }

  /**
   * Adds or replaces a transform function in this Jexl instance.
   * Transforms are applied using the pipe operator (|) and operate on the
   * value to their left, optionally accepting additional arguments.
   *
   * Transforms are ideal for data processing pipelines where you want to
   * chain multiple operations together.
   *
   * @param name The transform name as it will appear after the pipe operator
   * @param fn Function that receives the piped value as first argument, plus any additional args
   *
   * @example
   * ```typescript
   * // Simple value transformation
   * jexl.addTransform('double', (val: number) => val * 2)
   * await jexl.eval('5 | double') // 10
   *
   * // Transform with arguments
   * jexl.addTransform('multiply', (val: number, factor: number) => val * factor)
   * await jexl.eval('5 | multiply(3)') // 15
   *
   * // String transformations
   * jexl.addTransform('truncate', (str: string, length: number) =>
   *   str.length > length ? str.slice(0, length) + '...' : str
   * )
   * await jexl.eval('"Hello World" | truncate(5)') // "Hello..."
   *
   * // Array transformations
   * jexl.addTransform('sum', (arr: number[]) => arr.reduce((a, b) => a + b, 0))
   * await jexl.eval('[1, 2, 3, 4] | sum') // 10
   *
   * // Chaining transforms
   * jexl.addTransform('sort', (arr: number[]) => [...arr].sort((a, b) => a - b))
   * await jexl.eval('[3, 1, 4, 2] | sort | sum') // 10
   * ```
   */
  addTransform(name: string, fn: TransformFunction) {
    this.grammar.transforms[name] = fn
  }

  /**
   * Convenience method for adding multiple transforms at once.
   * Equivalent to calling `addTransform()` for each key-value pair in the map.
   *
   * @param map Object mapping transform names to their implementations
   *
   * @example
   * ```typescript
   * jexl.addTransforms({
   *   // String transforms
   *   upper: (str: string) => str.toUpperCase(),
   *   lower: (str: string) => str.toLowerCase(),
   *   trim: (str: string) => str.trim(),
   *
   *   // Number transforms
   *   abs: (num: number) => Math.abs(num),
   *   round: (num: number, places = 0) => Number(num.toFixed(places)),
   *
   *   // Array transforms
   *   reverse: (arr: unknown[]) => [...arr].reverse(),
   *   unique: (arr: unknown[]) => [...new Set(arr)]
   * })
   *
   * // Usage examples
   * await jexl.eval('"  Hello World  " | trim | upper') // "HELLO WORLD"
   * await jexl.eval('3.14159 | round(2)') // 3.14
   * await jexl.eval('[1, 2, 2, 3] | unique') // [1, 2, 3]
   * ```
   */
  addTransforms(map: Record<string, TransformFunction>) {
    for (const key in map) {
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        const fn = map[key]
        if (fn) {
          this.grammar.transforms[key] = fn
        }
      }
    }
  }

  /**
   * Creates an Expression object from the given Jexl expression string and
   * immediately compiles it into an Abstract Syntax Tree (AST).
   *
   * Compilation parses the expression once, creating an optimized representation
   * that can be evaluated multiple times with different contexts without
   * re-parsing the original string.
   *
   * @param expression The Jexl expression string to compile
   * @returns A compiled Expression object ready for evaluation
   *
   * @example
   * ```typescript
   * // Compile an expression for reuse
   * const compiled = jexl.compile('user.orders | length')
   *
   * // Evaluate with different contexts
   * await compiled.eval({ user: { orders: [1, 2, 3] } }) // 3
   * await compiled.eval({ user: { orders: [1, 2] } })    // 2
   * await compiled.eval({ user: { orders: [] } })        // 0
   *
   * // Complex expressions benefit most from compilation
   * const complexExpr = jexl.compile(
   *   'items[price > 100] | map("name") | sort | join(", ")'
   * )
   *
   * // Use with different datasets
   * const result1 = await complexExpr.eval({ items: expensiveItems })
   * const result2 = await complexExpr.eval({ items: luxuryItems })
   * ```
   */
  compile<R>(expression: string): Expression<R> {
    const exprObj = this.createExpression<R>(expression)
    return exprObj.compile()
  }

  /**
   * Creates an Expression object from a Jexl expression string without compiling it.
   * The expression will be compiled automatically when first evaluated.
   *
   * Use this method when you want to create an expression object but defer
   * compilation until evaluation time, or when you need to access the raw
   * expression string before compilation.
   *
   * @param expression The Jexl expression string to wrap
   * @returns An Expression object (not yet compiled)
   *
   * @example
   * ```typescript
   * // Create expression without immediate compilation
   * const expr = jexl.createExpression('user.name | upper')
   *
   * // Compilation happens automatically on first eval
   * await expr.eval({ user: { name: 'john' } }) // 'JOHN'
   *
   * // Or compile explicitly when ready
   * expr.compile()
   * await expr.eval({ user: { name: 'jane' } }) // 'JANE'
   *
   * // Useful for conditional compilation
   * const expressions = [
   *   jexl.createExpression('simple'),
   *   jexl.createExpression('complex | operation')
   * ]
   * // Compile only the ones you need
   * expressions[1].compile()
   * ```
   */
  createExpression<R = unknown>(expression: string): Expression<R> {
    return new Expression<R>(this.grammar, expression)
  }

  /**
   * Retrieves a previously registered expression function by name.
   * Useful for introspection, testing, or calling functions programmatically.
   *
   * @param name The name of the expression function
   * @returns The function implementation
   * @throws {Error} if the function is not found
   *
   * @example
   * ```typescript
   * // Register a function
   * jexl.addFunction('max', (...args: number[]) => Math.max(...args))
   *
   * // Retrieve and use it directly
   * const maxFn = jexl.getFunction('max')
   * maxFn(1, 5, 3) // 5
   *
   * // Check if function exists before using
   * try {
   *   const myFn = jexl.getFunction('customFunction')
   *   // Function exists, safe to use
   * } catch (error) {
   *   // Function doesn't exist, handle gracefully
   *   console.log('Function not found')
   * }
   * ```
   */
  getFunction(name: string): FunctionFunction {
    const fn = this.grammar.functions[name]
    if (!fn) {
      throw new Error(`Function '${name}' is not defined`)
    }
    return fn
  }

  /**
   * Retrieves a previously registered transform function by name.
   * Useful for introspection, testing, or calling transforms programmatically.
   *
   * @param name The name of the transform function
   * @returns The transform function implementation
   * @throws {Error} if the transform is not found
   *
   * @example
   * ```typescript
   * // Register a transform
   * jexl.addTransform('double', (val: number) => val * 2)
   *
   * // Retrieve and use it directly
   * const doubleFn = jexl.getTransform('double')
   * doubleFn(5) // 10
   *
   * // Use for programmatic transformation
   * const upperFn = jexl.getTransform('upper')
   * const names = ['john', 'jane', 'bob']
   * const upperNames = names.map(upperFn) // ['JOHN', 'JANE', 'BOB']
   *
   * // Conditional transform application
   * try {
   *   const customTransform = jexl.getTransform('customTransform')
   *   result = customTransform(value)
   * } catch (error) {
   *   result = value // fallback if transform doesn't exist
   * }
   * ```
   */
  getTransform(name: string): TransformFunction {
    const fn = this.grammar.transforms[name]
    if (!fn) {
      throw new Error(`Transform '${name}' is not defined`)
    }
    return fn
  }

  /**
   * Evaluates a Jexl expression string with optional context data.
   * This is a convenience method that creates and evaluates an expression in one call.
   *
   * For repeated evaluations of the same expression, consider using `compile()`
   * for better performance as it avoids re-parsing the expression string.
   *
   * @param expression The Jexl expression string to evaluate
   * @param context Variables and values accessible within the expression
   * @returns Promise resolving to the evaluation result
   *
   * @example
   * ```typescript
   * // Simple evaluation
   * await jexl.eval('2 + 3') // 5
   *
   * // With context data
   * await jexl.eval('user.name', {
   *   user: { name: 'Alice', age: 30 }
   * }) // 'Alice'
   *
   * // Complex expressions with transforms
   * await jexl.eval('users | map("name") | join(", ")', {
   *   users: [
   *     { name: 'Alice', age: 30 },
   *     { name: 'Bob', age: 25 }
   *   ]
   * }) // 'Alice, Bob'
   *
   * // Conditional logic
   * await jexl.eval('age >= 18 ? "adult" : "minor"', { age: 20 }) // 'adult'
   *
   * // Array filtering and processing
   * await jexl.eval('products[price < 100] | length', {
   *   products: [
   *     { name: 'Book', price: 15 },
   *     { name: 'Phone', price: 300 },
   *     { name: 'Pen', price: 2 }
   *   ]
   * }) // 2
   * ```
   */
  eval<R = unknown>(expression: string, context: Context = {}): Promise<R> {
    const exprObj = this.createExpression<R>(expression)
    return exprObj.eval(context)
  }

  /**
   * Evaluates a Jexl expression and coerces the result to a string.
   * @param expression The Jexl expression string to evaluate.
   * @param context Optional context object.
   * @returns A promise that resolves to the string result.
   */
  evalAsString(expression: string, context: Context = {}): Promise<string> {
    const exprObj = this.createExpression<string>(expression)
    return exprObj.evalAsString(context)
  }

  /**
   * Evaluates a Jexl expression and coerces the result to a number.
   * `null` and `undefined` results are coerced to `NaN`.
   * @param expression The Jexl expression string to evaluate.
   * @param context Optional context object.
   * @returns A promise that resolves to the number result.
   */
  evalAsNumber(expression: string, context: Context = {}): Promise<number> {
    const exprObj = this.createExpression<number>(expression)
    return exprObj.evalAsNumber(context)
  }

  /**
   * Evaluates a Jexl expression and coerces the result to a boolean.
   * Uses standard JavaScript truthiness rules.
   * @param expression The Jexl expression string to evaluate.
   * @param context Optional context object.
   * @returns A promise that resolves to the boolean result.
   */
  evalAsBoolean(expression: string, context: Context = {}): Promise<boolean> {
    const exprObj = this.createExpression<boolean>(expression)
    return exprObj.evalAsBoolean(context)
  }

  /**
   * Evaluates a Jexl expression and ensures the result is an array.
   * - If the result is an array, it's returned as is.
   * - If the result is `null` or `undefined`, an empty array `[]` is returned.
   * - Otherwise, the result is wrapped in an array.
   * @template T The expected type of elements in the array.
   * @param expression The Jexl expression string to evaluate.
   * @param context Optional context object.
   * @returns A promise that resolves with the result as an array.
   */
  evalAsArray<T = unknown>(expression: string, context: Context = {}): Promise<T[]> {
    // The expression can return a single item of type T, or an array of T.
    // We set the expression's expected type R to T | T[] to cover both cases.
    const exprObj = this.createExpression<T>(expression)
    return exprObj.evalAsArray(context) as Promise<T[]>
  }

  /**
   * Evaluates a Jexl expression and validates it against a list of allowed values.
   * @template T The type of the enum values.
   * @param expression The Jexl expression string to evaluate.
   * @param context A mapping of variables to values.
   * @param allowedValues An array of allowed values for the result.
   * @returns A promise that resolves with the result if it's in the `allowedValues` list, otherwise `undefined`.
   */
  evalAsEnum<T = string | number | boolean>(
    expression: string,
    context: Context = {},
    allowedValues: readonly T[]
  ): Promise<T | undefined> {
    const exprObj = this.createExpression<T>(expression)
    return exprObj.evalAsEnum(context, allowedValues)
  }

  /**
   * Evaluates a Jexl expression, returning a default value if the result is `null` or `undefined`.
   * This is useful for providing defaults for optional paths without relying on the `||` operator,
   * which would also override falsy values like `0`, `false`, or `""`.
   * @template T The expected type of the result.
   * @param expression The Jexl expression string to evaluate.
   * @param context A mapping of variables to values.
   * @param defaultValue The value to return if the expression result is `null` or `undefined`.
   * @returns A promise that resolves with the expression's result or the default value.
   */
  evalWithDefault<T = unknown>(expression: string, context: Context = {}, defaultValue: T): Promise<T> {
    const exprObj = this.createExpression<T>(expression)
    return exprObj.evalWithDefault(context, defaultValue)
  }

  /**
   * Template literal function for creating Jexl expressions with embedded JavaScript values.
   * Allows you to interpolate variables directly into expression strings using template syntax.
   *
   * The interpolated values are converted to strings and embedded directly into the expression,
   * so be careful with user input to avoid injection issues.
   *
   * @param strings The template string parts
   * @param args The interpolated values
   * @returns An Expression object ready for evaluation
   *
   * @example
   * ```typescript
   * // Basic interpolation
   * const threshold = 100
   * const expr = jexl.expr`price > ${threshold}`
   * await expr.eval({ price: 150 }) // true
   *
   * // Multiple interpolations
   * const field = 'name'
   * const value = 'John'
   * const filterExpr = jexl.expr`users[${field} == "${value}"]`
   * await filterExpr.eval({
   *   users: [
   *     { name: 'John', age: 30 },
   *     { name: 'Jane', age: 25 }
   *   ]
   * }) // [{ name: 'John', age: 30 }]
   *
   * // Dynamic property access
   * const property = 'email'
   * const userExpr = jexl.expr`user.${property}`
   * await userExpr.eval({
   *   user: { name: 'Alice', email: 'alice@example.com' }
   * }) // 'alice@example.com'
   *
   * // Building expressions programmatically
   * const operations = ['upper', 'trim']
   * const transformChain = operations.join(' | ')
   * const dynamicExpr = jexl.expr`input | ${transformChain}`
   * await dynamicExpr.eval({ input: '  hello world  ' }) // 'HELLO WORLD'
   * ```
   */
  expr(strings: string[] | TemplateStringsArray, ...args: unknown[]): Expression {
    const exprStr = strings.reduce((acc, str, idx) => {
      const arg = idx < args.length ? args[idx] : ''
      acc += str + arg
      return acc
    }, '')
    return this.createExpression(exprStr)
  }

  /**
   * Removes a binary or unary operator from the Jexl grammar.
   * This permanently removes the operator from this Jexl instance, making it
   * unavailable for use in future expressions.
   *
   * @param operator The operator string to remove (e.g., '+', '&&', '!')
   *
   * @example
   * ```typescript
   * // Remove the modulo operator
   * jexl.removeOp('%')
   *
   * // This will now throw an error
   * try {
   *   await jexl.eval('10 % 3')
   * } catch (error) {
   *   console.log('Modulo operator not available')
   * }
   *
   * // Remove multiple operators
   * jexl.removeOp('+')
   * jexl.removeOp('-')
   * jexl.removeOp('!')
   *
   * // Create a restricted expression environment
   * const restrictedJexl = new Jexl()
   * restrictedJexl.removeOp('*') // No multiplication
   * restrictedJexl.removeOp('/') // No division
   * // Only allow safe operations
   * ```
   */
  removeOp(operator: string): void {
    if (
      Object.prototype.hasOwnProperty.call(this.grammar.elements, operator) &&
      (this.grammar.elements[operator].type === 'binaryOp' || this.grammar.elements[operator].type === 'unaryOp')
    ) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.grammar.elements[operator]
    }
  }

  /**
   * Adds an element to the grammar map used by this Jexl instance.
   * @param str The key string to be added
   * @param obj A map of configuration options for this grammar element
   * @private
   */
  private _addGrammarElement(str: string, obj: GrammarElement): void {
    this.grammar.elements[str] = obj
  }
}
