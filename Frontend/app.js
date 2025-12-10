
import User from './userState.js'
import Auth from './Auth.js'
import UIManager from './UIManager.js'
import ProjectManager from './ProjectManager.js'
import TasksManager from './TasksManager.js'

/*  Make UI / UX using figma so skip for now.
    Backend - 
        1. login/register
            - create token
            - add user to db (users)
        2. add/update/delete projects 
            - add projects to db (projects)
        3. add/update/delete tasks 
            - add tasks to db (tasks)
        4. 
    Database -
        1. Create user blueprint
        2. Create projects blueprint
        3. Create tasks blueprint
    
    Main JS logic -
        1. Emitter
        2. Auth
        3. UI Manager
        4. Projects Manager
        5. Tasks 

        */
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

