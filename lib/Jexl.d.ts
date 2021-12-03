import Expression, { Context } from './Expression';
import { Grammar } from './grammar';

type TransformFunction = (value: any, ...args: any[]) => any;

type BinaryOpFunction = (left: any, right: any) => any;

type UnaryOpFunction = (right: any) => any;

type FunctionFunction = (value: any, ...args: any[]) => any;

/**
 * Jexl is the Javascript Expression Language, capable of parsing and
 * evaluating basic to complex expression strings, combined with advanced
 * xpath-like drilldown into native Javascript objects.
 */
export class Jexl {
  _grammar: Grammar;
  constructor();

  /**
   * Adds a binary operator to Jexl at the specified precedence. The higher the
   * precedence, the earlier the operator is applied in the order of operations.
   * For example, * has a higher precedence than +, because multiplication comes
   * before division.
   *
   * Please see grammar.js for a listing of all default operators and their
   * precedence values in order to choose the appropriate precedence for the
   * new operator.
   * @param {string} operator The operator string to be added
   * @param {number} precedence The operator's precedence
   * @param {function} fn A function to run to calculate the result. The function
   *      will be called with two arguments: left and right, denoting the values
   *      on either side of the operator. It should return either the resulting
   *      value, or a Promise that resolves with the resulting value.
   * @param {boolean} [manualEval] If true, the `left` and `right` arguments
   *      will be wrapped in objects with an `eval` function. Calling
   *      left.eval() or right.eval() will return a promise that resolves to
   *      that operand's actual value. This is useful to conditionally evaluate
   *      operands.
   */
  addBinaryOp(operator: string, precedence: number, fn: BinaryOpFunction): void;

  /**
   * Adds or replaces an expression function in this Jexl instance.
   * @param {string} name The name of the expression function, as it will be
   *      used within Jexl expressions
   * @param {function} fn The javascript function to be executed when this
   *      expression function is invoked. It will be provided with each argument
   *      supplied in the expression, in the same order.
   */
  addFunction(name: string, fn: FunctionFunction): void;

  /**
   * Syntactic sugar for calling {@link #addFunction} repeatedly. This function
   * accepts a map of one or more expression function names to their javascript
   * function counterpart.
   * @param {{}} map A map of expression function names to javascript functions
   */
  addFunctions(map: { [key: string]: FunctionFunction }): void;

  /**
   * Adds a unary operator to Jexl. Unary operators are currently only supported
   * on the left side of the value on which it will operate.
   * @param {string} operator The operator string to be added
   * @param {function} fn A function to run to calculate the result. The function
   *      will be called with one argument: the literal value to the right of the
   *      operator. It should return either the resulting value, or a Promise
   *      that resolves with the resulting value.
   */
  addUnaryOp(operator: string, fn: UnaryOpFunction): void;

  /**
   * Adds or replaces a transform function in this Jexl instance.
   * @param {string} name The name of the transform function, as it will be used
   *      within Jexl expressions
   * @param {function} fn The function to be executed when this transform is
   *      invoked. It will be provided with at least one argument:
   *          - {*} value: The value to be transformed
   *          - {...*} args: The arguments for this transform
   */
  addTransform(name: string, fn: TransformFunction): void;

  /**
   * Syntactic sugar for calling {@link #addTransform} repeatedly.  This function
   * accepts a map of one or more transform names to their transform function.
   * @param {{}} map A map of transform names to transform functions
   */
  addTransforms(map: { [key: string]: TransformFunction }): void;

  /**
   * Creates an Expression object from the given Jexl expression string, and
   * immediately compiles it. The returned Expression object can then be
   * evaluated multiple times with new contexts, without generating any
   * additional string processing overhead.
   * @param {string} expression The Jexl expression to be compiled
   * @returns {Expression} The compiled Expression object
   */
  compile(expression: string): Expression;

  /**
   * Constructs an Expression object from a Jexl expression string.
   * @param {string} expression The Jexl expression to be wrapped in an
   *    Expression object
   * @returns {Expression} The Expression object representing the given string
   */
  createExpression(expression: string): Expression;

  /**
   * Retrieves a previously set expression function.
   * @param {string} name The name of the expression function
   * @returns {function} The expression function
   */
  getFunction(name: string): FunctionFunction;

  /**
   * Retrieves a previously set transform function.
   * @param {string} name The name of the transform function
   * @returns {function} The transform function
   */
  getTransform(name: string): TransformFunction;

  /**
   * Asynchronously evaluates a Jexl string within an optional context.
   * @param {string} expression The Jexl expression to be evaluated
   * @param {Object} [context] A mapping of variables to values, which will be
   *      made accessible to the Jexl expression when evaluating it
   * @returns {Promise<*>} resolves with the result of the evaluation.
   */
  eval(expression: string, context?: Context): Promise<any>;

  /**
   * Synchronously evaluates a Jexl string within an optional context.
   * @param {string} expression The Jexl expression to be evaluated
   * @param {Object} [context] A mapping of variables to values, which will be
   *      made accessible to the Jexl expression when evaluating it
   * @returns {*} the result of the evaluation.
   * @throws {*} on error
   */
  evalSync(expression: string, context?: Context): any;

  /**
   * A JavaScript template literal to allow expressions to be defined by the
   * syntax: expr`40 + 2`
   * @param {Array<string>} strs
   * @param  {...any} args
   */
  expr(strs: string[], ...args: any[]): Expression;

  /**
   * Removes a binary or unary operator from the Jexl grammar.
   * @param {string} operator The operator string to be removed
   */
  removeOp(operator: string): void;
}
