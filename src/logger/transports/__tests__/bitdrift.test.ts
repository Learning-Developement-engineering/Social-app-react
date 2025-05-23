import * as bitdriftLib from '#/logger/bitdrift/lib'
import { LogLevel } from "#/logger/types"
import * as util from '#/logger/util'
import {bitdriftTransport} from '../bitdrift'
jest.mock('#/logger/bitdrift/lib', () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}))

jest.mock('#/logger/util', () => ({
  prepareMetadata: jest.fn(() => ({metaKey: 'metaVal'})),
}))

describe('bitdriftTransport', () => {
  const context = 'test-context'
  const message = 'Hello, world!'
  const metadata = {foo: 'bar'}

  afterEach(() => {
    jest.clearAllMocks()
  })

  it.each([
    [LogLevel.Debug, 'debug'],
    [LogLevel.Info, 'info'],
    [LogLevel.Log, 'info'], // Log maps to info
    [LogLevel.Warn, 'warn'],
    [LogLevel.Error, 'error'],
  ])('logs using %s -> %s', (level, fnName) => {
    bitdriftTransport(level, context, message, metadata)

    expect(bitdriftLib[fnName as keyof typeof bitdriftLib]).toHaveBeenCalledWith(
      message,
      {
        __context__: context,
        metaKey: 'metaVal', // From mocked prepareMetadata
      },
    )

    expect(util.prepareMetadata).toHaveBeenCalledWith(metadata)
  })
})
