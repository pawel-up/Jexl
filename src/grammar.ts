/* eslint-disable @typescript-eslint/no-explicit-any */

// Type for values that can be compared
export type ComparableValue = string | number | Date | boolean

// Type for evaluation context objects
export interface EvaluationContext {
  eval(): Promise<unknown>
}

// Transform function that accepts any function signature
export type TransformFunction = (...args: any[]) => any

export type BinaryOpFunction = (left: any, right: any) => unknown

export type UnaryOpFunction = (right: any) => unknown

// Function that accepts any function signature
export type FunctionFunction = (...args: any[]) => any

// AST Node Types
export interface BaseASTNode {
  type: string
}

export interface ArrayLiteralNode extends BaseASTNode {
  type: 'ArrayLiteral'
  value: ASTNode[]
}

export interface BinaryExpressionNode extends BaseASTNode {
  type: 'BinaryExpression'
  operator: string
  left: ASTNode
  right: ASTNode
}

export interface ConditionalExpressionNode extends BaseASTNode {
  type: 'ConditionalExpression'
  test: ASTNode
  consequent: ASTNode
  alternate: ASTNode
}

export interface FilterExpressionNode extends BaseASTNode {
  type: 'FilterExpression'
  subject: ASTNode
  expr: ASTNode
  relative: boolean
}

export interface IdentifierNode extends BaseASTNode {
  type: 'Identifier'
  value: string
  from?: ASTNode
  relative?: boolean
}

export interface LiteralNode extends BaseASTNode {
  type: 'Literal'
  value: unknown
}

export interface ObjectLiteralNode extends BaseASTNode {
  type: 'ObjectLiteral'
  value: Record<string, ASTNode>
}

export interface FunctionCallNode extends BaseASTNode {
  type: 'FunctionCall'
  name: string
  args?: ASTNode[]
  pool: 'functions' | 'transforms'
}

export interface UnaryExpressionNode extends BaseASTNode {
  type: 'UnaryExpression'
  operator: string
  right: ASTNode
}

export type ASTNode =
  | ArrayLiteralNode
  | BinaryExpressionNode
  | ConditionalExpressionNode
  | FilterExpressionNode
  | IdentifierNode
  | LiteralNode
  | ObjectLiteralNode
  | FunctionCallNode
  | UnaryExpressionNode

export interface GrammarElement {
  type:
    | 'dot'
    | 'openBracket'
    | 'closeBracket'
    | 'pipe'
    | 'openCurl'
    | 'closeCurl'
    | 'colon'
    | 'comma'
    | 'openParen'
    | 'closeParen'
    | 'question'
    | 'binaryOp'
    | 'unaryOp'
  raw?: string
}

export interface BinaryElement extends GrammarElement {
  type: 'binaryOp'
  precedence?: number
  eval?: BinaryOpFunction
  evalOnDemand?: BinaryOpFunction
}

export interface UnaryElement extends GrammarElement {
  type: 'unaryOp'
  weight?: number
  precedence?: number
  eval?: UnaryOpFunction
}

export interface Grammar {
  elements: Record<string, GrammarElement | BinaryElement | UnaryElement>
  functions: Record<string, FunctionFunction>
  transforms: Record<string, TransformFunction>
}

export const getGrammar = (): Grammar => ({
  /**
   * A map of all expression elements to their properties. Note that changes
   * here may require changes in the Lexer or Parser.
   */
  elements: {
    '.': { type: 'dot' } as GrammarElement,
    '[': { type: 'openBracket' } as GrammarElement,
    ']': { type: 'closeBracket' } as GrammarElement,
    '|': { type: 'pipe' } as GrammarElement,
    '{': { type: 'openCurl' } as GrammarElement,
    '}': { type: 'closeCurl' } as GrammarElement,
    ':': { type: 'colon' } as GrammarElement,
    ',': { type: 'comma' } as GrammarElement,
    '(': { type: 'openParen' } as GrammarElement,
    ')': { type: 'closeParen' } as GrammarElement,
    '?': { type: 'question' } as GrammarElement,
    '+': {
      type: 'binaryOp',
      precedence: 30,
      eval: function (left: any, right: any) {
        if (arguments.length === 1) {
          return +left
        }
        return left + right
      },
    } as BinaryElement,
    '-': {
      type: 'binaryOp',
      precedence: 30,
      eval: function (left: any, right: any) {
        if (arguments.length === 1) {
          return -left
        }
        return left - right
      },
    } as BinaryElement,
    '*': {
      type: 'binaryOp',
      precedence: 40,
      eval: (left, right) => (left as number) * (right as number),
    } as BinaryElement,
    '/': {
      type: 'binaryOp',
      precedence: 40,
      eval: (left, right) => (left as number) / (right as number),
    } as BinaryElement,
    '//': {
      type: 'binaryOp',
      precedence: 40,
      eval: (left, right) => Math.floor((left as number) / (right as number)),
    } as BinaryElement,
    '%': {
      type: 'binaryOp',
      precedence: 50,
      eval: (left, right) => (left as number) % (right as number),
    } as BinaryElement,
    '^': {
      type: 'binaryOp',
      precedence: 50,
      eval: (left, right) => Math.pow(left as number, right as number),
    } as BinaryElement,
    '==': {
      type: 'binaryOp',
      precedence: 20,
      eval: (left, right) => left == right,
    } as BinaryElement,
    '!=': {
      type: 'binaryOp',
      precedence: 20,
      eval: (left, right) => left != right,
    } as BinaryElement,
    '>': {
      type: 'binaryOp',
      precedence: 20,
      eval: (left, right) => (left as ComparableValue) > (right as ComparableValue),
    } as BinaryElement,
    '>=': {
      type: 'binaryOp',
      precedence: 20,
      eval: (left, right) => (left as ComparableValue) >= (right as ComparableValue),
    } as BinaryElement,
    '<': {
      type: 'binaryOp',
      precedence: 20,
      eval: (left, right) => (left as ComparableValue) < (right as ComparableValue),
    } as BinaryElement,
    '<=': {
      type: 'binaryOp',
      precedence: 20,
      eval: (left, right) => (left as ComparableValue) <= (right as ComparableValue),
    } as BinaryElement,
    '&&': {
      type: 'binaryOp',
      precedence: 10,
      evalOnDemand: (left, right) => {
        return (left as EvaluationContext).eval().then((leftVal: unknown) => {
          if (!leftVal) return leftVal
          return (right as EvaluationContext).eval()
        })
      },
    } as BinaryElement,
    '||': {
      type: 'binaryOp',
      precedence: 5,
      evalOnDemand: (left, right) => {
        return (left as EvaluationContext).eval().then((leftVal: unknown) => {
          if (leftVal) return leftVal
          return (right as EvaluationContext).eval()
        })
      },
    } as BinaryElement,
    'in': {
      type: 'binaryOp',
      precedence: 20,
      eval: (left, right) => {
        if (typeof right === 'string') {
          return right.indexOf(left as string) !== -1
        }
        if (Array.isArray(right)) {
          return right.some((elem) => elem === left)
        }
        return false
      },
    } as BinaryElement,
    '!': {
      type: 'unaryOp',
      precedence: Infinity,
      eval: (right) => !right,
    } as UnaryElement,
  },

  /**
   * A map of function names to javascript functions. A Jexl function
   * takes zero ore more arguments:
   *
   *     - {*} ...args: A variable number of arguments passed to this function.
   *       All of these are pre-evaluated to their actual values before calling
   *       the function.
   *
   * The Jexl function should return either the transformed value, or
   * a Promises/A+ Promise object that resolves with the value and rejects
   * or throws only when an unrecoverable error occurs. Functions should
   * generally return undefined when they don't make sense to be used on the
   * given value type, rather than throw/reject. An error is only
   * appropriate when the function would normally return a value, but
   * cannot due to some other failure.
   */
  functions: {},

  /**
   * A map of transform names to transform functions. A transform function
   * takes one ore more arguments:
   *
   *     - {*} val: A value to be transformed
   *     - {*} ...args: A variable number of arguments passed to this transform.
   *       All of these are pre-evaluated to their actual values before calling
   *       the function.
   *
   * The transform function should return either the transformed value, or
   * a Promises/A+ Promise object that resolves with the value and rejects
   * or throws only when an unrecoverable error occurs. Transforms should
   * generally return undefined when they don't make sense to be used on the
   * given value type, rather than throw/reject. An error is only
   * appropriate when the transform would normally return a value, but
   * cannot due to some other failure.
   */
  transforms: {},
})
