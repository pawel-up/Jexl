import { test } from '@japa/runner'
import Lexer from '../../src/Lexer.js'
import Parser from '../../src/parser/Parser.js'
import Evaluator from '../../src/evaluator/Evaluator.js'
import { getGrammar } from '../../src/grammar.js'
import type { ASTNode } from '../../src/grammar.js'

const grammar = getGrammar()
const lexer = new Lexer(grammar)

const toTree = (exp: string): ASTNode => {
  const p = new Parser(grammar)
  p.addTokens(lexer.tokenize(exp))
  return p.complete() as ASTNode
}

test.group('Evaluator', () => {
  test('evaluates an arithmetic expression', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('(2 + 3) * 4'))
    assert.equal(result, 20)
  })

  test('evaluates a string concat', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('"Hello" + (4+4) + "Wo\\"rld"'))
    assert.equal(result, 'Hello8Wo"rld')
  })

  test('evaluates a true comparison expression', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('2 > 1'))
    assert.equal(result, true)
  })

  test('evaluates a false comparison expression', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('2 <= 1'))
    assert.equal(result, false)
  })

  test('evaluates a complex expression', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('"foo" && 6 >= 6 && 0 + 1 && true'))
    assert.equal(result, true)
  })

  test('evaluates an identifier chain', async ({ assert }) => {
    const context = { foo: { baz: { bar: 'tek' } } }
    const e = new Evaluator(grammar, context)
    const result = await e.eval(toTree('foo.baz.bar'))
    assert.equal(result, context.foo.baz.bar)
  })

  test('applies transforms', async ({ assert }) => {
    const context = { foo: 10 }
    const half = (val: number) => val / 2
    const g = { ...grammar, transforms: { half } }
    const e = new Evaluator(g, context)
    const result = await e.eval(toTree('foo|half + 3'))
    assert.equal(result, 8)
  })

  test('filters arrays', async ({ assert }) => {
    const context = {
      foo: {
        bar: [{ tek: 'hello' }, { tek: 'baz' }, { tok: 'baz' }],
      },
    }
    const e = new Evaluator(grammar, context)
    const result = await e.eval(toTree('foo.bar[.tek == "baz"]'))
    assert.deepEqual(result, [{ tek: 'baz' }])
  })

  test('assumes array index 0 when traversing', async ({ assert }) => {
    const context = {
      foo: {
        bar: [{ tek: { hello: 'world' } }, { tek: { hello: 'universe' } }],
      },
    }
    const e = new Evaluator(grammar, context)
    const result = await e.eval(toTree('foo.bar.tek.hello'))
    assert.equal(result, 'world')
  })

  test('makes array elements addressable by index', async ({ assert }) => {
    const context = {
      foo: {
        bar: [{ tek: 'tok' }, { tek: 'baz' }, { tek: 'foz' }],
      },
    }
    const e = new Evaluator(grammar, context)
    const result = await e.eval(toTree('foo.bar[1].tek'))
    assert.equal(result, 'baz')
  })

  test('allows filters to select object properties', async ({ assert }) => {
    const context = { foo: { baz: { bar: 'tek' } } }
    const e = new Evaluator(grammar, context)
    const result = await e.eval(toTree('foo["ba" + "z"].bar'))
    assert.equal(result, context.foo.baz.bar)
  })

  test('throws when transform does not exist', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    await assert.rejects(async () => {
      await e.eval(toTree('"hello"|world'))
    }, Error)
  })

  test('applies the DivFloor operator', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('7 // 2'))
    assert.equal(result, 3)
  })

  test('evaluates an object literal', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('{foo: {bar: "tek"}}'))
    assert.deepEqual(result, {
      foo: { bar: 'tek' },
    })
  })

  test('evaluates an empty object literal', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('{}'))
    assert.deepEqual(result, {})
  })

  test('evaluates a transform with multiple args', async ({ assert }) => {
    const g = {
      ...grammar,
      transforms: {
        concat: (val: string, a1: string, a2: string, a3: string) => val + ': ' + a1 + a2 + a3,
      },
    }
    const e = new Evaluator(g, {})
    const result = await e.eval(toTree('"foo"|concat("baz", "bar", "tek")'))
    assert.equal(result, 'foo: bazbartek')
  })

  test('evaluates dot notation for object literals', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('{foo: "bar"}.foo'))
    assert.equal(result, 'bar')
  })

  test('allows access to literal properties', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('"foo".length'))
    assert.equal(result, 3)
  })

  test('evaluates array literals', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('["foo", 1+2]'))
    assert.deepEqual(result, ['foo', 3])
  })

  test('applies the "in" operator to strings - positive case', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('"bar" in "foobartek"'))
    assert.equal(result, true)
  })

  test('applies the "in" operator to strings - negative case', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('"baz" in "foobartek"'))
    assert.equal(result, false)
  })

  test('applies the "in" operator to arrays - positive case', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('"bar" in ["foo","bar","tek"]'))
    assert.equal(result, true)
  })

  test('applies the "in" operator to arrays - negative case', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('"baz" in ["foo","bar","tek"]'))
    assert.equal(result, false)
  })

  test('evaluates a conditional expression - truthy case', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('"foo" ? 1 : 2'))
    assert.equal(result, 1)
  })

  test('evaluates a conditional expression - falsy case', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('"" ? 1 : 2'))
    assert.equal(result, 2)
  })

  test('allows missing consequent in ternary', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('"foo" ?: "bar"'))
    assert.equal(result, 'foo')
  })

  test('does not treat falsy properties as undefined', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('"".length'))
    assert.equal(result, 0)
  })

  test('returns empty array when applying a filter to an undefined value', async ({ assert }) => {
    const e = new Evaluator(grammar, { a: {}, d: 4 })
    const result = await e.eval(toTree('a.b[.c == d]'))
    assert.lengthOf(result as unknown[], 0)
  })

  test('evaluates an expression with arbitrary whitespace', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('(\t2\n+\n3) *\n4\n\r\n'))
    assert.equal(result, 20)
  })

  test('evaluates an expression with $ in identifiers', async ({ assert }) => {
    const context = {
      $: 5,
      $foo: 6,
      $foo$bar: 7,
      $bar: 8,
    }
    const expr = '$+$foo+$foo$bar+$bar'
    const e = new Evaluator(grammar, context)
    const result = await e.eval(toTree(expr))
    assert.equal(result, 26)
  })
})

test.group('Evaluator: Null and Undefined', () => {
  test('evaluates null literal to null', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('null'))
    assert.isNull(result)
  })

  test('evaluates undefined literal to undefined', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('undefined'))
    assert.isUndefined(result)
  })

  test('evaluates an identifier with a null value', async ({ assert }) => {
    const context = { foo: null }
    const e = new Evaluator(grammar, context)
    const result = await e.eval(toTree('foo'))
    assert.isNull(result)
  })

  test('evaluates property access on a null object to null', async ({ assert }) => {
    const context = { foo: null }
    const e = new Evaluator(grammar, context)
    const result = await e.eval(toTree('foo.bar'))
    assert.isNull(result)
  })

  test('evaluates property access on an undefined object to undefined', async ({ assert }) => {
    const context = { foo: undefined }
    const e = new Evaluator(grammar, context)
    const result = await e.eval(toTree('foo.bar'))
    assert.isUndefined(result)
  })

  test('evaluates property access on a missing object to undefined', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('foo.bar'))
    assert.isUndefined(result)
  })

  test('evaluates bracket access on a null object to null', async ({ assert }) => {
    const context = { foo: null }
    const e = new Evaluator(grammar, context)
    const result = await e.eval(toTree('foo["bar"]'))
    assert.isNull(result)
  })

  test('evaluates bracket access on an undefined object to undefined', async ({ assert }) => {
    const context = { foo: undefined }
    const e = new Evaluator(grammar, context)
    const result = await e.eval(toTree('foo["bar"]'))
    assert.isUndefined(result)
  })

  test('evaluates conditional with null', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('null ? "truthy" : "falsy"'))
    assert.equal(result, 'falsy')
  })

  test('evaluates conditional with undefined', async ({ assert }) => {
    const e = new Evaluator(grammar, {})
    const result = await e.eval(toTree('undefined ? "truthy" : "falsy"'))
    assert.equal(result, 'falsy')
  })
})
