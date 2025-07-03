/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * Jexl
 * Copyright 2020 Tom Shawver
 */

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
 * Jexl is the Javascript Expression Language, capable of parsing and
 * evaluating basic to complex expression strings, combined with advanced
 * xpath-like drilldown into native Javascript objects.
 */
export class Jexl {
  _grammar: Grammar

  constructor() {
    // Allow expr to be called outside of the jexl context
    this.expr = this.expr.bind(this)
    this._grammar = getGrammar()
  }

  /**
   * Adds a binary operator to Jexl at the specified precedence. The higher the
   * precedence, the earlier the operator is applied in the order of operations.
   * For example, * has a higher precedence than +, because multiplication comes
   * before division.
   *
   * Please see grammar.js for a listing of all default operators and their
   * precedence values in order to choose the appropriate precedence for the
   * new operator.
   * @param operator The operator string to be added
   * @param precedence The operator's precedence
   * @param fn A function to run to calculate the result. The function
   *      will be called with two arguments: left and right, denoting the values
   *      on either side of the operator. It should return either the resulting
   *      value, or a Promise that resolves with the resulting value.
   * @param manualEval If true, the `left` and `right` arguments
   *      will be wrapped in objects with an `eval` function. Calling
   *      left.eval() or right.eval() will return a promise that resolves to
   *      that operand's actual value. This is useful to conditionally evaluate
   *      operands.
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
   * Adds or replaces an expression function in this Jexl instance.
   * @param name The name of the expression function, as it will be
   *      used within Jexl expressions
   * @param fn The javascript function to be executed when this
   *      expression function is invoked. It will be provided with each argument
   *      supplied in the expression, in the same order.
   */
  addFunction(name: string, fn: FunctionFunction) {
    this._grammar.functions[name] = fn
  }

  /**
   * Syntactic sugar for calling {@link #addFunction} repeatedly. This function
   * accepts a map of one or more expression function names to their javascript
   * function counterpart.
   * @param map A map of expression function names to javascript functions
   */
  addFunctions(map: Record<string, FunctionFunction>) {
    for (const key in map) {
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        const fn = map[key]
        if (fn) {
          this._grammar.functions[key] = fn
        }
      }
    }
  }

  /**
   * Adds a unary operator to Jexl. Unary operators are currently only supported
   * on the left side of the value on which it will operate.
   * @param operator The operator string to be added
   * @param fn A function to run to calculate the result. The function
   *      will be called with one argument: the literal value to the right of the
   *      operator. It should return either the resulting value, or a Promise
   *      that resolves with the resulting value.
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
   * @param name The name of the transform function, as it will be used
   *      within Jexl expressions
   * @param fn The function to be executed when this transform is
   *      invoked. It will be provided with at least one argument:
   *          - {*} value: The value to be transformed
   *          - {...*} args: The arguments for this transform
   */
  addTransform(name: string, fn: TransformFunction) {
    this._grammar.transforms[name] = fn
  }

  /**
   * Syntactic sugar for calling {@link #addTransform} repeatedly.  This function
   * accepts a map of one or more transform names to their transform function.
   * @param map A map of transform names to transform functions
   */
  addTransforms(map: Record<string, TransformFunction>) {
    for (const key in map) {
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        const fn = map[key]
        if (fn) {
          this._grammar.transforms[key] = fn
        }
      }
    }
  }

  /**
   * Creates an Expression object from the given Jexl expression string, and
   * immediately compiles it. The returned Expression object can then be
   * evaluated multiple times with new contexts, without generating any
   * additional string processing overhead.
   * @param expression The Jexl expression to be compiled
   * @returns The compiled Expression object
   */
  compile(expression: string): Expression {
    const exprObj = this.createExpression(expression)
    return exprObj.compile()
  }

  /**
   * Constructs an Expression object from a Jexl expression string.
   * @param expression The Jexl expression to be wrapped in an
   *    Expression object
   * @returns The Expression object representing the given string
   */
  createExpression(expression: string): Expression {
    return new Expression(this._grammar, expression)
  }

  /**
   * Retrieves a previously set expression function.
   * @param name The name of the expression function
   * @returns The expression function
   * @throws {Error} if the function is not found
   */
  getFunction(name: string): FunctionFunction {
    const fn = this._grammar.functions[name]
    if (!fn) {
      throw new Error(`Function '${name}' is not defined`)
    }
    return fn
  }

  /**
   * Retrieves a previously set transform function.
   * @param name The name of the transform function
   * @returns The transform function
   * @throws {Error} if the transform is not found
   */
  getTransform(name: string): TransformFunction {
    const fn = this._grammar.transforms[name]
    if (!fn) {
      throw new Error(`Transform '${name}' is not defined`)
    }
    return fn
  }

  /**
   * Asynchronously evaluates a Jexl string within an optional context.
   * @param expression The Jexl expression to be evaluated
   * @param context A mapping of variables to values, which will be
   *      made accessible to the Jexl expression when evaluating it
   * @returns {Promise<*>} resolves with the result of the evaluation.
   */
  eval(expression: string, context: Context = {}): Promise<unknown> {
    const exprObj = this.createExpression(expression)
    return exprObj.eval(context)
  }

  /**
   * Synchronously evaluates a Jexl string within an optional context.
   * @param _expression The Jexl expression to be evaluated
   * @param _context A mapping of variables to values, which will be
   *      made accessible to the Jexl expression when evaluating it
   * @returns the result of the evaluation.
   * @throws {Error} always - synchronous evaluation is no longer supported
   * @deprecated Use eval() instead for asynchronous evaluation
   */
  evalSync(_expression: string, _context: Context = {}): never {
    throw new Error('Synchronous evaluation is no longer supported. Use eval() instead for asynchronous evaluation.')
  }

  /**
   * A JavaScript template literal to allow expressions to be defined by the
   * syntax: expr`40 + 2`
   */
  expr(strs: string[] | TemplateStringsArray, ...args: unknown[]): Expression {
    const exprStr = strs.reduce((acc, str, idx) => {
      const arg = idx < args.length ? args[idx] : ''
      acc += str + arg
      return acc
    }, '')
    return this.createExpression(exprStr)
  }

  /**
   * Removes a binary or unary operator from the Jexl grammar.
   * @param operator The operator string to be removed
   */
  removeOp(operator: string): void {
    if (
      this._grammar.elements[operator] &&
      (this._grammar.elements[operator].type === 'binaryOp' || this._grammar.elements[operator].type === 'unaryOp')
    ) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this._grammar.elements[operator]
    }
  }

  /**
   * Adds an element to the grammar map used by this Jexl instance.
   * @param str The key string to be added
   * @param obj A map of configuration options for this
   *      grammar element
   * @private
   */
  _addGrammarElement(str: string, obj: GrammarElement): void {
    this._grammar.elements[str] = obj
  }
}
