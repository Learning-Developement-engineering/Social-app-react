import { emitNetworkConfirmed, emitNetworkLost, emitPostCreated, emitSessionDropped, emitSoftReset, listenNetworkConfirmed, listenNetworkLost, listenPostCreated, listenSessionDropped, listenSoftReset } from "../events"


describe('Event Emitter Utility', () => {
  it('should emit and listen for soft-reset', () => {
    const fn = jest.fn()
    const unlisten = listenSoftReset(fn)

    emitSoftReset()
    expect(fn).toHaveBeenCalledTimes(1)

    emitSoftReset()
    expect(fn).toHaveBeenCalledTimes(2)

    unlisten()
    emitSoftReset()
    expect(fn).toHaveBeenCalledTimes(2) // should not call again
  })

  it('should emit and listen for session-dropped', () => {
    const fn = jest.fn()
    const unlisten = listenSessionDropped(fn)

    emitSessionDropped()
    expect(fn).toHaveBeenCalledTimes(1)

    unlisten()
    emitSessionDropped()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should emit and listen for network-confirmed', () => {
    const fn = jest.fn()
    const unlisten = listenNetworkConfirmed(fn)

    emitNetworkConfirmed()
    expect(fn).toHaveBeenCalledTimes(1)

    unlisten()
    emitNetworkConfirmed()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should emit and listen for network-lost', () => {
    const fn = jest.fn()
    const unlisten = listenNetworkLost(fn)

    emitNetworkLost()
    expect(fn).toHaveBeenCalledTimes(1)

    unlisten()
    emitNetworkLost()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should emit and listen for post-created', () => {
    const fn = jest.fn()
    const unlisten = listenPostCreated(fn)

    emitPostCreated()
    expect(fn).toHaveBeenCalledTimes(1)

    unlisten()
    emitPostCreated()
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
