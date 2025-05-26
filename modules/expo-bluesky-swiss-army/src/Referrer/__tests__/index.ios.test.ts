 // adjust path as needed
import { NotImplementedError } from '../../NotImplemented'
import { getGooglePlayReferrerInfoAsync, getReferrerInfo } from '../index.ios'

jest.mock('../../../index', () => ({
  SharedPrefs: {
    getString: jest.fn(),
    removeValue: jest.fn(),
  },
}))

const { SharedPrefs } = require('../../../index')

describe('getGooglePlayReferrerInfoAsync', () => {
  test('should throw NotImplementedError', () => {
    expect(() => getGooglePlayReferrerInfoAsync()).toThrow(NotImplementedError)
  })
})

describe('getReferrerInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns parsed URL when referrer is valid URL string', () => {
    SharedPrefs.getString.mockImplementation((key: string) =>
      key === 'referrer' ? 'https://example.com/?utm_source=test' : null
    )

    const result = getReferrerInfo()
    expect(result).toEqual({
      referrer: 'https://example.com/?utm_source=test',
      hostname: 'example.com',
    })
    expect(SharedPrefs.removeValue).toHaveBeenCalledWith('referrer')
  })

  test('returns fallback hostname when referrer is not a URL', () => {
    SharedPrefs.getString.mockImplementation((key: string) =>
      key === 'referrer' ? 'not-a-url' : null
    )

    const result = getReferrerInfo()
    expect(result).toEqual({
      referrer: 'not-a-url',
      hostname: 'not-a-url',
    })
    expect(SharedPrefs.removeValue).toHaveBeenCalledWith('referrer')
  })

  test('returns referrerApp if referrer is missing', () => {
    SharedPrefs.getString.mockImplementation((key: string) =>
      key === 'referrerApp' ? 'com.example.app' : null
    )

    const result = getReferrerInfo()
    expect(result).toEqual({
      referrer: 'com.example.app',
      hostname: 'com.example.app',
    })
    expect(SharedPrefs.removeValue).toHaveBeenCalledWith('referrerApp')
  })

  test('returns null if both referrer and referrerApp are missing', () => {
    SharedPrefs.getString.mockReturnValue(null)

    const result = getReferrerInfo()
    expect(result).toBeNull()
    expect(SharedPrefs.removeValue).not.toHaveBeenCalled()
  })
})
