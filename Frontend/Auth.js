
import User from './userState.js'
import eventEmitter from './EventBus.js';

export default class Auth {
    constructor() {
        this.events = eventEmitter;

        this.loadEvents();
    }
    loadEvents() {
        this.events.on('user:register:attempt', (payload) => {
            const { username, email, password } = payload;
            this.register(username, email, password);
        })
        this.events.on('user:register:success', () => {
            console.log('Registration successful');
        })
        this.events.on('user:register:failed', () => {
            // Like a pop-up message ig.
        })
        this.events.on('user:login:attempt', (payload) => {
            const { username, password } = payload;
            this.login(username, password);
        })
        this.events.on('user:login:failed', () => {
            User.userId = null;
            User.username = null;
            User.token = null;
            User.isLoggedIn = false;
        })
        this.events.on('user:login:success', async (payload)=> {
            const { userId, username, token } = payload;
            if (!userId || !username || !token) {
                const res  = await fetch('http://localhost:5000/user/decodeToken', {
                    method: 'GET',
                    headers: {  'Content-Type': 'application/json',
                                'authorization': `Bearer ${payload}` 
                    }
                })
                if (res.ok) {
                    const data = await res.json();
                    User.userId = data.userId;
                    User.username = data.username;
                    User.token = data.token;
                    User.isLoggedIn = true;

                    this.events.emit('UI:render:user');

                    return;
            }}
                
            User.userId = userId;
            User.username = username;
            User.token = token;
            User.isLoggedIn = true;

            this.events.emit('UI:render:user');
            //this.events.emit('');


        })
    }
    async checkLoginStatus() {
        const token = localStorage.getItem('token');
        if (!token || token === 'null') {
            this.events.emit('user:login:failed');
            this.events.emit('UI:render:signup');
            return;
        }

            const res = await fetch('http://localhost:5000/user/decodeToken', {
            method: 'GET',
            headers: {  'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}` 
            }
        })
        if (res.ok) {
            const data = await res.json();
            this.events.emit('user:login:success', data);
        }


        
        
    } 
    async login(username, password) {

        const response = await fetch('http://localhost:5000/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password }),
        })
        if (response.ok) {
            const token = await response.json();
            this.events.emit('user:login:success', token);
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
            this.events.emit('user:register:success');
        }
        else {
            this.events.emit('user:register:failed');
        }
    }
}