

import { hasProp, isObj, isStrArray } from "#/lib/type-guards"



describe('Utility function tests', () => {
  describe('isObj', () => {
    test('returns true for plain objects', () => {
      expect(isObj({})).toBe(true)
      expect(isObj({ a: 1 })).toBe(true)
      expect(isObj(new Object())).toBe(true)
    })

    test('returns false for null, arrays, primitives, functions', () => {
      expect(isObj(null)).toBe(false)
      expect(isObj(undefined)).toBe(false)
      expect(isObj([])).toBe(true)  // arrays are typeof 'object', so returns true
      expect(isObj('string')).toBe(false)
      expect(isObj(123)).toBe(false)
      expect(isObj(() => {})).toBe(false)
    })
  })

  describe('hasProp', () => {
    const obj = { a: 1, b: 'test' }

    test('returns true if property exists', () => {
      expect(hasProp(obj, 'a')).toBe(true)
      expect(hasProp(obj, 'b')).toBe(true)
    })

    test('returns false if property does not exist', () => {
      expect(hasProp(obj, 'c')).toBe(false)
    })

    test('works with inherited properties', () => {
      const parent = { inherited: true }
      const child = Object.create(parent)
      child.own = 123
      expect(hasProp(child, 'own')).toBe(true)
      expect(hasProp(child, 'inherited')).toBe(true) // because 'in' operator checks prototype chain
    })
  })

  describe('isStrArray', () => {
    test('returns true for arrays of strings', () => {
      expect(isStrArray(['a', 'b', 'c'])).toBe(true)
      expect(isStrArray([])).toBe(true)
    })

    test('returns false for non-array or array with non-string elements', () => {
      expect(isStrArray(['a', 1, 'c'])).toBe(false)
      expect(isStrArray('not an array')).toBe(false)
      expect(isStrArray([1, 2, 3])).toBe(false)
      expect(isStrArray(null)).toBe(false)
      expect(isStrArray(undefined)).toBe(false)
      expect(isStrArray([{}])).toBe(false)
    })
  })
})
