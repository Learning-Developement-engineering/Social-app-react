import {cleanError, isNetworkError} from '../../src/lib/strings/errors'
jest.mock('@lingui/macro', () => ({
  t: (strs: any) => strs, // simple identity function for testing
}))

describe('cleanError', () => {
  it('returns empty string if input is falsy', () => {
    expect(cleanError(null)).toBe('')
    expect(cleanError(undefined)).toBe('')
    expect(cleanError('')).toBe('')
  })

  it('converts non-string errors to string', () => {
    expect(cleanError(new Error('Error: Abort'))).toContain('Unable to connect')
  })

  it('returns network error message', () => {
    expect(cleanError('Failed to fetch')).toContain('Unable to connect')
    expect(cleanError('Load failed')).toContain('Unable to connect')
  })

  it('returns upstream failure message', () => {
    expect(cleanError('Upstream Failure')).toContain('server appears to be experiencing issues')
    expect(cleanError('NotEnoughResources')).toContain('server appears to be experiencing issues')
    expect(cleanError('pipethrough network error')).toContain('server appears to be experiencing issues')
  })

  it('returns bad token scope message', () => {
    expect(cleanError('Bad token scope')).toContain('App Password')
  })

  it('removes "Error: " prefix', () => {
    expect(cleanError('Error: Something went wrong')).toBe('Something went wrong')
  })

  it('returns unrecognized string as-is', () => {
    expect(cleanError('Some unknown error')).toBe('Some unknown error')
  })
})
describe('isNetworkError', () => {
  const inputs = [
    'TypeError: Network request failed',
    'Uncaught TypeError: Cannot read property x of undefined',
    'Uncaught RangeError',
    'Error: Aborted',
  ]
  const outputs = [true, false, false, true]

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i]
    const output = outputs[i]
    it(`correctly distinguishes network errors for ${input}`, () => {
      expect(isNetworkError(input)).toEqual(output)
    })
  }
})
