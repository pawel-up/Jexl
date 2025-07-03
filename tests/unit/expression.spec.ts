import { test } from '@japa/runner'
import * as sinon from 'sinon'
import { Jexl } from '../../src/Jexl.js'

test.group('Expression', (group) => {
  let inst: Jexl

  group.setup(() => {
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
    }, /unexpected/)
  })

  test('eval passes context', async ({ assert }) => {
    const expr = inst.createExpression('foo')
    const result = await expr.eval({ foo: 'bar' })
    assert.equal(result, 'bar')
  })

  test('eval never compiles more than once', async ({ assert }) => {
    const expr = inst.createExpression('2*2')
    const spy = sinon.spy(expr, 'compile')
    await expr.eval()
    await expr.eval()
    assert.equal(spy.callCount, 1)
  })

  test('evalSync throws error (not supported)', ({ assert }) => {
    const expr = inst.createExpression('2 % 2')
    assert.throws(() => expr.evalSync(), 'Synchronous evaluation is not supported')
  })
})
