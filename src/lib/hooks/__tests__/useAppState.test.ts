import {AppState} from 'react-native'
import { act, renderHook } from '@testing-library/react-native'

import { useAppState } from '../useAppState'

describe('useAppState', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('initializes with AppState.currentState', () => {
    (AppState.currentState as string) = 'active'
    const {result} = renderHook(() => useAppState())
    expect(result.current).toBe('active')
  })

  it('updates state when AppState changes', () => {
    let callback: (state: string) => void = () => {}

    const removeMock = jest.fn()
    jest.spyOn(AppState, 'addEventListener').mockImplementation((event, cb) => {
      if (event === 'change') {
        callback = cb as (state: string) => void
        return {remove: removeMock}
      }
      return {remove: removeMock}
    })

    const {result, unmount} = renderHook(() => useAppState())
    expect(result.current).toBe(AppState.currentState)

    act(() => {
      callback('background')
    })
    expect(result.current).toBe('background')

    act(() => {
      callback('inactive')
    })
    expect(result.current).toBe('inactive')

    unmount()
    expect(removeMock).toHaveBeenCalled()
  })
})
