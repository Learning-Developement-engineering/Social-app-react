
import * as persisted from '#/state/persisted'
import { isOnboardingActive } from '../onboarding'
import { logger } from '#/logger'
import { simpleAreDatesEqual } from '#/lib/strings/time'
import { shouldRequestEmailConfirmation, snoozeEmailConfirmationPrompt } from '../reminders'

jest.mock('#/state/persisted')
jest.mock('../onboarding')
jest.mock('#/logger')
jest.mock('#/lib/strings/time')

describe('Email Confirmation Reminder', () => {
  const mockPersistedGet = persisted.get as jest.Mock
  const mockPersistedWrite = persisted.write as jest.Mock
  const mockIsOnboardingActive = isOnboardingActive as jest.Mock
  const mockLoggerDebug = logger.debug as jest.Mock
  const mockSimpleAreDatesEqual = simpleAreDatesEqual as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('shouldRequestEmailConfirmation', () => {
    it('returns false if no account', () => {
      expect(shouldRequestEmailConfirmation(null)).toBe(false)
      expect(shouldRequestEmailConfirmation(undefined)).toBe(false)
    })

    it('returns false if email is already confirmed', () => {
      const account = { emailConfirmed: true }
      expect(shouldRequestEmailConfirmation(account as any)).toBe(false)
    })

    it('returns false if onboarding is active', () => {
      mockIsOnboardingActive.mockReturnValue(true)
      const account = { emailConfirmed: false }
      expect(shouldRequestEmailConfirmation(account as any)).toBe(false)
      expect(mockIsOnboardingActive).toHaveBeenCalled()
    })

    it('returns true if never snoozed before', () => {
      mockIsOnboardingActive.mockReturnValue(false)
      mockPersistedGet.mockReturnValueOnce({ lastEmailConfirm: undefined })
      const account = { emailConfirmed: false }
      expect(shouldRequestEmailConfirmation(account as any)).toBe(true)
      expect(mockLoggerDebug).toHaveBeenCalled()
    })

    it('returns false if snoozed today', () => {
      mockIsOnboardingActive.mockReturnValue(false)
      const now = new Date()
      mockPersistedGet.mockReturnValueOnce({ lastEmailConfirm: now.toISOString() })
      mockSimpleAreDatesEqual.mockReturnValue(true)
      const account = { emailConfirmed: false }
      expect(shouldRequestEmailConfirmation(account as any)).toBe(false)
      expect(mockSimpleAreDatesEqual).toHaveBeenCalled()
      expect(mockLoggerDebug).toHaveBeenCalled()
    })

    it('returns true if snoozed on a different day', () => {
      mockIsOnboardingActive.mockReturnValue(false)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      mockPersistedGet.mockReturnValueOnce({ lastEmailConfirm: yesterday })
      mockSimpleAreDatesEqual.mockReturnValue(false)
      const account = { emailConfirmed: false }
      expect(shouldRequestEmailConfirmation(account as any)).toBe(true)
      expect(mockSimpleAreDatesEqual).toHaveBeenCalled()
      expect(mockLoggerDebug).toHaveBeenCalled()
    })
  })

  describe('snoozeEmailConfirmationPrompt', () => {
    it('writes current ISO date string to persisted reminders', () => {
      const currentReminders = { lastEmailConfirm: 'old-date' }
      mockPersistedGet.mockReturnValue(currentReminders)

      const spyDateToISOString = jest.spyOn(Date.prototype, 'toISOString')
      spyDateToISOString.mockReturnValue('2025-05-26T12:34:56.789Z')

      snoozeEmailConfirmationPrompt()

      expect(mockLoggerDebug).toHaveBeenCalledWith(
        'Snoozing email confirmation reminder',
        { snoozedAt: '2025-05-26T12:34:56.789Z' },
      )

      expect(mockPersistedWrite).toHaveBeenCalledWith('reminders', {
        ...currentReminders,
        lastEmailConfirm: '2025-05-26T12:34:56.789Z',
      })

      spyDateToISOString.mockRestore()
    })
  })
})
