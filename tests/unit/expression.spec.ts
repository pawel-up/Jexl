import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { Jexl } from '../../src/Jexl.js'

test.group('Expression', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
  })

  test('compile returns the parent instance', ({ assert }) => {
    const expr = inst.createExpression('2/2')
    const compiled = expr.compile()
    assert.deepEqual(expr, compiled)
  })

  test('compile compiles the Expression', ({ assert }) => {
    const expr = inst.createExpression('2 & 2')
    const willFail = () => expr.compile()
    assert.throws(willFail, 'Invalid expression token: &')
  })

  test('compile compiles more than once if requested', ({ assert }) => {
    const expr = inst.createExpression('2*2')
    const spy = sinon.spy(expr, 'compile')
    expr.compile()
    expr.compile()
    assert.equal(spy.callCount, 2)
  })

  test('eval resolves Promise on success', async ({ assert }) => {
    const expr = inst.createExpression('2/2')
    const result = await expr.eval()
    assert.equal(result, 1)
  })

  test('eval rejects Promise on error', async ({ assert }) => {
    const expr = inst.createExpression('2++2')
    await assert.rejects(async () => {
      await expr.eval()
    }, /unexpected/i)
  })

  test('eval passes context', async ({ assert }) => {
    const expr = inst.createExpression('foo')
    const result = await expr.eval({ foo: 'bar' })
    assert.equal(result, 'bar')
  })

  test('eval handles chained transforms', async ({ assert }) => {
    inst.addTransform('upper', (val: string) => val.toUpperCase())
    inst.addTransform('split', (val: string, delimiter: string) => val.split(delimiter))
    const expr = inst.createExpression('name | upper | split(" ")')
    const result = await expr.eval({ name: 'john doe' })
    assert.deepEqual(result, ['JOHN', 'DOE'])
  })

  test('eval never compiles more than once', async ({ assert }) => {
    const expr = inst.createExpression('2*2')
    const spy = sinon.spy(expr, 'compile')
    await expr.eval()
    await expr.eval()
    assert.equal(spy.callCount, 1)
  })
})

test.group('Expression Semantic Layer', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
  })

  test('evalAsString should work on a compiled expression', async ({ assert }) => {
    const expr = inst.compile('foo')
    const result = await expr.evalAsString({ foo: 42 })
    assert.equal(result, '42')
  })

  test('evalAsNumber should work on a compiled expression', async ({ assert }) => {
    const expr = inst.compile('foo')
    const result = await expr.evalAsNumber({ foo: '55' })
    assert.equal(result, 55)
  })

  test('evalAsBoolean should work on a compiled expression', async ({ assert }) => {
    const expr = inst.compile('foo')
    const result = await expr.evalAsBoolean({ foo: 1 })
    assert.isTrue(result)
  })
})

test.group('evalAsArray', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
  })

  test('should work on a compiled expression returning a single item', async ({ assert }) => {
    const expr = inst.compile('foo')
    const result = await expr.evalAsArray({ foo: 'bar' })
    assert.deepEqual(result, ['bar'])
  })

  test('should work on a compiled expression returning an array', async ({ assert }) => {
    const expr = inst.compile('foo')
    const result = await expr.evalAsArray({ foo: ['bar', 'baz'] })
    assert.deepEqual(result, ['bar', 'baz'])
  })

  test('should work on a compiled expression returning null', async ({ assert }) => {
    const expr = inst.compile('foo')
    const result = await expr.evalAsArray({ foo: null })
    assert.deepEqual(result, [])
  })
})

test.group('evalAsEnum', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
  })

  const allowed = ['active', 'inactive', 'pending'] as const

  test('should work on a compiled expression with a valid value', async ({ assert }) => {
    const expr = inst.compile('foo')
    const result = await expr.evalAsEnum({ foo: 'pending' }, allowed)
    assert.equal(result, 'pending')
  })

  test('should work on a compiled expression with an invalid value', async ({ assert }) => {
    const expr = inst.compile('foo')
    const result = await expr.evalAsEnum({ foo: 'archived' }, allowed)
    assert.isUndefined(result)
  })
})

test.group('evalWithDefault', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
  })

  test('should work on a compiled expression with a null value', async ({ assert }) => {
    const expr = inst.compile('foo')
    const result = await expr.evalWithDefault({ foo: null }, 'default value')
    assert.equal(result, 'default value')
  })
})
