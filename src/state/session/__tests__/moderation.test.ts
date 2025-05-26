// __tests__/moderation-config.test.ts
jest.mock('@atproto/api', () => ({
  BskyAgent: {
    configure: jest.fn(),
  },
  BSKY_LABELER_DID: 'did:plc:defaultlabeler',
}))

jest.mock('#/lib/constants', () => ({
  IS_TEST_USER: jest.fn(),
}))

jest.mock('../agent-config', () => ({
  readLabelers: jest.fn(),
}))

jest.mock('../additional-moderation-authorities', () => ({
  configureAdditionalModerationAuthorities: jest.fn(),
}))

import {BskyAgent} from '@atproto/api'

import {IS_TEST_USER} from '#/lib/constants'
import {readLabelers} from '../agent-config'
import { configureModerationForAccount, configureModerationForGuest } from '../moderation'
import { configureAdditionalModerationAuthorities } from '../additional-moderation-authorities'


describe('Moderation Config', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('configureModerationForGuest calls switchToBskyAppLabeler and additional moderation', () => {
    configureModerationForGuest()

    expect(BskyAgent.configure).toHaveBeenCalledWith({
      appLabelers: ['did:plc:defaultlabeler'],
    })
    expect(configureAdditionalModerationAuthorities).toHaveBeenCalled()
  })

  it('configureModerationForAccount configures labelers and moderation authorities', async () => {
    const agent = {
      configureLabelersHeader: jest.fn(),
      resolveHandle: jest.fn().mockResolvedValue({
        data: {did: 'did:plc:testmod'},
      }),
    }
    const account = {
      did: 'did:plc:user123',
      handle: 'test.user',
    }
    IS_TEST_USER.mockReturnValue(true)
    readLabelers.mockResolvedValue([
      'did:plc:otherlabeler',
      'did:plc:defaultlabeler',
    ])

    await configureModerationForAccount(agent as any, account)

    expect(BskyAgent.configure).toHaveBeenCalledWith({
      appLabelers: ['did:plc:testmod'],
    })
    expect(agent.configureLabelersHeader).toHaveBeenCalledWith([
      'did:plc:otherlabeler',
    ])
    expect(configureAdditionalModerationAuthorities).toHaveBeenCalled()
  })

  it('configureModerationForAccount skips test labeler if not test user', async () => {
    const agent = {
      configureLabelersHeader: jest.fn(),
      resolveHandle: jest.fn(),
    }
    const account = {
      did: 'did:plc:user123',
      handle: 'regular.user',
    }
    IS_TEST_USER.mockReturnValue(false)
    readLabelers.mockResolvedValue([])

    await configureModerationForAccount(agent as any, account)

    expect(agent.resolveHandle).not.toHaveBeenCalled()
    expect(agent.configureLabelersHeader).toHaveBeenCalledWith([])
    expect(configureAdditionalModerationAuthorities).toHaveBeenCalled()
  })
})
