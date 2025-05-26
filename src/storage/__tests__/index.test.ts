import {beforeEach, expect, jest, test} from '@jest/globals'

import {Storage} from '#/storage'

<<<<<<< HEAD
// jest.mock('react-native-mmkv', () => ({
//   MMKV: class MMKVMock {
//     _store = new Map()

//     set(key: string, value: unknown) {
//       this._store.set(key, value)
//     }

//     getString(key: string) {
//       return this._store.get(key)
//     }

//     delete(key: string) {
//       return this._store.delete(key)
//     }
    
//   },
// }))

jest.mock('react-native-mmkv', () => {
  return {
    MMKV: class MMKVMock {
      _store = new Map<string, string>()
      _listeners: ((key: string) => void)[] = []

      set(key: string, value: unknown) {
        this._store.set(key, value)
        // Call listeners for the changed key
        this._listeners.forEach(listener => listener(key))
      }

      getString(key: string) {
        return this._store.get(key)
      }

      delete(key: string) {
        const result = this._store.delete(key)
        this._listeners.forEach(listener => listener(key))
        return result
      }

      addOnValueChangedListener(callback: (key: string) => void) {
        this._listeners.push(callback)
        return {
          remove: () => {
            this._listeners = this._listeners.filter(l => l !== callback)
          },
        }
      }
    },
  }
})

=======
jest.mock('react-native-mmkv', () => ({
  MMKV: class MMKVMock {
    _store = new Map()

    set(key: string, value: unknown) {
      this._store.set(key, value)
    }

    getString(key: string) {
      return this._store.get(key)
    }

    delete(key: string) {
      return this._store.delete(key)
    }
  },
}))
>>>>>>> 34dc5eca2ebfd88b2c1a084878e8a88c89866740

type Schema = {
  boo: boolean
  str: string | null
  num: number
  obj: Record<string, unknown>
}

const scope = `account`
const store = new Storage<['account'], Schema>({id: 'test'})

beforeEach(() => {
  store.removeMany([scope], ['boo', 'str', 'num', 'obj'])
})

test(`stores and retrieves data`, () => {
  store.set([scope, 'boo'], true)
  store.set([scope, 'str'], 'string')
  store.set([scope, 'num'], 1)
  expect(store.get([scope, 'boo'])).toEqual(true)
  expect(store.get([scope, 'str'])).toEqual('string')
  expect(store.get([scope, 'num'])).toEqual(1)
})

test(`removes data`, () => {
  store.set([scope, 'boo'], true)
  expect(store.get([scope, 'boo'])).toEqual(true)
  store.remove([scope, 'boo'])
  expect(store.get([scope, 'boo'])).toEqual(undefined)
})

test(`removes multiple keys at once`, () => {
  store.set([scope, 'boo'], true)
  store.set([scope, 'str'], 'string')
  store.set([scope, 'num'], 1)
  store.removeMany([scope], ['boo', 'str', 'num'])
  expect(store.get([scope, 'boo'])).toEqual(undefined)
  expect(store.get([scope, 'str'])).toEqual(undefined)
  expect(store.get([scope, 'num'])).toEqual(undefined)
})

test(`concatenates keys`, () => {
  store.remove([scope, 'str'])
  store.set([scope, 'str'], 'concat')
  // @ts-ignore accessing these properties for testing purposes only
  expect(store.store.getString(`${scope}${store.sep}str`)).toBeTruthy()
})

test(`can store falsy values`, () => {
  store.set([scope, 'str'], null)
  store.set([scope, 'num'], 0)
  expect(store.get([scope, 'str'])).toEqual(null)
  expect(store.get([scope, 'num'])).toEqual(0)
})

test(`can store objects`, () => {
  const obj = {foo: true}
  store.set([scope, 'obj'], obj)
  expect(store.get([scope, 'obj'])).toEqual(obj)
})
<<<<<<< HEAD
test('addOnValueChangedListener triggers callback on change', () => {
  const callback = jest.fn()
  const key = [scope, 'boo']
  const listener = store.addOnValueChangedListener(key, callback)

  // Simulate a change event from MMKV store for the exact key
  store.store._store.set(key.join(store.sep), JSON.stringify({ data: true }))
  // Manually invoke listener's callback
// trigger all listeners manually with the changed key
store.store._listeners.forEach(listener => listener(key.join(store.sep)));


  expect(callback).toHaveBeenCalled()

  // Remove listener and simulate change again
  listener.remove()
  callback.mockClear()
  // trigger all listeners manually with the changed key
store.store._listeners.forEach(listener => listener(key.join(store.sep)));

  expect(callback).not.toHaveBeenCalled()
})
=======
>>>>>>> 34dc5eca2ebfd88b2c1a084878e8a88c89866740
