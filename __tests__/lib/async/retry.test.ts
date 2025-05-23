import { networkRetry, retry } from '#/lib/async/retry'
import { isNetworkError } from '#/lib/strings/errors'
// import { retry, networkRetry } from './yourRetryFile'

// Mock isNetworkError
jest.mock('#/lib/strings/errors', () => ({
  isNetworkError: jest.fn(),
}))

describe('retry utility', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return result if function succeeds on first try', async () => {
    const fn = jest.fn().mockResolvedValue('success')
    const result = await retry(3, () => true, fn)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(result).toBe('success')
  })

  it('should retry if cond returns true on failure', async () => {
    const error = new Error('Temporary error')
    const fn = jest
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce('recovered')
    const cond = jest.fn().mockReturnValue(true)

    const result = await retry(2, cond, fn)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(cond).toHaveBeenCalledWith(error)
    expect(result).toBe('recovered')
  })

  it('should throw if cond returns false', async () => {
    const error = new Error('Fatal error')
    const fn = jest.fn().mockRejectedValue(error)
    const cond = jest.fn().mockReturnValue(false)

    await expect(retry(3, cond, fn)).rejects.toThrow('Fatal error')
    expect(fn).toHaveBeenCalledTimes(1)
    expect(cond).toHaveBeenCalledWith(error)
  })

  it('should throw last error if all retries exhausted', async () => {
    const error = new Error('Persistent error')
    const fn = jest.fn().mockRejectedValue(error)
    const cond = jest.fn().mockReturnValue(true)

    await expect(retry(2, cond, fn)).rejects.toThrow('Persistent error')
    expect(fn).toHaveBeenCalledTimes(2)
    expect(cond).toHaveBeenCalledTimes(2)
  })

  it('networkRetry should delegate to retry with isNetworkError', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('Network'))
      .mockResolvedValueOnce('done')
    ;(isNetworkError as jest.Mock).mockReturnValue(true)

    const result = await networkRetry(2, fn)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(result).toBe('done')
    expect(isNetworkError).toHaveBeenCalled()
  })
})
