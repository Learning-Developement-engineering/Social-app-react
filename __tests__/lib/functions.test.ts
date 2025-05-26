import { choose, dedupArray, isPlainArray, replaceEqualDeep } from "#/lib/functions";
import { isPlainObject } from "#/lib/functions";

// import { choose, dedupArray, replaceEqualDeep, isPlainArray, isPlainObject, } from './functions';
describe('choose', () => {
    it('returns value for existing key', () => {
        const choices = { a: 1, b: 2 }
        expect(choose('a', choices)).toBe(1)
        expect(choose('b', choices)).toBe(2)
    })
})

describe('dedupArray', () => {
    it('removes duplicates', () => {
        expect(dedupArray([1, 2, 2, 3, 1])).toEqual([1, 2, 3])
        expect(dedupArray(['a', 'b', 'a'])).toEqual(['a', 'b'])
    })
    
    it('returns empty array for empty input', () => {
        expect(dedupArray([])).toEqual([])
    })
})

describe('replaceEqualDeep', () => {
  it('returns a if a and b are strictly equal', () => {
    const a = { x: 1 }
    expect(replaceEqualDeep(a, a)).toBe(a)
  })

  it('returns a if a and b are deeply equal', () => {
    const a = { x: 1 }
    const b = { x: 1 }
    expect(replaceEqualDeep(a, b)).toBe(a)
  })

  it('returns b if a and b are different types', () => {
    expect(replaceEqualDeep(1, 2)).toBe(2)
    expect(replaceEqualDeep([1], { x: 1 })).toEqual({ x: 1 }) // This will fail, so let's fix below:
  })

  it('returns a if a and b are equal Dates', () => {
    const date1 = new Date(2020, 1, 1)
    const date2 = new Date(2020, 1, 1)
    expect(replaceEqualDeep(date1, date2)).toBe(date1)
  })

  it('returns b if a and b are different Dates', () => {
    const date1 = new Date(2020, 1, 1)
    const date2 = new Date(2021, 1, 1)
    expect(replaceEqualDeep(date1, date2)).toBe(date2)
  })
})

describe('isPlainArray', () => {
  it('returns true for plain arrays', () => {
    expect(isPlainArray([1, 2, 3])).toBe(true)
  })

  it('returns false for arrays with extra properties', () => {
    const arr: any = [1, 2, 3]
    arr.foo = 'bar'
    expect(isPlainArray(arr)).toBe(false)
  })

  it('returns false for non-arrays', () => {
    expect(isPlainArray({})).toBe(false)
    expect(isPlainArray(null)).toBe(false)
  })
})

describe('isPlainObject', () => {
  it('returns true for plain objects', () => {
    expect(isPlainObject({})).toBe(true)
    expect(isPlainObject({ a: 1 })).toBe(true)
  })

  it('returns false for non-objects', () => {
    expect(isPlainObject(null)).toBe(false)
    expect(isPlainObject(undefined)).toBe(false)
    expect(isPlainObject(123)).toBe(false)
    expect(isPlainObject('string')).toBe(false)
  })

  it('returns true for objects created with Object.create(proto)', () => {
    const proto = { foo: 'bar' }
    const objWithModifiedProto = Object.create(proto)
    expect(isPlainObject(objWithModifiedProto)).toBe(true)
  })

  it('returns true for objects with no constructor', () => {
    const obj = Object.create(null)
    expect(isPlainObject(obj)).toBe(true)
  })

  it('returns false for instances of classes', () => {
    class Foo {}
    const instance = new Foo()
    expect(isPlainObject(instance)).toBe(false)
  })

  it('returns false for Date objects', () => {
    expect(isPlainObject(new Date())).toBe(false)
  })
})
