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
    }, /unexpected/i)
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

  test('handles logical operator precedence correctly', async ({ assert }) => {
    const result = await inst.eval('true && true || false && false')
    assert.isTrue(result)
  })

  test('handles decimal-only numbers', async ({ assert }) => {
    const result = await inst.eval('2 + .5')
    assert.equal(result, 2.5)
  })

  test('handles unary plus', async ({ assert }) => {
    const result = await inst.eval('1 * +2')
    assert.equal(result, 2)
  })

  test('rejects ambiguous operators', async ({ assert }) => {
    await assert.rejects(async () => inst.eval('2++2'), /Unexpected token/)
    await assert.rejects(async () => inst.eval('2--2'), /Unexpected token/)
    await assert.rejects(async () => inst.eval('2+-2'), /Unexpected token/)
    await assert.rejects(async () => inst.eval('2-+2'), /Unexpected token/)
  })

  test('allows unary operators with space', async ({ assert }) => {
    assert.equal(await inst.eval('2+ +2'), 4)
    assert.equal(await inst.eval('2- -2'), 4)
    assert.equal(await inst.eval('2 + -2'), 0)
    assert.equal(await inst.eval('2 - +2'), 0)
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

  test('allows namespace functions to be defined', async ({ assert }) => {
    inst.addFunction('My.sayHi', () => 'Hello')
    const result = await inst.eval('My.sayHi()')
    assert.equal(result, 'Hello')
  })

  test('allows deeply nested namespace functions', async ({ assert }) => {
    inst.addFunction('Utils.String.upper', (str: string) => str.toUpperCase())
    const result = await inst.eval('Utils.String.upper("hello")')
    assert.equal(result, 'HELLO')
  })

  test('allows namespace functions with arguments', async ({ assert }) => {
    inst.addFunction('Math.add', (a: number, b: number) => a + b)
    const result = await inst.eval('Math.add(5, 3)')
    assert.equal(result, 8)
  })

  test('allows namespace functions in complex expressions', async ({ assert }) => {
    inst.addFunction('Config.getValue', (key: string) => {
      const config: Record<string, unknown> = { timeout: 5000, enabled: true }
      return config[key]
    })
    const result = await inst.eval('Config.getValue("timeout") > 1000 && Config.getValue("enabled")')
    assert.isTrue(result)
  })

  test('throws error for undefined namespace function', async ({ assert }) => {
    await assert.rejects(async () => {
      await inst.eval('Undefined.func()')
    }, /Jexl Function Undefined\.func is not defined/)
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

  test('handles negative numbers in arguments', async ({ assert }) => {
    inst.addFunction('add', (a: number, b: number) => a + b)
    const result = await inst.eval('add(5, -3)')
    assert.equal(result, 2)
    const result2 = await inst.eval('add(-5, 3)')
    assert.equal(result2, -2)
    const result3 = await inst.eval('add(-5, -3)')
    assert.equal(result3, -8)
  })
})

test.group('Jexl eval with unary minus on expressions', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
    inst.addFunction('add', (a: number, b: number) => a + b)
  })

  test('handles unary minus on function calls with arguments', async ({ assert }) => {
    const result = await inst.eval('-add(2, 3)')
    assert.equal(result, -5)
  })

  test('handles unary minus on identifiers', async ({ assert }) => {
    const result = await inst.eval('-foo', { foo: 10 })
    assert.equal(result, -10)
  })

  test('handles unary minus on parenthesized expressions', async ({ assert }) => {
    const result = await inst.eval('-(2+3)')
    assert.equal(result, -5)
  })

  test('handles unary plus on an identifier', async ({ assert }) => {
    const result = await inst.eval('+foo', { foo: '10' })
    assert.equal(result, 10)
  })
})

test.group('Jexl eval with functions in ternary', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
    inst.addFunction('parseInt', (arg) => Number.parseInt(arg as any))
    inst.addFunction('isNaN', (arg) => Number.isNaN(arg as any))
  })

  test('handles function calls in ternary test', async ({ assert }) => {
    const result = await inst.eval('isNaN(parseInt(size)) ? 0 : parseInt(size)', { size: '' })
    assert.equal(result, 0)
  })

  test('handles function calls in ternary test with comparison', async ({ assert }) => {
    const result = await inst.eval('isNaN(parseInt(size)) == true ? 0 : parseInt(size)', { size: '' })
    assert.equal(result, 0)
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
    inst.addBinaryOp('**', 0, (left: number, right: number) => left * 2 + right * 2)
    inst.addBinaryOp('***', 1000, (left, right) => (left as number) * 2 + (right as number) * 2)
    const results = await Promise.all([inst.eval<number>('1 + 2 ** 3 + 4'), inst.eval<number>('1 + 2 *** 3 + 4')])
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

test.group('evalAsString', (group) => {
  let jexl: Jexl

  group.each.setup(() => {
    jexl = new Jexl()
  })

  test('should coerce a number to a string', async ({ assert }) => {
    const result = await jexl.evalAsString('123')
    assert.equal(result, '123')
  })

  test('should coerce null to "null"', async ({ assert }) => {
    const result = await jexl.evalAsString('null')
    assert.equal(result, 'null')
  })

  test('should coerce undefined to "undefined"', async ({ assert }) => {
    const result = await jexl.evalAsString('undefined')
    assert.equal(result, 'undefined')
  })
})

test.group('evalAsNumber', (group) => {
  let jexl: Jexl

  group.each.setup(() => {
    jexl = new Jexl()
  })

  test('should coerce a string number to a number', async ({ assert }) => {
    const result = await jexl.evalAsNumber('"42"')
    assert.equal(result, 42)
  })

  test('should coerce null to NaN', async ({ assert }) => {
    const result = await jexl.evalAsNumber('null')
    assert.isNaN(result)
  })

  test('should coerce undefined to NaN', async ({ assert }) => {
    const result = await jexl.evalAsNumber('undefined')
    assert.isNaN(result)
  })

  test('should coerce true to 1', async ({ assert }) => {
    const result = await jexl.evalAsNumber('true')
    assert.equal(result, 1)
  })
})

test.group('evalAsBoolean', (group) => {
  let jexl: Jexl

  group.each.setup(() => {
    jexl = new Jexl()
  })

  test('should return true for truthy values', async ({ assert }) => {
    assert.isTrue(await jexl.evalAsBoolean('true'))
    assert.isTrue(await jexl.evalAsBoolean('1'))
    assert.isTrue(await jexl.evalAsBoolean('"hello"'))
    assert.isTrue(await jexl.evalAsBoolean('{}'))
  })

  test('should return false for falsy values', async ({ assert }) => {
    assert.isFalse(await jexl.evalAsBoolean('false'))
    assert.isFalse(await jexl.evalAsBoolean('0'))
    assert.isFalse(await jexl.evalAsBoolean('""'))
    assert.isFalse(await jexl.evalAsBoolean('null'))
    assert.isFalse(await jexl.evalAsBoolean('undefined'))
  })
})

test.group('evalAsArray', (group) => {
  let jexl: Jexl

  group.each.setup(() => {
    jexl = new Jexl()
  })

  test('should return an array as-is', async ({ assert }) => {
    const result = await jexl.evalAsArray<number>('[1, 2, 3]')
    assert.deepEqual(result, [1, 2, 3])
  })

  test('should wrap a single item in an array', async ({ assert }) => {
    const result = await jexl.evalAsArray<string>('"hello"')
    assert.deepEqual(result, ['hello'])
  })

  test('should return an empty array for null', async ({ assert }) => {
    const result = await jexl.evalAsArray('null')
    assert.deepEqual(result, [])
  })

  test('should handle expression returning an array from context', async ({ assert }) => {
    const context = { items: ['a', 'b'] }
    const result = await jexl.evalAsArray<string>('items', context)
    assert.deepEqual(result, ['a', 'b'])
  })

  test('should handle expression returning a single item from context', async ({ assert }) => {
    const context = { item: 'a' }
    const result = await jexl.evalAsArray<string>('item', context)
    assert.deepEqual(result, ['a'])
  })
})

test.group('evalAsEnum', (group) => {
  let jexl: Jexl

  group.each.setup(() => {
    jexl = new Jexl()
  })

  const allowed = ['active', 'inactive', 'pending'] as const

  test('should return the value if it is in the allowed list', async ({ assert }) => {
    const result = await jexl.evalAsEnum('"active"', {}, allowed)
    assert.equal(result, 'active')
  })

  test('should return undefined if the value is not in the allowed list', async ({ assert }) => {
    const result = await jexl.evalAsEnum('"archived"', {}, allowed)
    assert.isUndefined(result)
  })

  test('should work with numeric enums', async ({ assert }) => {
    const numericAllowed = [10, 20, 30] as const
    const result = await jexl.evalAsEnum('20', {}, numericAllowed)
    assert.equal(result, 20)
    const invalidResult = await jexl.evalAsEnum('25', {}, numericAllowed)
    assert.isUndefined(invalidResult)
  })
})

test.group('evalWithDefault', (group) => {
  let jexl: Jexl

  group.each.setup(() => {
    jexl = new Jexl()
  })

  test('should return the default value for null', async ({ assert }) => {
    const result = await jexl.evalWithDefault('null', {}, 'default')
    assert.equal(result, 'default')
  })

  test('should return the default value for undefined', async ({ assert }) => {
    const result = await jexl.evalWithDefault('undefined', {}, 'default')
    assert.equal(result, 'default')
  })

  test('should return the original value if it is not null or undefined', async ({ assert }) => {
    assert.equal(await jexl.evalWithDefault('0', {}, 10), 0)
    assert.equal(await jexl.evalWithDefault('""', {}, 'default'), '')
    assert.isFalse(await jexl.evalWithDefault('false', {}, true))
  })
})

test.group('Jexl namespace transforms', (group) => {
  let inst: Jexl

  group.each.setup(() => {
    inst = new Jexl()
  })

  test('should support simple namespace transforms', async ({ assert }) => {
    inst.addTransform('String.upper', (str) => str.toUpperCase())
    const result = await inst.eval('"hello"|String.upper')
    assert.equal(result, 'HELLO')
  })

  test('should support nested namespace transforms', async ({ assert }) => {
    inst.addTransform('Utils.Text.capitalize', (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
    const result = await inst.eval('"hELLO"|Utils.Text.capitalize')
    assert.equal(result, 'Hello')
  })

  test('should support namespace transforms with arguments', async ({ assert }) => {
    inst.addTransform('String.repeat', (str, count) => str.repeat(count))
    const result = await inst.eval('"Hi "|String.repeat(3)')
    assert.equal(result, 'Hi Hi Hi ')
  })

  test('should support chained namespace transforms', async ({ assert }) => {
    inst.addTransform('String.lower', (str) => str.toLowerCase())
    inst.addTransform('String.trim', (str) => str.trim())
    const result = await inst.eval('"  HELLO WORLD  "|String.lower|String.trim')
    assert.equal(result, 'hello world')
  })

  test('should support mix of regular and namespace transforms', async ({ assert }) => {
    inst.addTransform('String.upper', (str) => str.toUpperCase())
    inst.addTransform('reverse', (str) => str.split('').reverse().join(''))
    const result = await inst.eval('"hello"|String.upper|reverse')
    assert.equal(result, 'OLLEH')
  })

  test('should still support regular transforms', async ({ assert }) => {
    inst.addTransform('double', (val) => val * 2)
    const result = await inst.eval('5|double')
    assert.equal(result, 10)
  })

  test('should throw error for undefined namespace transforms', async ({ assert }) => {
    await assert.rejects(
      async () => inst.eval('"test"|Undefined.transform'),
      'Transform Undefined.transform is not defined.'
    )
  })

  test('should support complex expressions with namespace transforms', async ({ assert }) => {
    inst.addTransform('Math.multiply', (val, factor) => val * factor)
    const result = await inst.eval('((5 + 3)|Math.multiply(2)) + " times"')
    assert.equal(result, '16 times')
  })

  test('should support deeply nested namespace transforms', async ({ assert }) => {
    inst.addTransform('Utils.String.Format.title', (str) =>
      str.replace(/\w\S*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
    )
    const result = await inst.eval('"hello world"|Utils.String.Format.title')
    assert.equal(result, 'Hello World')
  })

  test('should support namespace transforms with multiple arguments', async ({ assert }) => {
    inst.addTransform('String.replace', (str, search, replacement) => str.replace(new RegExp(search, 'g'), replacement))
    const result = await inst.eval('"hello world"|String.replace("l", "x")')
    assert.equal(result, 'hexxo worxd')
  })

  test('should support namespace functions alongside namespace transforms', async ({ assert }) => {
    inst.addFunction('Utils.format', (template, value) => template.replace('{value}', value))
    inst.addTransform('String.upper', (str) => str.toUpperCase())
    const result = await inst.eval('("hello"|String.upper) + " " + Utils.format("Result: {value}", "world")')
    assert.equal(result, 'HELLO Result: world')
  })
})
