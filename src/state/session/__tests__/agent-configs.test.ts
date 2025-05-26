import AsyncStorage from '@react-native-async-storage/async-storage'

import { readLabelers, saveLabelers } from '../agent-config'


jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}))

describe('Labelers AsyncStorage helpers', () => {
  const did = 'user123'
  const key = `agent-labelers:${did}`
  const labels = ['label1', 'label2']

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('saveLabelers stores the JSON stringified value', async () => {
    await saveLabelers(did, labels)
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(labels))
  })

  test('readLabelers returns parsed array when data exists', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(labels))
    const result = await readLabelers(did)
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(key)
    expect(result).toEqual(labels)
  })

  test('readLabelers returns undefined when no data', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)
    const result = await readLabelers(did)
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(key)
    expect(result).toBeUndefined()
  })
})
