import {NotImplementedError} from '../NotImplemented' // adjust the path as needed
import {Platform} from 'react-native'

describe('NotImplementedError', () => {
  const originalDev = __DEV__
    const originalPlatform = Platform.OS
  afterEach(() => {
    global.__DEV__ = originalDev
    Object.defineProperty(Platform, 'OS', {
      value: originalPlatform,
      writable: true,
    })
  })

  test('should include platform and params in message in dev mode', () => {
    global.__DEV__ = true
    Object.defineProperty(Platform, 'OS', {
      value: 'ios',
      writable: true,
    })

    const error = new NotImplementedError({foo: 'bar'})
    expect(error.message).toContain('Not implemented on ios')
    expect(error.message).toContain('"foo":"bar"')
    expect(error.message).toContain('at')
  })

  test('should show generic message in production mode', () => {
     global.__DEV__ = false

    const error = new NotImplementedError({foo: 'bar'})
    expect(error.message).toBe('Not implemented')
  })

  test('should work with no params', () => {
    global.__DEV__ = true
    Object.defineProperty(Platform, 'OS', {
      value: 'android',
      writable: true,
    })

    const error = new NotImplementedError()
    expect(error.message).toContain('Not implemented on android')
    expect(error.message).toContain('{}')
  })
})
