/*
 * Jexl
 * Copyright 2020 Tom Shawver
 */

import Evaluator from './evaluator/Evaluator.js'
import { Grammar, ASTNode } from './grammar.js'
import Lexer from './Lexer.js'
import Parser from './parser/Parser.js'

export type Context = Record<string, unknown>

export default class Expression {
  _grammar: Grammar
  _exprStr: string
  _ast: ASTNode | null

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
   * Synchronously evaluates the expression within an optional context.
   * Note: This method throws an error since the evaluator is inherently async.
   * Use eval() for asynchronous evaluation.
   * @param _context A mapping of variables to values
   * @throws {Error} Always throws since synchronous evaluation is not supported
   * @deprecated Use eval() instead for proper async evaluation
   */
  evalSync(_context: Context = {}): never {
    throw new Error(
      'Synchronous evaluation is not supported. Use eval() for asynchronous evaluation.'
    )
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
      context  // Use the same context as relative context
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
