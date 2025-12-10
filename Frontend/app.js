
import User from './userState.js'
import Auth from './Auth.js'
import UIManager from './UIManager.js'
import ProjectManager from './ProjectManager.js'
import TasksManager from './TasksManager.js'

document.addEventListener('DOMContentLoaded', () => {
    const events = new Emitter();
    
    const projectManager = new ProjectManager(events);
    const UI = new UIManager(events);
    const Authentication = new Auth(events);
    
    const menu = document.querySelector('.menu-icon');
    menu.addEventListener('click', ()=> {
        events.emit('UI:mobile:project:list');
    })

    Authentication.checkLoginStatus();

})


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

