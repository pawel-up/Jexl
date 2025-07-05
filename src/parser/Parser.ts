/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Grammar } from '../grammar.js'
import { states } from './states.js'

/**
 * Represents a token in the parsing process, which can be either a simple token from the lexer
 * or a complex AST node being constructed during parsing.
 *
 * @example Simple token from lexer
 * ```typescript
 * const token: Token = {
 *   type: 'identifier',
 *   value: 'username',
 *   raw: 'username'
 * }
 * ```
 *
 * @example Complex AST node during parsing
 * ```typescript
 * const binaryExpr: Token = {
 *   type: 'BinaryExpression',
 *   operator: '+',
 *   left: { type: 'Identifier', value: 'a' },
 *   right: { type: 'Literal', value: 5 }
 * }
 * ```
 */
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
 * The Parser is a state machine that converts tokens from the {@link Lexer} into an Abstract Syntax Tree (AST).
 *
 * The Parser processes tokens sequentially and builds a tree structure that represents the logical
 * structure of the expression. It handles operator precedence, nested expressions, function calls,
 * object/array literals, and complex filtering operations.
 *
 * @example Basic parsing workflow
 * ```typescript
 * const grammar = getGrammar()
 * const lexer = new Lexer(grammar)
 * const parser = new Parser(grammar)
 *
 * // Parse simple expression: "age + 5"
 * const tokens = lexer.tokenize("age + 5")
 * parser.addTokens(tokens)
 * const ast = parser.complete()
 * // Returns: { type: 'BinaryExpression', operator: '+', left: {...}, right: {...} }
 * ```
 *
 * @example Parsing complex expressions
 * ```typescript
 * // Parse: "users[.age > 18].name|upper"
 * const tokens = lexer.tokenize("users[.age > 18].name|upper")
 * parser.addTokens(tokens)
 * const ast = parser.complete()
 * // Returns complex AST with FilterExpression, Identifier, and FunctionCall nodes
 * ```
 *
 * @example Sub expression parsing
 * ```typescript
 * // Used internally for parsing nested expressions like function arguments
 * const subParser = new Parser(grammar, "parentExpr", { ')': 'argEnd' })
 * // Parses until ')' token and returns stop state 'argEnd'
 * ```
 */
export default class Parser {
  /** The grammar object containing language rules, operators, and functions */
  _grammar: Grammar

  /** Current state of the parser state machine (e.g., 'expectOperand', 'expectBinaryOp') */
  _state: string

  /** Root node of the AST being constructed */
  _tree: Token | null

  /** Current expression string being parsed (used for error messages) */
  _exprStr: string

  /** Flag indicating if the expression contains relative identifiers (starting with '.') */
  _relative: boolean

  /** Map of token types to stop states for sub expression parsing */
  _stopMap: Record<string, unknown>

  /** Sub parser instance for handling nested expressions */
  _subParser: any

  /** Flag indicating if this parser should stop when encountering a stop token */
  _parentStop: any

  /** Current position in the AST where new nodes are added */
  _cursor?: Token

  /** Flag indicating if the next identifier should encapsulate the current cursor */
  _nextIdentEncapsulate?: boolean

  /** Flag indicating if the next identifier should be relative */
  _nextIdentRelative?: boolean

  /** Currently queued object key waiting for a value */
  _curObjKey?: string

  /**
   * Creates a new Parser instance for building Abstract Syntax Trees from token streams.
   *
   * @param grammar - Grammar object containing language rules and operators
   * @param prefix - String prefix for error messages (useful for sub expressions)
   * @param stopMap - Map of token types to stop states for sub expression parsing
   *
   * @example Basic parser creation
   * ```typescript
   * const grammar = getGrammar()
   * const parser = new Parser(grammar)
   * ```
   *
   * @example Sub expression parser with stop conditions
   * ```typescript
   * // Parser that stops when encountering ')' or ',' tokens
   * const subParser = new Parser(grammar, "func(", {
   *   ')': 'functionEnd',
   *   ',': 'nextArg'
   * })
   * ```
   *
   * @example Error message prefix
   * ```typescript
   * // For better error messages in nested contexts
   * const parser = new Parser(grammar, "users[.age > ")
   * // Error messages will include the prefix for context
   * ```
   */
  constructor(grammar: Grammar, prefix?: string, stopMap: Record<string, unknown> = {}) {
    this._grammar = grammar
    this._state = 'expectOperand'
    this._tree = null
    this._exprStr = prefix || ''
    this._relative = false
    this._stopMap = stopMap
  }

  /**
   * Processes a single token and advances the parser state machine.
   *
   * This is the core method that drives the parsing process. It examines the current parser state,
   * determines if the token is valid in that state, and either processes it directly or delegates
   * to a sub parser for nested expressions.
   *
   * @param token - Token to process (from lexer or as part of AST construction)
   * @returns false if parsing should continue, or stop state value if a stop condition was met
   *
   * @example Processing simple tokens
   * ```typescript
   * const parser = new Parser(grammar)
   *
   * // Process identifier token
   * const result1 = parser.addToken({ type: 'identifier', value: 'age', raw: 'age' })
   * // Returns false (continue parsing)
   *
   * // Process operator token
   * const result2 = parser.addToken({ type: 'binaryOp', value: '+', raw: '+' })
   * // Returns false (continue parsing)
   *
   * // Process literal token
   * const result3 = parser.addToken({ type: 'literal', value: 5, raw: '5' })
   * // Returns false (continue parsing)
   * ```
   *
   * @example Sub expression with stop conditions
   * ```typescript
   * // Parser configured to stop on ')' token
   * const parser = new Parser(grammar, "", { ')': 'endGroup' })
   * parser.addToken({ type: 'identifier', value: 'x', raw: 'x' })
   * const result = parser.addToken({ type: 'closeParen', raw: ')' })
   * // Returns 'endGroup' (stop state reached)
   * ```
   *
   * @throws {Error} When parser is already complete
   * @throws {Error} When unexpected token type is encountered
   * @throws {Error} When parser state is invalid
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
   * Processes an array of tokens sequentially using {@link addToken}.
   *
   * This is a convenience method for processing multiple tokens at once, typically
   * the entire token stream from a lexer.
   *
   * @param tokens - Array of tokens to process sequentially
   *
   * @example Processing token stream from lexer
   * ```typescript
   * const lexer = new Lexer(grammar)
   * const parser = new Parser(grammar)
   *
   * const tokens = lexer.tokenize("user.name + ' - ' + user.email")
   * parser.addTokens(tokens)
   * const ast = parser.complete()
   * // Fully parsed AST ready for evaluation
   * ```
   *
   * @example Manual token array
   * ```typescript
   * const tokens = [
   *   { type: 'identifier', value: 'age', raw: 'age' },
   *   { type: 'binaryOp', value: '>', raw: '>' },
   *   { type: 'literal', value: 18, raw: '18' }
   * ]
   * parser.addTokens(tokens)
   * // Creates AST for "age > 18"
   * ```
   */
  addTokens(tokens: Token[]) {
    tokens.forEach(this.addToken, this)
  }

  /**
   * Finalizes parsing and returns the completed Abstract Syntax Tree.
   *
   * This method should be called after all tokens have been processed. It verifies that
   * the parser is in a valid end state and returns the root of the constructed AST.
   *
   * @returns The root AST node, or null if no tokens were processed
   *
   * @example Completing simple expression
   * ```typescript
   * const parser = new Parser(grammar)
   * parser.addTokens(lexer.tokenize("price * quantity"))
   * const ast = parser.complete()
   * // Returns:
   * // {
   * //   type: 'BinaryExpression',
   * //   operator: '*',
   * //   left: { type: 'Identifier', value: 'price' },
   * //   right: { type: 'Identifier', value: 'quantity' }
   * // }
   * ```
   *
   * @example Completing complex expression
   * ```typescript
   * parser.addTokens(lexer.tokenize("users[.age > 21 && .active].name"))
   * const ast = parser.complete()
   * // Returns complex AST with FilterExpression containing nested BinaryExpression
   * ```
   *
   * @example Empty expression
   * ```typescript
   * const parser = new Parser(grammar)
   * const ast = parser.complete()
   * // Returns null (no tokens processed)
   * ```
   *
   * @throws {Error} When parser is not in a valid completion state (incomplete expression)
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
   * Indicates whether the expression contains relative path identifiers.
   *
   * Relative identifiers start with '.' and are used in filter expressions to reference
   * properties of the current context item (e.g., '.age' in 'users[.age > 18]').
   *
   * @returns true if relative identifiers are present, false otherwise
   *
   * @example Expression with relative identifiers
   * ```typescript
   * const parser = new Parser(grammar)
   * parser.addTokens(lexer.tokenize("users[.age > 18 && .active]"))
   * parser.complete()
   * const hasRelative = parser.isRelative()
   * // Returns true (contains '.age' and '.active')
   * ```
   *
   * @example Expression without relative identifiers
   * ```typescript
   * parser.addTokens(lexer.tokenize("user.name + user.email"))
   * parser.complete()
   * const hasRelative = parser.isRelative()
   * // Returns false (no relative identifiers)
   * ```
   *
   * @example Used in sub expression parsing
   * ```typescript
   * // When parsing filter expressions, this helps determine the filter type
   * const filterParser = new Parser(grammar, "", stopMap)
   * filterParser.addTokens(filterTokens)
   * const filterAst = filterParser.complete()
   * if (filterParser.isRelative()) {
   *   // Use relative filtering (each array element as context)
   * } else {
   *   // Use static filtering (property access or boolean check)
   * }
   * ```
   */
  isRelative(): boolean {
    return this._relative
  }

  /**
   * Ends a sub expression by completing the subParser and passing its result
   * to the subHandler configured in the current state.
   * @private
   */
  _endSubExpression() {
    const currentState = states[this._state]
    if (!currentState || !currentState.subHandler) {
      throw new Error(`Invalid state for ending sub expression: ${this._state}`)
    }
    const subHandlerName = currentState.subHandler
    const handlerMethod = this._getSubHandlerMethod(subHandlerName)
    if (handlerMethod) {
      handlerMethod(this._subParser.complete())
    }
    this._subParser = null
  }

  /**
   * Places a new AST node at the current cursor position and advances the cursor.
   *
   * This is the primary method for adding nodes to the AST. It handles both root node
   * creation and linking nodes into the tree structure.
   *
   * @param node - AST node to place at the cursor
   *
   * @example First node (root)
   * ```typescript
   * // When tree is empty, node becomes the root
   * this._placeAtCursor({ type: 'Identifier', value: 'user' })
   * // Result: _tree = { type: 'Identifier', value: 'user' }
   * //         _cursor points to this node
   * ```
   *
   * @example Subsequent nodes
   * ```typescript
   * // When cursor exists, node becomes the 'right' child
   * this._placeAtCursor({ type: 'Literal', value: 5 })
   * // Result: previous node's 'right' property points to new node
   * //         _cursor advances to new node
   * ```
   *
   * @example Building binary expression
   * ```typescript
   * // For "a + b":
   * // 1. Place identifier 'a' (becomes root)
   * // 2. Binary operator '+' restructures tree
   * // 3. Place identifier 'b' (becomes right child of '+')
   * ```
   *
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
   * Places a node before the current cursor position, effectively replacing the cursor node.
   *
   * This method is used when a node needs to "wrap" or "contain" the current cursor node,
   * such as when creating filter expressions or function calls.
   *
   * @param node - AST node that should contain the current cursor node
   *
   * @example Creating filter expression
   * ```typescript
   * // Current cursor points to 'users' identifier
   * // Create filter that wraps it:
   * this._placeBeforeCursor({
   *   type: 'FilterExpression',
   *   subject: this._cursor,  // 'users' becomes the subject
   *   expr: filterAst,
   *   relative: true
   * })
   * // Result: FilterExpression becomes new cursor, containing 'users'
   * ```
   *
   * @example Converting identifier to function call
   * ```typescript
   * // Current cursor points to 'max' identifier
   * // Convert to function call:
   * this._placeBeforeCursor({
   *   type: 'FunctionCall',
   *   name: this._cursor.value,  // 'max'
   *   args: [],
   *   pool: 'functions'
   * })
   * // Result: FunctionCall replaces identifier, ready for arguments
   * ```
   *
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
   * Prepares the Parser to accept a sub expression by (re)instantiating the
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
   * Handles a sub expression that's used to define a transform argument's value.
   * @param ast The sub expression tree
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
   * Handles a sub expression representing an element of an array literal.
   * @param ast The sub expression tree
   */
  private arrayVal(ast: Token): void {
    const { _cursor } = this
    if (ast && _cursor && Array.isArray(_cursor.value)) {
      _cursor.value.push(ast)
    }
  }

  /**
   * Handles binary operator tokens and manages operator precedence.
   *
   * Binary operators like +, -, *, /, ==, etc. require special handling to ensure correct
   * operator precedence. This method restructures the AST to maintain proper order of operations.
   *
   * @param token - Binary operator token with operator value
   *
   * @example Operator precedence handling
   * ```typescript
   * // For expression "2 + 3 * 4"
   * // First processes: 2, then +, then 3, then *
   * // When * is encountered, it has higher precedence than +
   * // So the tree gets restructured to ensure 3*4 is evaluated first
   * //
   * // Before * token:           After * token:
   * //     +                        +
   * //   /   \                    /   \
   * //  2     3                  2     *
   * //                                / \
   * //                               3   (next)
   * ```
   *
   * @example Left-to-right evaluation for same precedence
   * ```typescript
   * // For expression "10 - 5 + 2"
   * // Both - and + have same precedence, so left-to-right evaluation
   * // Final AST: ((10 - 5) + 2)
   * ```
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
   * Handles dot (.) tokens for property access and relative identifier setup.
   *
   * The dot operator is used for property access (user.name) and to indicate relative
   * identifiers in filters (.age). This method sets up state flags that control how
   * the next identifier will be processed.
   *
   * @example Property access chain
   * ```typescript
   * // For "user.profile.avatar"
   * // Each dot sets up the next identifier to be chained from the previous
   * // Creates: { type: 'Identifier', value: 'avatar', from: { ... } }
   * ```
   *
   * @example Relative identifier in filter
   * ```typescript
   * // For "users[.age > 18]"
   * // The dot before 'age' marks it as relative to the current filter context
   * // Creates: { type: 'Identifier', value: 'age', relative: true }
   * ```
   *
   * @example Standalone relative identifier for transforms
   * ```typescript
   * // For ".|transform" - the dot is standalone and becomes a relative identifier
   * // Creates: { type: 'Identifier', value: '.', relative: true }
   * ```
   *
   * @example Mixed access patterns
   * ```typescript
   * // For "data.items[.value > threshold].name"
   * // First dot: normal property access (data.items)
   * // Second dot: relative identifier (.value)
   * // Third dot: property access on filtered result (.name)
   * ```
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
   * Handles completed filter sub expressions for array filtering or property access.
   *
   * Filter expressions use square bracket notation like [expression]. They can be either
   * relative (filtering arrays where each element becomes context) or static (property access).
   *
   * @param ast - The completed sub expression AST for the filter
   *
   * @example Relative filter (array filtering)
   * ```typescript
   * // For "users[.age > 18]"
   * // Creates FilterExpression with:
   * // - subject: 'users' identifier
   * // - expr: binary expression '.age > 18'
   * // - relative: true (because subParser.isRelative() returns true)
   * ```
   *
   * @example Static filter (property access)
   * ```typescript
   * // For "config['api' + 'Key']"
   * // Creates FilterExpression with:
   * // - subject: 'config' identifier
   * // - expr: binary expression '"api" + "Key"'
   * // - relative: false (no relative identifiers in expression)
   * ```
   *
   * @example Dynamic array indexing
   * ```typescript
   * // For "items[currentIndex + 1]"
   * // Creates FilterExpression for computed array access
   * ```
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
    // Check if the current cursor is already a FunctionCall with pool 'transforms'
    // This happens when we have namespace transforms with arguments like String.repeat(3)
    if (this._cursor && this._cursor.type === 'FunctionCall' && this._cursor.pool === 'transforms') {
      // Don't create a new FunctionCall, just continue with the existing transform
      return
    }

    const functionName = this._buildFullIdentifierPath(this._cursor || null)
    this._placeBeforeCursor({
      type: 'FunctionCall',
      name: functionName,
      args: [],
      pool: 'functions',
    })
  }

  /**
   * Builds the full namespace path for an identifier by traversing the 'from' chain.
   * This supports namespace functions like 'My.sayHi' by building the complete name.
   *
   * @param node - The identifier node to build the path for
   * @returns The full namespace path as a string
   *
   * @example
   * // For identifier chain: My.sayHi
   * // Returns: "My.sayHi"
   *
   * @example
   * // For simple identifier: sayHi
   * // Returns: "sayHi"
   */
  private _buildFullIdentifierPath(node: Token | null): string {
    if (!node || node.type !== 'Identifier') {
      return (node?.value as string) || ''
    }

    const parts: string[] = []
    let current: Token | null = node

    // Walk up the 'from' chain to collect all parts
    while (current && current.type === 'Identifier') {
      parts.unshift(current.value as string)
      current = current.from || null
    }

    return parts.join('.')
  }

  /**
   * Handles identifier tokens by creating Identifier AST nodes.
   *
   * Identifiers represent variable names, property names, or function names. Their placement
   * in the AST depends on context - they can be standalone, part of a property chain, or
   * relative to a filter context.
   *
   * @param token - Identifier token with the name value
   *
   * @example Simple identifier
   * ```typescript
   * // For "username"
   * // Creates: { type: 'Identifier', value: 'username' }
   * ```
   *
   * @example Property access
   * ```typescript
   * // For "user.name" - when processing 'name' after dot
   * // Creates: { type: 'Identifier', value: 'name', from: userIdentifier }
   * ```
   *
   * @example Relative identifier in filter
   * ```typescript
   * // For ".age" in filter context
   * // Creates: { type: 'Identifier', value: 'age', relative: true }
   * ```
   *
   * @example Function name
   * ```typescript
   * // For "max(" - identifier before parentheses
   * // Later converted to FunctionCall node by functionCall handler
   * ```
   */
  private identifier(token: Token): void {
    const node: Token = {
      type: 'Identifier',
      value: token.value,
    }

    // Special handling for namespace transforms
    // If we're creating an identifier that has 'from' pointing to a FunctionCall with pool 'transforms',
    // this indicates a namespace transform like 'String.upper'
    if (
      this._nextIdentEncapsulate &&
      this._cursor &&
      this._cursor.type === 'FunctionCall' &&
      this._cursor.pool === 'transforms'
    ) {
      // Rebuild the transform with the full namespace path
      const namespaceParts: string[] = []
      namespaceParts.push(this._cursor.name as string) // e.g., "String"
      namespaceParts.push(token.value as string) // e.g., "upper"

      const namespacedTransformName = namespaceParts.join('.')

      // Update the existing transform's name instead of creating a new identifier
      this._cursor.name = namespacedTransformName
      this._nextIdentEncapsulate = false
      return
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
   * Handles literal value tokens (strings, numbers, booleans, null).
   *
   * Literals represent constant values in expressions. They are the simplest AST nodes
   * and are always leaf nodes (no children).
   *
   * @param token - Literal token containing the parsed value
   *
   * @example String literal
   * ```typescript
   * // For '"Hello World"'
   * // Creates: { type: 'Literal', value: 'Hello World' }
   * ```
   *
   * @example Number literal
   * ```typescript
   * // For '42.5'
   * // Creates: { type: 'Literal', value: 42.5 }
   * ```
   *
   * @example Boolean literal
   * ```typescript
   * // For 'true'
   * // Creates: { type: 'Literal', value: true }
   * ```
   *
   * @example Null literal
   * ```typescript
   * // For 'null'
   * // Creates: { type: 'Literal', value: null }
   * ```
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
   * @param ast The sub expression tree
   */
  private objVal(ast: Token): void {
    if (this._cursor && this._curObjKey) {
      ;(this._cursor.value as Record<string, Token>)[this._curObjKey] = ast
    }
  }

  /**
   * Handles traditional sub expressions, delineated with the groupStart and
   * groupEnd elements.
   * @param ast The sub expression tree
   */
  private subExpression(ast: Token): void {
    this._placeAtCursor(ast)
  }

  /**
   * Handles a completed alternate sub expression of a ternary operator.
   * @param ast The sub expression tree
   */
  private ternaryEnd(ast: Token): void {
    if (this._cursor) {
      this._cursor.alternate = ast
    }
  }

  /**
   * Handles a completed consequent sub expression of a ternary operator.
   * @param ast The sub expression tree
   */
  private ternaryMid(ast: Token): void {
    if (this._cursor) {
      this._cursor.consequent = ast
    }
  }

  /**
   * Initiates a ternary conditional expression by wrapping the current AST as the test condition.
   *
   * Ternary expressions have the form: test ? consequent : alternate
   * This method is called when the '?' token is encountered.
   *
   * @example Standard ternary
   * ```typescript
   * // For "age >= 18 ? 'adult' : 'minor'"
   * // When '?' is encountered, wraps existing "age >= 18" as test:
   * // {
   * //   type: 'ConditionalExpression',
   * //   test: { type: 'BinaryExpression', ... },  // age >= 18
   * //   consequent: undefined,  // will be set by ternaryMid
   * //   alternate: undefined    // will be set by ternaryEnd
   * // }
   * ```
   *
   * @example Elvis operator (missing consequent)
   * ```typescript
   * // For "nickname ?: 'Anonymous'"
   * // Similar structure but consequent will remain undefined
   * // Evaluator will use test result as consequent
   * ```
   */
  private ternaryStart(): void {
    this._tree = {
      type: 'ConditionalExpression',
      test: this._tree || undefined,
    }
    this._cursor = this._tree
  }

  /**
   * Converts an identifier token into a transform function call.
   *
   * Transform functions are applied using the pipe operator (|). This method converts
   * the identifier following a pipe into a FunctionCall node in the transforms pool.
   * Supports namespace transforms like 'String.upper' or 'Utils.format'.
   *
   * @param token - Identifier token with the transform function name
   *
   * @example Simple transform
   * ```typescript
   * // For "name|upper"
   * // When processing 'upper' after pipe:
   * // Creates: {
   * //   type: 'FunctionCall',
   * //   name: 'upper',
   * //   args: [nameIdentifier],  // current cursor becomes first argument
   * //   pool: 'transforms'
   * // }
   * ```
   *
   * @example Namespace transform
   * ```typescript
   * // For "name|String.upper"
   * // When processing 'String.upper' after pipe:
   * // Creates: {
   * //   type: 'FunctionCall',
   * //   name: 'String.upper',
   * //   args: [nameIdentifier],
   * //   pool: 'transforms'
   * // }
   * ```
   *
   * @example Transform with arguments
   * ```typescript
   * // For "value|Utils.multiply(2, 3)"
   * // Creates FunctionCall node, args will be populated by argVal handler:
   * // {
   * //   type: 'FunctionCall',
   * //   name: 'Utils.multiply',
   * //   args: [valueIdentifier, 2, 3],
   * //   pool: 'transforms'
   * // }
   * ```
   *
   * @example Chained transforms
   * ```typescript
   * // For "name|String.lower|String.trim"
   * // Each transform becomes a FunctionCall wrapping the previous result
   * ```
   */
  private transform(token: Token): void {
    // For transforms, the token contains the transform name
    // We need to build the full namespace path if this is part of a namespace transform
    const transformName = token.value as string

    this._placeBeforeCursor({
      type: 'FunctionCall',
      name: transformName,
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
      case 'pipe':
        return () => this.pipe()
      default:
        return undefined
    }
  }

  /**
   * Handles pipe (|) tokens for transform operations.
   *
   * Special handling for cases where a pipe follows a dot in traverse state,
   * indicating a standalone relative identifier for transforms like .|transform.
   */
  private pipe(): void {
    // If we're in traverse state and encounter a pipe, it means we have a standalone dot
    // that should become a relative identifier for the transform
    if (this._state === 'traverse') {
      // Create a standalone relative identifier
      this._placeAtCursor({
        type: 'Identifier',
        value: '.',
        relative: true,
      })
      this._relative = true
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
  //
  // The following methods handle specific token types and AST node construction.
  // They are called by the state machine based on current state and token type.
  //
  // Handler methods fall into several categories:
  // 1. Token handlers: Process individual tokens (identifier, literal, binaryOp, etc.)
  // 2. Structure handlers: Handle compound structures (arrays, objects, functions)
  // 3. Sub expression handlers: Process completed sub expressions (filter, argVal, etc.)
  // 4. State transition handlers: Manage parser state changes (dot, ternaryStart, etc.)
  //
  // The parser uses a cursor-based approach where _cursor points to the current
  // position in the AST where new nodes should be added or where modifications
  // should be made.
}
