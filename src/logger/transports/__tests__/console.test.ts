import {LogLevel} from '#/logger/types'
import { consoleTransport } from '../console'

jest.mock('#/logger/util', () => ({
  prepareMetadata: jest.fn(() => ({prepared: true})),
}))
jest.mock('#/platform/detection', () => ({ isWeb: true }))

const originalConsole = { ...console }
beforeEach(() => {
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    error: jest.fn(),
    groupCollapsed: jest.fn(),
    groupEnd: jest.fn(),
  }
})

afterEach(() => {
  jest.clearAllMocks()
  global.console = originalConsole
})

const fakeTimestamp = new Date('2025-01-01T12:00:00Z')

describe('consoleTransport (web)', () => {
  // Remove spyOn here, rely on jest.mock
  // beforeEach(() => {
  //   jest.spyOn(detection, 'isWeb', 'get').mockReturnValue(true)
  // })

  it('logs message without metadata', () => {
    consoleTransport(LogLevel.Info, 'Ctx', 'Hello', {}, fakeTimestamp)

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Hello'))
  })

  it('logs message with metadata', () => {
    consoleTransport(LogLevel.Info, 'Ctx', 'Hello', {foo: 'bar'}, fakeTimestamp)

    expect(console.groupCollapsed).toHaveBeenCalledWith(expect.stringContaining('Hello'))
    expect(console.log).toHaveBeenCalledWith({foo: 'bar'})
    expect(console.groupEnd).toHaveBeenCalled()
  })

  it('logs error stack trace', () => {
    const err = new Error('Boom')
    consoleTransport(LogLevel.Error, 'Ctx', err, {}, fakeTimestamp)

    expect(console.error).toHaveBeenCalledWith(err)
  })
})
