import { test } from '@japa/runner'
import Lexer from '../../src/Lexer.js'
import Parser from '../../src/parser/Parser.js'
import { getGrammar } from '../../src/grammar.js'

const grammar = getGrammar()
const lexer = new Lexer(grammar)

test.group('Parser Basic Operations', (group) => {
  let inst: Parser

  group.each.setup(() => {
    inst = new Parser(grammar)
  })

  test('constructs an AST for 1+2', ({ assert }) => {
    inst.addTokens(lexer.tokenize('1+2'))
    assert.deepEqual(inst.complete(), {
      type: 'BinaryExpression',
      operator: '+',
      left: { type: 'Literal', value: 1 },
      right: { type: 'Literal', value: 2 },
    })
  })

  test('adds heavier operations to the right for 2+3*4', ({ assert }) => {
    inst.addTokens(lexer.tokenize('2+3*4'))
    assert.deepEqual(inst.complete(), {
      type: 'BinaryExpression',
      operator: '+',
      left: { type: 'Literal', value: 2 },
      right: {
        type: 'BinaryExpression',
        operator: '*',
        left: { type: 'Literal', value: 3 },
        right: { type: 'Literal', value: 4 },
      },
    })
  })

  test('encapsulates for lighter operation in 2*3+4', ({ assert }) => {
    inst.addTokens(lexer.tokenize('2*3+4'))
    assert.deepEqual(inst.complete(), {
      type: 'BinaryExpression',
      operator: '+',
      left: {
        type: 'BinaryExpression',
        operator: '*',
        left: { type: 'Literal', value: 2 },
        right: { type: 'Literal', value: 3 },
      },
      right: { type: 'Literal', value: 4 },
    })
  })

  test('handles encapsulation of subtree in 2+3*4==5/6-7', ({ assert }) => {
    inst.addTokens(lexer.tokenize('2+3*4==5/6-7'))
    assert.deepEqual(inst.complete(), {
      type: 'BinaryExpression',
      operator: '==',
      left: {
        type: 'BinaryExpression',
        operator: '+',
        left: { type: 'Literal', value: 2 },
        right: {
          type: 'BinaryExpression',
          operator: '*',
          left: { type: 'Literal', value: 3 },
          right: { type: 'Literal', value: 4 },
        },
      },
      right: {
        type: 'BinaryExpression',
        operator: '-',
        left: {
          type: 'BinaryExpression',
          operator: '/',
          left: { type: 'Literal', value: 5 },
          right: { type: 'Literal', value: 6 },
        },
        right: { type: 'Literal', value: 7 },
      },
    })
  })

  test('handles whitespace in an expression', ({ assert }) => {
    inst.addTokens(lexer.tokenize('\t2\r\n+\n\r3\n\n'))
    assert.deepEqual(inst.complete(), {
      type: 'BinaryExpression',
      operator: '+',
      left: { type: 'Literal', value: 2 },
      right: { type: 'Literal', value: 3 },
    })
  })

  test('handles logical operator precedence', ({ assert }) => {
    inst.addTokens(lexer.tokenize('true && true || false && false'))
    assert.deepEqual(inst.complete(), {
      type: 'BinaryExpression',
      operator: '||',
      left: {
        type: 'BinaryExpression',
        operator: '&&',
        left: { type: 'Literal', value: true },
        right: { type: 'Literal', value: true },
      },
      right: {
        type: 'BinaryExpression',
        operator: '&&',
        left: { type: 'Literal', value: false },
        right: { type: 'Literal', value: false },
      },
    })
  })
})

test.group('Parser Unary and Sub expressions', (group) => {
  let inst: Parser

  group.each.setup(() => {
    inst = new Parser(grammar)
  })

  test('handles a unary operator', ({ assert }) => {
    inst.addTokens(lexer.tokenize('1*!!true-2'))
    assert.deepEqual(inst.complete(), {
      type: 'BinaryExpression',
      operator: '-',
      left: {
        type: 'BinaryExpression',
        operator: '*',
        left: { type: 'Literal', value: 1 },
        right: {
          type: 'UnaryExpression',
          operator: '!',
          right: {
            type: 'UnaryExpression',
            operator: '!',
            right: { type: 'Literal', value: true },
          },
        },
      },
      right: { type: 'Literal', value: 2 },
    })
  })

  test('handles a sub expression', ({ assert }) => {
    inst.addTokens(lexer.tokenize('(2+3)*4'))
    assert.deepEqual(inst.complete(), {
      type: 'BinaryExpression',
      operator: '*',
      left: {
        type: 'BinaryExpression',
        operator: '+',
        left: { type: 'Literal', value: 2 },
        right: { type: 'Literal', value: 3 },
      },
      right: { type: 'Literal', value: 4 },
    })
  })

  test('handles nested sub expressions', ({ assert }) => {
    inst.addTokens(lexer.tokenize('(4*(2+3))/5'))
    assert.deepEqual(inst.complete(), {
      type: 'BinaryExpression',
      operator: '/',
      left: {
        type: 'BinaryExpression',
        operator: '*',
        left: { type: 'Literal', value: 4 },
        right: {
          type: 'BinaryExpression',
          operator: '+',
          left: { type: 'Literal', value: 2 },
          right: { type: 'Literal', value: 3 },
        },
      },
      right: { type: 'Literal', value: 5 },
    })
  })

  test('handles unary minus on an identifier', ({ assert }) => {
    inst.addTokens(lexer.tokenize('-foo'))
    assert.deepEqual(inst.complete(), {
      type: 'UnaryExpression',
      operator: '-',
      right: { type: 'Identifier', value: 'foo' },
    })
  })

  test('handles unary minus on a function call', ({ assert }) => {
    inst.addTokens(lexer.tokenize('-foo()'))
    assert.deepEqual(inst.complete(), {
      type: 'UnaryExpression',
      operator: '-',
      right: {
        type: 'FunctionCall',
        name: 'foo',
        pool: 'functions',
        args: [],
      },
    })
  })
})

test.group('Parser Ternary and Sub expressions', (group) => {
  let inst: Parser

  group.each.setup(() => {
    inst = new Parser(grammar)
  })

  test('handles a ternary expression', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo ? 1 : 0'))
    assert.deepEqual(inst.complete(), {
      type: 'ConditionalExpression',
      test: { type: 'Identifier', value: 'foo' },
      consequent: { type: 'Literal', value: 1 },
      alternate: { type: 'Literal', value: 0 },
    })
  })

  test('handles nested and grouped ternary expressions', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo ? (bar ? 1 : 2) : 3'))
    assert.deepEqual(inst.complete(), {
      type: 'ConditionalExpression',
      test: { type: 'Identifier', value: 'foo' },
      consequent: {
        type: 'ConditionalExpression',
        test: { type: 'Identifier', value: 'bar' },
        consequent: { type: 'Literal', value: 1 },
        alternate: { type: 'Literal', value: 2 },
      },
      alternate: { type: 'Literal', value: 3 },
    })
  })

  test('handles nested, non-grouped ternary expressions', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo ? bar ? 1 : 2 : 3'))
    assert.deepEqual(inst.complete(), {
      type: 'ConditionalExpression',
      test: { type: 'Identifier', value: 'foo' },
      consequent: {
        type: 'ConditionalExpression',
        test: { type: 'Identifier', value: 'bar' },
        consequent: { type: 'Literal', value: 1 },
        alternate: { type: 'Literal', value: 2 },
      },
      alternate: { type: 'Literal', value: 3 },
    })
  })

  test('handles ternary expression with objects', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo ? {bar: "tek"} : "baz"'))
    assert.deepEqual(inst.complete(), {
      type: 'ConditionalExpression',
      test: { type: 'Identifier', value: 'foo' },
      consequent: {
        type: 'ObjectLiteral',
        value: {
          bar: { type: 'Literal', value: 'tek' },
        },
      },
      alternate: { type: 'Literal', value: 'baz' },
    })
  })

  test('handles a ternary expression on a function call', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo() ? 1 : 0'))
    assert.deepEqual(inst.complete(), {
      type: 'ConditionalExpression',
      test: {
        type: 'FunctionCall',
        name: 'foo',
        pool: 'functions',
        args: [],
      },
      consequent: { type: 'Literal', value: 1 },
      alternate: { type: 'Literal', value: 0 },
    })
  })
})

test.group('Parser Binary and Sub expressions', (group) => {
  let inst: Parser

  group.each.setup(() => {
    inst = new Parser(grammar)
  })

  test('balances a binary op between complex identifiers', ({ assert }) => {
    inst.addTokens(lexer.tokenize('a.b == c.d'))
    assert.deepEqual(inst.complete(), {
      type: 'BinaryExpression',
      operator: '==',
      left: {
        type: 'Identifier',
        value: 'b',
        from: { type: 'Identifier', value: 'a' },
      },
      right: {
        type: 'Identifier',
        value: 'd',
        from: { type: 'Identifier', value: 'c' },
      },
    })
  })
})

test.group('Parser Object Literals', (group) => {
  let inst: Parser

  group.each.setup(() => {
    inst = new Parser(grammar)
  })

  test('handles object literals', ({ assert }) => {
    inst.addTokens(lexer.tokenize('{foo: "bar", tek: 1+2}'))
    assert.deepEqual(inst.complete(), {
      type: 'ObjectLiteral',
      value: {
        foo: { type: 'Literal', value: 'bar' },
        tek: {
          type: 'BinaryExpression',
          operator: '+',
          left: { type: 'Literal', value: 1 },
          right: { type: 'Literal', value: 2 },
        },
      },
    })
  })

  test('handles dashes in key', ({ assert }) => {
    inst.addTokens(lexer.tokenize(`{'with-dash': "bar", tek: 1+2}`))
    assert.deepEqual(inst.complete(), {
      type: 'ObjectLiteral',
      value: {
        'with-dash': { type: 'Literal', value: 'bar' },
        'tek': {
          type: 'BinaryExpression',
          operator: '+',
          left: { type: 'Literal', value: 1 },
          right: { type: 'Literal', value: 2 },
        },
      },
    })
  })

  test('handles nested object literals', ({ assert }) => {
    inst.addTokens(lexer.tokenize('{foo: {bar: "tek"}}'))
    assert.deepEqual(inst.complete(), {
      type: 'ObjectLiteral',
      value: {
        foo: {
          type: 'ObjectLiteral',
          value: {
            bar: { type: 'Literal', value: 'tek' },
          },
        },
      },
    })
  })

  test('handles empty object literals', ({ assert }) => {
    inst.addTokens(lexer.tokenize('{}'))
    assert.deepEqual(inst.complete(), {
      type: 'ObjectLiteral',
      value: {},
    })
  })
})

test.group('Parser Array Literals', (group) => {
  let inst: Parser

  group.each.setup(() => {
    inst = new Parser(grammar)
  })

  test('handles array literals', ({ assert }) => {
    inst.addTokens(lexer.tokenize('[1, 2, "three"]'))
    assert.deepEqual(inst.complete(), {
      type: 'ArrayLiteral',
      value: [
        { type: 'Literal', value: 1 },
        { type: 'Literal', value: 2 },
        { type: 'Literal', value: 'three' },
      ],
    })
  })

  test('handles empty array literals', ({ assert }) => {
    inst.addTokens(lexer.tokenize('[]'))
    assert.deepEqual(inst.complete(), {
      type: 'ArrayLiteral',
      value: [],
    })
  })

  test('handles nested array literals', ({ assert }) => {
    inst.addTokens(lexer.tokenize('[[1,2], [3,4]]'))
    assert.deepEqual(inst.complete(), {
      type: 'ArrayLiteral',
      value: [
        {
          type: 'ArrayLiteral',
          value: [
            { type: 'Literal', value: 1 },
            { type: 'Literal', value: 2 },
          ],
        },
        {
          type: 'ArrayLiteral',
          value: [
            { type: 'Literal', value: 3 },
            { type: 'Literal', value: 4 },
          ],
        },
      ],
    })
  })
})

test.group('Parser Identifiers and Access', (group) => {
  let inst: Parser

  group.each.setup(() => {
    inst = new Parser(grammar)
  })

  test('handles identifier chains', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo.bar.baz + 1'))
    assert.deepEqual(inst.complete(), {
      type: 'BinaryExpression',
      operator: '+',
      left: {
        type: 'Identifier',
        value: 'baz',
        from: {
          type: 'Identifier',
          value: 'bar',
          from: {
            type: 'Identifier',
            value: 'foo',
          },
        },
      },
      right: { type: 'Literal', value: 1 },
    })
  })

  test('handles bracket notation', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo["bar"]'))
    assert.deepEqual(inst.complete(), {
      type: 'FilterExpression',
      expr: { type: 'Literal', value: 'bar' },
      relative: false,
      subject: { type: 'Identifier', value: 'foo' },
    })
  })

  test('handles filter expressions', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo[.bar == "baz"]'))
    assert.deepEqual(inst.complete(), {
      type: 'FilterExpression',
      relative: true,
      expr: {
        type: 'BinaryExpression',
        operator: '==',
        left: {
          type: 'Identifier',
          value: 'bar',
          relative: true,
        },
        right: { type: 'Literal', value: 'baz' },
      },
      subject: {
        type: 'Identifier',
        value: 'foo',
      },
    })
  })

  test('applies filters to identifiers', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo[1][.bar[0]=="tek"].baz'))
    assert.deepEqual(inst.complete(), {
      type: 'Identifier',
      value: 'baz',
      from: {
        type: 'FilterExpression',
        relative: true,
        expr: {
          type: 'BinaryExpression',
          operator: '==',
          left: {
            type: 'FilterExpression',
            relative: false,
            expr: { type: 'Literal', value: 0 },
            subject: {
              type: 'Identifier',
              value: 'bar',
              relative: true,
            },
          },
          right: { type: 'Literal', value: 'tek' },
        },
        subject: {
          type: 'FilterExpression',
          relative: false,
          expr: { type: 'Literal', value: 1 },
          subject: { type: 'Identifier', value: 'foo' },
        },
      },
    })
  })

  test('allows mixing relative and non-relative identifiers', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo[.bar.baz == tek]'))
    assert.deepEqual(inst.complete(), {
      expr: {
        left: {
          from: {
            relative: true,
            type: 'Identifier',
            value: 'bar',
          },
          type: 'Identifier',
          value: 'baz',
        },
        operator: '==',
        right: {
          type: 'Identifier',
          value: 'tek',
        },
        type: 'BinaryExpression',
      },
      relative: true,
      subject: {
        type: 'Identifier',
        value: 'foo',
      },
      type: 'FilterExpression',
    })
  })

  test('allows mixing relative and non-relative identifiers in a complex case', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo.bar[.baz == tek.tak]'))
    assert.deepEqual(inst.complete(), {
      expr: {
        left: {
          relative: true,
          type: 'Identifier',
          value: 'baz',
        },
        operator: '==',
        right: {
          from: {
            type: 'Identifier',
            value: 'tek',
          },
          type: 'Identifier',
          value: 'tak',
        },
        type: 'BinaryExpression',
      },
      relative: true,
      subject: {
        from: {
          type: 'Identifier',
          value: 'foo',
        },
        type: 'Identifier',
        value: 'bar',
      },
      type: 'FilterExpression',
    })
  })

  test('allows dot notation for all operands', ({ assert }) => {
    inst.addTokens(lexer.tokenize('"foo".length + {foo: "bar"}.foo'))
    assert.deepEqual(inst.complete(), {
      type: 'BinaryExpression',
      operator: '+',
      left: {
        type: 'Identifier',
        value: 'length',
        from: { type: 'Literal', value: 'foo' },
      },
      right: {
        type: 'Identifier',
        value: 'foo',
        from: {
          type: 'ObjectLiteral',
          value: {
            foo: { type: 'Literal', value: 'bar' },
          },
        },
      },
    })
  })

  test('allows dot notation on sub expressions', ({ assert }) => {
    inst.addTokens(lexer.tokenize('("foo" + "bar").length'))
    assert.deepEqual(inst.complete(), {
      type: 'Identifier',
      value: 'length',
      from: {
        type: 'BinaryExpression',
        operator: '+',
        left: { type: 'Literal', value: 'foo' },
        right: { type: 'Literal', value: 'bar' },
      },
    })
  })

  test('allows dot notation on arrays', ({ assert }) => {
    inst.addTokens(lexer.tokenize('["foo", "bar"].length'))
    assert.deepEqual(inst.complete(), {
      type: 'Identifier',
      value: 'length',
      from: {
        type: 'ArrayLiteral',
        value: [
          { type: 'Literal', value: 'foo' },
          { type: 'Literal', value: 'bar' },
        ],
      },
    })
  })
})

test.group('Parser Functions and Transforms', (group) => {
  let inst: Parser

  group.each.setup(() => {
    inst = new Parser(grammar)
  })

  test('handles function calls', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo("bar", "baz")'))
    assert.deepEqual(inst.complete(), {
      type: 'FunctionCall',
      name: 'foo',
      pool: 'functions',
      args: [
        { type: 'Literal', value: 'bar' },
        { type: 'Literal', value: 'baz' },
      ],
    })
  })

  test('handles transforms', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo|bar'))
    assert.deepEqual(inst.complete(), {
      type: 'FunctionCall',
      name: 'bar',
      pool: 'transforms',
      args: [
        {
          type: 'Identifier',
          value: 'foo',
        },
      ],
    })
  })

  test('handles transforms with arguments', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo|bar("baz")'))
    assert.deepEqual(inst.complete(), {
      type: 'FunctionCall',
      name: 'bar',
      pool: 'transforms',
      args: [
        {
          type: 'Identifier',
          value: 'foo',
        },
        { type: 'Literal', value: 'baz' },
      ],
    })
  })

  test('applies transforms and arguments', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo|tr1|tr2.baz|tr3({bar:"tek"})'))
    assert.deepEqual(inst.complete(), {
      type: 'FunctionCall',
      name: 'tr3',
      pool: 'transforms',
      args: [
        {
          type: 'FunctionCall',
          name: 'tr2.baz',
          pool: 'transforms',
          args: [
            {
              type: 'FunctionCall',
              name: 'tr1',
              pool: 'transforms',
              args: [
                {
                  type: 'Identifier',
                  value: 'foo',
                },
              ],
            },
          ],
        },
        {
          type: 'ObjectLiteral',
          value: {
            bar: { type: 'Literal', value: 'tek' },
          },
        },
      ],
    })
  })

  test('handles multiple arguments in transforms', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo|bar("tek", 5, true)'))
    assert.deepEqual(inst.complete(), {
      type: 'FunctionCall',
      name: 'bar',
      pool: 'transforms',
      args: [
        { type: 'Identifier', value: 'foo' },
        { type: 'Literal', value: 'tek' },
        { type: 'Literal', value: 5 },
        { type: 'Literal', value: true },
      ],
    })
  })
})

test.group('Parser Conditional Expressions', (group) => {
  let inst: Parser

  group.each.setup(() => {
    inst = new Parser(grammar)
  })

  test('handles ternary conditionals', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo ? bar : baz'))
    assert.deepEqual(inst.complete(), {
      type: 'ConditionalExpression',
      test: {
        type: 'Identifier',
        value: 'foo',
      },
      consequent: {
        type: 'Identifier',
        value: 'bar',
      },
      alternate: {
        type: 'Identifier',
        value: 'baz',
      },
    })
  })

  test('handles ternary with missing consequent', ({ assert }) => {
    inst.addTokens(lexer.tokenize('foo ?: bar'))
    assert.deepEqual(inst.complete(), {
      type: 'ConditionalExpression',
      test: {
        type: 'Identifier',
        value: 'foo',
      },
      consequent: null,
      alternate: {
        type: 'Identifier',
        value: 'bar',
      },
    })
  })
})

test.group('Parser Error Cases', (group) => {
  let inst: Parser

  group.each.setup(() => {
    inst = new Parser(grammar)
  })

  test('throws on unexpected token', ({ assert }) => {
    inst.addTokens(lexer.tokenize('2 +'))
    assert.throws(() => inst.complete(), /Unexpected end of expression/)
  })
})
