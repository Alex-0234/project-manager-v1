
class Emitter {
    constructor() {
        this.listeners = {};
    }
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    emit(event, payload) {
        for (const callback of this.listeners[event]) {
            callback(payload);
        }
    }
    off(event, callback) {
        if (!this.listeners[event]) return; 

        const newListeners = this.listeners[event].filter(cb => cb !== callback);
        this.listeners[event] = newListeners;
    }
    disconnect(event) {
        if (!this.listeners[event]) return;

        delete this.listeners[event];
    }
}
const eventEmitter = new Emitter();
export default eventEmitter;

