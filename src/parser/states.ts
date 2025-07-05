/**
 * Parser State Machine Configuration
 *
 * This module defines the finite state machine (FSM) that powers the Jexl expression parser.
 * The parser uses this state machine to understand the structure of Jexl expressions and build
 * an Abstract Syntax Tree (AST) that can be evaluated later.
 *
 * ## How the State Machine Works
 *
 * The parser starts in the `expectOperand` state and transitions between states based on the
 * tokens it encounters. Each state defines what tokens are legal and how to handle them.
 *
 * ### Example Expression Parsing Flow:
 * ```
 * Expression: "user.name | upper"
 *
 * 1. expectOperand + identifier("user") → identifier state
 * 2. identifier + dot(".") → traverse state
 * 3. traverse + identifier("name") → identifier state
 * 4. identifier + pipe("|") → expectTransform state
 * 5. expectTransform + identifier("upper") → postTransform state
 * 6. End of input + completable state → parsing complete
 * ```
 *
 * ## State Types
 *
 * States can handle tokens in two ways:
 *
 * ### 1. Token Type Mapping (`tokenTypes`)
 * Standard states that handle individual tokens directly:
 * ```typescript
 * {
 *   tokenTypes: {
 *     literal: { toState: 'expectBinOp' },        // Transition to new state
 *     identifier: { toState: 'identifier' },      // Transition to new state
 *     unaryOp: { handler: 'unaryOp' }            // Call handler, stay in state
 *   }
 * }
 * ```
 *
 * ### 2. Sub expression Handling (`subHandler`)
 * States that consume entire sub expressions:
 * ```typescript
 * {
 *   subHandler: 'filter',           // Handler to call with parsed sub expression
 *   endStates: {
 *     closeBracket: 'identifier'    // When to end and where to transition
 *   }
 * }
 * ```
 *
 * ## Token Type Configuration Options
 *
 * - `toState`: The next state to transition to after handling this token
 * - `handler`: Custom handler function to call (if omitted, uses default based on token type)
 *
 * ## State Configuration Properties
 *
 * - `tokenTypes`: Map of legal token types to their handling configuration
 * - `subHandler`: Function to call when a sub expression is completely parsed
 * - `endStates`: Tokens that end a sub expression and their target states
 * - `completable`: Whether parsing can successfully end in this state
 *
 * ## Error Handling
 *
 * If a token is encountered that isn't defined in the current state's `tokenTypes`,
 * the parser will throw an error. This ensures that only valid Jexl syntax is accepted.
 */

/**
 * Configuration for how a specific token type should be handled in a state.
 *
 * @example
 * ```typescript
 * // Transition to new state after handling token
 * { toState: 'expectBinOp' }
 *
 * // Call custom handler and transition
 * { toState: 'identifier', handler: 'transform' }
 *
 * // Call handler but stay in current state
 * { handler: 'unaryOp' }
 * ```
 */
interface TokenTypeConfig {
  /** The state to transition to after handling this token */
  toState?: string
  /** Custom handler function to call for this token type */
  handler?: string
}

/**
 * Configuration for a parser state, defining how it handles tokens and sub expressions.
 *
 * @example
 * ```typescript
 * // Simple token-based state
 * {
 *   tokenTypes: {
 *     literal: { toState: 'expectBinOp' },
 *     identifier: { toState: 'identifier' }
 *   },
 *   completable: true
 * }
 *
 * // Sub expression-consuming state
 * {
 *   subHandler: 'filter',
 *   endStates: {
 *     closeBracket: 'identifier'
 *   }
 * }
 * ```
 */
interface StateConfig {
  /** Map of legal token types and how to handle them */
  tokenTypes?: Record<string, TokenTypeConfig>
  /** Handler function for processing complete sub expressions */
  subHandler?: string
  /** Tokens that end sub expression parsing and their target states */
  endStates?: Record<string, string>
  /** Whether parsing can successfully complete in this state */
  completable?: boolean
}

export const states: Record<string, StateConfig> = {
  expectOperand: {
    tokenTypes: {
      literal: { toState: 'expectBinOp' },
      identifier: { toState: 'identifier' },
      unaryOp: {},
      openParen: { toState: 'subExpression' },
      openCurl: { toState: 'expectObjKey', handler: 'objStart' },
      dot: { toState: 'traverse' },
      openBracket: { toState: 'arrayVal', handler: 'arrayStart' },
    },
  },
  expectBinOp: {
    tokenTypes: {
      binaryOp: { toState: 'expectOperand' },
      pipe: { toState: 'expectTransform' },
      dot: { toState: 'traverse' },
      question: { toState: 'ternaryMid', handler: 'ternaryStart' },
    },
    completable: true,
  },
  expectTransform: {
    tokenTypes: {
      identifier: { toState: 'postTransform', handler: 'transform' },
    },
  },
  expectObjKey: {
    tokenTypes: {
      literal: { toState: 'expectKeyValSep', handler: 'objKey' },
      identifier: { toState: 'expectKeyValSep', handler: 'objKey' },
      closeCurl: { toState: 'expectBinOp' },
    },
  },
  expectKeyValSep: {
    tokenTypes: {
      colon: { toState: 'objVal' },
    },
  },
  postTransform: {
    tokenTypes: {
      openParen: { toState: 'argVal' },
      binaryOp: { toState: 'expectOperand' },
      dot: { toState: 'traverse' },
      openBracket: { toState: 'filter' },
      pipe: { toState: 'expectTransform' },
    },
    completable: true,
  },
  postArgs: {
    tokenTypes: {
      binaryOp: { toState: 'expectOperand' },
      dot: { toState: 'traverse' },
      openBracket: { toState: 'filter' },
      question: { toState: 'ternaryMid', handler: 'ternaryStart' },
      pipe: { toState: 'expectTransform' },
    },
    completable: true,
  },
  identifier: {
    tokenTypes: {
      binaryOp: { toState: 'expectOperand' },
      dot: { toState: 'traverse' },
      openBracket: { toState: 'filter' },
      openParen: { toState: 'argVal', handler: 'functionCall' },
      pipe: { toState: 'expectTransform' },
      question: { toState: 'ternaryMid', handler: 'ternaryStart' },
    },
    completable: true,
  },
  traverse: {
    tokenTypes: {
      identifier: { toState: 'identifier' },
      pipe: { toState: 'expectTransform' },
    },
  },
  filter: {
    subHandler: 'filter',
    endStates: {
      closeBracket: 'identifier',
    },
  },
  subExpression: {
    subHandler: 'subExpression',
    endStates: {
      closeParen: 'expectBinOp',
    },
  },
  argVal: {
    subHandler: 'argVal',
    endStates: {
      comma: 'argVal',
      closeParen: 'postArgs',
    },
  },
  objVal: {
    subHandler: 'objVal',
    endStates: {
      comma: 'expectObjKey',
      closeCurl: 'expectBinOp',
    },
  },
  arrayVal: {
    subHandler: 'arrayVal',
    endStates: {
      comma: 'arrayVal',
      closeBracket: 'expectBinOp',
    },
  },
  ternaryMid: {
    subHandler: 'ternaryMid',
    endStates: {
      colon: 'ternaryEnd',
    },
  },
  ternaryEnd: {
    subHandler: 'ternaryEnd',
    completable: true,
  },
}
