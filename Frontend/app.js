import { SignupWrapper, renderWindow, userWrapper } from '../functions.js';


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
    const User = new Auth(events);
    
    const menu = document.querySelector('.menu-icon');
    menu.addEventListener('click', ()=> {
        events.emit('UI:project:list');
    })

    User.checkLoginStatus();

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

class Auth {
    constructor(events) {
        this.events = events;

        this.data = new Proxy({userId: null, username: null, token: null}, {
            set: (target, prop, value) => {
                target[prop] = value;
                switch (prop) {
                    case 'token':
                        this.events.emit('user:change', {
                            userId: target.userId,
                            username: target.username,
                            token: target.token
                        });
                        break;
                    case 'userId':
                        break;
                    case 'username':
                        break;
                    default:
                        break;
                }
                return true;
            }
        });
        console.log(this.data)
        this.loadEvents();
    }
    loadEvents() {
        this.events.on('user:register:attempt', (payload) => {
            const { username, email, password } = payload;
            this.register(username, email, password);
        })
        this.events.on('user:register:success', (payload) => {
            const { userId, username, token } = payload;
            this.data.userId = userId;
            this.data.username = username;
            this.data.token = token;
            
        })
        this.events.on('user:register:failed', () => {
            // Like a pop-up message ig.
        })
        this.events.on('user:login:attempt', (payload) => {
            const { username, password } = payload;
            this.login(username, password);
        })
        this.events.on('user:login:failed', () => {

        })
        this.events.on('user:login:success', (payload)=> {
            const { userId, username, token } = payload;
            this.data.userId = userId;
            this.data.username = username;
            this.data.token = token;
        })
        this.events.on('user:change', ()=> {
            console.log(this.data);
            this.events.emit('UI:render:user');
        })
    }
    async checkLoginStatus() {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await fetch('http://localhost:5000/user/token/decrypt',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token }),
            }); 
            if (response.ok) {
                const data = await response.json();
                this.events.emit('UI:render:user', data);
            }
            else {
                this.events.emit('UI:render:signup');
            }
        }
        else {
            this.events.emit('UI:render:signup');
        }
    }
    async login(username, password) {

        const response = await fetch('http://localhost:5000/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password }),
        })
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            this.events.emit('user:login:success', data);
        }
        else {
            this.events.emit('user:login:failed');
        }
    }
    async register(username, email, password) {
        const response = await fetch('http://localhost:5000/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, email: email, password: password }),
        })
        if (response.ok) {
            const data = await response.json();
            this.events.emit('user:register:success', data);
        }
        else {
            this.events.emit('user:register:failed');
        }
    }
}
class UIManager {
    constructor(events) {
        this.events = events;
        this.activeWindow = null;

        this.loadEvents();
    }
    loadEvents() {
        this.events.on('UI:project:list', ()=> {
            // Render the project list 
        })   
        this.events.on('UI:render:user', () => {
            const signupWrapper = document.querySelector('.signup-wrapper');
            signupWrapper && signupWrapper.remove();
            userWrapper(this.events);
        })
        this.events.on('UI:render:signup', () => {
            const exists = document.querySelector('.signup-wrapper');
            exists && exists.remove();
            SignupWrapper(this.events);
        });
        this.events.on('UI:render:projects', (payload) => {
            // Logic to render / remove UI;
        });
        this.events.on('UI:render:window', (payload) => { 
            this.activeWindow && this.activeWindow.remove();
            const modal = renderWindow(this.events, payload);
            this.activeWindow = modal;
        });
            
    }   

}

class ProjectManager {
    constructor(events) {
        this.events = events;
        this.currentProject = null;
        this.AllProjects = [];
        this.view = 'table';

        this.loadEvents();
    }
    loadEvents() {
        this.events.on('user:register:success', (payload) => {
            const { username, email, password } = payload;
        });
        this.events.on('user:retrieve:projects', async () => {
            const response = await fetch('http://127.0:5000/user/projects')
            if(response.ok) {
                const data = await response.json();
                
            }
            else {
                this.events.emit('user:retrieve:projects:failed', () => {
                    // Code to render message or whatever..
                })
            }
        })
        this.events.on('user:login:success', (payload) => {
            this.events.emit('UI:render:projects', payload);

        })
    }
    async loadUserProjects(user) {
        // Loading user projects from DB
    }

}