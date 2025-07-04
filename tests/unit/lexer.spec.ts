import { test } from '@japa/runner'
import { getGrammar } from '../../src/grammar.js'
import Lexer from '../../src/Lexer.js'

const grammar = getGrammar()

test.group('Lexer Elements', (group) => {
  let inst: Lexer

  group.each.setup(() => {
    inst = new Lexer(grammar)
  })

  test('counts a string as one element', ({ assert }) => {
    const str = '"foo"'
    const elems = inst.getElements(str)
    assert.lengthOf(elems, 1)
    assert.deepEqual(elems[0], str)
  })

  test('supports single-quote strings', ({ assert }) => {
    const str = "'foo'"
    const elems = inst.getElements(str)
    assert.lengthOf(elems, 1)
    assert.deepEqual(elems[0], str)
  })

  test('supports escaping double-quotes', ({ assert }) => {
    const str = '"f\\"oo"'
    const elems = inst.getElements(str)
    assert.lengthOf(elems, 1)
    assert.deepEqual(elems[0], str)
  })

  test('supports escaped double-quotes at the end of strings', ({ assert }) => {
    const str = '"foo\\""'
    const elems = inst.getElements(str)
    assert.lengthOf(elems, 1)
    assert.deepEqual(elems[0], str)
  })

  test('supports escaping single-quotes', ({ assert }) => {
    const str = "'f\\'oo'"
    const elems = inst.getElements(str)
    assert.lengthOf(elems, 1)
    assert.deepEqual(elems[0], str)
  })

  test('supports escaped single-quotes at the end of strings', ({ assert }) => {
    const str = "'foo\\''"
    const elems = inst.getElements(str)
    assert.lengthOf(elems, 1)
    assert.deepEqual(elems[0], str)
  })

  test('counts an identifier as one element', ({ assert }) => {
    const str = 'alpha12345'
    const elems = inst.getElements(str)
    assert.deepEqual(elems, [str])
  })

  test('does not split grammar elements out of transforms', ({ assert }) => {
    const str = 'inString'
    const elems = inst.getElements(str)
    assert.deepEqual(elems, [str])
  })

  test('allows an identifier to start with and contain $', ({ assert }) => {
    const str = '$my$Var'
    const elems = inst.getElements(str)
    assert.deepEqual(elems, [str])
  })

  test('allows an identifier to start with and contain accented letters from Latin 1 Supplement unicode block', ({
    assert,
  }) => {
    const str = 'ÄmyäVarÖö'
    const elems = inst.getElements(str)
    assert.deepEqual(elems, [str])
  })

  test('allows an identifier to start with and contain accented letters from Russian unicode block', ({ assert }) => {
    const str = 'Проверка'
    const elems = inst.getElements(str)
    assert.deepEqual(elems, [str])
  })
})

test.group('Lexer Tokens', (group) => {
  let inst: Lexer

  group.each.setup(() => {
    inst = new Lexer(grammar)
  })

  test('unquotes string elements', ({ assert }) => {
    const tokens = inst.getTokens(['"foo \\"bar\\\\"'])
    assert.deepEqual(tokens, [
      {
        type: 'literal',
        value: 'foo "bar\\',
        raw: '"foo \\"bar\\\\"',
      },
    ])
  })

  test('recognizes booleans', ({ assert }) => {
    const tokens = inst.getTokens(['true', 'false'])
    assert.deepEqual(tokens, [
      {
        type: 'literal',
        value: true,
        raw: 'true',
      },
      {
        type: 'literal',
        value: false,
        raw: 'false',
      },
    ])
  })

  test('recognizes null', ({ assert }) => {
    const tokens = inst.getTokens(['null'])
    assert.deepEqual(tokens, [
      {
        type: 'literal',
        value: null,
        raw: 'null',
      },
    ])
  })

  test('recognizes undefined', ({ assert }) => {
    const tokens = inst.getTokens(['undefined'])
    assert.deepEqual(tokens, [
      {
        type: 'literal',
        value: undefined,
        raw: 'undefined',
      },
    ])
  })

  test('recognizes numerics', ({ assert }) => {
    const tokens = inst.getTokens(['-7.6', '20'])
    assert.deepEqual(tokens, [
      {
        type: 'literal',
        value: -7.6,
        raw: '-7.6',
      },
      {
        type: 'literal',
        value: 20,
        raw: '20',
      },
    ])
  })

  test('tokenizes a decimal-only number', ({ assert }) => {
    const tokens = inst.tokenize('.5')
    assert.deepEqual(tokens, [
      {
        type: 'literal',
        value: 0.5,
        raw: '.5',
      },
    ])
  })

  test('recognizes binary operators in context', ({ assert }) => {
    // To test a binary operator, it must be in a binary context (e.g., 1 + 2).
    // The lexer identifies '+' as a binaryOp because it follows an operand.
    const tokens = inst.tokenize('1+2')
    assert.deepEqual(tokens, [
      { type: 'literal', value: 1, raw: '1' },
      { type: 'binaryOp', value: '+', raw: '+' },
      { type: 'literal', value: 2, raw: '2' },
    ])
  })

  test('recognizes unary operators', ({ assert }) => {
    const tokens = inst.getTokens(['!'])
    assert.deepEqual(tokens, [
      {
        type: 'unaryOp',
        value: '!',
        raw: '!',
      },
    ])
  })

  test('recognizes control characters', ({ assert }) => {
    const tokens = inst.getTokens(['('])
    assert.deepEqual(tokens, [
      {
        type: 'openParen',
        value: '(',
        raw: '(',
      },
    ])
  })

  test('recognizes identifiers', ({ assert }) => {
    const tokens = inst.getTokens(['_foo9_bar'])
    assert.deepEqual(tokens, [
      {
        type: 'identifier',
        value: '_foo9_bar',
        raw: '_foo9_bar',
      },
    ])
  })

  test('throws on invalid token', ({ assert }) => {
    const fn = () => inst.getTokens(['9foo'])
    assert.throws(fn)
  })
})

test.group('Lexer Full Expression', (group) => {
  let inst: Lexer

  group.each.setup(() => {
    inst = new Lexer(grammar)
  })

  test('tokenizes a full expression', ({ assert }) => {
    const tokens = inst.tokenize('6+x -  -17.55*y<= !foo.bar["baz\\"foz"]')
    assert.deepEqual(tokens, [
      { type: 'literal', value: 6, raw: '6' },
      { type: 'binaryOp', value: '+', raw: '+' },
      { type: 'identifier', value: 'x', raw: 'x ' },
      { type: 'binaryOp', value: '-', raw: '-  ' },
      { type: 'literal', value: -17.55, raw: '-17.55' },
      { type: 'binaryOp', value: '*', raw: '*' },
      { type: 'identifier', value: 'y', raw: 'y' },
      { type: 'binaryOp', value: '<=', raw: '<= ' },
      { type: 'unaryOp', value: '!', raw: '!' },
      { type: 'identifier', value: 'foo', raw: 'foo' },
      { type: 'dot', value: '.', raw: '.' },
      { type: 'identifier', value: 'bar', raw: 'bar' },
      { type: 'openBracket', value: '[', raw: '[' },
      { type: 'literal', value: 'baz"foz', raw: '"baz\\"foz"' },
      { type: 'closeBracket', value: ']', raw: ']' },
    ])
  })

  test('considers minus to be negative appropriately', ({ assert }) => {
    const result = inst.tokenize('-1?-2:-3')
    assert.deepEqual(result, [
      { type: 'literal', value: -1, raw: '-1' },
      { type: 'question', value: '?', raw: '?' },
      { type: 'literal', value: -2, raw: '-2' },
      { type: 'colon', value: ':', raw: ':' },
      { type: 'literal', value: -3, raw: '-3' },
    ])
  })

  test('considers minus to be negative in function args', ({ assert }) => {
    const result = inst.tokenize('add(5, -3)')
    assert.deepEqual(result, [
      { type: 'identifier', value: 'add', raw: 'add' },
      { type: 'openParen', value: '(', raw: '(' },
      { type: 'literal', value: 5, raw: '5' },
      { type: 'comma', value: ',', raw: ', ' },
      { type: 'literal', value: -3, raw: '-3' },
      { type: 'closeParen', value: ')', raw: ')' },
    ])
  })
})
