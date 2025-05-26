// __tests__/sentry-export.test.ts

import * as sentryRN from '@sentry/react-native'

import { Sentry } from ".."
// We assume that your re-export is in a file named sentryExport.ts

describe('Sentry re-export', () => {
  it('should export Sentry from @sentry/react-native', () => {
    // Verify that the Sentry object from our re-export equals the original module.
    expect(Sentry).toEqual(sentryRN)
  })

  it('should have expected Sentry properties', () => {
    // For instance, test that captureException is a function.
    expect(typeof Sentry.captureException).toBe('function')
    // You can add other properties if needed, e.g.:
    // expect(typeof Sentry.init).toBe('function')
  })
})
