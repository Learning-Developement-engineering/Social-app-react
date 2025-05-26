// adjust the path

import { getIsReducedMotionEnabled, setAudioActive, setAudioCategory } from '../index.ts'
import {NotImplementedError} from '../../NotImplemented'
import {AudioCategory} from '../types' // adjust path as needed


describe('Not implemented platform functions', () => {
  const originalDev = global.__DEV__

  afterEach(() => {
    global.__DEV__ = originalDev
  })

  test('getIsReducedMotionEnabled should throw NotImplementedError', () => {
    global.__DEV__ = true
    expect(() => getIsReducedMotionEnabled()).toThrow(NotImplementedError)
    expect(() => getIsReducedMotionEnabled()).toThrow('Not implemented')
  })

  test('setAudioActive should throw NotImplementedError with params', () => {
    global.__DEV__ = true
    expect(() => setAudioActive(true)).toThrow(NotImplementedError)
    expect(() => setAudioActive(true)).toThrow(/"active":true/)
  })

  test('setAudioCategory should throw NotImplementedError with audioCategory param', () => {
    global.__DEV__ = true
    const mockCategory: AudioCategory = 'Playback' // Replace with actual valid enum/string
    expect(() => setAudioCategory(mockCategory)).toThrow(NotImplementedError)
    expect(() => setAudioCategory(mockCategory)).toThrow(
      new RegExp(`"audioCategory":"${mockCategory}"`),
    )
  })
})
