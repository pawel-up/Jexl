import { test } from '@japa/runner'
import { Jexl } from '../../src/Jexl.js'

test.group('Unary and Binary Operators', (group) => {
  let jexl: Jexl
  group.each.setup(() => {
    jexl = new Jexl()
  })

  test('handles unary positive', async ({ assert }) => {
    assert.equal(await jexl.eval('+5'), 5)
    assert.equal(await jexl.eval('+"5"'), 5)
  })

  test('handles unary negative', async ({ assert }) => {
    assert.equal(await jexl.eval('-5'), -5)
    assert.equal(await jexl.eval('-"5"'), -5)
  })

  test('handles unary positive on an undefined variable', async ({ assert }) => {
    assert.isNaN(await jexl.eval('+undef'))
  })

  test('handles unary negative on an undefined variable', async ({ assert }) => {
    assert.isNaN(await jexl.eval('-undef'))
  })

  test('concatenates when right side is undefined', async ({ assert }) => {
    const result = await jexl.eval("'Test: ' + undef")
    assert.equal(result, 'Test: undefined')
  })

  test('concatenates when left side is undefined', async ({ assert }) => {
    const result = await jexl.eval("undef + ' string'")
    assert.equal(result, 'undefined string')
  })

  test('concatenates with an undefined variable and empty string', async ({ assert }) => {
    const result = await jexl.eval("'Test 8: ' + test5 + ''")
    assert.equal(result, 'Test 8: undefined')
  })

  test('handles subtraction with undefined', async ({ assert }) => {
    assert.isNaN(await jexl.eval('5 - undef'))
    assert.isNaN(await jexl.eval('undef - 5'))
  })

  test('handles addition with two operands', async ({ assert }) => {
    assert.equal(await jexl.eval('2 + 3'), 5)
  })

  test('handles subtraction with two operands', async ({ assert }) => {
    assert.equal(await jexl.eval('5 - 2'), 3)
  })

  test('handles subtraction with strings', async ({ assert }) => {
    assert.equal(await jexl.eval("'5' - 2"), 3)
    assert.equal(await jexl.eval("5 - '2'"), 3)
    assert.isNaN(await jexl.eval("'foo' - 'bar'"))
  })
})
