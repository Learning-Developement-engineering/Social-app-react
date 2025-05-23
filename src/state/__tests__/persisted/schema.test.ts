import {logger} from '#/logger'
import { defaults } from '#/state/persisted'
import { tryParse, tryStringify } from '#/state/persisted/schema'

jest.mock('#/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}))

describe('schema validation', () => {
  describe('tryParse', () => {
    it('parses and validates a correct schema', () => {
      const str = JSON.stringify(defaults)
      const parsed = tryParse(str)
      expect(parsed).toBeDefined()
      expect(parsed?.colorMode).toBe(defaults.colorMode)
    })

    it('returns undefined for invalid JSON', () => {
      const result = tryParse('{bad json}')
      expect(result).toBeUndefined()
      expect(logger.error).toHaveBeenCalledWith(
        'persisted state: failed to parse root state from storage',
        expect.any(Object),
      )
    })

    it('returns undefined for JSON that fails validation', () => {
      const badJson = JSON.stringify({...defaults, colorMode: 'ultra-dark'})
      const result = tryParse(badJson)
      expect(result).toBeUndefined()
      expect(logger.error).toHaveBeenCalledWith(
        'persisted store: data failed validation on read',
        expect.objectContaining({
          errors: expect.any(Array),
        }),
      )
    })
  })

  describe('tryStringify', () => {
    it('returns a string for valid input', () => {
      const result = tryStringify(defaults)
      expect(result).toEqual(JSON.stringify(defaults))
    })

    it('returns undefined for invalid input', () => {
      const invalid = {...defaults, colorMode: 'alien'} // not in enum
      const result = tryStringify(invalid as any)
      expect(result).toBeUndefined()
      expect(logger.error).toHaveBeenCalledWith(
        'persisted state: failed stringifying root state',
        expect.any(Object),
      )
    })
  })

  
})
