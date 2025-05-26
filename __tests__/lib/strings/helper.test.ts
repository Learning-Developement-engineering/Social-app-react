// import { renderHook, act } from '@testing-library/react-hooks' import { enforceLen, useEnforceMaxGraphemeCount, useWarnMaxGraphemeCount, toHashCode, countLines, augmentSearchQuery, } from '../../src/lib/strings/utils'

import { act, renderHook } from "@testing-library/react-native"

import { augmentSearchQuery, countLines, enforceLen, toHashCode, useEnforceMaxGraphemeCount, useWarnMaxGraphemeCount } from "#/lib/strings/helpers"

describe('enforceLen', () => {
  it('returns string if shorter than limit', () => {
    expect(enforceLen('short', 10)).toBe('short')
  })

  it('truncates without ellipsis', () => {
    expect(enforceLen('1234567890', 5)).toBe('12345')
  })

  it('truncates with ellipsis (end)', () => {
    expect(enforceLen('1234567890', 5, true)).toBe('12345…')
  })

  it('truncates with ellipsis (middle)', () => {
    expect(enforceLen('abcdefghij', 6, true, 'middle')).toBe('abc…hij')
  })

  it('falls back on unknown mode', () => {
    expect(enforceLen('1234567890', 5, true, 'unknown' as any)).toBe('12345')
  })

  it('handles empty or undefined string', () => {
    expect(enforceLen(undefined as any, 5)).toBe('')
  })
})

describe('useEnforceMaxGraphemeCount', () => {
  it('limits text to grapheme count', () => {
    const { result } = renderHook(() => useEnforceMaxGraphemeCount())
    act(() => {
      const text = '👍👍👍'
      expect(result.current(text, 2)).toBe('👍👍')
      expect(result.current('abc', 5)).toBe('abc')
    })
  })
})

describe('useWarnMaxGraphemeCount', () => {
  it('warns if grapheme count is over max', () => {
    const { result, rerender } = renderHook(
      ({ text, maxCount }) => useWarnMaxGraphemeCount({ text, maxCount }),
      { initialProps: { text: '👍👍👍', maxCount: 2 } }
    )
    expect(result.current).toBe(true)
    rerender({ text: 'ok', maxCount: 10 })
    expect(result.current).toBe(false)
  })
})

describe('toHashCode', () => {
  it('generates consistent hash', () => {
    const hash1 = toHashCode('hello')
    const hash2 = toHashCode('hello')
    expect(hash1).toBe(hash2)
  })

  it('generates different hash for different strings', () => {
    expect(toHashCode('hello')).not.toBe(toHashCode('world'))
  })

  it('supports seed', () => {
    expect(toHashCode('hello', 1234)).not.toBe(toHashCode('hello', 4321))
  })
})

describe('countLines', () => {
  it('counts newlines in string', () => {
    expect(countLines('one\ntwo\nthree')).toBe(2)
    expect(countLines('no newlines')).toBe(0)
  })

  it('returns 0 for undefined', () => {
    expect(countLines(undefined)).toBe(0)
  })
})

describe('augmentSearchQuery', () => {
  it('replaces from:me outside quotes', () => {
    const query = 'from:me hello "from:me is not replaced"'
    const result = augmentSearchQuery(query, { did: 'did:example:123' })
    expect(result).toBe('did:example:123 hello "from:me is not replaced"')
  })

  it('returns same query if no DID', () => {
    const query = 'from:me test'
    expect(augmentSearchQuery(query, { did: undefined })).toBe(query)
  })

  it('handles empty string', () => {
    expect(augmentSearchQuery('', { did: 'did:xyz' })).toBe('')
  })
})
