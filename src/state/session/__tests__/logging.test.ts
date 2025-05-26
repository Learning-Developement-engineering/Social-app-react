// Place this at the top of the test file before any imports
jest.mock('statsig-react-native-expo', () => ({
  Statsig: {
    initializeCalled: jest.fn(),
    getStableID: jest.fn(),
    logEvent: jest.fn(),
    checkGate: jest.fn(),
  },
}))

import {type AtpSessionEvent} from '@atproto/api'
import {Statsig} from 'statsig-react-native-expo'

import {addSessionDebugLog,addSessionErrorLog, wrapSessionReducerForLogging} from '../logging'

describe('Session Logging', () => {
  const mockReducer = jest.fn((state, action) => ({
    ...state,
    count: state.count + 1,
  }))
  const initialState = {count: 0}
  const action = {type: 'INCREMENT'}

  beforeEach(() => {
    jest.clearAllMocks()
    Statsig.initializeCalled.mockReturnValue(true)
    Statsig.getStableID.mockReturnValue('mock-stable-id')
  })

  test('wrapSessionReducerForLogging should call reducer and log debug', () => {
    const wrapped = wrapSessionReducerForLogging(mockReducer)
    const newState = wrapped(initialState, action)

    expect(mockReducer).toHaveBeenCalledWith(initialState, action)
    expect(newState.count).toBe(1)
    expect(Statsig.logEvent).toHaveBeenCalledWith(
      'session:debug',
      null,
      expect.objectContaining({
        messageType: 'reducer:call',
        sliceIndex: '0',
      })
    )
  })

  test('addSessionErrorLog should log session error when initialized', () => {
    const event: AtpSessionEvent = {
      op: 'create',
      did: 'did:example:abc123',
      handle: 'alice.test',
    }
    addSessionErrorLog('did:example:abc123', event)

    expect(Statsig.logEvent).toHaveBeenCalledWith(
      'session:error',
      null,
      expect.objectContaining({
        did: 'did:example:abc123',
        event,
        stack: expect.any(String),
      })
    )
  })

  test('addSessionDebugLog slices large logs', () => {
    const longData = 'x'.repeat(3000) // > 3x MAX_SLICE_LENGTH
    addSessionDebugLog({
      type: 'persisted:broadcast',
      data: {
        sessionKey: longData,
      } as any,
    })

    expect(Statsig.logEvent.mock.calls[0][2].slice.length).toBeLessThanOrEqual(1000)
  })
})
