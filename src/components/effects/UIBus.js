// the UI Bus is an event emitter that UI components subscribe to for various visual effects
// the UI bus is also a context, being able to be called anywhere
// It uses an observer pattern to minimize code complexity
export class UIBus{
    constructor() {
        this.listeners = {}
    }

    subscribe(type, callback) {
        if(!this.listeners[type]) this.listeners[type] = []
        this.listeners[type].push(callback)
    }

    emit(type, payload) {
        if(!this.listeners[type]) returnthis.listeners[type].forEach(cb => cb(payload))
    }
}