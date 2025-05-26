// import {getLocales, deviceLocales, deviceLanguageCodes} from './locales'
import * as expoLocalization from 'expo-localization'

import {getLocales } from '../deviceLocales';

jest.mock('expo-localization', () => ({
  getLocales: jest.fn(),
}))

describe('getLocales', () => {
  it('normalizes legacy language codes', () => {
    const mockLocales = [
      { languageCode: 'in', languageTag: 'in-ID' },
      { languageCode: 'iw', languageTag: 'iw-IL' },
      { languageCode: 'ji', languageTag: 'ji-YD' },
    ]

    ;(expoLocalization.getLocales as jest.Mock).mockReturnValue(mockLocales)

    const result = getLocales()
    expect(result.map(l => l.languageCode)).toEqual(['id', 'he', 'yi'])
  })

  it('normalizes Chinese tags', () => {
    const mockLocales = [
      { languageCode: 'zh', languageTag: 'zh-CN' },
      { languageCode: 'zh', languageTag: 'zh-TW' },
      { languageCode: 'zh', languageTag: 'zh-Hans' },
      { languageCode: 'zh', languageTag: 'zh-Hant' },
    ]

    ;(expoLocalization.getLocales as jest.Mock).mockReturnValue(mockLocales)

    const result = getLocales()
    expect(result.map(l => l.languageTag)).toEqual([
      'zh-Hans-CN',
      'zh-Hant-TW',
      'zh-Hans-CN',
      'zh-Hant-TW',
    ])
  })

  it('returns deduplicated deviceLanguageCodes', async () => {
    jest.resetModules()

    jest.doMock('expo-localization', () => ({
        getLocales: () => [
        { languageCode: 'en', languageTag: 'en-US' },
        { languageCode: 'en', languageTag: 'en-GB' },
        { languageCode: 'fr', languageTag: 'fr-FR' },
        ],
    }))

    // Re-import after mock is applied
    const { deviceLanguageCodes } = require('../deviceLocales')

    expect(deviceLanguageCodes).toEqual(['en', 'fr'])
    })

})
