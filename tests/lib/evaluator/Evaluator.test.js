/*
 * Jexl
 * Copyright 2020 Tom Shawver
 */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import spies from 'chai-spies'
import Lexer from '../../../lib/Lexer.js'
import Parser from '../../../lib/parser/Parser.js'
import Evaluator from '../../../lib/evaluator/Evaluator.js'
import { getGrammar } from '../../../lib/grammar.js'
import PromiseSync from '../../../lib/PromiseSync.js'

chai.use(spies)
chai.use(chaiAsPromised)

const grammar = getGrammar()
const lexer = new Lexer(grammar)

const toTree = (exp) => {
  const p = new Parser(grammar)
  p.addTokens(lexer.tokenize(exp))
  return p.complete()
}

describe('Evaluator', () => {
  it('evaluates using an alternative Promise class', () => {
    const e = new Evaluator(grammar, null, null, PromiseSync)
    expect(e.eval(toTree('2 + 2'))).to.have.property('value', 4)
  })
  it('evaluates an arithmetic expression', async () => {
    const e = new Evaluator(grammar)
    return expect(e.eval(toTree('(2 + 3) * 4'))).eventually.to.eq(20)
  })
  it('evaluates a string concat', async () => {
    const e = new Evaluator(grammar)
    return expect(
      e.eval(toTree('"Hello" + (4+4) + "Wo\\"rld"'))
    ).eventually.to.eq('Hello8Wo"rld')
  })
  it('evaluates a true comparison expression', async () => {
    const e = new Evaluator(grammar)
    return expect(e.eval(toTree('2 > 1'))).eventually.to.eq(true)
  })
  it('evaluates a false comparison expression', async () => {
    const e = new Evaluator(grammar)
    return expect(e.eval(toTree('2 <= 1'))).eventually.to.eq(false)
  })
  it('evaluates a complex expression', async () => {
    const e = new Evaluator(grammar)
    return expect(
      e.eval(toTree('"foo" && 6 >= 6 && 0 + 1 && true'))
    ).eventually.to.eq(true)
  })
  it('evaluates an identifier chain', async () => {
    const context = { foo: { baz: { bar: 'tek' } } }
    const e = new Evaluator(grammar, context)
    return expect(e.eval(toTree('foo.baz.bar'))).eventually.to.eq(
      context.foo.baz.bar
    )
  })
  it('applies transforms', async () => {
    const context = { foo: 10 }
    const half = (val) => val / 2
    const g = { ...grammar, transforms: { half } }
    const e = new Evaluator(g, context)
    return expect(e.eval(toTree('foo|half + 3'))).eventually.to.eq(8)
  })
  it('filters arrays', async () => {
    const context = {
      foo: {
        bar: [{ tek: 'hello' }, { tek: 'baz' }, { tok: 'baz' }]
      }
    }
    const e = new Evaluator(grammar, context)
    return expect(
      e.eval(toTree('foo.bar[.tek == "baz"]'))
    ).eventually.to.deep.equal([{ tek: 'baz' }])
  })
  it('assumes array index 0 when traversing', async () => {
    const context = {
      foo: {
        bar: [{ tek: { hello: 'world' } }, { tek: { hello: 'universe' } }]
      }
    }
    const e = new Evaluator(grammar, context)
    return expect(e.eval(toTree('foo.bar.tek.hello'))).eventually.to.eq('world')
  })
  it('makes array elements addressable by index', async () => {
    const context = {
      foo: {
        bar: [{ tek: 'tok' }, { tek: 'baz' }, { tek: 'foz' }]
      }
    }
    const e = new Evaluator(grammar, context)
    return expect(e.eval(toTree('foo.bar[1].tek'))).eventually.to.eq('baz')
  })
  it('allows filters to select object properties', async () => {
    const context = { foo: { baz: { bar: 'tek' } } }
    const e = new Evaluator(grammar, context)
    return expect(e.eval(toTree('foo["ba" + "z"].bar'))).eventually.to.eq(
      context.foo.baz.bar
    )
  })
  it('throws when transform does not exist', async () => {
    const e = new Evaluator(grammar)
    return expect(
      e.eval(toTree('"hello"|world'))
    ).to.eventually.be.rejectedWith(Error)
  })
  it('applies the DivFloor operator', async () => {
    const e = new Evaluator(grammar)
    return expect(e.eval(toTree('7 // 2'))).eventually.to.eq(3)
  })
  it('evaluates an object literal', async () => {
    const e = new Evaluator(grammar)
    return expect(
      e.eval(toTree('{foo: {bar: "tek"}}'))
    ).eventually.to.deep.equal({
      foo: { bar: 'tek' }
    })
  })
  it('evaluates an empty object literal', async () => {
    const e = new Evaluator(grammar)
    return expect(e.eval(toTree('{}'))).eventually.to.deep.equal({})
  })
  it('evaluates a transform with multiple args', async () => {
    const g = {
      ...grammar,
      transforms: {
        concat: (val, a1, a2, a3) => val + ': ' + a1 + a2 + a3
      }
    }
    const e = new Evaluator(g)
    return expect(
      e.eval(toTree('"foo"|concat("baz", "bar", "tek")'))
    ).eventually.to.eq('foo: bazbartek')
  })
  it('evaluates dot notation for object literals', async () => {
    const e = new Evaluator(grammar)
    return expect(e.eval(toTree('{foo: "bar"}.foo'))).eventually.to.eq('bar')
  })
  it('allows access to literal properties', async () => {
    const e = new Evaluator(grammar)
    return expect(e.eval(toTree('"foo".length'))).eventually.to.eq(3)
  })
  it('evaluates array literals', async () => {
    const e = new Evaluator(grammar)
    return expect(e.eval(toTree('["foo", 1+2]'))).eventually.to.deep.equal([
      'foo',
      3
    ])
  })
  it('applys the "in" operator to strings', async () => {
    const e = new Evaluator(grammar)
    return Promise.all([
      expect(e.eval(toTree('"bar" in "foobartek"'))).eventually.to.eq(true),
      expect(e.eval(toTree('"baz" in "foobartek"'))).eventually.to.eq(false)
    ])
  })
  it('applys the "in" operator to arrays', async () => {
    const e = new Evaluator(grammar)
    return Promise.all([
      expect(e.eval(toTree('"bar" in ["foo","bar","tek"]'))).eventually.to.eq(
        true
      ),
      expect(e.eval(toTree('"baz" in ["foo","bar","tek"]'))).eventually.to.eq(
        false
      )
    ])
  })
  it('evaluates a conditional expression', async () => {
    const e = new Evaluator(grammar)
    return Promise.all([
      expect(e.eval(toTree('"foo" ? 1 : 2'))).eventually.to.eq(1),
      expect(e.eval(toTree('"" ? 1 : 2'))).eventually.to.eq(2)
    ])
  })
  it('allows missing consequent in ternary', async () => {
    const e = new Evaluator(grammar)
    return expect(e.eval(toTree('"foo" ?: "bar"'))).eventually.to.eq('foo')
  })
  it('does not treat falsey properties as undefined', async () => {
    const e = new Evaluator(grammar)
    return expect(e.eval(toTree('"".length'))).eventually.to.eq(0)
  })
  it('returns empty array when applying a filter to an undefined value', async () => {
    const e = new Evaluator(grammar, { a: {}, d: 4 })
    return expect(e.eval(toTree('a.b[.c == d]'))).eventually.to.have.length(0)
  })
  it('evaluates an expression with arbitrary whitespace', async () => {
    const e = new Evaluator(grammar)
    await expect(e.eval(toTree('(\t2\n+\n3) *\n4\n\r\n'))).eventually.to.eq(20)
  })
  it('evaluates an expression with $ in identifiers', async () => {
    const context = {
      $: 5,
      $foo: 6,
      $foo$bar: 7,
      $bar: 8
    }
    const expr = '$+$foo+$foo$bar+$bar'
    const e = new Evaluator(grammar, context)
    await expect(e.eval(toTree(expr))).eventually.to.eq(26)
  })
})
