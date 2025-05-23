import AsyncStorage from '@react-native-async-storage/async-storage'

import * as persisted from  '#/state/persisted'

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}))

jest.mock('#/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}))

jest.mock('#/state/persisted/schema', () => {
  const defaultSchema = {
    theme: 'light',
    account: null,
  }
  return {
    defaults: defaultSchema,
    tryParse: jest.fn((str: string) => JSON.parse(str)),
    tryStringify: jest.fn((obj: any) => JSON.stringify(obj)),
    normalizeData: jest.fn((data) => data),
  }
})

describe('persisted storage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('init', () => {
    it('should initialize with defaults when storage is empty', async () => {
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)
      await persisted.init()
      expect(persisted.get('theme')).toBe('light')
    })

    it('should initialize with stored values', async () => {
      const mockStored = JSON.stringify({theme: 'dark', account: null})
      ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(mockStored)
      await persisted.init()
      expect(persisted.get('theme')).toBe('dark')
    })
  })

  describe('get', () => {
    it('should return correct value from state', () => {
      expect(persisted.get('theme')).toBeDefined()
    })
  })

  describe('write', () => {
    it('should write new values to state and storage', async () => {
      await persisted.write('theme', 'dark')
      expect(AsyncStorage.setItem).toHaveBeenCalled()
      expect(persisted.get('theme')).toBe('dark')
    })
  })

  describe('clearStorage', () => {
    it('should call AsyncStorage.removeItem', async () => {
      await persisted.clearStorage()
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('BSKY_STORAGE')
    })
  })
})
