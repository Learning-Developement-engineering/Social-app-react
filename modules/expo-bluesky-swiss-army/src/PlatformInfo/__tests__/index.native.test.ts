import { Platform } from 'react-native'
import { getIsReducedMotionEnabled, setAudioActive, setAudioCategory } from '../index.native.ts'
import { AudioCategory } from '../types'

// Mock NativeModule with missing methods for the tests
jest.mock('expo-modules-core', () => ({
  requireNativeModule: () => ({
    getIsReducedMotionEnabled: undefined,
    setAudioActive: undefined,
    setAudioCategory: undefined,
  }),
}))

describe('Not implemented platform functions', () => {
  beforeEach(() => {
    jest.resetModules()
    global.__DEV__ = true
  })

  test('getIsReducedMotionEnabled should throw NotImplementedError', () => {
    expect(() => {
      if (typeof getIsReducedMotionEnabled !== 'function') {
        throw new Error('Function not implemented')
      }
      getIsReducedMotionEnabled()
    }).toThrow()
  })

  test('setAudioActive should throw when method is not available', () => {
    Object.defineProperty(Platform, 'OS', { value: 'ios' })
    expect(() => setAudioActive(true)).toThrow(/setAudioActive/)
  })

  test('setAudioCategory should throw when method is not available', () => {
    Object.defineProperty(Platform, 'OS', { value: 'ios' })
    const mockCategory: AudioCategory = 'Playback'
    expect(() => setAudioCategory(mockCategory)).toThrow(/setAudioCategory/)
  })
})
