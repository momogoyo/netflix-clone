const events = {}

export default {
  on (channel, listener) {
    if (typeof events[channel] !== 'object') {
      events[channel] = []
    }
    events[channel].push(listener)
    return () => this.removeListener(event, listener)
  },
  emit (channel, ...args) {
    if (typeof events[channel] === 'object') {
      const listeners = events[channel].slice()
      for (const listener of listeners) {
        listener.apply(this, args)
      }
    }
  }
}
