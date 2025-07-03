import Evaluator from './evaluator/Evaluator.js'
import { Grammar, ASTNode } from './grammar.js'
import Lexer from './Lexer.js'
import Parser from './parser/Parser.js'

/**
 * Context for expression evaluation.
 * Maps variable names to their values that will be accessible within the expression.
 *
 * @example
 * ```typescript
 * const context: Context = {
 *   user: { name: 'John', age: 30 },
 *   items: [1, 2, 3],
 *   config: { debug: true }
 * }
 * ```
 */
export type Context = Record<string, unknown>

/**
 * Expression represents a compiled Jexl expression that can be evaluated multiple times
 * with different contexts. This class handles the compilation of expression strings into
 * Abstract Syntax Trees (AST) and their subsequent evaluation.
 *
 * Expressions are created through the `Jexl.compile()` or `Jexl.createExpression()` methods
 * and provide better performance for repeated evaluations since the parsing overhead
 * is incurred only once during compilation.
 *
 * @example
 * ```typescript
 * import { Jexl } from '@pawel-up/jexl'
 *
 * const jexl = new Jexl()
 *
 * // Create and compile an expression
 * const expr = jexl.compile('user.profile.name | upper')
 *
 * // Evaluate with different contexts
 * await expr.eval({ user: { profile: { name: 'alice' } } }) // 'ALICE'
 * await expr.eval({ user: { profile: { name: 'bob' } } })   // 'BOB'
 *
 * // Complex expressions with filters and functions
 * const orderExpr = jexl.compile('orders[status == "pending"] | length')
 * await orderExpr.eval({
 *   orders: [
 *     { id: 1, status: 'pending' },
 *     { id: 2, status: 'completed' },
 *     { id: 3, status: 'pending' }
 *   ]
 * }) // 2
 * ```
 *
 * ## Compilation Process
 *
 * 1. **Lexical Analysis**: Expression string is tokenized into meaningful parts
 * 2. **Parsing**: Tokens are organized into an Abstract Syntax Tree (AST)
 * 3. **Optimization**: AST is prepared for efficient evaluation
 *
 * ## Evaluation Process
 *
 * 1. **Context Binding**: Variables in the context are made available to the expression
 * 2. **AST Traversal**: The syntax tree is walked and operations are executed
 * 3. **Result Computation**: Final result is computed and returned as a Promise
 *
 * ## Performance Benefits
 *
 * - **Reusability**: Compile once, evaluate many times
 * - **Efficiency**: No repeated parsing overhead
 * - **Type Safety**: Compile-time validation of expression syntax
 */
export default class Expression {
  /** The grammar configuration used for parsing and evaluation */
  _grammar: Grammar
  /** The original expression string provided during construction */
  _exprStr: string
  /** The compiled Abstract Syntax Tree, null until compilation */
  _ast: ASTNode | null

  /**
   * Creates a new Expression instance with the given grammar and expression string.
   * Note: The expression is not compiled until `compile()` is called explicitly
   * or implicitly during the first evaluation.
   *
   * @param grammar The grammar configuration containing operators, functions, and transforms
   * @param exprStr The Jexl expression string to be compiled and evaluated
   *
   * @example
   * ```typescript
   * const expr = new Expression(grammar, 'user.name | upper')
   * ```
   */
  constructor(grammar: Grammar, exprStr: string) {
    this._grammar = grammar
    this._exprStr = exprStr
    this._ast = null
  }

  /**
   * Forces a compilation of the expression string that this Expression object
   * was constructed with. This function can be called multiple times; useful
   * if the language elements of the associated Jexl instance change.
   * @returns this Expression instance, for convenience
   */
  compile(): this {
    const lexer = new Lexer(this._grammar)
    const parser = new Parser(this._grammar)
    const tokens = lexer.tokenize(this._exprStr)
    parser.addTokens(tokens)
    const result = parser.complete()
    // Convert Token to ASTNode - they have compatible structures
    this._ast = result as ASTNode | null
    return this
  }

  /**
   * Asynchronously evaluates the expression within an optional context.
   * @param context A mapping of variables to values, which will be
   *      made accessible to the Jexl expression when evaluating it
   * @returns resolves with the result of the evaluation.
   */
  eval(context: Context = {}): Promise<unknown> {
    return this._eval(context)
  }

  /**
   * Internal evaluation method that handles the actual evaluation logic.
   * @param context The evaluation context
   * @returns Promise that resolves to the evaluation result
   */
  async _eval(context: Context): Promise<unknown> {
    const ast = this._getAst()
    if (!ast) {
      throw new Error('No AST available for evaluation. Expression may not be compiled.')
    }

    const evaluator = new Evaluator(
      this._grammar,
      context,
      context // Use the same context as relative context
    )
    return evaluator.eval(ast)
  }

  /**
   * Gets the compiled AST, compiling if necessary.
   * @returns The compiled AST
   * @throws {Error} if compilation fails
   */
  _getAst(): ASTNode | null {
    if (!this._ast) {
      this.compile()
    }
    return this._ast
  }
}
