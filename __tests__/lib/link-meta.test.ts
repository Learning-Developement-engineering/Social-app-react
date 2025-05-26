<<<<<<< HEAD
// import { getLikelyType, LikelyType } from "#/lib/link-meta/link-meta"
// import { resolveShortLink } from "#/lib/link-meta/resolve-short-link"
// import { logger } from "#/logger"

// jest.mock('#/logger', () => ({
//   logger: {
//     error: jest.fn(),
//   },
// }))

// beforeEach(() => {
//   jest.clearAllMocks()
//   jest.useFakeTimers()
// })

// afterEach(() => {
//   jest.useRealTimers()
// })
// describe('getLikelyType', () => {
//   it('correctly handles non-parsed url', async () => {
//     const output = await getLikelyType('https://example.com')
//     expect(output).toEqual(LikelyType.HTML)
//   })

//   it('handles non-string urls without crashing', async () => {
//     const output = await getLikelyType('123')
//     expect(output).toEqual(LikelyType.Other)
//   })
// })

// describe('resolveShortLink', () => {
//   it('resolves a short link successfully', async () => {
//     const mockUrl = 'https://resolved.com'
//     global.fetch = jest.fn().mockResolvedValue({
//       status: 200,
//       json: async () => ({url: mockUrl}),
//     }) as any

//     const result = await resolveShortLink('https://short.link/abc123')

//     expect(result).toBe(mockUrl)
//     expect(fetch).toHaveBeenCalledTimes(1)
//   })

//   it('returns the short link if fetch fails with non-200 status', async () => {
//     global.fetch = jest.fn().mockResolvedValue({
//       status: 404,
//       json: async () => ({}),
//     }) as any

//     const shortLink = 'https://short.link/abc123'
//     const result = await resolveShortLink(shortLink)

//     expect(result).toBe(shortLink)
//     expect(logger.error).toHaveBeenCalledWith('Failed to resolve short link', {status: 404})
//   })

//   it('returns the short link if fetch throws an error', async () => {
//     global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

//     const shortLink = 'https://short.link/abc123'
//     const result = await resolveShortLink(shortLink)

//     expect(result).toBe(shortLink)
//     expect(logger.error).toHaveBeenCalledWith('Failed to resolve short link', {safeMessage: expect.any(Error)})
//   })

//   it('aborts the request after timeout', async () => {
//     const abortSpy = jest.fn()
//     const signal = {aborted: false, addEventListener: (_: any, cb: any) => cb()} as any

//     global.fetch = jest.fn().mockImplementation(() => {
//       return new Promise((_resolve, reject) => {
//         setTimeout(() => reject(new DOMException('Aborted', 'AbortError')), 2100)
//       })
//     }) as any

//     const shortLink = 'https://short.link/timeout'
//     const promise = resolveShortLink(shortLink)

//     jest.advanceTimersByTime(2100)
//     const result = await promise

//     expect(result).toBe(shortLink)
//     expect(logger.error).toHaveBeenCalledWith('Failed to resolve short link', {safeMessage: expect.any(DOMException)})
//   })
// })
import {getLinkMeta, LikelyType} from '#/lib/link-meta/link-meta'
import {BskyAgent} from '@atproto/api'

jest.mock('#/lib/strings/url-helpers', () => ({
  isBskyAppUrl: jest.fn(),
}))

jest.mock('#/lib/strings/starter-pack', () => ({
  parseStarterPackUri: jest.fn(),
}))

jest.mock('#/lib/strings/embed-player', () => ({
  getGiphyMetaUri: jest.fn(),
}))

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('getLinkMeta - 100% coverage', () => {
  const mockAgent = {
    service: { toString: () => 'https://agent.service/' },
  } as unknown as BskyAgent

  const { isBskyAppUrl } = require('#/lib/strings/url-helpers')
  const { parseStarterPackUri } = require('#/lib/strings/starter-pack')
  const { getGiphyMetaUri } = require('#/lib/strings/embed-player')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns AtpData for BskyApp URL without starter pack', async () => {
    isBskyAppUrl.mockReturnValue(true)
    parseStarterPackUri.mockReturnValue(undefined)

    const result = await getLinkMeta(mockAgent, 'https://bsky.app/profile')
    expect(result).toEqual({
      likelyType: LikelyType.AtpData,
      url: 'https://bsky.app/profile',
    })
  })


  it('rewrites Giphy URL', async () => {
    isBskyAppUrl.mockReturnValue(false)
    getGiphyMetaUri.mockReturnValue('https://giphy.com/meta')

    mockFetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          title: 'Gif Title',
          description: 'Funny gif',
          image: 'img.gif',
          error: '',
        }),
    })

    const result = await getLinkMeta(mockAgent, 'https://giphy.com/somegif')

    expect(result.url).toBe('https://giphy.com/meta')
    expect(result.title).toBe('Gif Title')
    expect(result.image).toBe('img.gif')
    expect(result.description).toBe('Funny gif')
    expect(result.likelyType).toBe(LikelyType.HTML)
  })

  it('handles non-HTML link (e.g. image)', async () => {
    isBskyAppUrl.mockReturnValue(false)
    getGiphyMetaUri.mockReturnValue(null)

    // Force a URL with image extension
    const result = await getLinkMeta(mockAgent, 'https://example.com/image.jpg')
    expect(result.likelyType).toBe(LikelyType.Image)
    expect(result.title).toBeUndefined()
  })

  it('fetch throws error and returns meta with error field', async () => {
    isBskyAppUrl.mockReturnValue(false)
    getGiphyMetaUri.mockReturnValue(null)

    mockFetch.mockRejectedValue(new Error('Fetch failed'))

    const result = await getLinkMeta(mockAgent, 'https://example.com/page.html')
    expect(result.likelyType).toBe(LikelyType.HTML)
    expect(result.error).toContain('Fetch failed')
  })

  it('handles error field in proxy response body', async () => {
    isBskyAppUrl.mockReturnValue(false)
    getGiphyMetaUri.mockReturnValue(null)

    mockFetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          error: 'Proxy failed',
          title: '',
          description: '',
          image: '',
        }),
    })

    const result = await getLinkMeta(mockAgent, 'https://example.com/page.html')
    expect(result.error).toContain('Proxy failed')
  })
})
=======
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
>>>>>>> 34dc5eca2ebfd88b2c1a084878e8a88c89866740
