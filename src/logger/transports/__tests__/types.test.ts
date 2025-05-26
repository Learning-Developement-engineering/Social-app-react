import { LogContext, LogLevel } from "#/logger/types"



describe('LogContext enum', () => {
  it('should have expected context values', () => {
    expect(LogContext.Default).toBe('logger')
    expect(LogContext.Session).toBe('session')
    expect(LogContext.Notifications).toBe('notifications')
    expect(LogContext.ConversationAgent).toBe('conversation-agent')
    expect(LogContext.DMsAgent).toBe('dms-agent')
    expect(LogContext.ReportDialog).toBe('report-dialog')
    expect(LogContext.Metric).toBe('metric')
  })
})

describe('LogLevel enum', () => {
  it('should have expected log level values', () => {
    expect(LogLevel.Debug).toBe('debug')
    expect(LogLevel.Info).toBe('info')
    expect(LogLevel.Log).toBe('log')
    expect(LogLevel.Warn).toBe('warn')
    expect(LogLevel.Error).toBe('error')
  })
})
