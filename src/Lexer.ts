/* eslint-disable max-len */
import type { Grammar } from './grammar.js'

/**
 * Regular expression patterns and constants used by the lexer for tokenization.
 * These patterns identify different types of tokens in Jexl expressions.
 */

/** Matches numeric literals (integers and floats, including negative numbers) */
const numericRegex = /^-?(?:(?:[0-9]*\.[0-9]+)|[0-9]+)$/

/** Matches valid identifier names (variables, function names, etc.) */
const identRegex =
  /^[a-zA-Zа-яА-Я_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF$][a-zA-Zа-яА-Я0-9_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF$]*$/

/** Matches escaped backslashes in string literals */
const escEscRegex = /\\\\/

/** Matches whitespace-only strings */
const whitespaceRegex = /^\s*$/

/**
 * Regex elements that are processed before operator elements.
 * Includes string literals, whitespace, and boolean literals.
 */
const preOpRegexElements = [
  // Strings
  "'(?:(?:\\\\')|[^'])*'",
  '"(?:(?:\\\\")|[^"])*"',
  // Whitespace
  '\\s+',
  // Booleans
  '\\btrue\\b',
  '\\bfalse\\b',
]
/**
 * Regex elements that are processed after operator elements.
 * Includes identifiers and numeric literals (without negative symbol).
 */
const postOpRegexElements = [
  // Identifiers
  '[a-zA-Zа-яА-Я_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\\$][a-zA-Z0-9а-яА-Я_\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\\$]*',
  // Numerics (without negative symbol)
  '(?:(?:[0-9]*\\.[0-9]+)|[0-9]+)',
]
/**
 * Token types after which a minus sign should be treated as a negation operator
 * rather than a binary subtraction operator.
 */
const minusNegatesAfter = ['binaryOp', 'unaryOp', 'openParen', 'openBracket', 'question', 'colon']

/**
 * Represents a lexical token in a Jexl expression.
 * Each token contains information about its type, processed value, and original text.
 */
interface Token {
  /** The type of token (e.g., 'literal', 'identifier', 'binaryOp') */
  type: string
  /** The processed value of the token (e.g., parsed number, unquoted string) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  /** The original raw text from the expression string */
  raw: string
}

/**
 * Lexer is responsible for the lexical analysis phase of Jexl expression parsing.
 * It takes a raw expression string and converts it into a sequence of tokens that
 * can be consumed by the Parser.
 *
 * The Lexer's primary responsibilities are:
 * - Identifying and categorizing different parts of the expression (literals, operators, etc.)
 * - Converting raw text into meaningful tokens with appropriate types and values
 * - Handling special cases like negative numbers and string escaping
 * - Minimal syntax validation (only what's needed for tokenization)
 *
 * @example
 * ```typescript
 * const lexer = new Lexer(grammar)
 * const tokens = lexer.tokenize('user.name | upper')
 * // Results in tokens like:
 * // [
 * //   { type: 'identifier', value: 'user', raw: 'user' },
 * //   { type: 'dot', value: '.', raw: '.' },
 * //   { type: 'identifier', value: 'name', raw: 'name' },
 * //   { type: 'pipe', value: '|', raw: ' | ' },
 * //   { type: 'identifier', value: 'upper', raw: 'upper' }
 * // ]
 * ```
 *
 * ## Tokenization Process
 *
 * 1. **Split**: Expression is split into elements using a regex
 * 2. **Classify**: Each element is classified by type (literal, operator, etc.)
 * 3. **Process**: Values are processed (e.g., parse numbers, unquote strings)
 * 4. **Optimize**: Adjacent whitespace is consolidated with neighboring tokens
 *
 * ## Token Types
 *
 * - **literal**: String, number, or boolean values
 * - **identifier**: Variable names, function names, property names
 * - **binaryOp**: Binary operators like `+`, `-`, `==`, `&&`
 * - **unaryOp**: Unary operators like `!`, `-` (negation)
 * - **dot**: Property access operator `.`
 * - **pipe**: Transform operator `|`
 * - **openParen/closeParen**: Parentheses for grouping `()`
 * - **openBracket/closeBracket**: Brackets for array access/filtering `[]`
 * - **openCurl/closeCurl**: Braces for object literals `{}`
 * - **question/colon**: Ternary operator parts `?` and `:`
 * - **comma**: Argument separator `,`
 *
 * ## Error Handling
 *
 * The Lexer performs minimal error checking. It will throw errors only when:
 * - It encounters characters that cannot be classified into any token type
 * - String literals are malformed (unclosed quotes)
 *
 * Most syntax errors (like mismatched operators) are left for the Parser to detect.
 */
export default class Lexer {
  /** The grammar configuration containing operators and other language elements */
  private _grammar: Grammar
  /** Cached regex for splitting expressions, built on first use */
  private _splitRegex?: RegExp

  /**
   * Creates a new Lexer instance with the given grammar configuration.
   *
   * @param grammar The grammar containing operators, functions, and other language elements
   */
  constructor(grammar: Grammar) {
    this._grammar = grammar
  }

  /**
   * Splits a Jexl expression string into an array of expression elements.
   * @param str A Jexl expression string
   * @returns An array of substrings defining the functional
   *      elements of the expression.
   */
  getElements(str: string): string[] {
    const regex = this._getSplitRegex()
    return str.split(regex).filter((elem) => {
      // Remove empty strings
      return elem
    })
  }

  /**
   * Converts an array of expression elements into an array of tokens.  Note that
   * the resulting array may not equal the element array in length, as any
   * elements that consist only of whitespace get appended to the previous
   * token's "raw" property.  For the structure of a token object, please see
   * {@link Lexer#tokenize}.
   * @param elements An array of Jexl expression elements to be
   *      converted to tokens
   * @returns An array of token objects.
   */
  getTokens(elements: string[]): Token[] {
    const tokens: Token[] = []
    let negate = false
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      if (!element) continue // Skip empty elements

      if (this._isWhitespace(element)) {
        if (tokens.length > 0) {
          tokens[tokens.length - 1].raw += element
        }
      } else if (element === '-' && this._isNegative(tokens)) {
        negate = true
      } else {
        if (negate) {
          elements[i] = '-' + element
          negate = false
        }
        tokens.push(this._createToken(elements[i]))
      }
    }
    // Catch a - at the end of the string. Let the parser handle that issue.
    if (negate) {
      tokens.push(this._createToken('-'))
    }
    return tokens
  }

  /**
   * Converts a Jexl expression string into an array of tokens.
   * This is the main entry point for lexical analysis.
   *
   * Each token is an object with the following structure:
   * ```typescript
   * {
   *   type: string,     // Token type (e.g., 'literal', 'identifier', 'binaryOp')
   *   value: any,       // Processed value (parsed number, unquoted string, etc.)
   *   raw: string       // Original text including any whitespace
   * }
   * ```
   *
   * ## Token Types
   *
   * - **literal**: String, number, or boolean values
   * - **identifier**: Variable names, function names, property names
   * - **binaryOp**: Binary operators like `+`, `-`, `==`, `&&`
   * - **unaryOp**: Unary operators like `!`, `-` (negation)
   * - **Grammar elements**: Control characters defined in grammar (dot, pipe, etc.)
   *
   * ## Value Processing
   *
   * - **Strings**: Quotes are removed and escape sequences processed
   * - **Numbers**: Converted to numeric values using `parseFloat()`
   * - **Booleans**: `"true"` and `"false"` become boolean values
   * - **Others**: Remain as original strings
   *
   * @param str The Jexl expression string to be tokenized
   * @returns An array of token objects representing the expression
   * @throws {Error} if the string contains invalid tokens
   *
   * @example
   * ```typescript
   * lexer.tokenize('user.age >= 18')
   * // Returns:
   * // [
   * //   { type: 'identifier', value: 'user', raw: 'user' },
   * //   { type: 'dot', value: '.', raw: '.' },
   * //   { type: 'identifier', value: 'age', raw: 'age' },
   * //   { type: 'binaryOp', value: '>=', raw: ' >= ' },
   * //   { type: 'literal', value: 18, raw: '18' }
   * // ]
   * ```
   */
  tokenize(str: string): Token[] {
    const elements = this.getElements(str)
    return this.getTokens(elements)
  }

  /**
   * Creates a new token object from an element of a Jexl string. See
   * {@link Lexer#tokenize} for a description of the token object.
   * @param element The element from which a token should be made
   * @returns A token object describing the provided element.
   * @throws {Error} if the provided string is not a valid expression element.
   * @private
   */
  _createToken(element: string): Token {
    const token: Token = {
      type: 'literal',
      value: element,
      raw: element,
    }
    if (element[0] === '"' || element[0] === "'") {
      token.value = this._unquote(element)
    } else if (element.match(numericRegex)) {
      token.value = parseFloat(element)
    } else if (element === 'true' || element === 'false') {
      token.value = element === 'true'
    } else if (this._grammar.elements[element]) {
      token.type = this._grammar.elements[element].type
    } else if (element.match(identRegex)) {
      token.type = 'identifier'
    } else {
      throw new Error(`Invalid expression token: ${element}`)
    }
    return token
  }

  /**
   * Escapes a string so that it can be treated as a string literal within a
   * regular expression.
   * @param str The string to be escaped
   * @returns the RegExp-escaped string.
   * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions
   * @private
   */
  _escapeRegExp(str: string): string {
    str = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (str.match(identRegex)) {
      str = '\\b' + str + '\\b'
    }
    return str
  }

  /**
   * Gets a RegEx object appropriate for splitting a Jexl string into its core
   * elements.
   * @returns {RegExp} An element-splitting RegExp object
   * @private
   */
  _getSplitRegex(): RegExp {
    if (!this._splitRegex) {
      // Sort by most characters to least, then regex escape each
      const elemArray = Object.keys(this._grammar.elements)
        .sort((a, b) => {
          return b.length - a.length
        })
        .map((elem) => {
          return this._escapeRegExp(elem)
        }, this)
      this._splitRegex = new RegExp(
        '(' + [preOpRegexElements.join('|'), elemArray.join('|'), postOpRegexElements.join('|')].join('|') + ')'
      )
    }
    return this._splitRegex
  }

  /**
   * Determines whether the addition of a '-' token should be interpreted as a
   * negative symbol for an upcoming number, given an array of tokens already
   * processed.
   * @param {Array<Object>} tokens An array of tokens already processed
   * @returns {boolean} true if adding a '-' should be considered a negative
   *      symbol; false otherwise
   * @private
   */
  _isNegative(tokens: Token[]): boolean {
    if (!tokens.length) return true
    const lastToken = tokens[tokens.length - 1]
    if (!lastToken) return true
    return minusNegatesAfter.some((type) => type === lastToken.type)
  }

  /**
   * A utility function to determine if a string consists of only space
   * characters.
   * @param {string} str A string to be tested
   * @returns {boolean} true if the string is empty or consists of only spaces;
   *      false otherwise.
   * @private
   */
  _isWhitespace(str: string): boolean {
    return !!str.match(whitespaceRegex)
  }

  /**
   * Removes the beginning and trailing quotes from a string, unescapes any
   * escaped quotes on its interior, and unescapes any escaped escape
   * characters. Note that this function is not defensive; it assumes that the
   * provided string is not empty, and that its first and last characters are
   * actually quotes.
   * @param {string} str A string whose first and last characters are quotes
   * @returns {string} a string with the surrounding quotes stripped and escapes
   *      properly processed.
   * @private
   */
  _unquote(str: string): string {
    const quote = str[0]
    if (!quote) {
      throw new Error('Cannot unquote empty string')
    }
    const escQuoteRegex = new RegExp('\\\\' + quote, 'g')
    return str
      .substr(1, str.length - 2)
      .replace(escQuoteRegex, quote)
      .replace(escEscRegex, '\\')
  }
}
