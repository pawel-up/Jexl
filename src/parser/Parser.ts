/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * Jexl
 * Copyright 2020 Tom Shawver
 */

import type { Grammar } from '../grammar.js'
import { states } from './states.js'

export interface Token {
  type: string
  raw?: string
  right?: Token
  _parent?: Token
  args?: Token[]
  value?: unknown | unknown[]
  operator?: string
  // Additional properties for specific node types
  expr?: Token
  subject?: Token
  relative?: boolean
  from?: Token
  name?: string
  pool?: string
  left?: Token
  test?: Token
  consequent?: Token
  alternate?: Token
}

/**
 * The Parser is a state machine that converts tokens from the {@link Lexer}
 * into an Abstract Syntax Tree (AST), capable of being evaluated in any
 * context by the {@link Evaluator}.  The Parser expects that all tokens
 * provided to it are legal and typed properly according to the grammar, but
 * accepts that the tokens may still be in an invalid order or in some other
 * unparsable configuration that requires it to throw an Error.
 * @param rammar The grammar object to use to parse Jexl strings
 * @param prefix A string prefix to prepend to the expression string
 *      for error messaging purposes.  This is useful for when a new Parser is
 *      instantiated to parse an subexpression, as the parent Parser's
 *      expression string thus far can be passed for a more user-friendly
 *      error message.
 * @param stopMap A mapping of token types to any truthy value. When the
 *      token type is encountered, the parser will return the mapped value
 *      instead of boolean false.
 */
export default class Parser {
  _grammar: Grammar
  _state: string
  _tree: Token | null
  _exprStr: string
  _relative: boolean
  _stopMap: Record<string, unknown>
  _subParser: any
  _parentStop: any
  _cursor?: Token
  _nextIdentEncapsulate?: boolean
  _nextIdentRelative?: boolean
  _curObjKey?: string

  constructor(grammar: Grammar, prefix?: string, stopMap: Record<string, unknown> = {}) {
    this._grammar = grammar
    this._state = 'expectOperand'
    this._tree = null
    this._exprStr = prefix || ''
    this._relative = false
    this._stopMap = stopMap
  }

  /**
   * Processes a new token into the AST and manages the transitions of the state
   * machine.
   * @param token A token object, as provided by the
   *      {@link Lexer#tokenize} function.
   * @throws {Error} if a token is added when the Parser has been marked as
   *      complete by {@link #complete}, or if an unexpected token type is added.
   * @returns the stopState value if this parser encountered a token
   *      in the stopState mapb false if tokens can continue.
   */
  addToken(token: Token): boolean | unknown {
    if (this._state === 'complete') {
      throw new Error('Cannot add a new token to a completed Parser')
    }
    const state = states[this._state]
    if (!state) {
      throw new Error(`Invalid parser state: ${this._state}`)
    }
    const startExpr = this._exprStr
    this._exprStr += token.raw
    if (state.subHandler) {
      if (!this._subParser) {
        this._startSubExpression(startExpr)
      }
      const stopState = this._subParser.addToken(token)
      if (stopState) {
        this._endSubExpression()
        if (this._parentStop) return stopState
        this._state = stopState
      }
    } else if (state.tokenTypes && state.tokenTypes[token.type]) {
      const typeOpts = state.tokenTypes[token.type]
      if (!typeOpts) {
        throw new Error(`No type options for token ${token.type}`)
      }

      // Use internal handler methods instead of external handlers
      if (typeOpts.handler) {
        const handlerMethod = this._getTokenHandlerMethod(typeOpts.handler)
        if (handlerMethod) {
          handlerMethod(token)
        }
      } else {
        // Map token types to internal handler methods
        const handlerMethod = this._getHandlerMethod(token.type)
        if (handlerMethod) {
          handlerMethod(token)
        }
      }

      if (typeOpts.toState) {
        this._state = typeOpts.toState
      }
    } else if (this._stopMap[token.type]) {
      return this._stopMap[token.type]
    } else {
      throw new Error(`Token ${token.raw} (${token.type}) unexpected in expression: ${this._exprStr}`)
    }
    return false
  }

  /**
   * Processes an array of tokens iteratively through the {@link #addToken}
   * function.
   * @param tokens An array of tokens, as provided by
   *      the {@link Lexer#tokenize} function.
   */
  addTokens(tokens: Token[]) {
    tokens.forEach(this.addToken, this)
  }

  /**
   * Marks this Parser instance as completed and retrieves the full AST.
   * @returns a full expression tree, ready for evaluation by the
   *      {@link Evaluator#eval} function, or null if no tokens were passed to
   *      the parser before complete was called
   * @throws {Error} if the parser is not in a state where it's legal to end
   *      the expression, indicating that the expression is incomplete
   */
  complete(): Token | null {
    const currentState = states[this._state]
    if (this._cursor && (!currentState || !currentState.completable)) {
      throw new Error(`Unexpected end of expression: ${this._exprStr}`)
    }
    if (this._subParser) {
      this._endSubExpression()
    }
    this._state = 'complete'
    return this._cursor ? this._tree : null
  }

  /**
   * Indicates whether the expression tree contains a relative path identifier.
   * @returns true if a relative identifier exists false otherwise.
   */
  isRelative(): boolean {
    return this._relative
  }

  /**
   * Ends a subexpression by completing the subParser and passing its result
   * to the subHandler configured in the current state.
   * @private
   */
  _endSubExpression() {
    const currentState = states[this._state]
    if (!currentState || !currentState.subHandler) {
      throw new Error(`Invalid state for ending subexpression: ${this._state}`)
    }
    const subHandlerName = currentState.subHandler
    const handlerMethod = this._getSubHandlerMethod(subHandlerName)
    if (handlerMethod) {
      handlerMethod(this._subParser.complete())
    }
    this._subParser = null
  }

  /**
   * Places a new tree node at the current position of the cursor (to the 'right'
   * property) and then advances the cursor to the new node. This function also
   * handles setting the parent of the new node.
   * @param node A node to be added to the AST
   * @private
   */
  _placeAtCursor(node: Token): void {
    if (!this._cursor) {
      this._tree = node
    } else {
      this._cursor.right = node
      this._setParent(node, this._cursor)
    }
    this._cursor = node
  }

  /**
   * Places a tree node before the current position of the cursor, replacing
   * the node that the cursor currently points to. This should only be called in
   * cases where the cursor is known to exist, and the provided node already
   * contains a pointer to what's at the cursor currently.
   * @param node A node to be added to the AST
   * @private
   */
  _placeBeforeCursor(node: Token): void {
    this._cursor = this._cursor?._parent
    this._placeAtCursor(node)
  }

  /**
   * Sets the parent of a node by creating a non-enumerable _parent property
   * that points to the supplied parent argument.
   * @param node A node of the AST on which to set a new
   *      parent
   * @param parent An existing node of the AST to serve as the
   *      parent of the new node
   * @private
   */
  _setParent(node: Token, parent: Token): void {
    Object.defineProperty(node, '_parent', {
      value: parent,
      writable: true,
    })
  }

  /**
   * Prepares the Parser to accept a subexpression by (re)instantiating the
   * subParser.
   * @param {string} [exprStr] The expression string to prefix to the new Parser
   * @private
   */
  _startSubExpression(exprStr?: string): void {
    let endStates = (states as any)[this._state].endStates
    if (!endStates) {
      this._parentStop = true
      endStates = this._stopMap
    }
    this._subParser = new Parser(this._grammar, exprStr, endStates)
  }

  /**
   * Handles a subexpression that's used to define a transform argument's value.
   * @param ast The subexpression tree
   */
  private argVal(this: Parser, ast?: Token) {
    if (ast) {
      this._cursor?.args?.push(ast)
    }
  }

  /**
   * Handles new array literals by adding them as a new node in the AST,
   * initialized with an empty array.
   */
  private arrayStart() {
    this._placeAtCursor({
      type: 'ArrayLiteral',
      value: [],
    })
  }

  /**
   * Handles a subexpression representing an element of an array literal.
   * @param ast The subexpression tree
   */
  private arrayVal(ast: Token): void {
    const { _cursor } = this
    if (ast && _cursor && Array.isArray(_cursor.value)) {
      _cursor.value.push(ast)
    }
  }

  /**
   * Handles tokens of type 'binaryOp', indicating an operation that has two
   * inputs: a left side and a right side.
   * @param token A token object
   */
  private binaryOp(token: Token): void {
    const precedence = (this._grammar.elements[token.value as string] as any)?.precedence || 0
    let parent = this._cursor?._parent
    while (parent && parent.operator && (this._grammar.elements[parent.operator] as any)?.precedence >= precedence) {
      this._cursor = parent
      parent = parent._parent
    }
    const node: Token = {
      type: 'BinaryExpression',
      operator: token.value as string,
      left: this._cursor,
    }
    if (this._cursor) {
      this._setParent(this._cursor, node)
    }
    this._cursor = parent
    this._placeAtCursor(node)
  }

  /**
   * Handles successive nodes in an identifier chain.  More specifically, it
   * sets values that determine how the following identifier gets placed in the
   * AST.
   */
  private dot(): void {
    this._nextIdentEncapsulate = Boolean(
      this._cursor &&
        this._cursor.type !== 'UnaryExpression' &&
        (this._cursor.type !== 'BinaryExpression' || (this._cursor.type === 'BinaryExpression' && this._cursor.right))
    )
    this._nextIdentRelative = !this._cursor || (this._cursor && !this._nextIdentEncapsulate)
    if (this._nextIdentRelative) {
      this._relative = true
    }
  }

  /**
   * Handles a subexpression used for filtering an array returned by an
   * identifier chain.
   * @param ast The subexpression tree
   */
  private filter(ast: Token): void {
    this._placeBeforeCursor({
      type: 'FilterExpression',
      expr: ast,
      relative: this._subParser.isRelative(),
      subject: this._cursor,
    })
  }

  /**
   * Handles identifier tokens when used to indicate the name of a function to
   * be called.
   */
  private functionCall(): void {
    this._placeBeforeCursor({
      type: 'FunctionCall',
      name: this._cursor?.value as string,
      args: [],
      pool: 'functions',
    })
  }

  /**
   * Handles identifier tokens by adding them as a new node in the AST.
   * @param token A token object
   */
  private identifier(token: Token): void {
    const node: Token = {
      type: 'Identifier',
      value: token.value,
    }
    if (this._nextIdentEncapsulate) {
      node.from = this._cursor
      this._placeBeforeCursor(node)
      this._nextIdentEncapsulate = false
    } else {
      if (this._nextIdentRelative) {
        node.relative = true
        this._nextIdentRelative = false
      }
      this._placeAtCursor(node)
    }
  }

  /**
   * Handles literal values, such as strings, booleans, and numerics, by adding
   * them as a new node in the AST.
   * @param token A token object
   */
  private literal(token: Token): void {
    this._placeAtCursor({
      type: 'Literal',
      value: token.value,
    })
  }

  /**
   * Queues a new object literal key to be written once a value is collected.
   * @param token A token object
   */
  private objKey(token: Token): void {
    this._curObjKey = token.value as string
  }

  /**
   * Handles new object literals by adding them as a new node in the AST,
   * initialized with an empty object.
   */
  private objStart(): void {
    this._placeAtCursor({
      type: 'ObjectLiteral',
      value: {},
    })
  }

  /**
   * Handles an object value by adding its AST to the queued key on the object
   * literal node currently at the cursor.
   * @param ast The subexpression tree
   */
  private objVal(ast: Token): void {
    if (this._cursor && this._curObjKey) {
      ;(this._cursor.value as Record<string, Token>)[this._curObjKey] = ast
    }
  }

  /**
   * Handles traditional subexpressions, delineated with the groupStart and
   * groupEnd elements.
   * @param ast The subexpression tree
   */
  private subExpression(ast: Token): void {
    this._placeAtCursor(ast)
  }

  /**
   * Handles a completed alternate subexpression of a ternary operator.
   * @param ast The subexpression tree
   */
  private ternaryEnd(ast: Token): void {
    if (this._cursor) {
      this._cursor.alternate = ast
    }
  }

  /**
   * Handles a completed consequent subexpression of a ternary operator.
   * @param ast The subexpression tree
   */
  private ternaryMid(ast: Token): void {
    if (this._cursor) {
      this._cursor.consequent = ast
    }
  }

  /**
   * Handles the start of a new ternary expression by encapsulating the entire
   * AST in a ConditionalExpression node, and using the existing tree as the
   * test element.
   */
  private ternaryStart(): void {
    this._tree = {
      type: 'ConditionalExpression',
      test: this._tree || undefined,
    }
    this._cursor = this._tree
  }

  /**
   * Handles identifier tokens when used to indicate the name of a transform to
   * be applied.
   * @param token A token object
   */
  private transform(token: Token): void {
    this._placeBeforeCursor({
      type: 'FunctionCall',
      name: token.value as string,
      args: this._cursor ? [this._cursor] : [],
      pool: 'transforms',
    })
  }

  /**
   * Handles token of type 'unaryOp', indicating that the operation has only
   * one input: a right side.
   * @param token A token object
   */
  private unaryOp(token: Token): void {
    this._placeAtCursor({
      type: 'UnaryExpression',
      operator: token.value as string,
    })
  }

  /**
   * Maps token types to their corresponding handler methods
   * @param tokenType The type of token to handle
   * @returns The handler method for this token type
   * @private
   */
  private _getHandlerMethod(tokenType: string): ((token: Token) => void) | undefined {
    switch (tokenType) {
      case 'binaryOp':
        return this.binaryOp.bind(this)
      case 'dot':
        return () => this.dot()
      case 'identifier':
        return this.identifier.bind(this)
      case 'literal':
        return this.literal.bind(this)
      case 'unaryOp':
        return this.unaryOp.bind(this)
      default:
        return undefined
    }
  }

  /**
   * Maps token handler names to their corresponding handler methods
   * @param handlerName The name of the token handler to handle
   * @returns The handler method for this token handler name
   * @private
   */
  private _getTokenHandlerMethod(handlerName: string): ((token: Token) => void) | undefined {
    switch (handlerName) {
      case 'arrayStart':
        return () => this.arrayStart()
      case 'functionCall':
        return () => this.functionCall()
      case 'objKey':
        return this.objKey.bind(this)
      case 'objStart':
        return () => this.objStart()
      case 'ternaryStart':
        return () => this.ternaryStart()
      case 'transform':
        return this.transform.bind(this)
      default:
        return undefined
    }
  }

  /**
   * Maps subHandler names to their corresponding handler methods
   * @param handlerName The name of the subHandler to handle
   * @returns The handler method for this subHandler name
   * @private
   */
  private _getSubHandlerMethod(handlerName?: string): ((ast: Token) => void) | undefined {
    switch (handlerName) {
      case 'argVal':
        return this.argVal.bind(this)
      case 'arrayVal':
        return this.arrayVal.bind(this)
      case 'filter':
        return this.filter.bind(this)
      case 'objVal':
        return this.objVal.bind(this)
      case 'subExpression':
        return this.subExpression.bind(this)
      case 'ternaryEnd':
        return this.ternaryEnd.bind(this)
      case 'ternaryMid':
        return this.ternaryMid.bind(this)
      default:
        return undefined
    }
  }

  // ===== Private Handler Methods =====
}
