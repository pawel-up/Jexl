/*
 * Jexl
 * Copyright 2020 Tom Shawver
 */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import spies from 'chai-spies'
import { Jexl } from '../../lib/Jexl.js'

chai.use(spies)
chai.use(chaiAsPromised)

/** @type Jexl */
let inst

describe('Expression', () => {
  beforeEach(() => {
    inst = new Jexl()
  })

  describe('compile', () => {
    it('returns the parent instance', () => {
      const expr = inst.createExpression('2/2')
      const compiled = expr.compile()
      expect(expr).to.deep.equal(compiled)
    })
    it('compiles the Expression', () => {
      const expr = inst.createExpression('2 & 2')
      const willFail = () => expr.compile('2 & 2')
      expect(willFail).to.throw('Invalid expression token: &')
    })
    it('compiles more than once if requested', () => {
      const expr = inst.createExpression('2*2')
      const spy = chai.spy.on(expr, 'compile')
      expr.compile()
      expr.compile()
      expect(spy).to.have.been.called.exactly(2)
    })
  })

  describe('eval', () => {
    it('resolves Promise on success', async () => {
      const expr = inst.createExpression('2/2')
      await expect(expr.eval()).eventually.to.eq(1)
    })

    it('rejects Promise on error', async () => {
      const expr = inst.createExpression('2++2')
      await expect(expr.eval()).to.eventually.be.rejectedWith(/unexpected/)
    })

    it('passes context', async () => {
      const expr = inst.createExpression('foo')
      await expect(expr.eval({ foo: 'bar' })).eventually.to.eq('bar')
    })

    it('never compiles more than once', async () => {
      const expr = inst.createExpression('2*2')
      const spy = chai.spy.on(expr, 'compile')
      await expr.eval()
      await expr.eval()
      expect(spy).to.have.been.called.exactly(1)
    })
  })
  describe('evalSync', () => {
    it('returns success', () => {
      const expr = inst.createExpression('2 % 2')
      expect(expr.evalSync()).to.eq(0)
    })

    it('throws on error', async () => {
      const expr = inst.createExpression('2++2')
      expect(expr.evalSync.bind(expr)).to.throw(/unexpected/)
    })

    it('passes context', () => {
      const expr = inst.createExpression('foo')
      expect(expr.evalSync({ foo: 'bar' })).to.eq('bar')
    })

    it('never compiles more than once', () => {
      const expr = inst.createExpression('2*2')
      const spy = chai.spy.on(expr, 'compile')
      expr.evalSync()
      expr.evalSync()
      expect(spy).to.have.been.called.exactly(1)
    })
  })
})
