/* eslint-disable @typescript-eslint/no-explicit-any */
import { test } from '@japa/runner'
import { Jexl } from '../../src/Jexl.js'
import Expression from '../../src/Expression.js'

test.group('Jexl compile', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
  })

  test('returns an instance of Expression', ({ assert }) => {
    const expr = inst.compile('2/2')
    assert.instanceOf(expr, Expression)
  })

  test('compiles the Expression and throws on invalid tokens', ({ assert }) => {
    assert.throws(() => inst.compile('2 & 2'), 'Invalid expression token: &')
  })
})

test.group('Jexl createExpression', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
  })

  test('returns an instance of Expression', ({ assert }) => {
    const expr = inst.createExpression('2/2')
    assert.instanceOf(expr, Expression)
  })

  test('does not compile the Expression', ({ assert }) => {
    const expr = inst.createExpression('2 wouldFail &^% ..4')
    assert.instanceOf(expr, Expression)
  })
})

test.group('Jexl eval', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
  })

  test('resolves Promise on success', async ({ assert }) => {
    const result = await inst.eval('2+2')
    assert.equal(result, 4)
  })

  test('rejects Promise on error', async ({ assert }) => {
    await assert.rejects(async () => {
      await inst.eval('2++2')
    }, /unexpected/)
  })

  test('passes context', async ({ assert }) => {
    const result = await inst.eval('foo', { foo: 'bar' })
    assert.equal(result, 'bar')
  })

  test('filters collections as expected (issue #61)', async ({ assert }) => {
    const context = {
      a: [{ b: 'A' }, { b: 'B' }, { b: 'C' }],
    }
    const result = await inst.eval('a[.b in ["A","B"]]', context)
    assert.deepEqual(result, [{ b: 'A' }, { b: 'B' }])
  })
})

test.group('Jexl eval with null/undefined', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
  })

  test('evaluates null literal', async ({ assert }) => {
    const result = await inst.eval('null')
    assert.isNull(result)
  })

  test('evaluates undefined literal', async ({ assert }) => {
    const result = await inst.eval('undefined')
    assert.isUndefined(result)
  })

  test('evaluates property on a null context variable', async ({ assert }) => {
    const result = await inst.eval('foo.bar', { foo: null })
    assert.isNull(result)
  })

  test('evaluates property on an undefined context variable', async ({ assert }) => {
    const result = await inst.eval('foo.bar', { foo: undefined })
    assert.isUndefined(result)
  })

  test('evaluates property on a missing context variable', async ({ assert }) => {
    const result = await inst.eval('foo.bar', {})
    assert.isUndefined(result)
  })

  test('uses null and undefined as falsy in conditionals', async ({ assert }) => {
    assert.equal(await inst.eval('null ? "yes" : "no"'), 'no')
    assert.equal(await inst.eval('undefined ? "yes" : "no"'), 'no')
  })
})

test.group('Jexl expr template literal', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
  })

  test('returns an evaluatable instance of Expression', ({ assert }) => {
    const expr = inst.expr`2+2`
    assert.instanceOf(expr, Expression)
  })

  test('functions as a template string', ({ assert }) => {
    const myVar = 'foo'
    const expr = inst.expr`'myVar' + ${myVar} + 'Car'`
    assert.instanceOf(expr, Expression)
  })

  test('works outside of the instance context', ({ assert }) => {
    const myVar = '##'
    inst.addUnaryOp('##', (val) => (val as number) * 2)
    const { expr } = inst
    const e = expr`${myVar}5`
    assert.instanceOf(e, Expression)
  })
})

test.group('Jexl addFunction', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
  })

  test('allows functions to be defined', async ({ assert }) => {
    inst.addFunction('sayHi', () => 'Hello')
    const result = await inst.eval('sayHi()')
    assert.equal(result, 'Hello')
  })

  test('allows functions to be retrieved', ({ assert }) => {
    inst.addFunction('ret2', () => 2)
    const f = inst.getFunction('ret2')
    assert.isDefined(f)
    assert.equal(f(), 2)
  })

  test('allows functions to be set in batch', async ({ assert }) => {
    inst.addFunctions({
      add1: (val) => (val as number) + 1,
      add2: (val) => (val as number) + 2,
    })
    const result = await inst.eval('add1(add2(2))')
    assert.equal(result, 5)
  })
})

test.group('Jexl addTransform', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
  })

  test('allows transforms to be defined', async ({ assert }) => {
    inst.addTransform('toCase', (val, args: any) =>
      args.case === 'upper' ? (val as string).toUpperCase() : (val as string).toLowerCase()
    )
    const result = await inst.eval('"hello"|toCase({case:"upper"})')
    assert.equal(result, 'HELLO')
  })

  test('allows transforms to be retrieved', ({ assert }) => {
    inst.addTransform('ret2', () => 2)
    const t = inst.getTransform('ret2')
    assert.isDefined(t)
    assert.equal(t(), 2)
  })

  test('allows transforms to be set in batch', async ({ assert }) => {
    inst.addTransforms({
      add1: (val) => (val as number) + 1,
      add2: (val) => (val as number) + 2,
    })
    const result = await inst.eval('2|add1|add2')
    assert.equal(result, 5)
  })
})

test.group('Jexl addBinaryOp', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
  })

  test('allows binaryOps to be defined', async ({ assert }) => {
    inst.addBinaryOp('_=', 20, (left, right) => (left as string).toLowerCase() === (right as string).toLowerCase())
    const result = await inst.eval('"FoO" _= "fOo"')
    assert.equal(result, true)
  })

  test('observes weight on binaryOps', async ({ assert }) => {
    inst.addBinaryOp('**', 0, (left, right) => (left as number) * 2 + (right as number) * 2)
    inst.addBinaryOp('***', 1000, (left, right) => (left as number) * 2 + (right as number) * 2)
    const results = await Promise.all([inst.eval('1 + 2 ** 3 + 4'), inst.eval('1 + 2 *** 3 + 4')])
    assert.deepEqual(results, [20, 15])
  })

  test('allows binaryOps to be defined with manual operand evaluation', async ({ assert }) => {
    inst.addBinaryOp(
      '$$',
      50,
      (left: any, right: any) => {
        return left.eval().then((val: number) => {
          if (val > 0) return val
          return right.eval()
        })
      },
      true
    )
    let count = 0
    inst.addTransform('inc', (elem) => {
      count++
      return elem
    })

    const result1 = await inst.eval('-2|inc $$ 5|inc')
    assert.equal(result1, 5)
    assert.equal(count, 2)

    count = 0
    const result2 = await inst.eval('2|inc $$ -5|inc')
    assert.equal(result2, 2)
    assert.equal(count, 1)
  })
})

test.group('Jexl addUnaryOp', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
  })

  test('allows unaryOps to be defined', async ({ assert }) => {
    inst.addUnaryOp('~', (right) => Math.floor(right as number))
    const result = await inst.eval('~5.7 + 5')
    assert.equal(result, 10)
  })
})

test.group('Jexl removeOp', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
  })

  test('allows binaryOps to be removed', async ({ assert }) => {
    inst.removeOp('+')
    await assert.rejects(async () => {
      await inst.eval('1+2')
    }, /invalid/i)
  })

  test('allows unaryOps to be removed', async ({ assert }) => {
    inst.removeOp('!')
    await assert.rejects(async () => {
      await inst.eval('!true')
    }, /invalid/i)
  })
})
