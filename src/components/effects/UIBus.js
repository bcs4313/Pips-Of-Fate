// the UI Bus is an event emitter that UI components subscribe to for various visual effects
// the UI bus is also a context, being able to be called anywhere
// It uses an observer pattern to minimize code complexity
export class UIBus{
    constructor() {
        this.listeners = {}
    }

    // localIdentity is used 
    subscribe(event_name, callback) {
        if(!this.listeners[event_name]) this.listeners[event_name] = []
        this.listeners[event_name].push(callback)
    }

    unsubscribe(event_name, callback) {
        this.listeners[event_name] = this.listeners[event_name].filter((func) => {
            return func !== callback
        })
    }

    emit(event_name, event_arguments) {
        if(!this.listeners[event_name]) return
        this.listeners[event_name].forEach(cb => cb(event_arguments))
    }
}