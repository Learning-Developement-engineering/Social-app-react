import { getLikelyType, LikelyType } from "#/lib/link-meta/link-meta"
import { resolveShortLink } from "#/lib/link-meta/resolve-short-link"
import { logger } from "#/logger"

jest.mock('#/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}))

beforeEach(() => {
  jest.clearAllMocks()
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})
describe('getLikelyType', () => {
  it('correctly handles non-parsed url', async () => {
    const output = await getLikelyType('https://example.com')
    expect(output).toEqual(LikelyType.HTML)
  })

  it('handles non-string urls without crashing', async () => {
    const output = await getLikelyType('123')
    expect(output).toEqual(LikelyType.Other)
  })
})

describe('resolveShortLink', () => {
  it('resolves a short link successfully', async () => {
    const mockUrl = 'https://resolved.com'
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: async () => ({url: mockUrl}),
    }) as any

    const result = await resolveShortLink('https://short.link/abc123')

    expect(result).toBe(mockUrl)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('returns the short link if fetch fails with non-200 status', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 404,
      json: async () => ({}),
    }) as any

    const shortLink = 'https://short.link/abc123'
    const result = await resolveShortLink(shortLink)

    expect(result).toBe(shortLink)
    expect(logger.error).toHaveBeenCalledWith('Failed to resolve short link', {status: 404})
  })

  it('returns the short link if fetch throws an error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

    const shortLink = 'https://short.link/abc123'
    const result = await resolveShortLink(shortLink)

    expect(result).toBe(shortLink)
    expect(logger.error).toHaveBeenCalledWith('Failed to resolve short link', {safeMessage: expect.any(Error)})
  })

  it('aborts the request after timeout', async () => {
    const abortSpy = jest.fn()
    const signal = {aborted: false, addEventListener: (_: any, cb: any) => cb()} as any

    global.fetch = jest.fn().mockImplementation(() => {
      return new Promise((_resolve, reject) => {
        setTimeout(() => reject(new DOMException('Aborted', 'AbortError')), 2100)
      })
    }) as any

    const shortLink = 'https://short.link/timeout'
    const promise = resolveShortLink(shortLink)

    jest.advanceTimersByTime(2100)
    const result = await promise

    expect(result).toBe(shortLink)
    expect(logger.error).toHaveBeenCalledWith('Failed to resolve short link', {safeMessage: expect.any(DOMException)})
  })
})