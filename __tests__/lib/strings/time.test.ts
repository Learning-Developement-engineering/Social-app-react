import { type I18n } from '@lingui/core'

import { getAge, getDateAgo, niceDate, simpleAreDatesEqual } from '#/lib/strings/time'

// import { niceDate, getAge, getDateAgo, simpleAreDatesEqual } from '.#/lib/strings/time'

// Mock I18n.date function to simplify testing
const mockI18n: I18n  = {
  date: jest.fn((date: Date, opts: any) => {
    // For test, just return a fixed formatted string based on date input
    return date.toISOString() + ` (${opts.dateStyle}, ${opts.timeStyle})`
  }),
} as any

describe('Date Utilities', () => {
  describe('niceDate', () => {
    it('should format the date using i18n.date with correct options', () => {
      const dateInput = new Date('2023-01-15T10:30:00Z')
      const result = niceDate(mockI18n, dateInput)

      expect(mockI18n.date).toHaveBeenCalledWith(dateInput, {
        dateStyle: 'long',
        timeStyle: 'short',
      })
      expect(result).toBe(dateInput.toISOString() + ' (long, short)')
    })

    it('should accept string and number dates', () => {
      const dateStr = '2022-05-20T12:00:00Z'
      const dateNum = new Date(dateStr).getTime()

      expect(niceDate(mockI18n, dateStr)).toContain('2022-05-20T12:00:00')
      expect(niceDate(mockI18n, dateNum)).toContain('2022-05-20T12:00:00')
    })
  })

  describe('getAge', () => {
    it('should return correct age based on birthDate', () => {
      const today = new Date()
      const birthDate = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate())
      expect(getAge(birthDate)).toBe(30)
    })

    it('should subtract 1 if birthday has not occurred yet this year', () => {
      const today = new Date()
      const birthDate = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate() + 1)
      expect(getAge(birthDate)).toBe(29)
    })
  })

  describe('getDateAgo', () => {
    it('should return a date exactly N years ago', () => {
      const now = new Date()
      const yearsAgo = 5
      const result = getDateAgo(yearsAgo)

      expect(result.getFullYear()).toBe(now.getFullYear() - yearsAgo)
      expect(result.getMonth()).toBe(now.getMonth())
      expect(result.getDate()).toBe(now.getDate())
    })
  })

  describe('simpleAreDatesEqual', () => {
    it('should return true for same year, month, and day', () => {
      const d1 = new Date(2023, 4, 15, 10, 30)
      const d2 = new Date(2023, 4, 15, 22, 45)
      expect(simpleAreDatesEqual(d1, d2)).toBe(true)
    })

    it('should return false if year differs', () => {
      const d1 = new Date(2023, 4, 15)
      const d2 = new Date(2022, 4, 15)
      expect(simpleAreDatesEqual(d1, d2)).toBe(false)
    })

    it('should return false if month differs', () => {
      const d1 = new Date(2023, 4, 15)
      const d2 = new Date(2023, 3, 15)
      expect(simpleAreDatesEqual(d1, d2)).toBe(false)
    })

    it('should return false if day differs', () => {
      const d1 = new Date(2023, 4, 15)
      const d2 = new Date(2023, 4, 14)
      expect(simpleAreDatesEqual(d1, d2)).toBe(false)
    })
  })
})
